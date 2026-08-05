import ImageCompressor from 'image-compressor.js';
// 辅助函数：获取图片原始尺寸（同时会应用方向修正）
function getImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      // 注意：这里返回的是图片原始像素尺寸（未应用方向）
      // 如果需要考虑 EXIF 方向导致的宽高交换，可以使用 exif.js 或简单信任图片自然尺寸
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

// 原生 Canvas 压缩（专门用于 PNG，也兼容其他格式但无法控制 quality）
function compressWithCanvas(file, maxWidth, maxHeight) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // 计算缩放后的尺寸（保持宽高比，且为整数）
      let width = img.width;
      let height = img.height;
      if (maxWidth && width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      if (maxHeight && height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }
      width = Math.floor(width);
      height = Math.floor(height);
      if (width < 1) width = 1;
      if (height < 1) height = 1;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      // 绘制图像（对于 PNG，保持透明背景）
      ctx.drawImage(img, 0, 0, width, height);

      // 输出为 PNG（无损，但尺寸缩小后体积会明显下降）
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas toBlob 失败'));
            return;
          }
          const compressedFile = new File([blob], file.name, {
            type: 'image/png',
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        },
        'image/png',
        1 // PNG 的 quality 无效，但参数需保留
      );
      URL.revokeObjectURL(img.src);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(img.src);
      reject(err);
    };
    img.src = URL.createObjectURL(file);
  });
}

// 核心压缩函数（单次）- 根据格式选择方法
async function compressWithOptions(file, options) {
  // 对于 PNG，使用原生 Canvas（避免 ImageCompressor 的白色 bug）
  if (file.type === 'image/png') {
    return compressWithCanvas(file, options.maxWidth, options.maxHeight);
  }

  // 其他格式（JPEG, WebP 等）仍然使用 ImageCompressor（支持 quality）
  return new Promise((resolve, reject) => {
    new ImageCompressor(file, {
      ...options,
      success(result) {
        const compressedFile = new File([result], file.name, {
          type: result.type,
          lastModified: Date.now(),
        });
        resolve(compressedFile);
      },
      error(e) {
        reject(e);
      },
    });
  });
}

// 主函数：确保最终文件 ≤ 4MB
export default async function compressFile(file) {
  // 1. 获取原始尺寸
  let dimensions;
  try {
    dimensions = await getImageDimensions(file);
  } catch (e) {
    console.warn('无法获取图片尺寸，按原文件处理', e);
    return file;
  }

  let { width, height } = dimensions;
  const MAX_PIXEL_LIMIT = import.meta.env.VITE_MAX_WIDTH || 2048; // 最大像素限制
  const TARGET_SIZE = 4 * 1024 * 1024; // 4MB
  const MIN_SIZE = 500; // 最小边不小于 500px

  // 如果原文件已经在 4MB 以下且像素尺寸未超标，直接返回
  if (file.size <= TARGET_SIZE && width <= MAX_PIXEL_LIMIT && height <= MAX_PIXEL_LIMIT) {
    return file;
  }

  let currentFile = file;
  let currentWidth = width;
  let currentHeight = height;
  let attempt = 0;
  const maxAttempts = 5;
  let quality = 0.7; // 仅对 JPEG 有效

  while (attempt < maxAttempts) {
    // 计算本次压缩的尺寸限制（整数）
    let maxWidth = undefined;
    let maxHeight = undefined;

    if (currentWidth > MAX_PIXEL_LIMIT || currentHeight > MAX_PIXEL_LIMIT) {
      maxWidth = MAX_PIXEL_LIMIT;
      maxHeight = MAX_PIXEL_LIMIT;
    } else if (currentFile.size > TARGET_SIZE) {
      // 动态缩小尺寸
      let scale = attempt === 0 ? 0.85 : 0.9;
      maxWidth = Math.max(MIN_SIZE, Math.floor(currentWidth * scale));
      maxHeight = Math.max(MIN_SIZE, Math.floor(currentHeight * scale));
    }

    const options = {
      quality: quality,
      convertSize: Infinity, // 不强制转 JPEG
      preserveExif: false,
      checkOrientation: true, // 让 ImageCompressor 自动纠正方向（对 PNG 不会用到）
      minWidth: 1,
      minHeight: 1,
    };
    if (maxWidth) options.maxWidth = maxWidth;
    if (maxHeight) options.maxHeight = maxHeight;

    try {
      const compressed = await compressWithOptions(currentFile, options);
      console.log(
        `第 ${attempt + 1} 次压缩: ${(currentFile.size / 1024 / 1024).toFixed(2)}MB → ${(compressed.size / 1024 / 1024).toFixed(2)}MB, 尺寸限制: ${maxWidth || '无'}, 格式: ${compressed.type}`
      );

      if (compressed.size <= TARGET_SIZE) {
        return compressed;
      }

      // 获取压缩后的实际尺寸（用于下一轮缩放）
      try {
        const newDim = await getImageDimensions(compressed);
        currentWidth = newDim.width;
        currentHeight = newDim.height;
      } catch (e) {
        // 无法获取则保留原值
      }

      currentFile = compressed;
      quality = Math.max(0.3, quality - 0.15);
      attempt++;

      if (currentWidth <= MIN_SIZE && currentHeight <= MIN_SIZE && compressed.size > TARGET_SIZE) {
        console.warn('图片已缩小到最小尺寸，仍超过目标大小，无法进一步压缩');
        return compressed;
      }
    } catch (err) {
      console.error('压缩失败', err);
      return currentFile;
    }
  }

  console.warn(`经过 ${maxAttempts} 次压缩，最终文件仍为 ${(currentFile.size / 1024 / 1024).toFixed(2)}MB`);
  return currentFile;
}
import { ElMessage } from 'element-plus';

export default async function handleCheckWidthHeight(file) {
  return new Promise((resolve) => {
    const maxW = Number(import.meta.env.VITE_MAX_WIDTH);
    const maxH = Number(import.meta.env.VITE_MAX_HEIGHT);
    const minW = Number(import.meta.env.VITE_MIN_WIDTH);
    const minH = Number(import.meta.env.VITE_MIN_HEIGHT);

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = function () {
      const validMin = (minW <= img.width && minH <= img.height);
      const validMax = (img.width <= maxW && img.height <= maxH);
      const valid = validMin && validMax; // 同时满足最小和最大

      if (!valid) {
        // 根据实际需求给出更具体的提示
        ElMessage.warning(`图片分辨率需在 ${minW}x${minH} 至 ${maxW}x${maxH} 之间`);
      }

      URL.revokeObjectURL(objectUrl); // 释放内存
      resolve(valid);
    };

    img.onerror = function () {
      ElMessage.error('图片加载失败，请检查文件是否损坏');
      URL.revokeObjectURL(objectUrl);
      resolve(false);
    };

    img.src = objectUrl;
  });
}
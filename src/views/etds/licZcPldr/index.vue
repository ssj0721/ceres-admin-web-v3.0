<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { Plus, Delete, ZoomIn, DocumentCopy } from '@element-plus/icons-vue';
import { ElMessage, ElLoading } from 'element-plus'
import {
  uploadEtdsFile,
  uploadZcFileDirect,
  downloadLicExcel,
  uploadZcFile,
  getDefectList,
  getDefectDetails,
  saveNormalPic,
  saveDefectPic,
  updatePicOnly,
  deleteFile,
  exportLicZcReport,
  uploadZcReportPic,
  gcZcDeletePic
} from '@/api/etds'
import { useLicZcStore } from '@/stores/licZcStore'

// 初始化store
const licZcStore = useLicZcStore()

// 表单数据
const contractFormData = ref({
  contract: '', // 款号输入
  defect: '', // 疵点输入
})

const fileData = ref(null)
const imgForm = ref([])
const cdDic = ref([]) // 疵点字典
const picname = ref([])

// 导出自查数据弹窗
const exportDialogVisible = ref(false)
const exportForm = ref({
  startdate: `${new Date().getFullYear() - 1}-${new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1}-${new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate()}`,
  enddate: `${new Date().getFullYear()}-${new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1}-${new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate()}`,
  po_no: '',
})

// 图片相关数据
const commonImages = ref({
  describe: '',
  imgbase: [],
})
const cidianImages = ref([])
// 格式化文件大小
const formatFileSize = (size) => {
  if (!size) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  let index = 0
  while (size >= 1024 && index < units.length - 1) {
    size /= 1024
    index++
  }
  return `${size.toFixed(2)} ${units[index]}`
}
// 处理款号格式化
const formatPoNo = computed(() => {
  if (!exportForm.value.po_no) return ''
  const normalized = exportForm.value.po_no
    .replace(/[\s,;，；]+/g, ',')
    .replace(/^,+|,+$/g, '')
  if (!normalized) return ''
  const poNos = normalized.split(',')
    .map(po => po.trim())
    .filter(po => po)
  if (poNos.length === 0) return ''
  return `('${poNos.join('\',\'')}')`
})

// 添加文件选择处理函数
// 验证图片名称
function validateImageName (fileName) {
  // 正则表达式匹配普通图片格式
  const format1Pattern = /^[A-Z0-9]{2}-[A-Z0-9]{2}-[A-Z0-9]{6,7}_(?:中期|尾期)_\d+_\d+_[^_]+\.(jpg|jpeg|png|gif|bmp|tiff)$/
  // 正则表达式匹配疵点图片格式
  const format2Pattern = /^cidian_[A-Z0-9]{2}-[A-Z0-9]{2}-[A-Z0-9]{6,7}_(?:中期|尾期)_\d+_\d+_[^_]+_[^_]+\.(jpg|jpeg|png|gif|bmp|tiff)$/

  return format1Pattern.test(fileName) || format2Pattern.test(fileName)
}
const handleChooseFile = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.xlsx,.xls' // 限制文件类型为 Excel
  input.multiple = false // 单文件选择

  input.onchange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 验证文件格式
    if (!/\.(xls|xlsx)$/i.test(file.name)) {
      ElMessage.warning('请上传 Excel 文件(xls、xlsx格式)')
      return
    }

    // 更新文件数据
    fileData.value = file

    // 更新文件信息显示
    const fileInfo = document.querySelector('.file-info')
    if (fileInfo) {
      fileInfo.classList.add('has-file')
      fileInfo.querySelector('.info-text').textContent = `已选择文件: ${file.name} (${formatFileSize(file.size)})`
    }

    ElMessage.success('文件选择成功')
  }

  input.click()
}

// 初始化方法 - 获取疵点类型列表
// 初始化方法
async function init () {
  try {
    // 获取疵点类型列表
    const defectListRes = await getDefectList({
      repType: -1,
    })

    if (defectListRes.data.result.Examples) {
      const cdDicTemp = defectListRes.data.result.Examples

      // 获取每个疵点类型的详情
      const detailPromises = cdDicTemp.map(item =>
        getDefectDetails({
          itemsName: item,
          repType: -1,
        }),
      )
      const detailResults = await Promise.all(detailPromises)
      // 处理返回的疵点详情数据
      // console.log('疵点详情', detailResults)
      cdDic.value = detailResults.reduce((acc, curr, index) => {
        if (curr.data.result.Examples) {
          acc.push({
            name: cdDicTemp[index],
            ...curr.data.result.Examples,
          })
        }
        return acc
      }, [])

      // console.log('疵点字典初始化完成：', cdDic.value)
    } else {
      ElMessage.error('获取疵点类型失败')
    }
  } catch (error) {
    console.error('初始化失败：', error)
    ElMessage.error('查货系统初始化失败')
  }
}
const previewList = computed(() => {
  return imgForm.value.map(item => item.imgData.preview)
})
// 删除图片
const handleDeleteImage = (index) => {
  const deletedImage = imgForm.value[index]

  // 释放预览URL
  URL.revokeObjectURL(deletedImage.imgData.preview)

  // 如果是普通图片，从commonImages中删除
  if (!deletedImage.name.startsWith('cidian_')) {
    const commonImageIndex = commonImages.value.imgbase.findIndex(img => img.name === deletedImage.name)
    if (commonImageIndex !== -1) {
      commonImages.value.imgbase.splice(commonImageIndex, 1)
    }
  } else {
    // 如果是疵点图片，从cidianImages中删除
    const contractInfo = getContractInfoFromFileName(deletedImage.name)
    const key = generateKey(
      contractInfo.pono,
      contractInfo.bcQs,
      contractInfo.batchNo,
      contractInfo.num
    )

    // 找到对应的疵点组
    const defectGroupIndex = cidianImages.value.findIndex(group => group.key === key)
    if (defectGroupIndex !== -1) {
      const defectGroup = cidianImages.value[defectGroupIndex]
      // 找到对应的疵点记录
      const defectRecord = defectGroup.record.find(record => record.item === contractInfo.defectType)
      if (defectRecord) {
        // 判断是第一张还是第二张图片并完全清除相关字段
        if (defectRecord.file1 && defectRecord.file1.name === deletedImage.name) {
          defectRecord.file1 = null
          defectRecord.BS_SIZE = 0
        } else if (defectRecord.file2 && defectRecord.file2.name === deletedImage.name) {
          defectRecord.file2 = null
          defectRecord.BS_SIZE2 = 0
        }

        // 如果该疵点记录没有任何图片了，从record数组中移除
        if (!defectRecord.file1 && !defectRecord.file2) {
          const recordIndex = defectGroup.record.findIndex(r => r.item === contractInfo.defectType)
          if (recordIndex !== -1) {
            defectGroup.record.splice(recordIndex, 1)
          }
        }

        // 如果该疵点组没有任何记录了，从cidianImages中移除
        if (defectGroup.record.length === 0) {
          cidianImages.value.splice(defectGroupIndex, 1)
        }
      }
    }
  }
  // console.log('cidianImages after deletion:', cidianImages.value)
  // 从列表中移除
  imgForm.value.splice(index, 1)
}

// 处理导出
async function handleExport () {
  ElLoading.service({
    fullscreen: true,
    text: '导出中...',
  })
  if (!exportForm.value.startdate || !exportForm.value.enddate) {
    ElMessage.warning('请选择日期范围')
    return
  }

  // 从localStorage获取用户信息
  const etdsUserStr = localStorage.getItem('storage_key_etds');
  const platformUserId = localStorage.getItem('platformUserId');
  const etdsUser = etdsUserStr ? JSON.parse(etdsUserStr) : {};

  // 处理is_sqs参数
  let is_show = '';
  if (etdsUser.is_sqs === 1 || etdsUser.is_sqs === '1') {
    is_show = 'true';
  } else {
    is_show = 'false';
  }

  const exportParams = {
    sdate: exportForm.value.startdate,
    edate: exportForm.value.enddate,
    po_no: exportForm.value.po_no,
    spo: formatPoNo.value,
    issqs: is_show,
    platformUserId: platformUserId || '',
    userId: etdsUser.userId || '',
  }
  const res = await exportLicZcReport(exportParams)
  try {
    if (res.code) {
      const base64 = res.code
      const binaryString = atob(base64)
      const arrayBuffer = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        arrayBuffer[i] = binaryString.charCodeAt(i)
      }
      const blob = new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const url = URL.createObjectURL(blob)
      // 修改文件名
      const link = document.createElement('a')
      link.href = url
      link.download = `联营商查货导出数据${exportForm.value.startdate}至${exportForm.value.enddate}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      ElMessage.success('导出成功')
    } else {
      ElMessage.error('导出失败')
    }
  } catch (error) {
    console.error('导出失败：', error)
    ElMessage.error('导出失败')
  } finally {
    exportDialogVisible.value = false

    ElLoading.service().close()
  }
}
/**/
// 控制状态
const openDefectList = ref(false)
const openDefectModal = ref(false)
const itemsName = ref('')
const defectDetailList = ref([])
const selectedDefects = ref([]) // 存储选中的疵点
const bcQsSelect = ref('尾期')
const bcQsOptions = ref([

  {
    label: '尾期',
    value: '尾期'
  },
  {
    label: '中期',
    value: '中期'
  },
])
const bcBatchNumberCount = ref(1)
const bcNumCount = ref(1)
// 从store获取选项列表
const defectOptions = computed(() => licZcStore.defectOptions)

// 处理打开疵点列表
async function handleOpenDefectList (e) {
  openDefectModal.value = true
  openDefectList.value = false
  itemsName.value = e
  await licZcStore.getDefectDetailsData(itemsName.value)
  defectDetailList.value = licZcStore.defectDetailList
}

// 处理返回到疵点大类列表
function handleBackToDefectList () {
  openDefectModal.value = false
  openDefectList.value = true
}

// 选择疵点
function handleSelectDefect (item) {
  selectedDefects.value.push({
    item: item.item,
    itemsName: itemsName.value
  })
  openDefectModal.value = false
}

// 删除已选疵点
function deleteDefect (index) {
  selectedDefects.value.splice(index, 1)
}

/**/

// 生成图片名称
function handleGenerate () {
  picname.value = []

  // 处理输入内容，去除空格和换行
  const contract = contractFormData.value.contract.replace(/[\s\n\r]+/g, ',').trim()

  if (!contract) {
    ElMessage.warning('请输入款号')
    return
  }

  // 分割款号
  const contractList = contract.split(',').filter(Boolean)

  // 生成图片名称
  if (selectedDefects.value.length > 0) {
    // 生成疵点图片名称
    contractList.forEach(contract => {
      selectedDefects.value.forEach(defect => {
        picname.value.push(`cidian_${contract}_${bcQsSelect.value}_${bcBatchNumberCount.value}_${bcNumCount.value}_${defect.item}_1`)
      })
    })
  } else {
    // 生成普通图片名称
    contractList.forEach(contract => {
      picname.value.push(`${contract}_${bcQsSelect.value}_${bcBatchNumberCount.value}_${bcNumCount.value}_1`)
    })
  }

  if (picname.value.length > 0) {
    ElMessage.success('生成成功')
    // 默认复制第一条
    nextTick(() => {
      copyToClipboard(picname.value[0]);
    });
  }
}
// 添加复制到剪贴板方法

const copyToClipboard = (text) => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      ElMessage.success('已复制到剪贴板');
    }).catch(() => {
      fallbackCopyToClipboard(text);
    });
  } else {
    fallbackCopyToClipboard(text);
  }
};

// 传统复制方法作为备选
const fallbackCopyToClipboard = (text) => {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    // 使文本域在视觉上不可见
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);

    if (successful) {
      ElMessage.success('已复制到剪贴板');
    } else {
      ElMessage.error('复制失败');
    }
  } catch (err) {
    ElMessage.error('复制失败');
  }
};
// 处理成功数据

async function handleSuccessData (data) {
  console.log('data=========success', data)
  // 删除旧图片
  if (data.susList?.length) {
    await handleDeleteOldImages(data.susList)
  }

  // 上传新图片
  if (data.susPoList?.length) {
    await handleUploadNewImages(data.susPoList)
  }
}
// 生成统一的key
function generateKey (pono, bcQs, batchNo, num) {
  return `${pono}_${bcQs === '3' ? '尾期' : '中期'}_${batchNo}_${num}`
}

// 从文件名获取合同信息
function getContractInfoFromFileName (fileName) {
  const parts = fileName.replace(/^cidian_/, '').split('_')
  return {
    pono: parts[0],
    bcQs: parts[1] === '中期' ? '1' : '3',
    batchNo: parts[2],
    num: parts[3],
    defectType: fileName.startsWith('cidian_') ? parts[4] : undefined,
  }
}
// 处理普通图片
async function handleNormalImage (imageData) {
  // 获取base64数据
  const baseData = await getBase64(imageData.file)

  // 添加到普通图片列表，保持与原系统相同的数据结构
  commonImages.value.imgbase.push({
    describe: '',
    baseData, // 添加base64数据
    name: imageData.name,
    staus: false,
    OID: imgForm.value.length + 1,
    displand: true,
    bp_fileSize: imageData.size,
    file: imageData.file, // 保存文件对象用于上传
  })
}
// 处理疵点图片
function handleDefectImage (imageData) {
  const contractInfo = getContractInfoFromFileName(imageData.name)
  // 使用统一的key生成函数
  const key = generateKey(contractInfo.pono, contractInfo.bcQs, contractInfo.batchNo, contractInfo.num)

  // 查找或创建疵点组
  let defectGroup = cidianImages.value.find(group => group.key === key)
  if (!defectGroup) {
    defectGroup = {
      key,
      record: [],
    }
    cidianImages.value.push(defectGroup)
  }

  // 获取疵点类型信息
  let defectType = null
  for (const category of cdDic.value) {
    // 遍历每个分类下的疵点类型
    for (let i = 0; i < Object.keys(category).length - 1; i++) { // -1 是因为要排除 name 属性
      const item = category[i]
      if (item && item.item === contractInfo.defectType) {
        defectType = item
        break
      }
    }
    if (defectType) { break }
  }

  if (!defectType) {
    ElMessage.warning(`未找到疵点类型：${contractInfo.defectType}`)
    return
  }

  // 查找是否已存在该疵点记录
  let defectRecord = defectGroup.record.find(record => record.item === contractInfo.defectType)

  // 如果不存在，创建新记录
  if (!defectRecord) {
    defectRecord = {
      item: defectType.item,
      itemOid: defectType.defectSpotOid,
      itemsName: defectType.itemsName,
      pic1: '',
      pic2: '',
      remark: defectType.item, // 使用疵点类型作为默认备注
      oid: '',
      bs_value: '1',
      BS_SIZE: 0,
      BS_SIZE2: 0,
      file1: null,
      file2: null,
    }
    defectGroup.record.push(defectRecord)
  }

  // 检查该疵点是否已有两张图片
  const hasFile1 = defectRecord.file1 !== null
  const hasFile2 = defectRecord.file2 !== null

  if (hasFile1 && hasFile2) {
    ElMessage.warning(`该疵点已有两张图片，不能再添加`)
    return
  }

  // 根据现有图片情况决定存储位置
  if (!hasFile1) {
    defectRecord.file1 = imageData.file
    defectRecord.BS_SIZE = imageData.size
  } else {
    defectRecord.file2 = imageData.file
    defectRecord.BS_SIZE2 = imageData.size
  }

  console.log('cidianImages', cidianImages.value)
}
// 选择图片
const handleChooseImage = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.multiple = true
  input.accept = 'image/*'

  input.onchange = (e) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      // 验证图片名称格式
      if (!validateImageName(file.name)) {
        ElMessage.warning(`图片 ${file.name} 命名格式不正确，请参考命名规则`)
        return
      }

      const imageData = {
        file,
        name: file.name,
        size: file.size,
        type: file.type || 'image/jpeg',
        preview: URL.createObjectURL(file)
      }

      // 处理疵点图片
      if (file.name.startsWith('cidian_')) {
        const contractInfo = getContractInfoFromFileName(file.name)
        const key = generateKey(
          contractInfo.pono,
          contractInfo.bcQs,
          contractInfo.batchNo,
          contractInfo.num
        )

        // 检查疵点图片数量限制
        const existingDefects = cidianImages.value.find(group => group.key === key)
        if (existingDefects) {
          // 查找当前疵点类型的记录
          const existingDefect = existingDefects.record.find(record => record.item === contractInfo.defectType)
          if (existingDefect && existingDefect.file1 && existingDefect.file2) {
            ElMessage.warning(`款号 ${contractInfo.pono} 的疵点 ${contractInfo.defectType} 已有两张图片`)
            URL.revokeObjectURL(imageData.preview) // 释放创建的URL
            return
          }
        }
        handleDefectImage(imageData)
      } else {
        // 处理普通图片
        handleNormalImage(imageData)
      }

      // 添加到显示列表
      imgForm.value.push({
        imgData: {
          ...imageData,
          staus: false,
          OID: imgForm.value.length + 1,
          displand: true,
        },
        name: file.name
      })
    })
  }

  input.click()
}
// 生成时间戳文件名
function generateTimestampFileName (file) {
  const timestamp = new Date().getTime()
  const extension = file.name ? file.name.split('.').pop() : ''
  return `${timestamp}${extension ? `.${extension}` : ''}`
}

// 处理图片上传的通用函数
async function uploadImage (file, params) {
  if (!file) { return null }
  try {
    const formData = new FormData()
    const timestampFileName = generateTimestampFileName(file)
    const newFile = new File([file], timestampFileName, { type: file.type })
    formData.append('file', newFile)

    Object.entries(params).forEach(([key, value]) => {
      formData.append(key, value)
    })

    // const uploadResult2 = await uploadEtdsFile(formData)
    // return uploadResult.message || null
    const uploadResult = await uploadZcReportPic(formData)
    return uploadResult.data?.pic_path || null
  } catch (error) {
    console.error('图片上传失败:', error)
    return null
  }
}

// 上传新图片
async function handleUploadNewImages (successList) {
  for (const item of successList) {
    try {
      // 使用统一的key生成函数
      const key = generateKey(item.pono, item.bcQs, item.batchNo, item.num)
      console.log('key=========success', key)
      console.log('Images=========success', imgForm.value)
      // 1. 上传普通图片
      const normalImages = imgForm.value.filter(img => {
        // 从图片名称中提取基本信息
        const imgNameParts = img.name.replace(/\.\w+$/, '').split('_')
        const imgKey = imgNameParts.slice(0, 4).join('_')

        // 不是疵点图片，并且基本信息匹配
        return !img.name.startsWith('cidian_') && imgKey === key
      })
      console.log('item=========success', item)
      console.log('normalImages=========success', normalImages)

      for (const img of normalImages) {
        // 使用新的上传方法
        const uploadRes = await uploadImage(img.imgData.file, {
          fk: item.OID,
          type: '1',
          bp_fileSize: img.imgData.size || 0,
        })

        // 保存图片路径
        if (uploadRes) {
          await saveNormalPic({
            pic_path: uploadRes,
            bp_fileSize: img.imgData.size,
            fk: item.OID,
          })
        }
      }

      // 2. 上传疵点图片
      const defectGroup = cidianImages.value.find((group) => {
        console.log('比较:', {
          groupKey: group.key,
          currentKey: key,
          isMatch: group.key === key,
        })
        return group.key === key
      })

      if (defectGroup) {
        for (let i = 0; i < defectGroup.record.length; i++) {
          const record = defectGroup.record[i]

          // 上传第一张疵点图
          if (record.file1) {
            const uploadRes1 = await uploadImage(record.file1, {
              fk: item.OID,
              type: 'pic1',
              bp_fileSize: record.BS_SIZE || 0,
              bs_item: record.itemOid || '',
            })

            if (uploadRes1) {
              await saveDefectPic({
                bs_pic: uploadRes1,
                BS_SIZE: record.BS_SIZE,
                fk: item.OID,
                bs_item: record.itemOid,
                pictype: '1',
              }, 'POST')
            }
          }

          // 上传第二张疵点图
          if (record.file2) {
            const uploadRes2 = await uploadImage(record.file2, {
              fk: item.OID,
              type: 'pic2',
              bp_fileSize: record.BS_SIZE2 || 0,
              bs_item: record.itemOid || '',
            })

            if (uploadRes2) {
              await saveDefectPic({
                bs_pic: uploadRes2,
                BS_SIZE: record.BS_SIZE2,
                fk: item.OID,
                bs_item: record.itemOid,
                pictype: '2',
              }, 'POST')
            }
          }
        }
      }
    } catch (error) {
      console.error('上传图片失败：', error)
      ElMessage.error(`上传图片失败: ${error.message || '未知错误'}`)
    }
  }
}

// 删除旧图片
async function handleDeleteOldImages (susList) {
  for (const item of susList) {
    try {
      if (!item.picpath && !item.cdpath?.length) {
        return
      }
      if (item.picpath) {
        await gcZcDeletePic({
          fileName: item.picpath,
        })
      }

      // 删除疵点图片
      if (item.cdpath?.length) {
        for (const path of item.cdpath) {
          if (path.bs_pic) {
            await gcZcDeletePic({
              fileName: path.bs_pic,
            })
          }
          if (path.bs_pic2) {
            await gcZcDeletePic({
              fileName: path.bs_pic2,
            })
          }
        }
      }

      // 所有图片删除完成后显示一次性提示
      ElMessage.success('删除旧图片成功')
    } catch (error) {
      // 只有真正的错误才会进入这里
      if (error.message !== 'DELETE Success!') {
        console.error('删除旧图片失败：', error)
        ElMessage.error(`删除旧图片失败: ${error.message || '未知错误'}`)
      }
    }
  }
}

// 导出错误列表
async function exportErrorList (errors) {
  try {
    // 动态导入xlsx库
    const XLSX = await import('xlsx')

    // 准备数据
    const data = errors.map(item => ({
      错误原因: item.errorMsg,
    }))

    // 创建工作簿
    const wb = XLSX.utils.book_new()

    // 将数据转换为工作表
    const ws = XLSX.utils.json_to_sheet(data, {
      header: ['错误原因'],
    })

    // 设置列宽
    ws['!cols'] = [{ wch: 50 }] // 设置第一列宽度为50个字符

    // 设置单元格样式
    for (let i = 0; i < data.length + 1; i++) {
      const cellRef = XLSX.utils.encode_cell({ r: i, c: 0 })
      if (!ws[cellRef]) { continue }

      ws[cellRef].s = {
        alignment: {
          horizontal: 'center',
          vertical: 'center',
        },
        font: {
          name: '微软雅黑',
          sz: 12,
        },
      }
    }

    // 添加工作表到工作簿
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

    // 生成文件名
    const dt = new Date()
    const filename = `批量导入错误数据_${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()}.xlsx`

    // 导出文件
    XLSX.writeFile(wb, filename)
  } catch (error) {
    console.error('导出错误列表失败：', error)
    ElMessage.error('导出错误列表失败')
  }
}

// 处理错误数据
async function handleErrorData (data) {
  const errorList = []

  // 处理一般错误信息
  if (data.errorMsg?.length) {
    errorList.push(...data.errorMsg.map(msg => ({
      errorMsg: `${msg}\n`,
    })))
  }

  // 处理保存错误信息
  if (data.saveErrorDataList?.length) {
    errorList.push(...data.saveErrorDataList.map(item => ({
      errorMsg: `款号:${item.pono}, 中尾期:${item.bcQs}, 出货批次:${item.batchNo}, 查货次数:${item.num}的款号已有相同的查货资料存在,存档失败!\n`,
    })))
  }

  // 导出错误Excel
  if (errorList.length > 0) {
    await exportErrorList(errorList)
  }
}

// 获取文件base64编码
function getBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

const isSubmitting = ref(false)
const loadingInstance = ref(null)
async function handleSubmit () {
  // 1. 权限检查
  const storageData = JSON.parse(localStorage.getItem('storage_key_etds'))
  // console.log('storageData', storageData)
  if (storageData?.is_sqs !== '1' && storageData?.is_sqs !== 1) {
    ElMessage.error('非联营业务/联营款账号不能提交自查报告')
    return
  }

  // 2. 基础验证
  if (!fileData.value && imgForm.value.length === 0) {
    ElMessage.warning('请先上传excel文件或图片')
    return
  }

  if (isSubmitting.value) {
    ElMessage.warning('正在提交中，请稍候...')
    return
  }

  try {
    isSubmitting.value = true
    loadingInstance.value = ElLoading.service({
      fullscreen: true,
      text: '正在上传中...',
    })

    // 3. 只有图片没有Excel的情况
    if (!fileData.value && imgForm.value.length > 0) {
      // 构造普通图片数据
      const picData = await Promise.all(commonImages.value.imgbase.map(async (img) => {
        // 获取图片base64数据
        return {
          describe: '',
          baseData: img.baseData, // 添加base64数据
          name: img.name,
          staus: false,
          OID: img.OID,
          displand: true,
          bp_fileSize: img.size,
        }
      }))

      // 构造疵点数据
      const defectData = await Promise.all(cidianImages.value.map(async (group) => {
        const key = group.key.includes('尾期') ? group.key.replace('尾期', '3') : group.key.replace('中尾期', '1')

        return {
          key,
          record: await Promise.all(group.record.map(async (record) => {
            // 获取疵点图片的base64数据
            const pic1 = record.file1 ? await getBase64(record.file1) : ''
            const pic2 = record.file2 ? await getBase64(record.file2) : ''

            return {
              item: record.item,
              itemOid: record.itemOid,
              itemsName: record.itemsName,
              pic1,
              pic2,
              remark: record.remark || record.item,
            }
          })),
        }
      }))

      const updateRes = await updatePicOnly({
        Uploadvueform: picData,
        detailsvueformList: defectData,
      })

      if (updateRes) {
        // 处理返回数据
        if (updateRes.errorMsg?.length || updateRes.saveErrorDataList?.length) {
          await handleErrorData(updateRes)
        }

        if (updateRes.susPoList?.length) {
          await handleSuccessData(updateRes)
        }

        ElMessage.success('上传成功')

        // 清理状态
        imgForm.value = []
        commonImages.value.imgbase = []
        cidianImages.value = []
      }
      return
    }

    // 4. 有Excel文件的情况
    const formData = new FormData()
    formData.append('file', fileData.value)

    // 4.1 处理普通图片数据
    const piclist = commonImages.value.imgbase.map(img => ({
      describe: '',
      baseData: '',
      name: img.name,
      staus: false,
      OID: img.OID,
      displand: true,
      bp_fileSize: img.size,
    }))
    formData.append('param3', JSON.stringify(piclist))

    // 4.2 处理疵点图片数据
    const cdlist = cidianImages.value.map((group) => {
      // 第一次上传时的key要特殊处理一下，如果是尾期就是3否则为1
      const key = group.key.includes('尾期') ? group.key.replace('尾期', '3') : group.key.replace('中期', '1')
      return {
        key,
        record: group.record.map(record => ({
          item: record.item,
          itemOid: record.itemOid,
          itemsName: record.itemsName,
          pic1: '',
          pic2: '',
          remark: record.remark || record.item,
          oid: '',
          bs_value: '1',
          BS_SIZE: record.BS_SIZE,
          BS_SIZE2: record.BS_SIZE2 || '',
        })),
      }
    })
    formData.append('param4', JSON.stringify(cdlist))

    // 4.3 添加用户信息
    const userInfo = JSON.parse(localStorage.getItem('storage_key_etds'))
    formData.append('useroid', userInfo.oid)
    formData.append('ismj', 0)
    formData.append('roleId', userInfo.roleId)
    formData.append('userId', userInfo.userId)

    // 5. 上传文件和数据
    // const uploadRes = await uploadZcFileDirect(formData)

    // 5.1 还要传一份到/etds/file/licZcupload
    const uploadRes2 = await uploadZcFile(formData)
    console.log('uploadRes2', uploadRes2)
    // console.log('uploadRes', uploadRes)
    // 6. 处理返回数据
    if (uploadRes2) {
      // 6.1 处理错误信息
      if (uploadRes2.data.errorMsg?.length || uploadRes2.data.saveErrorDataList?.length) {
        await handleErrorData(uploadRes2.data)
      }

      // 6.2 处理成功数据
      if (uploadRes2.data.susPoList?.length || uploadRes2.data.susList?.length) {
        // 成功了以后才上传到查货
        const scmOids = uploadRes2.data.susList.map(item => item.msg)
        console.log(scmOids)
        formData.append('scmOids', scmOids)
        await uploadZcFileDirect(formData)
        await handleSuccessData(uploadRes2.data)
      }
      if (!uploadRes2.data.errorMsg?.length && !uploadRes2.data.saveErrorDataList?.length) {
        ElMessage.success('上传成功')
      } else {
        ElMessage.error('上传失败')
      }
      // 清理状态
      // fileData.value = null
      // imgForm.value = []
      // commonImages.value.imgbase = []
      // cidianImages.value = []
      // picname.value = []
    }
  } catch (error) {
    console.error('上传失败：', error)
  } finally {
    isSubmitting.value = false
    loadingInstance.value.close()
  }
}
// 下载模版

async function handleDownloadTemplate () {
  try {
    const res = await downloadLicExcel({})

    console.log('下载模板响应：', res)
    if (res.data) {
      // 接收到Base64数据后
      const base64Data = res.data;

      // 创建下载链接
      const link = document.createElement('a');
      link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64Data}`;
      link.download = '联营商查货批量导入模板.xlsx';
      link.click();
    } else {
      throw new Error('下载失败：响应数据为空')
    }
  } catch (error) {
    console.error('下载模板失败：', error)
    ElMessage.error(error.message || '下载失败，请重试')
  }
}

// 组件挂载时初始化
onMounted(() => {
  init()
  // 初始化疵点选项
  licZcStore.getDefectListData()
})
</script>

<template>
  <div class="container">
    <div style="width: 100%; display: flex; font-size: large;">&nbsp;ScmAdm014</div>
    <div class="second-main-container">
      <!-- 操作区域 -->

      <div class="operation-area">
        <!-- 按钮组 -->
        <div class="btn-group">
          <el-button
            class="custom-button"
            type="primary"
            size="default"
            @click="handleChooseFile"
          >
            选择文件
          </el-button>
          <el-button
            class="custom-button"
            type="primary"
            size="default"
            @click="handleDownloadTemplate"
          >
            EXCEL模版下载
          </el-button>
          <el-button
            class="custom-button"
            type="primary"
            size="default"
            @click="exportDialogVisible = true"
          >
            导出自查数据
          </el-button>
          <el-button
            class="custom-button"
            type="primary"
            size="default"
            @click="handleSubmit"
          >
            提交
          </el-button>
        </div>

        <!-- 文件信息展示 -->
        <div class="file-info" :class="{ 'has-file': fileData }">
          <span class="info-text">{{ fileData ? `已选择文件: ${fileData.name} (${formatFileSize(fileData.size)})` : '未选择文件' }}</span>
        </div>

        <!-- 选择图片按钮 -->
        <div class="choose-image-wrapper">
          <el-button
            class="choose-image-btn"
            @click="handleChooseImage"
          >
            <div class="choose-image-content">
              <el-icon class="plus-icon"><Plus /></el-icon>
              <span class="choose-image-text">选择图片</span>
            </div>
          </el-button>
        </div>

        <!-- 图片预览区域 -->
        <div v-if="imgForm.length > 0" class="preview-area">
          <div class="preview-title">已选择的图片：</div>
          <div class="image-list">
            <div
              v-for="(item, index) in imgForm"
              :key="index"
              class="image-item"
            >
              <el-image
                :src="item.imgData.preview"
                fit="contain"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                close-on-press-escape
                :preview-teleported="true"
                :preview-src-list="previewList"
              />
              <div class="image-info">
                <div class="image-name">{{ item.name }}</div>
                <div class="image-size">{{ formatFileSize(item.imgData.size) }}</div>
              </div>
              <div
                class="delete-btn"
                @click="handleDeleteImage(index)"
              >
                <el-icon :size="20" color="#ff4d4f"><Delete /></el-icon>
              </div>
              <div class="preview-mask">
                <el-icon :size="30" color="#fff"><ZoomIn /></el-icon>
              </div>
            </div>
          </div>
        </div>

        <!-- 图片命名规则说明 -->
        <div class="naming-rules">
          <div class="rules-title">图片命名规则说明：</div>
          <div class="rules-content">
            <div class="rule-item">
              图片命名规则如下:其中x用来区分图片可以是1、2、3等数字，也可以是A、B、C等字母，具体规则如下：
            </div>
            <div class="rule-item">
              普通问题图片命名规则:款号_中尾期_出货批次_查货次数_x，如DE-31-919702_尾期_1_1_1，DE-31-919702_尾期_1_1_2;
            </div>
            <div class="rule-item">
              疵点图片命名规则:cidian_款号_中尾期_出货批次_查货次数_疵点类型_x，如cidian_DE-31-919702_尾期_1_1_不垂直_1或cidian_DE-31-919702_尾期_3_1_错(条码)_1;
            </div>
            <div class="rule-item important">
              其中每个款的疵点仅限上传两张，普通问题图片不限制;
            </div>
            <div class="rule-item warning">
              如果上传的excel中的款号原本就存在查货报告的时候，会执行更新操作，注意:对应的图片如果没有上传，会清空这个款号的图片
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="input-area">
          <div class="input-tips">
            <span>只输入款号，点击生成普通问题图片命名</span>
          </div>
          <div class="input-tips">
            <span>或者输入款号和疵点，点击生成疵点图片命名</span>
          </div>
          <div class="input-groups">
            <div class="input-group">
              <span class="label">款号</span>
              <el-input
                v-model="contractFormData.contract"
                placeholder="可以输入多个款号,用逗号或空格隔开"
                clearable
              />
            </div>

            <div class="input-group">
              <span class="label">中尾期</span>
              <el-select v-model="bcQsSelect" :options="bcQsOptions" class="image-count-input">
                <el-option v-for="item in bcQsOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </div>
            <div class="input-group">
              <span class="label">出货批次</span>
              <el-input-number
                v-model="bcBatchNumberCount"
                :min="1"
                :max="999"

                class="image-count-input"
              />
            </div>
            <div class="input-group">
              <span class="label">查货次数</span>
              <el-input-number
                v-model="bcNumCount"
                :min="1"
                :max="999"
                class="image-count-input"
              />
            </div>
            <!-- 22 -->
            <div class="input-group defect-group">
              <span class="label">疵点</span>
              <div class="defect-tags-container">
                <el-tag
                  v-for="(defect, index) in selectedDefects"
                  :key="index"
                  closable
                  class="defect-tag"
                  @close="deleteDefect(index)"
                >
                  {{ defect.itemsName }} - {{ defect.item }}
                </el-tag>
                <el-button
                  class="add-defect-btn"
                  @click="openDefectList = true"
                >
                  <el-icon><plus /></el-icon>
                  选择疵点
                </el-button>
              </div>

            </div>

            <div class="input-group">
              <el-button type="primary" class="custom-button" @click="handleGenerate">生成</el-button>
            </div>
          </div>
        </div>
        <!--  -->
        <!-- 生成的图片名称列表 -->
        <div v-if="picname.length > 0" class="picname-list">
          <div
            v-for="(item, index) in picname"
            :key="index"
            class="picname-item"
          >
            <span class="picname-text">{{ item }}</span>
            <el-button
              type="primary"
              circle
              size="small"
              class="copy-button"
              @click="copyToClipboard(item)"
            >
              <el-icon><document-copy /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
      <el-dialog
        v-model="exportDialogVisible"
        title="导出自查数据"
        width="50%"
        :header="false"
      >
        <el-form :model="exportForm" label-width="100px">
          <div class="date-picker-container">
            <el-form-item label="查货日期">
              <div class="date-picker-group">
                <el-date-picker
                  v-model="exportForm.startdate"
                  type="date"
                  placeholder="开始日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
                <div class="date-separator">至</div>
                <el-date-picker
                  v-model="exportForm.enddate"
                  type="date"
                  placeholder="结束日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
              </div>
            </el-form-item>
            <el-form-item label="款号">
              <el-input
                v-model="exportForm.po_no"
                placeholder="请输入款号(模糊查询)"
                clearable
                class="custom-input"
              />
            </el-form-item>
          </div>
        </el-form>
        <template #footer>
          <span>
            <el-button
              @click="exportDialogVisible = false"
            >
              关闭
            </el-button>
            <el-button
              class="custom-button"
              type="primary"
              @click="handleExport"
            >
              导出
            </el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 疵点大类选择弹窗 -->
      <el-dialog
        v-model="openDefectList"
        title="选择疵点类型"
        width="500px"
        :close-on-click-modal="false"
        destroy-on-close
      >
        <div class="defect-type-list">
          <div
            v-for="option in defectOptions"
            :key="option.value"
            class="defect-type-item"
            @click="handleOpenDefectList(option.label)"
          >
            {{ option.label }}
          </div>
        </div>
      </el-dialog>

      <!-- 疵点小类选择弹窗 -->
      <el-dialog
        v-model="openDefectModal"
        :title="itemsName"
        width="500px"
        :close-on-click-modal="false"
        destroy-on-close
      >
        <div class="dialog-header">
          <el-button @click="handleBackToDefectList">
            <el-icon><back /></el-icon>
            返回
          </el-button>
        </div>
        <div class="defect-detail-list">
          <div
            v-for="item in defectDetailList"
            :key="item.defectSpotOid"
            class="defect-detail-item"
            @click="handleSelectDefect(item)"
          >
            {{ item.item }}
          </div>
        </div>
      </el-dialog>

    </div>

  </div>
</template>

<style scoped lang="scss">
.container {
  // padding:.4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // 处理一下装箱表的主要功能部分，之前没有放在一个容器里面，非常混乱
  .second-main-container {
    width: 95%;
    background: $neutral-color-1;
    display: flex;
    flex-direction: column;
    margin: $container-margin;
    padding: $container-base-padding-2 +8;
    border-radius: $border-radius-medium;
    :deep(.el-form .el-form-item) {
      margin-bottom: 8px;
    }
    box-shadow: $shadow-1;

    .operation-area {
      .btn-group {
        display: flex;
        gap: 2rem;
        margin-bottom: $container-base-padding-2;
      }

      .file-info {
        background-color: #f8f9fa;
        padding: $container-base-padding-3;
        border-radius: $border-radius-mini;
        margin-bottom: $container-base-padding-2;

        .info-text {
          color: $secondary-text-color;
          font-size: $font-size-base;
        }

        &.has-file {
          background-color: #f0faea;
          .info-text {
            color: #67c23a;
          }
        }
      }

      .choose-image-wrapper {
        margin-top: $container-base-padding-2;

        .choose-image-btn {
          width: 100%;
        }

        .choose-image-content {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;

          .plus-icon {
            margin-right: $container-base-padding-4;
          }

          .choose-image-text {
            font-size: $font-size-base;
          }
        }
      }
    }

    .naming-rules {
      margin: $container-margin-2 + 4 0;
      background-color: #f8f9fa;
      padding: $container-base-padding-3;
      border-radius: $border-radius-medium;

      .rules-title {
        font-size: $font-size-medium;
        font-weight: bold;
        color: $primary-text-color;
        margin-bottom: $container-base-padding-3;
      }

      .rules-content {
        .rule-item {
          font-size: $font-size-base;
          color: $secondary-text-color;
          line-height: 1.6;
          margin-bottom: $container-base-padding-4;

          &.important {
            color: $theme-color-6;
            font-weight: 500;
          }

          &.warning {
            color: #ff9900;
            font-weight: 500;
          }
        }
      }
    }
    .date-picker-group {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .custom-input {
      height: 30px;
      width: 80%;
    }
  }

}

.input-area {
  margin-top: $container-margin-2;
  padding: $container-base-padding-3;
  background-color: $neutral-color-1;
  border-radius: $border-radius-medium;
  box-shadow: $shadow-2;

  .input-tips {
    font-size: $font-size-base;
    color: rgb(75, 75, 75);
    margin-bottom: $container-base-padding-4;
  }

  .input-groups {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin: 20px 0;

    .input-group {
      display: flex;
      flex-direction: column;

      gap: 8px;

      &:nth-child(1) {
        flex: 1 0 100px; // 款号输入框占更多空间
      }

      &:nth-child(2) {
        flex: 0 0 100px; // 图片序号固定宽度
      }

      &.defect-group {
        flex: 3; // 疵点选择框占最多空间
      }

      &:last-child {
        flex: 0 0 auto; // 生成按钮自适应宽度
        margin-top: 24px; // 对齐其他输入框的位置
      }

      .label {
        font-size: 14px;
        color: #606266;
      }

      .defect-tags-container {
        min-height: 32px;
        padding: 4px 8px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
        max-height: 72px; // 限制最多显示两行
        overflow-y: auto;

        .defect-tag {
          margin: 0;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .add-defect-btn {
          height: 24px;
          padding: 0 8px;
          font-size: 12px;
          border: 1px dashed #dcdfe6;

          .el-icon {
            margin-right: 4px;
          }
        }
      }
    }
  }
}

.picname-list {
  margin: $container-margin-2;
  padding: $container-base-padding-3;
  background-color: #f8f9fa;
  border-radius: $border-radius-medium;
  box-shadow: $shadow-2;

  .picname-item {
    font-size: $font-size-base;
    color: $secondary-text-color;
    line-height: 1.6;
    padding: $container-base-padding-4;
    border-bottom: 1px solid $neutral-color-4;
    user-select: text;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:last-child {
      border-bottom: none;
    }

    .picname-text {
      flex: 1;
      margin-right: 10px;
    }

    .copy-button {
      flex-shrink: 0;

      border-radius: 4px;
      padding: 2px 8px;
      font-size: 12px;
      cursor: pointer;
    }
  }
}

.preview-area {
  margin-top: $container-margin-2;

  .preview-title {
    font-size: $font-size-base;
    color: $secondary-text-color;
    margin-bottom: $container-base-padding-2;
  }

  .image-list {
    display: flex;
    flex-wrap: wrap;
    gap: $container-base-padding-2;

    .image-item {
      position: relative;
      background: $neutral-color-2;
      border-radius: $border-radius-mini;
      padding: $container-base-padding-3;
      width: calc((100% - 4 * #{$container-base-padding-2}) / 5); // 5列布局，减去4个间隔的宽度

      &:nth-child(5n) {
        margin-right: 0;
      }

      :deep(.el-image) {
        width: 100%;
        height: 200px;
        object-fit: contain;
      }

      .image-info {
        width: 100%;
        margin-top: $container-base-padding-4;
        text-align: center;

        .image-name {
          font-size: $font-size-small;
          color: $secondary-text-color;
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .image-size {
          font-size: $font-size-mini;
          color: $placeholder-text-color;
        }
      }

      .delete-btn {
        position: absolute;
        top: $container-base-padding-4;
        right: $container-base-padding-4;
        z-index: 2;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        cursor: pointer;
        background: rgba(255, 255, 255, 0.8);

        &:hover {
          background: rgba(255, 255, 255, 0.9);
        }
      }

      .preview-mask {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s;
        cursor: pointer;
        pointer-events: none;
        &:hover {
          opacity: 1;
        }
      }
    }
  }

}

:deep(.el-dialog__footer) {
    padding:20px;
  }

.defect-control {
  display: none;
}

.defect-type-list,
.defect-detail-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
  padding: 16px;

  .defect-type-item,
  .defect-detail-item {
    padding: 12px;
    text-align: center;
    background-color: #f5f7fa;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background-color: #e6f1fc;
      color: #409eff;
    }
  }
}

.dialog-header {
  padding: 0 16px;
}

.image-count-input {
  width: 120px;
}

</style>
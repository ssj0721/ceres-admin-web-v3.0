import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import {
  getDefectList,
  getDefectDetails,
  getLicZcDetails,
  getLicZcStandardData,
  getInspectionStandard,
  getLicZcOrderDefective,
  getLicZcQuestions,
  getLicZcCheckImage,
  saveLicZcReport,
  saveLicZcReportForEtds,
  songShenLicZcReport,
  uploadZcReportPic,
  uploadEtdsFile,
  saveNormalPic,
  saveDefectPic,
  retrieveLicZcReport,
  gcZcDeletePic,
  getAllShopItems as fetchShopItemsApi,
  getGcZcCheckReportBcNum,
  checkItemFromLicPo,
  checkLicPoCanAudit,
  checkZcReportExist
} from '@/api/etds'
import { ElMessage } from 'element-plus'

export const useLicZcStore = defineStore('licZcStore', () => {
  // 查货信息表单数据
  const checkFormData = ref({
    bc_pono: '', // 款号
    lic_type: 0, // 业务类型
    bc_date: '', // 查货日期
    sconfirm: '未送审', // 送审状态
    bc_qs: '尾期', // 中尾期
    batchNo: 1, // 批号
    bc_num: 1, // 查货次数
    bc_result: '', // 查货结果
  })
  const currentPonoInfo = ref({})
  const scmOid = ref('') // 查货款的oid，针对工厂送审 单独出来一个变量暂存
  const isGcReport = ref(false) // 是否是工厂送审
  // 详细资料表单数据
  const detailsFormData = ref({
    checkScrit: 'AQL2.5II', // 查货标准
    totalNum: 0, // 落货总数
    bc_date: '', // 查货日期
    checkNum: 0, // 查货数量
    accNum: 0, // 接受数量
    disAccNum: 0, // 不接受数量
    color: '', // 颜色
    standard1: [], // 主唛标准
    standard2: [], // 洗水唛标准
    standard3: [], // 吊牌标准
    record: [], // 记录疵点及其图片
  })

  // 问题跟进表单数据
  const problemFormData = ref({
    foreign: '', // 问题
    GM_CH_be_questionsOID: '', // 问题跟进ID
  })

  // 图片上传数据
  const uploadFormData = ref({
    imageList: [], // 图片列表
  })

  // 其他状态数据
  const defectDetailList = ref([]) // 疵点详情列表
  const defectOptions = ref([]) // 疵点选项列表
  const checkItems = ref([
    { label: 'AQL2.5II', value: 'AQL2.5II' },
    { label: 'AQL1.0II', value: 'AQL1.0II' },
    { label: 'AQL1.5II', value: 'AQL1.5II' },
    { label: '100%', value: '100%' },
  ])

  // 处理是否是工厂送来的报告，是就各种禁用
  const disabledGcReport = computed(() => currentPonoInfo.value.isGcReport || false)

  // 添加一个用于跟踪原始图片的状态
  const originalImages = ref({
    normal: [], // 保存原始的普通图片
    defect: [] // 保存原始的疵点图片
  })

  // 联营商能导的款
  const shopItemCodeList = ref([])

  // 处理图片预览
  // 规范预览名
  function getPreviewName (pic) {
    if (!pic) { return '' }
    const prefix = 'http://upload.gsitcloud.com/'
    return `${prefix}${pic}`
  }

  // 上传前要保证图片的前缀没有http://upload.gsitcloud.com/
  function getUploadPic (pic) {
    console.log('pic', pic)
    if (!pic) { return '' }
    return pic.replace('http://upload.gsitcloud.com/', '')
  }

  // 获取查货信息数据
  async function getCheckData () {
    if (!currentPonoInfo.value?.bc_pono) { return }
    updateCheckForm(currentPonoInfo.value)
  }

  // 获取详细资料数据
  async function getDetailsData () {
    try {
      if (!currentPonoInfo.value?.bc_pono) { return }

      const res = await getLicZcDetails({
        checkReportOid: currentPonoInfo.value.oid,
      })

      if (res.data.result) {
        const data = res.data.result[0]
        updateDetailsForm({
          bc_date: data.bc_date,
          checkNum: data.checkNum,
          accNum: data.accNum,
          disAccNum: data.disAccNum,
          color: data.color,
          totalNum: data.totalNum,
          checkScrit: data.checkScrit,
        })
      }
    } catch (error) {
      console.error('获取详细资料失败:', error)
    }
  }

  // 获取标准数据
  async function getStandardData () {
    try {
      const res = await getLicZcStandardData({
        pono: currentPonoInfo.value.bc_pono,
        num: 1,
        bcqs: currentPonoInfo.value.bc_qs === '中期' ? '1' : '3',
        batchNo: detailsFormData.value.batchNo,
      })

      if (res.data.result.Examples) {
        const standardTotal = res.data.result.Examples
        const standard1 = []
        const standard2 = []
        const standard3 = []

        standardTotal.forEach((item) => {
          if (item.labeltypeid === '1') { standard1.push(item.number) }
          if (item.labeltypeid === '2') { standard2.push(item.number) }
          if (item.labeltypeid === '3') { standard3.push(item.number) }
        })

        updateDetailsForm({ standard1, standard2, standard3 })
      }
    } catch (error) {
      console.error('获取标准数据失败:', error)
    }
  }

  // 获取查货标准
  async function getInspectionStandardData () {
    try {
      const res = await getInspectionStandard({
        unloadNumber: detailsFormData.value.totalNum,
        AQLID: detailsFormData.value.checkScrit,
      })

      if (res.data) {
        detailsFormData.value.checkNum = res.data.quantity || 0
        detailsFormData.value.accNum = res.data.acceptNum || 0
        detailsFormData.value.disAccNum = res.data.rejectNum || 0
      }
    } catch (error) {
      console.error('获取查货标准失败:', error)
    }
  }

  // 获取疵点列表
  async function getDefectListData (itemsName = '') {
    try {
      const res = await getDefectList({
        itemsName,
      })

      if (res.data.result.Examples) {
        defectOptions.value = res.data.result.Examples.map(item => ({
          label: item,
          value: item,
        }))
      }
    } catch (error) {
      console.error('获取疵点类型列表失败:', error)
    }
  }

  // 获取疵点详情
  async function getDefectDetailsData (itemsName) {
    try {
      const repType = localStorage.getItem('repType') || '1'
      const res = await getDefectDetails({
        itemsName,
        repType,
      })

      if (res.data.result.Examples) {
        defectDetailList.value = res.data.result.Examples
      }
    } catch (error) {
      console.error('获取疵点详情失败:', error)
    }
  }

  // 初始化时保存原始图片状态
  function saveOriginalImageState () {
    // 保存普通图片状态
    originalImages.value.normal = uploadFormData.value.imageList.map(img => ({
      preview: img.preview,
      bp_fileSize: img.bp_fileSize,
      checkOID: img.checkOID
    }))

    // 保存疵点图片状态
    originalImages.value.defect = detailsFormData.value.record.map(record => ({
      pic1: record.pic1,
      pic2: record.pic2,
      BS_SIZE: record.BS_SIZE,
      BS_SIZE2: record.BS_SIZE2,
      itemOid: record.itemOid
    }))
    console.log('原始图片状态:', originalImages.value)
  }

  // 修改获取数据方法，保存原始状态
  async function getUploadData () {
    try {
      const res = await getLicZcCheckImage({
        checkReportsOID: currentPonoInfo.value.oid,
      })

      if (res.data) {
        const imageList = res.data.map(item => ({
          bp_fileSize: item.bp_fileSize,
          checkOID: item.checkOID,
          preview: getPreviewName(item.imgData),
        }))

        updateUploadForm({
          imageList,
        })

        // 保存原始状态
        saveOriginalImageState()
      }
    } catch (error) {
      console.error('获取图片数据失败:', error)
    }
  }

  // 修改获取疵点数据方法，保存原始状态
  async function getDefectiveData () {
    try {
      const res = await getLicZcOrderDefective({
        checkReportOId: currentPonoInfo.value.oid,
      })

      if (res.data.result.Examples) {
        const record = res.data.result.Examples.map(item => ({
          item: item.item || '',
          itemsName: item.itemsName || '',
          itemOid: item.itemOid || '',
          pic1: getPreviewName(item.pic1),
          pic2: getPreviewName(item.pic2),
          remark: item.remark || '',
          oid: item.oid || '',
          BS_SIZE: item.BS_SIZE || 0,
          BS_SIZE2: item.BS_SIZE2 || 0,
          bs_value: item.bs_value || 1,
        }))
        updateDetailsForm({ record })

        // 保存原始状态
        saveOriginalImageState()
      }
    } catch (error) {
      console.error('获取订单疵点数据失败:', error)
    }
  }

  // 获取问题跟进数据
  async function getProblemData () {
    try {
      const res = await getLicZcQuestions({
        checkReportsOID: currentPonoInfo.value.oid,
      })

      if (res.data) {
        problemFormData.value.foreign = res.data.question
        problemFormData.value.GM_CH_be_questionsOID = res.data.GM_CH_be_questionsOID
      }
    } catch (error) {
      console.error('获取问题跟进数据失败:', error)
    }
  }

  // 初始化所有数据
  async function initAllData () {
    const storageData = localStorage.getItem('currentPonoInfo')
    currentPonoInfo.value = storageData ? JSON.parse(storageData) : {}

    if (!currentPonoInfo.value?.bc_pono) { return }

    try {
      await fetchAllShopItems()
      await getCheckData()
      await getDetailsData()

      await Promise.all([
        getStandardData(),
        getInspectionStandardData(),
        getDefectListData(),
        getDefectiveData(),
        getProblemData(),
        getUploadData(),
      ])

      // 保存原始图片状态
      saveOriginalImageState()
    } catch (error) {
      console.error('初始化数据失败:', error)
    }
  }

  // 更新查货信息
  function updateCheckForm (data) {
    checkFormData.value = {
      ...checkFormData.value,
      ...data,
    }
  }

  // 更新详细资料
  function updateDetailsForm (data) {
    detailsFormData.value = {
      ...detailsFormData.value,
      ...data,
    }
  }

  // 更新问题跟进
  function updateProblemForm (data) {
    problemFormData.value = {
      ...problemFormData.value,
      ...data,
    }
  }

  // 更新图片上传数据
  function updateUploadForm (data) {
    uploadFormData.value = {
      ...uploadFormData.value,
      ...data,
    }
  }

  // 重置所有数据
  async function resetAllData () {
    // 重置所有表单数据
    checkFormData.value = {
      bc_pono: '',
      lic_type: 0,
      bc_date: '',
      sconfirm: '',
      bc_qs: '尾期',
      batchNo: 1,
      bc_num: 1,
      bc_result: '',
    }
    detailsFormData.value = {
      checkScrit: 'AQL2.5II',
      totalNum: 0,
      bc_date: '',
      checkNum: 0,
      accNum: 0,
      disAccNum: 0,
      color: '',
      standard1: [],
      standard2: [],
      standard3: [],
      record: [],
    }
    problemFormData.value = {
      foreign: '',
      GM_CH_be_questionsOID: '',
    }
    uploadFormData.value = {
      imageList: [],
    }
    defectDetailList.value = []
    defectOptions.value = []
    currentPonoInfo.value = {}
    scmOid.value = ''
    isGcReport.value = false
    originalImages.value = {
      normal: [],
      defect: []
    }
    localStorage.removeItem('currentPonoInfo')
  }

  async function initEmptyState () {
    resetAllData()
    await fetchAllShopItems()
    // 设置一些默认值
    checkFormData.value = {
      ...checkFormData.value,
      bc_date: new Date().toISOString().split('T')[0], // 设置当前日期
    }
    detailsFormData.value = {
      ...detailsFormData.value,
      bc_date: new Date().toISOString().split('T')[0], // 设置当前日期
      checkScrit: 'AQL2.5II', // 设置默认查货标准
    }
    // 初始化疵点列表
    await getDefectListData()
  }

  // 获取所有表单数据（用于保存）
  function getAllFormData () {
    return {
      checkForm: checkFormData.value,
      detailsForm: detailsFormData.value,
      problemForm: problemFormData.value,
      uploadForm: uploadFormData.value,
    }
  }

  // 添加疵点记录
  function addDefectRecord (defectData) {
    detailsFormData.value.record.push({
      item: defectData.item || '',
      itemOid: defectData.defectSpotOid || '',
      itemsName: defectData.itemsName || '',
      pic1: null,
      pic2: null,
      remark: defectData.item || '',
      oid: '',
      BS_SIZE: 0,
      BS_SIZE2: 0,
      bs_value: 1,
    })
  }

  // 更新疵点记录
  function updateDefectRecord (index, data) {
    if (detailsFormData.value.record[index]) {
      detailsFormData.value.record[index] = {
        ...detailsFormData.value.record[index],
        ...data,
      }
    } else {
      detailsFormData.value.record.push(data)
    }
  }

  // 删除疵点记录
  function removeDefectRecord (index) {
    detailsFormData.value.record.splice(index, 1)
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

      const uploadResult = await uploadZcReportPic(formData)
      return uploadResult.data?.pic_path || null
    } catch (error) {
      console.error('图片上传失败:', error)
      return null
    }
  }

  // 判断是否需要上传（不是已存在的服务器图片）
  function needUpload (pic) {
    if (!pic) { return false }
    if (typeof pic === 'string') {
      // 同时支持adv和scm路径格式
      return !(pic.includes('adv/iretail/etds/') || pic.includes('scm/iretail/etds/'))
    }
    if (pic instanceof File) {
      return true
    }
    if (typeof pic === 'object' && pic !== null) {
      return !!pic.file || !!pic.path
    }
    return false
  }

  // 获取上传用的文件对象
  function getUploadFile (pic) {
    if (!pic) { return null }
    if (pic instanceof File) {
      return pic
    }
    if (typeof pic === 'object' && pic !== null) {
      return pic.file || pic
    }
    return pic
  }

  // 找出需要删除的图片
  function getImagesToDelete () {
    const imagesToDelete = []

    // 1. 检查普通图片
    for (const original of originalImages.value.normal) {
      // 如果原始预览URL存在且包含图床路径
      if (original.preview && typeof original.preview === 'string' &&
          (original.preview.includes('http://upload.gsitcloud.com/adv/iretail/etds/') ||
           original.preview.includes('http://upload.gsitcloud.com/scm/iretail/etds/'))) {
        // 检查当前列表中是否还存在这张图片
        const stillExists = uploadFormData.value.imageList.some(img =>
          img.preview === original.preview
        )

        // 如果不存在，说明被删除了，加入到删除列表
        if (!stillExists) {
          console.log('找到被删除的普通图片:', original.preview)
          imagesToDelete.push(getUploadPic(original.preview))
        }
      }
    }

    // 2. 检查疵点图片
    for (const original of originalImages.value.defect) {
      // 处理第一张疵点图
      if (original.pic1 && typeof original.pic1 === 'string' &&
          (original.pic1.includes('http://upload.gsitcloud.com/adv/iretail/etds/') ||
           original.pic1.includes('http://upload.gsitcloud.com/scm/iretail/etds/'))) {
        // 检查当前列表中是否还存在这张图片
        const stillExists = detailsFormData.value.record.some(record =>
          record.pic1 === original.pic1
        )

        // 如果不存在，说明被删除了，加入到删除列表
        if (!stillExists) {
          console.log('找到被删除的疵点图片1:', original.pic1)
          imagesToDelete.push(getUploadPic(original.pic1))
        }
      }

      // 处理第二张疵点图
      if (original.pic2 && typeof original.pic2 === 'string' &&
          (original.pic2.includes('http://upload.gsitcloud.com/adv/iretail/etds/') ||
           original.pic2.includes('http://upload.gsitcloud.com/scm/iretail/etds/'))) {
        // 检查当前列表中是否还存在这张图片
        const stillExists = detailsFormData.value.record.some(record =>
          record.pic2 === original.pic2
        )

        // 如果不存在，说明被删除了，加入到删除列表
        if (!stillExists) {
          console.log('找到被删除的疵点图片2:', original.pic2)
          imagesToDelete.push(getUploadPic(original.pic2))
        }
      }
    }

    console.log('需要删除的图片列表:', imagesToDelete)
    return imagesToDelete
  }

  // 删除被移除的图片
  async function deleteRemovedImages () {
    try {
      const imagesToDelete = getImagesToDelete()

      // 如果没有需要删除的图片，直接返回
      if (imagesToDelete.length === 0) {
        console.log('没有需要删除的图片')
        return true
      }

      console.log('需要删除的图片:', imagesToDelete)

      // 逐个删除图片
      for (const fileName of imagesToDelete) {
        try {
          // console.log('正在删除图片:', fileName)
          const deleteResult = await gcZcDeletePic({
            fileName
          })
          // console.log('删除图片结果:', deleteResult)
          console.log('成功删除图片:', fileName)
        } catch (error) {
          console.error('删除图片失败:', fileName, error)
        }
      }

      // 更新原始图片状态为当前状态
      saveOriginalImageState()

      return true
    } catch (error) {
      console.error('删除移除的图片失败:', error)
      return false
    }
  }

  // 修改保存方法，先删除被移除的图片
  async function saveAllData (radioValue) {
    try {
      // 起码要有radioValue
      if (!radioValue) {
        ElMessage.warning('请选择查货结果')
        return false
      }
      // 第一步先检查是否有款号
      if (!checkFormData.value.bc_pono) {
        ElMessage.warning('款号不能为空')
        return false
      }
      // 检查款号格式
      // const pattern = /^[0-9a-zA-Z]{2}-[0-9][12349]-[0-9a-zA-Z]{6}$/
      // if (!pattern.test(checkFormData.value.bc_pono)) {
      //   ElMessage.warning('款号不符合xx-yy-zzzzzz格式输入,xx=款字头,yy=年季,zzzzzz=流水号')
      //   return false
      // }
      // 检查款号在shopItemCodeList中
      const item = shopItemCodeList.value.find(item => item === checkFormData.value.bc_pono)
      if (!item) {
        ElMessage.warning('该款号不是本联营商款号/该款号不存在')
        return false
      }
      // 检查款号在licPo中
      // const resPo = await checkItemFromLicPo({
      //   bc_pono: checkFormData.value.bc_pono,
      // })
      // if (resPo.data.result.Examples.licPo.length === 0) {
      //   ElMessage.warning('该款号在查货系统中不存在')
      //   return false
      // }

      // 明确区分新增和更新模式
      const isNewMode = !currentPonoInfo.value?.oid
      const checkreportoid = isNewMode ? '00000000-0000-0000-0000-000000000000' : currentPonoInfo.value.oid

      // 只在更新模式下删除旧图片
      if (!isNewMode) {
        await deleteRemovedImages()
      }

      // 2. 处理普通图片上传
      const piclist = []
      if (uploadFormData.value.imageList?.length > 0) {
        for (const img of uploadFormData.value.imageList) {
          if (!img) { continue }

          try {
            if (needUpload(img)) {
              const uploadResult = await uploadImage(getUploadFile(img), {
                fk: checkreportoid,
                type: '1',
                bp_fileSize: img.bp_fileSize || img.size || 0,
              })

              if (uploadResult) {
                piclist.push({
                  fileName: generateTimestampFileName(img),
                  fileSize: img.bp_fileSize || img.size,
                  fileStream: uploadResult,
                })
              }
            } else {
              piclist.push({
                fileName: img.name || '',
                fileSize: img.bp_fileSize || img.size || 0,
                fileStream: getUploadPic(img.preview || ''),
              })
            }
          } catch (error) {
            console.error('处理普通图片失败:', error)
          }
        }
      }

      // 3. 处理疵点图片上传
      const cdlist = []
      if (detailsFormData.value.record?.length > 0) {
        for (const item of detailsFormData.value.record) {
          const defectData = {
            itemsName: item.itemsName || '',
            item: item.item || '',
            remark: item.remark || '',
            bs_value: item.bs_value || 0,
            pic1: '',
            pic2: '',
            itemOid: item.itemOid || '',
            BS_SIZE: item.BS_SIZE || 0,
            BS_SIZE2: item.BS_SIZE2 || 0,
          }

          try {
            // 处理 pic1
            if (item.pic1) {
              if (needUpload(item.pic1)) {
                const uploadResult = await uploadImage(getUploadFile(item.pic1), {
                  fk: checkreportoid,
                  type: 'pic1',
                  bp_fileSize: item.BS_SIZE || 0,
                  bs_item: item.item || '',
                })
                defectData.pic1 = uploadResult || ''
              } else {
                defectData.pic1 = typeof item.pic1 === 'string' ? getUploadPic(item.pic1) : ''
              }
            }

            // 处理 pic2
            if (item.pic2) {
              if (needUpload(item.pic2)) {
                const uploadResult = await uploadImage(getUploadFile(item.pic2), {
                  fk: checkreportoid,
                  type: 'pic2',
                  bp_fileSize: item.BS_SIZE2 || 0,
                  bs_item: item.item || '',
                })
                defectData.pic2 = uploadResult || ''
              } else {
                defectData.pic2 = typeof item.pic2 === 'string' ? getUploadPic(item.pic2) : ''
              }
            }
          } catch (error) {
            console.error('处理疵点图片失败:', error)
          }

          cdlist.push(defectData)
        }
      }

      // 4. 准备请求参数
      const requestBody = {
        condition: checkreportoid,
        is_new: isNewMode ? '1' : '0',
        lic_type: checkFormData.value.lic_type || 0,
        CheckReports: [{
          CH_ba_ReportType_FK: checkFormData.value.reportType || 10,
          bc_totalNum: detailsFormData.value.totalNum || 0,
          bc_checkNum: detailsFormData.value.checkNum || 0,
          bc_accNum: detailsFormData.value.accNum || 0,
          bc_disAccNum: detailsFormData.value.disAccNum || 0,
          bc_color: detailsFormData.value.color || '',
          bc_checkScrit: detailsFormData.value.checkScrit || '',
          bc_result: radioValue || 1,
          bc_checkdate: checkFormData.value.bc_date || '',
          pono: checkFormData.value.bc_pono || '',
          bcQs: checkFormData.value.bc_qs === '中期' ? '1' : '3',
          batchNo: checkFormData.value.batchNo || 1,
          num: checkFormData.value.bc_num || 1,
          checkerOId: localStorage.getItem('platformUserId') || '',
        }],
        CheckPic: [{
          GM_CH_be_CheckPicOID: '',
          bp_fileName: '',
          bp_fileSize: '',
          bp_desc: '',
          bp_stream: piclist,
        }],
        questions: [{
          GM_CH_be_questionsOID: problemFormData.value.GM_CH_be_questionsOID || '',
          bq_seq: 1,
          bq_custQues: '',
          bq_question: problemFormData.value.foreign || '',
        }],
        CheckData: [{
          detailsvueform: cdlist,
        }],
      }

      // 发送请求
      const res = await saveLicZcReport(requestBody)

      // 错误处理增加更多细节
      if (!res?.data?.msg || res.data.msg === '0') {
        const errorMsg = res?.data?.msg === '0' ? '已有相同的查货资料存在,保存失败!' : '保存失败'
        throw new Error(errorMsg)
      }

      // 保存成功后更新 currentPonoInfo
      if (isNewMode) {
        currentPonoInfo.value = {
          ...currentPonoInfo.value,
          oid: res.data.msg
        }
        // 保存新的图片状态
        saveOriginalImageState()
      }

      return true
    } catch (error) {
      console.error('保存失败:', error)
      return false
    }
  }

  // 存档到查货系统
  async function saveToInspection (radioValue, isAdd) {
    try {
      console.log('开始存档到查货系统，参数:', radioValue)
      // 基础验证
      // if (!radioValue) {
      //   ElMessage.warning('请选择查货结果')
      //   return false
      // }
      // if (!checkFormData.value.bc_pono) {
      //   ElMessage.warning('款号不能为空')
      //   return false
      // }
      // const item = shopItemCodeList.value.find(item => item.itemcode === checkFormData.value.bc_pono)
      // console.log('item', item)
      // if (!item) {
      //   ElMessage.warning('该款号不是本联营商款号/该款号不存在')
      //   return false
      // }

      // 新增模式下不需要checkreportoid
      const isNewMode = isAdd // 使用传入的参数判断是否为新增模式
      const checkreportoid = isNewMode ? '00000000-0000-0000-0000-000000000000' : currentPonoInfo.value.oid
      console.log('isNewMode', isNewMode)
      console.log('checkreportoid', checkreportoid)

      // 只在更新模式下删除旧图片
      if (!isNewMode) {
        await deleteRemovedImages()
      }

      // 2. 处理疵点列表
      const cdlist = detailsFormData.value.record.map(item => ({
        itemsName: item.itemsName || '',
        item: item.item || '',
        remark: item.remark || '',
        bs_value: item.bs_value || 0,
        pic1: '',
        pic2: '',
        itemOid: item.itemOid || '',
        BS_SIZE: item.BS_SIZE || 0,
        BS_SIZE2: item.BS_SIZE2 || 0,
      }))

      // 3. 处理普通图片列表
      const piclist = uploadFormData.value.imageList.map(img => ({
        fileName: img.name || '',
        fileSize: img.bp_fileSize || img.size || 0,
        baseData: '',
      }))

      // 打印几个数据验证一下

      const userInfo = JSON.parse(localStorage.getItem('storage_key_etds')) || {}
      // 4. 准备请求参数
      const requestBody = {
        lic_type: checkFormData.value.lic_type || 0,
        CheckReports: [{
          CH_ba_ReportType_FK: checkFormData.value.reportType || 10,
          bc_totalNum: detailsFormData.value.totalNum || 0,
          bc_checkNum: detailsFormData.value.checkNum || 0,
          bc_accNum: detailsFormData.value.accNum || 0,
          bc_disAccNum: detailsFormData.value.disAccNum || 0,
          bc_color: detailsFormData.value.color || '',
          bc_checkScrit: detailsFormData.value.checkScrit || '',
          bc_result: radioValue || 1,
          bc_checkdate: checkFormData.value.bc_date || '',
          pono: checkFormData.value.bc_pono || '',
          bcQs: checkFormData.value.bc_qs === '中期' ? '1' : '3',
          batchNo: checkFormData.value.batchNo || 1,
          num: checkFormData.value.bc_num || 1,
          checkerOId: userInfo.oid || '',
        }],
        CheckPic: [{
          GM_CH_be_CheckPicOID: '',
          bp_fileName: '',
          bp_fileSize: '',
          bp_desc: '',
          bp_stream: JSON.stringify(piclist),
        }],
        questions: [{
          GM_CH_be_questionsOID: problemFormData.value.GM_CH_be_questionsOID || '',
          bq_seq: 1,
          bq_custQues: '',
          bq_question: problemFormData.value.foreign || '',
        }],
        CheckData: [{
          detailsvueform: JSON.stringify(cdlist),
        }],

      }

      // 根据isGcReport调整requestBody
      if (isGcReport.value) {
        // 如果是工厂报告，添加scmOid，不添加condition
        requestBody.scmOid = scmOid.value || ''
        requestBody.isGcReport = true
      } else {
        requestBody.condition = checkreportoid
        requestBody.scmOid = currentPonoInfo.value.oid || ''
      }

      // 5. 发送存档请求
      const res = await saveLicZcReportForEtds(requestBody)
      console.log('requestBody', requestBody)

      if (!res?.data?.result?.msg?.msg || res.data.result.msg.msg === '0') {
        throw new Error(res.data.result.msg.msg === '0' ? '已有相同的查货资料存在,存档失败!' : '存档失败')
      }

      // 6. 获取新的 checkreportoid
      const newCheckreportoid = res.data.result.msg.msg

      // 7. 处理图片上传
      // 7.1 处理普通图片上传
      if (uploadFormData.value.imageList?.length > 0) {
        for (const img of uploadFormData.value.imageList) {
          if (!img) { continue }

          try {
            if (needUpload(img)) {
              const uploadResult = await uploadImage(getUploadFile(img), {
                fk: newCheckreportoid,
                type: '1',
                bp_fileSize: img.bp_fileSize || img.size || 0,
              })

              if (uploadResult) {
                await saveNormalPic({
                  pic_path: uploadResult,
                  bp_fileSize: img.bp_fileSize || img.size || 0,
                  fk: newCheckreportoid,
                })
              }
            } else {
              await saveNormalPic({
                pic_path: getUploadPic(img.preview),
                bp_fileSize: img.bp_fileSize || img.size || 0,
                fk: newCheckreportoid,
              })
            }
          } catch (error) {
            console.error('处理普通图片失败:', error)
          }
        }
      }

      // 7.2 处理疵点图片上传
      if (detailsFormData.value.record?.length > 0) {
        for (const item of detailsFormData.value.record) {
          try {
            // 处理 pic1
            if (item.pic1) {
              if (needUpload(item.pic1)) {
                const uploadResult = await uploadImage(getUploadFile(item.pic1), {
                  fk: newCheckreportoid,
                  type: 'pic1',
                  bp_fileSize: item.BS_SIZE || 0,
                  bs_item: item.item || '',
                })
                if (uploadResult) {
                  await saveDefectPic({
                    bs_pic: uploadResult,
                    BS_SIZE: item.BS_SIZE,
                    fk: newCheckreportoid,
                    bs_item: item.itemOid,
                    pictype: '1',
                  })
                }
              } else {
                await saveDefectPic({
                  bs_pic: getUploadPic(item.pic1),
                  BS_SIZE: item.BS_SIZE,
                  fk: newCheckreportoid,
                  bs_item: item.itemOid,
                  pictype: '1',
                })
              }
            }

            // 处理 pic2
            if (item.pic2) {
              if (needUpload(item.pic2)) {
                const uploadResult = await uploadImage(getUploadFile(item.pic2), {
                  fk: newCheckreportoid,
                  type: 'pic2',
                  bp_fileSize: item.BS_SIZE2 || 0,
                  bs_item: item.item || '',
                })
                if (uploadResult) {
                  await saveDefectPic({
                    bs_pic: uploadResult,
                    BS_SIZE: item.BS_SIZE2,
                    fk: newCheckreportoid,
                    bs_item: item.itemOid,
                    pictype: '2',
                  })
                }
              } else {
                await saveDefectPic({
                  bs_pic: getUploadPic(item.pic2),
                  BS_SIZE: item.BS_SIZE2,
                  fk: newCheckreportoid,
                  bs_item: item.itemOid,
                  pictype: '2',
                })
              }
            }
          } catch (error) {
            console.error('处理疵点图片失败:', error)
          }
        }
      }

      // 8. 保存新的checkreportoid到currentPonoInfo
      if (isNewMode) {
        currentPonoInfo.value = {
          ...currentPonoInfo.value,
          oid: newCheckreportoid
        }
        saveOriginalImageState()
      }

      return true
    } catch (error) {
      console.error('存档到查货失败:', error)
      return false
    }
  }

  // 处理工厂送审逻辑
  async function handleFactorySendAudit (row) {
    try {
      const oid = row.oid
      // 1. 获取工厂报告数据
      const reportData = await getLicZcDetails({
        checkReportOid: oid,
      })

      if (!reportData.data.result?.[0]) {
        throw new Error('获取工厂报告数据失败')
      }
      console.log('reportData', reportData)
      const report = reportData.data.result[0]

      // 2. 获取疵点数据
      const defectData = await getLicZcOrderDefective({
        checkReportOId: oid,
      })

      // 3. 获取图片数据
      const imageData = await getLicZcCheckImage({
        checkReportsOID: oid,
      })

      // 4. 获取问题跟进数据
      const questionData = await getLicZcQuestions({
        checkReportsOID: oid,
      })

      // 5. 更新store中的数据
      // 5.1 更新查货信息
      updateCheckForm({
        bc_pono: row.bc_pono,
        lic_type: row.lic_type,
        bc_date: row.bc_date,
        sconfirm: row.sconfirm,
        bc_qs: row.bc_qs,
        batchNo: row.bc_batchNo,
        bc_num: row.bc_num,
        bc_result: row.bc_result,
      })

      // 5.2 更新详细资料
      updateDetailsForm({
        checkScrit: row.bc_checkScrit,
        totalNum: row.bc_totalNum,
        bc_date: row.bc_date,
        checkNum: report.bc_checkNum || 0,
        accNum: report.bc_accNum || 0,
        disAccNum: report.bc_disAccNum || 0,
        color: row.bc_color,
        record: (defectData && defectData.data && defectData.data.result && defectData.data.result.Examples)
          ? defectData.data.result.Examples.map(item => ({
            item: item.item || '',
            itemsName: item.itemsName || '',
            itemOid: item.itemOid || '',
            pic1: item.pic1,
            pic2: item.pic2,
            remark: item.remark || '',
            oid: item.oid || '',
            BS_SIZE: item.BS_SIZE || 0,
            BS_SIZE2: item.BS_SIZE2 || 0,
            bs_value: item.bs_value || 1,
          })) : [],
      })

      // 5.3 更新图片数据
      updateUploadForm({
        imageList: imageData.data.map(item => ({
          bp_fileSize: item.bp_fileSize,
          checkOID: item.checkOID,
          preview: getUploadPic(item.imgData),
        })),
      })

      // 5.4 更新问题跟进
      updateProblemForm({
        foreign: questionData.data.question,
        GM_CH_be_questionsOID: questionData.data.GM_CH_be_questionsOID,
      })

      // 6. 保存原始图片状态
      saveOriginalImageState()

      // 检查是否拿到了所有必须的数据
      // console.log('reportData', reportData)
      // console.log('defectData', defectData)
      // console.log('imageData', imageData)
      // console.log('questionData', questionData)

      // 保存前为了能达到新增的效果，因为狗屎的后端写的很离谱我不能改，所以先在这里
      // 把currentPonoInfo.value.oid 的值清空，因为这样才是新增
      scmOid.value = row.oid
      isGcReport.value = true
      // 7. 保存到查货系统
      const saveResult = await saveToInspectionForAudit(row.bc_result)
      if (!saveResult) {
        throw new Error('保存到查货系统失败')
      } else {
        // 普通送审逻辑
        const res = await songShenLicZcReport({
          oid: oid,
        })
        if (res.data === 1) {
          checkFormData.value.sconfirm = '已送审'
          return true
        }
      }
    } catch (error) {
      console.error('工厂送审失败:', error)
      return false
    }
  }

  // 处理送审逻辑
  async function handleSendAudit (row) {
    try {
      // 判断是否是工厂报告
      if (row) {
        const isGcReport = row.isGcReport
        if (isGcReport) {
        // 如果是工厂报告，使用工厂送审逻辑
          const res = handleFactorySendAudit(row)
          return res
        }
      }

      // 送审前先调用一次保存接口 无论对或者错都送审一次 因为可能如果有重复数据就返回为false了，但是其实还是能送审
      const bc_result = row?.bc_result || checkFormData.value.bc_result
      const checkReportOid = row?.oid || currentPonoInfo.value.oid
      const checkReportExistRes = await checkZcReportExist({
        checkReportOid: checkReportOid,
      })
      if (checkReportExistRes.data.result) {
        await saveToInspection(bc_result, false)
      } else {
        await saveToInspection(bc_result, true)
      }
      // 普通送审逻辑
      const res = await songShenLicZcReport({
        oid: row?.oid || currentPonoInfo.value.oid,
      })
      if (res.data === 1) {
        checkFormData.value.sconfirm = '已送审'
        return true
      }
    } catch (error) {
      console.error('送审失败:', error)
      return false
    }
  }
  // 处理取回逻辑
  // 处理取回
  async function handleRetrieve () {
    // 如果没有送审不给取回

    try {
      const res = await retrieveLicZcReport({
        oid: currentPonoInfo.value.oid,
      })
      if (res.data === 1) {
        checkFormData.value.sconfirm = '未送审'
      }
      return res.data
    } catch (error) {
      console.error('取回失败:', error)
    }
  }

  // 查询联营商能导的款
  async function fetchAllShopItems () {
    const res = await fetchShopItemsApi({
      userId: localStorage.getItem('platformUserId') || ''
    })
    console.log('res shopItemCodeList!!', res)
    if (res.data) {
      shopItemCodeList.value = res.data
    }
  }

  // 根据批次号查询自查次数
  async function fetchBcNum (params) {
    const res = await getGcZcCheckReportBcNum(params)
    if (res.data) {
      checkFormData.value.bc_num = res.data
    }
  }

  // 2025.06.04 新增 因为原本送审的保存接口是直接调用的 savetoinspection 所以需要重写一个接口，否则会拦截那个itemcodeList
  async function saveToInspectionForAudit (radioValue) {
    try {
      console.log('开始存档到查货系统，参数:', radioValue)

      // 基础验证
      if (!radioValue) {
        ElMessage.warning('请选择查货结果')
        return false
      }
      if (!checkFormData.value.bc_pono) {
        ElMessage.warning('款号不能为空')
        return false
      }

      // 新增模式下不需要checkreportoid
      const isNewMode = !currentPonoInfo.value?.oid
      const checkreportoid = isNewMode ? '00000000-0000-0000-0000-000000000000' : currentPonoInfo.value.oid

      // 只在更新模式下删除旧图片
      if (!isNewMode) {
        await deleteRemovedImages()
      }

      // 2. 处理疵点列表
      const cdlist = detailsFormData.value.record.map(item => ({
        itemsName: item.itemsName || '',
        item: item.item || '',
        remark: item.remark || '',
        bs_value: item.bs_value || 0,
        pic1: '',
        pic2: '',
        itemOid: item.itemOid || '',
        BS_SIZE: item.BS_SIZE || 0,
        BS_SIZE2: item.BS_SIZE2 || 0,
      }))

      // 3. 处理普通图片列表
      const piclist = uploadFormData.value.imageList.map(img => ({
        fileName: img.name || '',
        fileSize: img.bp_fileSize || img.size || 0,
        baseData: '',
      }))

      // 打印几个数据验证一下

      const userInfo = JSON.parse(localStorage.getItem('storage_key_etds')) || {}
      // 4. 准备请求参数
      const requestBody = {
        lic_type: checkFormData.value.lic_type || 0,
        CheckReports: [{
          CH_ba_ReportType_FK: checkFormData.value.reportType || 10,
          bc_totalNum: detailsFormData.value.totalNum || 0,
          bc_checkNum: detailsFormData.value.checkNum || 0,
          bc_accNum: detailsFormData.value.accNum || 0,
          bc_disAccNum: detailsFormData.value.disAccNum || 0,
          bc_color: detailsFormData.value.color || '',
          bc_checkScrit: detailsFormData.value.checkScrit || '',
          bc_result: radioValue || 1,
          bc_checkdate: checkFormData.value.bc_date || '',
          pono: checkFormData.value.bc_pono || '',
          bcQs: checkFormData.value.bc_qs === '中期' ? '1' : '3',
          batchNo: checkFormData.value.batchNo || 1,
          num: checkFormData.value.bc_num || 1,
          checkerOId: userInfo.oid || '',
        }],
        CheckPic: [{
          GM_CH_be_CheckPicOID: '',
          bp_fileName: '',
          bp_fileSize: '',
          bp_desc: '',
          bp_stream: JSON.stringify(piclist),
        }],
        questions: [{
          GM_CH_be_questionsOID: problemFormData.value.GM_CH_be_questionsOID || '',
          bq_seq: 1,
          bq_custQues: '',
          bq_question: problemFormData.value.foreign || '',
        }],
        CheckData: [{
          detailsvueform: JSON.stringify(cdlist),
        }],
      }

      // 根据isGcReport调整requestBody
      if (isGcReport.value) {
        // 如果是工厂报告，添加scmOid，不添加condition
        requestBody.scmOid = scmOid.value || ''
        requestBody.isGcReport = true
      } else {
        requestBody.condition = checkreportoid
      }

      // 5. 发送存档请求
      const res = await saveLicZcReportForEtds(requestBody)
      console.log('requestBody', requestBody)

      if (!res?.data?.result?.msg?.msg || res.data.result.msg.msg === '0') {
        throw new Error(res.data.result.msg.msg === '0' ? '已有相同的查货资料存在,存档失败!' : '存档失败')
      }

      // 6. 获取新的 checkreportoid
      const newCheckreportoid = res.data.result.msg.msg

      // 7. 处理图片上传
      // 7.1 处理普通图片上传
      if (uploadFormData.value.imageList?.length > 0) {
        for (const img of uploadFormData.value.imageList) {
          if (!img) { continue }

          try {
            if (needUpload(img)) {
              const uploadResult = await uploadImage(getUploadFile(img), {
                fk: newCheckreportoid,
                type: '1',
                bp_fileSize: img.bp_fileSize || img.size || 0,
              })

              if (uploadResult) {
                await saveNormalPic({
                  pic_path: uploadResult,
                  bp_fileSize: img.bp_fileSize || img.size || 0,
                  fk: newCheckreportoid,
                })
              }
            } else {
              await saveNormalPic({
                pic_path: getUploadPic(img.preview),
                bp_fileSize: img.bp_fileSize || img.size || 0,
                fk: newCheckreportoid,
              })
            }
          } catch (error) {
            console.error('处理普通图片失败:', error)
          }
        }
      }

      // 7.2 处理疵点图片上传
      if (detailsFormData.value.record?.length > 0) {
        for (const item of detailsFormData.value.record) {
          try {
            // 处理 pic1
            if (item.pic1) {
              if (needUpload(item.pic1)) {
                const uploadResult = await uploadImage(getUploadFile(item.pic1), {
                  fk: newCheckreportoid,
                  type: 'pic1',
                  bp_fileSize: item.BS_SIZE || 0,
                  bs_item: item.item || '',
                })
                if (uploadResult) {
                  await saveDefectPic({
                    bs_pic: uploadResult,
                    BS_SIZE: item.BS_SIZE,
                    fk: newCheckreportoid,
                    bs_item: item.itemOid,
                    pictype: '1',
                  })
                }
              } else {
                await saveDefectPic({
                  bs_pic: getUploadPic(item.pic1),
                  BS_SIZE: item.BS_SIZE,
                  fk: newCheckreportoid,
                  bs_item: item.itemOid,
                  pictype: '1',
                })
              }
            }

            // 处理 pic2
            if (item.pic2) {
              if (needUpload(item.pic2)) {
                const uploadResult = await uploadImage(getUploadFile(item.pic2), {
                  fk: newCheckreportoid,
                  type: 'pic2',
                  bp_fileSize: item.BS_SIZE2 || 0,
                  bs_item: item.item || '',
                })
                if (uploadResult) {
                  await saveDefectPic({
                    bs_pic: uploadResult,
                    BS_SIZE: item.BS_SIZE2,
                    fk: newCheckreportoid,
                    bs_item: item.itemOid,
                    pictype: '2',
                  })
                }
              } else {
                await saveDefectPic({
                  bs_pic: getUploadPic(item.pic2),
                  BS_SIZE: item.BS_SIZE2,
                  fk: newCheckreportoid,
                  bs_item: item.itemOid,
                  pictype: '2',
                })
              }
            }
          } catch (error) {
            console.error('处理疵点图片失败:', error)
          }
        }
      }

      // 8. 保存新的checkreportoid到currentPonoInfo
      if (isNewMode) {
        currentPonoInfo.value = {
          ...currentPonoInfo.value,
          oid: newCheckreportoid
        }
        saveOriginalImageState()
      }

      return true
    } catch (error) {
      console.error('存档到查货失败:', error)
      return false
    }
  }

  return {
    // 状态
    checkFormData,
    detailsFormData,
    problemFormData,
    uploadFormData,
    defectDetailList,
    defectOptions,
    checkItems,
    currentPonoInfo,
    scmOid,
    isGcReport,
    disabledGcReport,
    originalImages,
    // 方法
    initAllData,
    getCheckData,
    getDetailsData,
    getStandardData,
    getInspectionStandardData,
    getDefectListData,
    getDefectDetailsData,
    getDefectiveData,
    getProblemData,
    getUploadData,
    updateCheckForm,
    updateDetailsForm,
    updateProblemForm,
    updateUploadForm,
    resetAllData,
    initEmptyState,
    getAllFormData,
    addDefectRecord,
    updateDefectRecord,
    removeDefectRecord,
    saveAllData,
    getPreviewName,
    getUploadPic,
    handleSendAudit,
    saveToInspection,
    handleRetrieve,
    deleteRemovedImages,
    saveOriginalImageState,
    shopItemCodeList,
    fetchAllShopItems,
    fetchBcNum,
  }
})

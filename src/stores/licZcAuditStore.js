import { defineStore } from 'pinia'
import {
  getLicZcCheckReportFile,
  getOneResult1,
  getLicZcRoidStep,
  getQuestionCheckBox,
  getLicZcCheckReportsDtlB1,
  saveLicZcCheckReportsDtlB1,
  uploadEtdsFile,
  deleteFile,
  saveLicZcCheckReportsDtlA,
  checkDeleteFile1
} from '@/api/etds'
import { ref } from 'vue'
import { etdsImgPrefix, removeImgPrefix } from '@/utils/imgPrefix'
import { ElMessage } from 'element-plus'

export const useLicZcAuditStore = defineStore('licZcAuditStore', () => {
  // 审阅数据
  const auditData = ref(null)

  // 审阅表单数据
  const auditForm = ref({
    bc_pono: '', // 款号
    bc_qs: '', // 中尾期 (值为 1-中期或3-尾期)
    bc_batchNo: '', // 出货批次
    bc_num: '', // 查货次数
    bc_date: '', // 自查日期
    problem: '', // 详细问题
    fresult: '接受', // 一审结果
    lic_type: 1, // 问题类型 (1-联营业务，2-联营款)
    sresult: '', // 二审结果
    oid: '', // 记录ID
    sy_state: '', // 审阅状态
    ch_result: '', // 查货结果
    zc_step: '', // 步骤
    state: '', // 状态
    sy_result: '', // 审阅结果
    bc_result: '', // 查货结果值
  })

  // 一审数据 
  const stepData = ref({
    result: '', // 审阅结果
    remark: '', // 备注
    oid: '', // 审阅记录ID
    state: null, // 状态
    lic_type: 1, // 许可类型
    lic_zcCheckReportsDtlBOid: '', // 报告详情ID
    selectionData: [] // 选择的问题数据
  })
  const problemList = ref([])
  // 附件列表
  const auditFileList = ref([])
  const previewList = ref([])
  // 要删除的文件列表
  const deleteFileList = ref([])
  // 要上传的新文件列表
  const newFileList = ref([])
  // 文件操作加载状态
  const fileLoading = ref(false)

  // 设置审阅数据
  function setAuditData (data) {
    auditData.value = data
  }

  // 获取审阅数据
  function getAuditData () {
    return auditData.value
  }

  // 更新审阅表单
  function updateAuditForm (formData) {
    auditForm.value = {
      ...auditForm.value,
      ...formData
    }
  }

  // 获取审阅表单
  function getAuditForm () {
    return auditForm.value
  }

  // 清空审阅数据
  function clearAuditData () {
    auditData.value = null
    auditForm.value = null
  }

  // 获取附件列表
  async function getAuditFileList () {
    const res = await getLicZcCheckReportFile({
      oid: stepData.value.lic_zcCheckReportsDtlBOid
    })
    if (res.data.result.Examples) {
      auditFileList.value = res.data.result.Examples.map(item => ({
        ...item,
        path: etdsImgPrefix(item.path)
      }))
      previewList.value = auditFileList.value.map(item => item.path)
    }
  }

  // 获取一审问题选项
  async function getQuestionCheckBoxs () {
    const res = await getQuestionCheckBox(
      {
        zcOid: stepData.value.oid,
      }
    )
    if (res.data.result.Examples) {
      console.log('问题选项', res.data.result.Examples)
      problemList.value = res.data.result.Examples
    }
  }

  // 获取一审结果
  async function getLicZcCheckReports (step) {
    try {
      const res = await getLicZcCheckReportsDtlB1({
        zcOid: stepData.value.oid,
        step: step
      })

      if (res.data?.result?.Examples) {
        const data = res.data.result.Examples

        // 处理选中的问题数据，将原始格式转为字符串数组
        let selectedValues = [];
        if (data.selectionData && Array.isArray(data.selectionData)) {
          selectedValues = data.selectionData
            .filter(item => item.state === '1' || item.state === 1)
            .map(item => item.zc_value.toString());
        }
        console.log('selectedValues', selectedValues)
        // 更新 stepData
        stepData.value = {
          oid: stepData.value.oid, // 保留原来的 oid
          lic_zcCheckReportsDtlBOid: data.lic_zcCheckReportsDtlBOid || '',
          remark: data.remark || '',
          result: data.result ? data.result.toString() : '',
          state: data.state !== undefined ? data.state.toString() : null,
          lic_type: data.lic_type || stepData.value.lic_type || 1,
          selectionData: selectedValues // 使用处理后的数据
        }

        // 如果是二审且没有数据，获取一审的问题选择和备注
        if (step === '2' && !data.lic_zcCheckReportsDtlBOid) {
          await getLicZcOneQuestionAndRemark(stepData.value.oid)
        }

        // 获取附件信息
        await getAuditFileList()
      }

      return true
    } catch (error) {
      console.error('获取审阅数据失败:', error)
      return false
    }
  }

  // 获取一审的问题选择和备注
  async function getLicZcOneQuestionAndRemark (zcOid) {
    try {
      const res = await getLicZcCheckReportsDtlB1({
        zcOid: zcOid,
        step: 1
      })

      if (res.data?.result?.Examples) {
        const data = res.data.result.Examples
        stepData.value.remark = data.remark || ''

        // 处理选择数据，与上面保持一致的处理方式
        if (data.selectionData && Array.isArray(data.selectionData)) {
          stepData.value.selectionData = data.selectionData
            .filter(item => item.state === '1' || item.state === 1)
            .map(item => item.zc_value.toString());
        }
      }
    } catch (error) {
      console.error('获取一审数据失败:', error)
    }
  }

  // 保存一审结果
  async function saveLicZcCheckReports (isSubmit = false, step = 1) {
    try {
      // 获取登录用户ID
      const useroid = JSON.parse(sessionStorage.getItem('oid'))

      // 构建请求参数
      const requestData = {
        zcOid: stepData.value.oid, // 自查报告ID
        result: stepData.value.result, // 审阅结果（1接受，2不接受，0不适用，3联营商选择不上架，4不接受并联营商选择不上架）
        remark: stepData.value.remark, // 备注
        oid: stepData.value.lic_zcCheckReportsDtlBOid, // 审阅记录ID
        step: String(step), // 第一步审阅
        useroid: useroid,
        state: isSubmit ? '1' : null, // 送审状态：null-未送审，1-已送审
        selection: stepData.value.selectionData // 问题选择
      }

      // 发送请求
      const res = await saveLicZcCheckReportsDtlB1(requestData)

      if (res.data?.result?.Examples) {
        // 更新审阅记录ID
        stepData.value.lic_zcCheckReportsDtlBOid = res.data.result.Examples

        // 处理附件相关逻辑
        await handleFileUpload()

        // 如果是送审，不显示成功消息，由组件显示
        if (!isSubmit) {
          ElMessage.success('保存成功！')
        }
        return true
      }
      return false
    } catch (error) {
      console.error('保存失败:', error)
      ElMessage.error('保存失败')
      return false
    }
  }

  // 选择图片
  function handleSelectImage () {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.accept = 'image/*'

    input.onchange = async (e) => {
      const files = e.target.files
      if (!files) return

      fileLoading.value = true
      try {
        // 处理每个文件
        Array.from(files).forEach((file) => {
          // 检查文件类型和大小
          if (!file.type.startsWith('image/')) {
            ElMessage.warning(`${file.name} 不是图片文件`)
            return
          }
          // 创建预览URL
          const preview = URL.createObjectURL(file)
          // 图片用时间戳命名
          const now = new Date()
          const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
          const timestamp = now.getTime()
          const filename = `${dateStr}${timestamp}`

          // 添加到新文件列表
          newFileList.value.push({
            preview,
            name: file.name,
            file,
            fileSize: file.size,
            fk: '',
            oid: newFileList.value.length,
            path: filename, // 直接使用带前缀的路径
            base64Url: '' // 可选，如果需要base64
          })
          console.log('newFileList', newFileList.value)
        })
      } finally {
        fileLoading.value = false
      }
    }

    input.click()
  }

  // 添加文件到删除列表
  function addFileToDeleteList (file) {
    if (file.path) {
      // 去掉baseUrl前缀，并确保文件名以etds/开头
      const fileName = removeImgPrefix(file.path)
      const finalFileName = fileName.startsWith('etds/') ? fileName : `etds/${fileName}`
      console.log('fileName', finalFileName)
      deleteFileList.value.push({ fileName: finalFileName })

      // 从显示列表中移除
      const index = auditFileList.value.findIndex(item => item.path === file.path)
      if (index !== -1) {
        auditFileList.value.splice(index, 1)
        previewList.value = auditFileList.value.map(item => item.path)
      }
    }
  }

  // 删除文件
  async function deleteFiles () {
    if (!deleteFileList.value.length) return true;

    try {
      console.log('deleteFileList', deleteFileList.value)

      // 先检查文件是否可以删除（是否被其他报告引用）
      const checkRes = await checkDeleteFile1({
        deleteFile: JSON.stringify(deleteFileList.value.map(item => ({ id: item.fileName })))
      });

      if (checkRes.data?.result?.Examples) {
        // 得到可以删除的附件列表
        const filesToDelete = checkRes.data.result.Examples;

        // 依次删除可以删除的文件
        for (let i = 0; i < filesToDelete.length; i++) {
          const id = filesToDelete[i];
          await deleteFile({
            fileName: id
          });
        }

        // 更新数据库中的文件关联
        if (stepData.value.lic_zcCheckReportsDtlBOid) {
          // 构建更新的文件数据，只保留未删除的文件
          const remainingFiles = auditFileList.value
            .filter(file => !deleteFileList.value.some(deleteFile => deleteFile.fileName === removeImgPrefix(file.path)))
            .map(file => ({
              path: file.path,
              name: file.name,
              fileSize: file.fileSize,
              fk: stepData.value.lic_zcCheckReportsDtlBOid
            }));

          // 调用保存文件关联的API
          await saveLicZcCheckReportsDtlA({
            updateFileData: JSON.stringify(remainingFiles),
            fk: stepData.value.lic_zcCheckReportsDtlBOid
          });
        }

        // 清空删除列表
        deleteFileList.value = [];
        return true;
      }
      return false;
    } catch (error) {
      console.error('删除文件失败:', error);
      ElMessage.error('删除文件失败');
      return false;
    }
  }

  // 上传新文件
  async function uploadNewFiles () {
    if (newFileList.value.length === 0) return

    try {
      for (const item of newFileList.value) {
        // 构建FormData
        const formData = new FormData()

        // 直接使用item.name作为文件名，因为handleSelectImage中已经添加了etds/lic/前缀
        formData.append('file', item.file, item.name)

        // 调用上传接口
        const res = await uploadEtdsFile(formData)

        if (res.message) {
          // 保存上传成功后的路径
          item.path = res.message
          console.log('上传成功后的路径', item.path)
          console.log('上传成功后图片列表', newFileList.value)
        }
      }

      // 更新文件关联
      await updateFileRelations()
      newFileList.value = []
      return true
    } catch (error) {
      console.error('上传文件失败:', error)
      ElMessage.error('上传文件失败')
      return false
    }
  }

  // 更新文件关联
  async function updateFileRelations () {
    // 如果没有审阅记录ID，不能关联
    if (!stepData.value.lic_zcCheckReportsDtlBOid) return

    // 构建更新的文件数据
    const updateFileData = newFileList.value.map(item => ({
      path: item.path,
      name: item.name,
      fileSize: item.fileSize,
      fk: stepData.value.lic_zcCheckReportsDtlBOid
    }))
    console.log('更新文件关联数据', updateFileData)
    try {
      // 调用保存文件关联的API
      await saveLicZcCheckReportsDtlA({
        updateFileData: JSON.stringify(updateFileData),
        fk: stepData.value.lic_zcCheckReportsDtlBOid
      })

      return true
    } catch (error) {
      console.error('更新文件关联失败:', error)
      throw error
    }
  }

  // 处理文件上传
  async function handleFileUpload () {
    try {
      // 如果有需要删除的文件，先删除
      if (deleteFileList.value.length > 0) {
        await deleteFiles()
      }

      // 上传新文件
      if (newFileList.value.length > 0) {
        await uploadNewFiles()
      }

      // 更新文件列表
      await getAuditFileList()

      return true
    } catch (error) {
      console.error('文件处理失败:', error)
      return false
    }
  }

  // 清空文件状态
  function clearFileState () {
    newFileList.value = []
    deleteFileList.value = []
    fileLoading.value = false
  }

  // 重置所有状态
  function reset () {
    auditData.value = null
    auditForm.value = {
      bc_pono: '',
      bc_qs: '',
      bc_batchNo: '',
      bc_num: '',
      bc_date: '',
      problem: '',
      fresult: '接受',
      lic_type: 1,
      sresult: '',
      oid: '',
      sy_state: '',
      ch_result: '',
      zc_step: '',
      state: '',
      sy_result: '',
      bc_result: '',
    }
    stepData.value = {
      result: '',
      remark: '',
      oid: '',
      state: null,
      lic_type: 1,
      lic_zcCheckReportsDtlBOid: '',
      selectionData: []
    }
    problemList.value = []
    auditFileList.value = []
    previewList.value = []
    deleteFileList.value = []
    newFileList.value = []
    fileLoading.value = false
  }

  // 使用pinia自带的 reset方法
  return {
    auditData,
    auditForm,
    setAuditData,
    getAuditData,
    updateAuditForm,
    getAuditForm,
    clearAuditData,
    getAuditFileList,
    auditFileList,
    previewList,
    getQuestionCheckBoxs,
    getLicZcCheckReports,
    stepData,
    problemList,
    getLicZcOneQuestionAndRemark,
    deleteFileList,
    newFileList,
    fileLoading,
    saveLicZcCheckReports,
    handleFileUpload,
    handleSelectImage,
    addFileToDeleteList,
    clearFileState,
    reset
  }
})


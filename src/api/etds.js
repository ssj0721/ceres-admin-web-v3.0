import request from '@/utils/request'
import { downloadRequest } from '@/utils/request'
// export const ETDS_BASE_URL = 'http://localhost:8089/api'

// iretail登录
export function loginIretail (userId) {
  return request({
    url: `/rest/api/smc/login`,
    method: 'post',
    headers: {
      appId: 'testAppId',
      appKey: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJQT1MiLCJleHAiOjE1MzExOTE0MTIsImlhdCI6MTUzMTEwNTAxMn0.EfNGlkeOtWQvV3V7DgenSugfhK9KSmYbuRZBfhKZ4ZA'
    },
    data: {
      params: {
        type: 5,
        userId: userId,

      }
    }
  })
}

// 获取iRetail用户信息
export function getUserInfo_iRetail () {
  return request({
    url: '/rest/api/smc',
    method: 'post',
    timeout: 1800000,
    data: {
      method: 'getuserinfo@retail.sys.user',
      params: {}
    }
  });
}

// 根据环境判断基础URL
const getBaseUrl = () => {
  const hostname = window.location.hostname
  console.log('hostname', hostname)
  if (hostname === '172.20.32.198' || hostname.includes('test')) {
    // 测试环境
    return 'http://test.tradingERP.gsitcloud.com/api2'
  } else if (hostname === 'scm.gsitcloud.com' || hostname.includes('scm.gsitcloud.com')) {
    // 正式环境
    return 'https://TradingERP.gsitcloud.com/api2'
  }
  // 如果都不是，则返回本地
  return 'http://localhost:8089/api'
}

export const ETDS_BASE_URL = getBaseUrl()

// 获取客户列表
export function getlicCustCodeList1 (data) {
  return request({
    url: '/etdsLicZcReport/getlicCustCodeList1',
    method: 'post',
    data
  });
}
// 获取联营商列表
export function getlicCodeList3 (data) {
  return request({
    url: '/etdsLicZcReport/getlicCodeList3',
    method: 'post',
    data
  });
}
// 获取口岸/仓库列表
export function getlicPortIdList1 (data) {
  return request({
    url: '/etdsLicZcReport/getlicPortIdList1',
    method: 'post',
    data
  });
}
// 送审自查报告通过合同、中尾期、批次获取查货次数
export function getLicZcRoidStep (data) {
  return request({
    url: '/etdsLicZcReport/getLicZcRoidStep',
    method: 'post',
    data
  });
}
export function exportZcReport (data) {
  return request({
    url: '/etdsLicZcReport/getReport2',
    method: 'post',
    data
  });
}

export function exportZcReport1 (data) {
  return request({
    url: '/etdsLicZcReport/exportZc1',
    method: 'post',
    data
  });
}
// 用户相关接口
export function login (data) {
  return request({
    url: '/etds/login',
    method: 'post',
    data
  })
}
// 2025.05.27 新增接口，用于无密码登录查货
export function loginWithoutPassword (data) {
  return request({
    url: '/etds/etdsLoginWithoutPassWord',
    method: 'post',
    data
  })
}

// 获取自查报告
export function getReport1 (data) {
  return request({
    url: '/etdsLicZcReport/getReport1',
    method: 'post',
    data
  });
}
export function logout () {
  return request({
    url: '/etds/logout',
    method: 'post'
  })
}

// 自查报告
// 联营商自查相关接口

export function getLicZcCustCode (data) {
  return request({
    url: '/etdsLicZcReport/getlicCustCodeList1',
    method: 'post',
    data
  })
}

export function getLicZcCodeList3 (data) {
  return request({
    url: '/etdsLicZcReport/getlicCodeList3',
    method: 'post',
    data
  })
}

export function getLicZcPortIdList1 (data) {
  return request({
    url: '/etdsLicZcReport/getlicPortIdList1',
    method: 'post',
    data
  })
}

export function getUser (data) {
  return request({
    url: '/etds/user/getUser',
    method: 'post',
    data
  })
}

export function getPassword (data) {
  return request({
    url: '/etds/user/getPassword',
    method: 'post',
    data
  })
}

// 疵点相关接口
export function getDefectList (data) {
  return request({
    url: '/etds/getLicDefectList',
    method: 'post',
    data
  })
}

export function getDefectDetails (data) {
  return request({
    url: '/etds/getLicDefectDetails',
    method: 'post',
    data
  })
}

// 图片相关接口
export function saveNormalPic (data) {
  return request({
    url: '/etds/saveZcPicPath',
    method: 'post',
    data
  })
}

export function saveDefectPic (data) {
  return request({
    url: '/etds/saveLicZcCdpath',
    method: 'post',
    data
  })
}

export function updatePicOnly (data) {
  return request({
    url: '/etds/licZcUpdateByPic',
    method: 'post',
    data
  })
}

export function uploadZcReportPic (data) {
  return request({
    url: '/etdsLicZcReport/zcReportUploadPic',
    method: 'post',
    data
  })
}

// 文件操作接口
export function uploadZcFile (data) {
  return request({
    url: '/etds/uploadZcFile',
    method: 'post',
    data
  })
}
// 特殊处理给查货用的
export function deleteFile (params) {
  return request({
    url: `${ETDS_BASE_URL}/file/delete`,
    method: 'delete',
    params
  })
}

// 自查报告相关接口
export function getLicZcReport (data) {
  return request({
    url: '/etdsLicZcReport/getLicZcCheckReports',
    method: 'post',
    data
  })
}

export function getLicZcContractInfo (data) {
  return request({
    url: '/etdsLicZcReport/getlicContractInfo',
    method: 'post',
    data
  })
}

export function getLicZcStaffContract (data) {
  return request({
    url: '/etdsLicZcReport/getlicZcStaffCon',
    method: 'post',
    data
  })
}

export function getLicZcOrderDefective (data) {
  return request({
    url: '/etdsLicZcReport/getliczcOrderDefective',
    method: 'post',
    data
  })
}

export function getLicZcStandardData (data) {
  return request({
    url: '/etdsLicZcReport/licGetStandardData',
    method: 'post',
    data
  })
}

export function getInspectionStandard (data) {
  return request({
    url: '/etdsLicZcReport/getInspectionStandard',
    method: 'post',
    data
  })
}

export function getLicZcDetails (data) {
  return request({
    url: '/etdsLicZcReport/getliczcDetails',
    method: 'post',
    data
  })
}

export function getLicZcQuestions (data) {
  return request({
    url: '/etdsLicZcReport/getLicZcQuestions',
    method: 'post',
    data
  })
}

export function getLicZcCheckImage (data) {
  return request({
    url: '/etdsLicZcReport/getliczcCheckImage',
    method: 'post',
    data
  })
}

// 自查报告状态操作
export function getLicZcContractStates (data) {
  return request({
    url: '/etdsLicZcReport/getliczcContractStates',
    method: 'post',
    data
  })
}

export function songShenLicZcReport (data) {
  return request({
    url: '/etdsLicZcReport/songshenLicZcCheckReports',
    method: 'post',
    data
  })
}

export function saveLicZcReport (data) {
  return request({
    url: '/etdsLicZcReport/saveLicZcReport',
    method: 'post',
    data
  })
}

export function saveLicZcReportForEtds (data) {
  return request({
    url: '/etdsLicZcReport/saveLicZcReportForEtds',
    method: 'post',
    data
  })
}

// 取回自查报告
export function retrieveLicZcReport (data) {
  return request({
    url: '/etdsLicZcReport/quhuiLicZcCheckReports',
    method: 'post',
    data
  })
}

// 导出相关接口
export function exportLicZcReport (data) {
  return request({
    url: '/etds/exportLicZcReportExcel',
    method: 'post',
    data
  })
}

export function exportZc1 (data) {
  return request({
    url: '/etdsLicZcReport/exportZc1',
    method: 'post',
    data
  })
}

export function exportExcel1 (data) {
  return request({
    url: '/etdsLicZcReport/exportExcel1',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    },
    responseType: 'blob' // 改为 blob 类型来处理二进制响应
  })
}

export function exportPdf1 (data) {
  return request({
    url: '/etdsLicZcReport/exportPDF1',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/pdf'
    },
    responseType: 'blob' // 设置响应类型为 blob
  })
}

export function getLicZcGcReports () {
  return request({
    url: '/etdsLicZcReport/getLicZcGcReports',
    method: 'post',
  })
}

// 工厂自查报告相关接口
export function gcZcCheckReportDeleteToPic (data) {
  return request({
    url: '/etds/gc/gcZcCheckReportDeleteToPic',
    method: 'post',
    data
  })
}

export function gcZcInsertPic (data) {
  return request({
    url: '/etds/gc/gcZcInsertPic',
    method: 'post',
    data
  })
}

export function gcZcCheckReportUpload (data) {
  return request({
    url: '/etds/gc/gcZcCheckReportUpload',
    method: 'post',
    data
  })
}

export function gcZcDeletePic (data) {
  return request({
    url: '/etds/gc/gcZcDeletePic',
    method: 'post',
    data
  })
}

export function gcZcUploadPic (data) {
  return request({
    url: '/etds/gc/gcZcUploadPic',
    method: 'post',
    data
  })
}

export function getGcZcCheckReport (data) {
  return request({
    url: '/etds/gc/getGcZcCheckReport',
    method: 'post',
    data
  })
}
// 导入自查
export function getGcZcCheckReportCanExportLicZc (data) {
  return request({
    url: '/etds/gc/getGcZcCheckReportCanExportLicZc',
    method: 'post',
    data
  })
}
// 联营商同意
export function gcZcCheckReportAccept (data) {
  return request({
    url: '/etds/gc/gcZcCheckReportAccept',
    method: 'post',
    data
  })
}
export function getGcZcCheckReportCanExportLicZc1 (data) {
  return request({
    url: '/etds/gc/getGcZcCheckReportCanExportLicZc1',
    method: 'post',
    data
  })
}

export function gcZcCheckReportToLicZc (data) {
  return request({
    url: '/etds/gc/gcZcCheckReportToLicZc',
    method: 'post',
    data
  })
}

export function gcZcCheckReportToLicZc1 (data) {
  return request({
    url: '/etds/gc/gcZcCheckReportToLicZc1',
    method: 'post',
    data
  })
}

export function getGcZcHomePageData (data) {
  return request({
    url: '/etds/gc/getGcZcHomePageData',
    method: 'post',
    data
  })
}

export function getGcZcCheckReportGcCheckData (data) {
  return request({
    url: '/etds/gc/getGcZcCheckReportGcCheckdata',
    method: 'post',
    data
  })
}

export function getGcDefectList (data) {
  return request({
    url: '/etds/gc/getlicDefectList',
    method: 'post',
    data
  })
}

export function getGcDefectDetailList (data) {
  return request({
    url: '/etds/gc/getDefectDetailList',
    method: 'post',
    data
  })
}

export function getGcInspectionStandard (data) {
  return request({
    url: '/etds/gc/getInspectionStandard',
    method: 'post',
    data
  })
}

export function getGcDetailsData (data) {
  return request({
    url: '/etds/gc/getGcDetailsData',
    method: 'post',
    data
  })
}

export function getGcProblemData (data) {
  return request({
    url: '/etds/gc/getGcProblemData',
    method: 'post',
    data
  })
}

export function getGcUploadData (data) {
  return request({
    url: '/etds/gc/getGcUploadData',
    method: 'post',
    data
  })
}

export function gcZcCheckReportSaveOrUpdate (data) {
  return request({
    url: '/etds/gc/gcZcCheckReportSaveOrUpdate',
    method: 'post',
    data
  })
}

// 联营商自查待确认相关接口
export function getLicZcPsw (data) {
  return request({
    url: '/etdsLicZcReport/getLicZcPsw',
    method: 'post',
    data
  })
}

export function updateLicZcPsw (data) {
  return request({
    url: '/etdsLicZcReport/updateLicZcPsw',
    method: 'post',
    data
  })
}
export function uploadEtdsFile (data) {
  return request({
    url: `${ETDS_BASE_URL}/file/upload`,
    method: 'post',
    data
  })
}
// /uploadZcFileScm
// export function uploadZcFileDirect (data) {
//   return request({
//     url: `${ETDS_BASE_URL}/etds/file/licZcuploadScm`,
//     method: 'post',
//     data
//   })
// }
export function uploadZcFileDirect (data) {
  return request({
    url: `/etds/uploadZcFileScm`,
    method: 'post',
    data
  })
}
// export function downloadLicExcel (data = {}) {
//   return downloadRequest(`${ETDS_BASE_URL}/etds/file/downloadLicExcelScm`, 'post', data)
// }
export function downloadLicExcel (data = {}) {
  return request({
    url: `/etds/downLoadExcelTemplate`,
    method: 'post',
    data
  })
}
// 下载模板
export const DOWNLOAD_TEMPLATE_URL = '/file/downloadLicExcelScm'
export const UPLOAD_ZCUP_FILE_URL = '/file/licZcupload'

// 检查可以拒绝工厂报告
export function gcZcCheckReportCanReject (data) {
  return request({
    url: '/etds/gc/gcZcCheckReportCanReject',
    method: 'post',
    data
  })
}

// 拒绝工厂报告
export function gcZcCheckReportReject (data) {
  return request({
    url: '/etds/gc/gcZcCheckReportReject',
    method: 'post',
    data
  })
}

// 检查可以拒绝工厂报告
export function gcZcCheckReportCanReject1 (data) {
  return request({
    url: '/etds/gc/gcZcCheckReportCanReject1',
    method: 'post',
    data
  })
}

export const pswGcZcCheckReport = (data) => {
  return request({
    url: 'etds/gc/pswGcZcCheckReport',
    method: 'post',
    data,
  });
}

// 审阅相关接口
export function getLicZcCheckReportFile (data) {
  return request({
    url: '/etdsLicZcReport/getLicZcCheckReportFile',
    method: 'post',
    data
  })
}

export function getOneResult1 (data) {
  return request({
    url: '/etdsLicZcReport/getOneResult1',
    method: 'post',
    data
  })
}
// 获取一审问题
export function getQuestionCheckBox (data) {
  return request({
    url: '/etdsLicZcReport/getQuestionCheckBox',
    method: 'post',
    data
  })
}
// 获取一审结果
export function getLicZcCheckReportsDtlB1 (data) {
  return request({
    url: '/etdsLicZcReport/getLicZcCheckReportsDtlB1',
    method: 'post',
    data
  })
}
// 保存一审结果
export function saveLicZcCheckReportsDtlB1 (data) {
  return request({
    url: '/etdsLicZcReport/saveAllLicZcCheckReportsDtlB1',
    method: 'post',
    data
  })
}
// 保存一审结果图片
export function saveLicZcCheckReportsDtlA (data) {
  return request({
    url: '/etdsLicZcReport/saveLicZcCheckReportsDtlA1',
    method: 'post',
    data
  })
}

// 得到可以删除的附件
export function checkDeleteFile1 (data) {
  return request({
    url: '/etdsLicZcReport/checkDeleteFile1',
    method: 'post',
    data
  })
}

// 工厂收办寄办列表
export function getGcAcceptMailModelList (data) {
  return request({
    url: '/etds/MailModel/getGcAcceptMailModelList',
    method: 'post',
    data
  })
}

// 工厂保存收办寄办列表
export function saveGcAcceptMailModelList (data) {
  return request({
    url: '/etds/MailModel/saveGcAcceptMailModelList',
    method: 'post',
    data
  })
}

// 查询联营商能导的款
export function getAllShopItems (data) {
  return request({
    url: '/etdsLicZcReport/getAllShopItems',
    method: 'post',
    data
  })
}

export function checkItemFromLicPo (data) {
  return request({
    url: '/etdsLicZcReport/checkItemFromLicPo',
    method: 'post',
    data
  })
}

// 根据批次号查询自查次数
export function getGcZcCheckReportBcNum (data) {
  return request({
    url: '/etdsLicZcReport/getGcZcCheckReportBcNum',
    method: 'post',
    data
  })
}

// 送审前检查licPo
export function checkLicPoCanAudit (data) {
  return request({
    url: '/etdsLicZcReport/checkLicPoCanAudit',
    method: 'post',
    data
  })
}

// 删除自查报告
export function deleteLicZcReport (data) {
  return request({
    url: '/etdsLicZcReport/deleteLicZcReport',
    method: 'post',
    data
  });
}

// 导出款式资料相关接口
export function getlicCodeList2 (data) {
  return request({
    url: '/etdsLicZcReport/getlicCodeList2',
    method: 'post',
    data
  });
}

export function getlicCodeList (data) {
  return request({
    url: '/etdsLicZcReport/getlicCodeList',
    method: 'post',
    data
  });
}

export function getlicCustCodeList (data) {
  return request({
    url: '/etdsLicZcReport/getlicCustCodeList',
    method: 'post',
    data
  });
}

export function getlicCheckSq_liccodelist (data) {
  return request({
    url: '/etdsLicZcReport/getlicCheckSq_liccodelist',
    method: 'post',
    data
  });
}

export function getStyleListInfo (data) {
  return request({
    url: '/etdsLicZcReport/getStyleListInfo',
    method: 'post',
    data
  });
}
// 检查自查报告是否存在
export function checkZcReportExist (data) {
  return request({
    url: '/etdsLicZcReport/checkZcReportExist',
    method: 'post',
    data
  })
}
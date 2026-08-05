import request from '@/utils/request'
export function getLicDqrList(params) {
  return request({
    url: '/licDqr/getList', // 实际接口路径以你项目为准
    method: 'post',
    data: params
  })
}

export function updateLicDqr(params) {
  return request({
    url: '/licDqr/update', // 实际接口路径以你项目为准
    method: 'post',
    data: params
  })
}

export function UPlicCheckReportsResult(params) {
  return request({
    url: '/licDqr/UPlicCheckReportsResult', // 实际接口路径以你项目为准
    method: 'post',
    data: params
  })
}

// 查看查货资料弹窗相关API
// 获取查货资料详情
export function getlicStaffCon(params) {
  return request({
    url: '/licDqr/getlicStaffCon',
    method: 'post',
    data: params
  })
}

// 获取合同详情
export function getContractDetail(params) {
  return request({
    url: '/licDqr/getContractDetail',
    method: 'post',
    data: params
  })
}

// 获取附件列表
export function getlicFileDown(params) {
  return request({
    url: '/licDqr/getlicFileDown',
    method: 'post',
    data: params
  })
}

//详细报告相关
export function getlicDetails(params) {
  return request({
    url: '/licDqr/getlicDetails',//详细资料详细
    method: 'post',
    data: params
  })
}

export function licGetStandardData(params) {
  return request({
    url: '/licDqr/licGetStandardData',//标准详细
    method: 'post',
    data: params
  })
}

export function getlicOrderDefective(params) {
  return request({
    url: '/licDqr/getlicOrderDefective',//疵点
    method: 'post',
    data: params
  })
}

export function getlicGM_CH_be_questions(params) {
  return request({
    url: '/licDqr/getlicGM_CH_be_questions',//问题获取
    method: 'post',
    data: params
  })
}

export function getlicCheckImage(params) {
  return request({
    url: '/licDqr/getlicCheckImage',//图片获取
    method: 'post',
    data: params
  })
}

export function getlicContractStates(params) {
  return request({
    url: '/licDqr/getlicContractStates',//结果获取
    method: 'post',
    data: params
  })
}

export function getIsEshop(params) {
  return request({
    url: '/licDqr/getIsEshop',//状态获取
    method: 'post',
    data: params
  })
}

export function checkLicZcSh_result(params) {
  return request({
    url: '/licDqr/checkLicZcSh_result', // 
    method: 'post',
    data: params
  })
}

export function getlicCheckSh_save(params) {
  return request({
    url: '/licDqr/getlicCheckSh_save', // 审阅保存
    method: 'post',
    data: params
  })
}

export function updateLicZcResult(params) {
  return request({
    url: '/licDqr/updateLicZcResult', // 更新
    method: 'post',
    data: params
  })
}

export function checkShenKuanPic_un(params) {
  return request({
    url: '/licDqr/checkShenKuanPic_un', // 判断疵点，获取下拉框
    method: 'post',
    data: params
  })
}

export function getlicCheckSh_result(params) {
  return request({
    url: '/licDqr/getlicCheckSh_result', // 获取确认结果
    method: 'post',
    data: params
  })
}

export function getlicPoDecision_result(params) {
  return request({
    url: '/licDqr/getlicPoDecision_result', //获取审阅下拉框
    method: 'post',
    data: params
  })
}


const avatar = localStorage.getItem("avatar");
const userId = localStorage.getItem("platformUserId");
const username = localStorage.getItem("username");
const role = localStorage.getItem("roleName");

console.log(userId); // "1"

export function formatTimeToStr(date, format = "yyyy-MM-dd") {
  if (!date) return "";
  const d = new Date(date);
  const pad = n => (n < 10 ? "0" + n : n);
  return format
    .replace("yyyy", d.getFullYear())
    .replace("MM", pad(d.getMonth() + 1))
    .replace("dd", pad(d.getDate()));
}

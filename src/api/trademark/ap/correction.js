import request from '@/utils/request'

export function correctionAdd(data) { return request({ url: '/correction/add', method: 'post', data }) }
export function correctionUpdate(data) { return request({ url: '/correction/update', method: 'post', data }) }
export function correctionSubmit(id) { return request({ url: `/correction/submit/${id}`, method: 'post' }) }
export function correctionApprove(id) { return request({ url: `/correction/approve/${id}`, method: 'post' }) }
export function correctionUnapprove(id) { return request({ url: `/correction/unapprove/${id}`, method: 'post' }) }
export function correctionGetDetail(id) { return request({ url: `/correction/get/${id}`, method: 'get' }) }
export function correctionGetBrandInfo(brandId) { return request({ url: `/correction/getBrandInfo/${brandId}`, method: 'get' }) }
export function correctionCheckConflict(brandId) { return request({ url: `/correction/checkConflict/${brandId}`, method: 'get' }) }

import request from '@/utils/request'

export function adminLitAdd(data) { return request({ url: '/adminLit/add', method: 'post', data }) }
export function adminLitUpdate(data) { return request({ url: '/adminLit/update', method: 'post', data }) }
export function adminLitSubmit(id) { return request({ url: `/adminLit/submit/${id}`, method: 'post' }) }
export function adminLitApprove(id) { return request({ url: `/adminLit/approve/${id}`, method: 'post' }) }
export function adminLitUnapprove(id) { return request({ url: `/adminLit/unapprove/${id}`, method: 'post' }) }
export function adminLitGetDetail(id) { return request({ url: `/adminLit/get/${id}`, method: 'get' }) }
export function adminLitGetBrandInfo(brandId) { return request({ url: `/adminLit/getBrandInfo/${brandId}`, method: 'get' }) }
export function adminLitCheckConflict(brandId) { return request({ url: `/adminLit/checkConflict/${brandId}`, method: 'get' }) }

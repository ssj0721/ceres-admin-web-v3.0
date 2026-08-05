import request from '@/utils/request'

export function exporBuyExcel(data) {
    return request({
        url: '/po1mnt009/exporBuyExcel',
        method: 'post',
        data,
        timeout: 1800000
    })
}

export function exportRepairExcel(data) {
    return request({
        url: '/po1mnt009/exportRepairExcel',
        method: 'post',
        data,
        timeout: 1800000
    })
}
import request from '@/utils/request'
//初始化

export function querylist(data) {
    return request({
        url: '/po1mnt007/querylist',
        method: 'post',
        data,
    })
}

export function exportExcel(data) {
    return request({
        url: '/po1mnt007/exportExcel',
        method: 'post',
        data,
    })
}

export function querySuppliername(data) {
    return request({
        url: '/po1mnt007/querySuppliername',
        method: 'post',
        data,
    })
}

export function getbuhuojianyi(data) {
    return request({
        url: '/po1mnt007/getbuhuojianyi',
        method: 'post',
        data,
    })
}

export function queryVendorList(data) {
    return request({
        url: '/po1mnt007/queryVendorList',
        method: 'post',
        data,
    })
}

export function queryCmpKey(data) {
    return request({
        url: '/po1mnt007/queryCmpKey',
        method: 'post',
        data,
    })
}


export function queryShopList(data) {
    return request({
        url: '/po1mnt007/queryShopList',
        method: 'post',
        data,
    })
}










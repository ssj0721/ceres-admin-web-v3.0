import request from '@/utils/request'

export function queryData(data) {
    return request({
        url: '/po1mnt002/query',
        method: 'post',
        data,
    })
}

export function queryRole(data) {
    return request({
        url: '/po1mnt002/queryRole',
        method: 'post',
        data,
    })
}

export function querySupplierList(data) {
    return request({
        url: '/po1mnt002/querySupplierList',
        method: 'post',
        data,
    })
}

export function queryVendorList(data) {
    return request({
        url: '/po1mnt002/queryVendorList',
        method: 'post',
        data,
    })
}

export function getVendor(data) {
    return request({
        url: '/po1mnt002/getVendor',
        method: 'post',
        data,
    })
}

export function add(data) {
    return request({
        url: '/po1mnt002/add',
        method: 'post',
        data,
    })
}

export function downShopGoods(data) {
    return request({
        url: '/po1mnt002/downShopGoods',
        method: 'post',
        data,
    })
}

export function importData(data) {
    return request({
        url: '/po1mnt002/dataImport',
        method: 'post',
        data,
    })
}

export function exportData(data) {
    return request({
        url: '/po1mnt002/dataExport',
        method: 'post',
        data,
    })
}

export function RowUpdate(data) {
    return request({
        url: '/po1mnt002/handRowUpdate',
        method: 'post',
        data,
    })
}

export function handConfirm(data) {
    return request({
        url: '/po1mnt002/handConfirm',
        method: 'post',
        data,
    })
}

export function retrieval(data) {
    return request({
        url: '/po1mnt002/retrieval',
        method: 'post',
        data,
    })
}

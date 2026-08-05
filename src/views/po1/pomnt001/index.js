import request from '@/utils/request'

export function querySupplierList(data) {
    return request({
        url: '/po1mnt001/querySupplierList',
        method: 'post',
        data,
    })
}

export function queryVendorList(data) {
    return request({
        url: '/po1mnt001/queryVendorList',
        method: 'post',
        data,
    })
}

export function handConfirm(data) {
    return request({
        url: '/po1mnt001/handConfirm',
        method: 'post',
        data,
    })
}

export function retrieval(data) {
    return request({
        url: '/po1mnt001/retrieval',
        method: 'post',
        data,
    })
}

export function queryData(data) {
    return request({
        url: '/po1mnt001/query',
        method: 'post',
        data,
    })
}

export function importData(data) {
    return request({
        url: '/po1mnt001/dataImport',
        method: 'post',
        data,
    })
}

export function dataImportPo02_1(data) {
    return request({
        url: '/po1mnt002/dataImport',
        method: 'post',
        data,
    })
}

export function RowUpdate(data) {
    return request({
        url: '/po1mnt001/handRowUpdate',
        method: 'post',
        data,
    })
}

export function editRow(data) {
    return request({
        url: '/po1mnt001/editRow',
        method: 'post',
        data,
    })
}

export function addRow(data) {
    return request({
        url: '/po1mnt001/addRow',
        method: 'post',
        data,
    })
}

export function exportData(data) {
    return request({
        url: '/po1mnt001/dataExport',
        method: 'post',
        data,
    })
}

export function exportData2(data) {
    return request({
        url: '/po1mnt001/dataExport2',
        method: 'post',
        data,
    })
}

export function queryRole(data) {
    return request({
        url: '/po1mnt001/queryRole',
        method: 'post',
        data,
    })
}

export function syndata(data) {
    return request({
        url: '/po1mnt002/syndata',
        method: 'post',
        data,
    })
}

export function testtemp(data) {
    return request({
        url: '/po1mnt002/testtemp',
        method: 'post',
        data,
    })
}

// export const pomnt001Api = {
//     // query: (obj) => {
//     //     return api.fetch({
//     //         method: "query@retail.po1.po1mnt001",
//     //         params: obj
//     //     })
//     // },

//     // queryRole: (obj) => {
//     //     return api.fetch({
//     //         method: "queryRole@retail.po1.po1mnt001",
//     //         params: obj
//     //     })
//     // },

//     // querySupplierList: (obj) => {
//     //     return api.fetch({
//     //         method: "querySupplierList@retail.po1.po1mnt001",
//     //         params: obj
//     //     })
//     // },

//     // queryVendorList: (obj) => {
//     //     return api.fetch({
//     //         method: "queryVendorList@retail.po1.po1mnt001",
//     //         params: obj
//     //     })
//     // },



//     // downShopGoods: (obj) => {
//     //     return api.fetch({
//     //         method: "downShopGoods@retail.po1.po1mnt001",
//     //         params: obj
//     //     })
//     // },

//     // dataImport: (obj) => {
//     //     return api.fetch({
//     //         method: "dataImport@retail.po1.po1mnt001",
//     //         params: obj
//     //     })
//     // },

//     // dataImport2: (obj) => {
//     //     return api.fetch({
//     //         method: "dataImport2@retail.po1.po1mnt001",
//     //         params: obj
//     //     })
//     // },

//     // dataImportPo02_1: (obj) => {
//     //     return api.fetch({
//     //         method: "dataImport@retail.po1.po1mnt002",
//     //         params: obj
//     //     })
//     // },

//     // dataExport: (obj) => {
//     //     return api.fetch({
//     //         method: "dataExport@retail.po1.po1mnt001",
//     //         params: obj
//     //     })
//     // },

//     // dataExport2: (obj) => {
//     //     return api.fetch({
//     //         method: "dataExport2@retail.po1.po1mnt001",
//     //         params: obj
//     //     })
//     // },

//     // handRowUpdate: (obj) => {
//     //     return api.fetch({
//     //         method: "update@retail.po1.po1mnt001",
//     //         params: obj
//     //     })
//     // },

//     // handConfirm: (obj) => {
//     //     return api.fetch({
//     //         method: "confirm@retail.po1.po1mnt001",
//     //         params: obj
//     //     })
//     // },

// }
import request from '@/utils/request'

export async function queryStyleStatusTabs() {
    return request({
        url: '/itemState/stateList',
        method: 'get'
    }).then((resp) => {
        const data = resp && resp.data ? resp.data : resp;
        if (data && typeof data.code !== 'undefined' && data.code !== 0) return data;

        const rawList =
            (data && Array.isArray(data.result) ? data.result : null) ||
            (data && Array.isArray(data.data) ? data.data : null) ||
            (Array.isArray(data) ? data : []);

        const list = rawList
            .map((it) => {
                if (!it) return null;
                const label = it.label;
                const value = it.value;
                if (!label || !value) return null;
                return { label, value };
            })
            .filter(Boolean);

        return {
            code: 0,
            result: list
        };
    });
}

export async function queryStyleStatusDashboard(params) {
    const safeParams = params || {};
    const dimensions = Array.isArray(safeParams.dimensions) ? safeParams.dimensions : [];
    const dateRange = Array.isArray(safeParams.dateRange) ? safeParams.dateRange : [];
    const from = dateRange.length === 2 ? dateRange[0] : undefined;
    const to = dateRange.length === 2 ? dateRange[1] : undefined;

    const normalizeList = (list) => {
        if (!Array.isArray(list)) return [];
        return list
            .map((it) => {
                if (!it) return null;
                const id = it.id;
                const name = it.name;
                const value = Number(it.value ?? 0);
                if (id === null || id === undefined || name === '') return null;
                return { id, name, value };
            })
            .filter(Boolean);
    };

    const resp = await request({
        url: '/itemState/pieData',
        method: 'post',
        data: {
            ...safeParams,
            from,
            to
        }
    });

    const data = resp && resp.data ? resp.data : resp;
    const payload = data && data.data ? data.data : data;

    const dimToKey = {
        '联营商': 'franchiseePieData',
        '平台': 'platformPieData',
        '大类': 'categoryPieData',
        '否决原因': 'rejectReasonPieData'
    };

    const pieDataMap = {};
    dimensions.forEach((d) => {
        const key = dimToKey[d];
        if (!key) return;
        pieDataMap[d] = normalizeList(payload ? payload[key] : []);
    });

    return {
        code: 0,
        result: {
            pieDataMap
        }
    };
}

export async function queryStyleStatusSummaryPie(params) {
    const safeParams = params || {};
    const dateRange = Array.isArray(safeParams.dateRange) ? safeParams.dateRange : [];
    const from = dateRange.length === 2 ? dateRange[0] : undefined;
    const to = dateRange.length === 2 ? dateRange[1] : undefined;
    const orgid = Array.isArray(safeParams.orgid) ? safeParams.orgid : undefined;

    return request({
        url: '/itemState/itemState',
        method: 'post',
        data: {
            from,
            to,
            orgid
        }
    }).then((resp) => {
        const data = resp && resp.data ? resp.data : resp;
        if (data && typeof data.code !== 'undefined' && data.code !== 0) return data;

        const rawList =
            (data && Array.isArray(data.result) ? data.result : null) ||
            (data && Array.isArray(data.data) ? data.data : null) ||
            (Array.isArray(data) ? data : []);

        const pieData = rawList
            .map((it) => {
                if (!it) return null;
                const id = it.id;
                const name = it.name;
                const value = Number(it.value ?? 0);
                if (id === null || id === undefined || name === '') return null;
                return { id, name, value };
            })
            .filter(Boolean);

        return {
            code: 0,
            result: {
                pieData
            }
        };
    });
}

export async function queryFranchiseeState(params) {
    const safeParams = params || {};
    const dateRange = Array.isArray(safeParams.dateRange) ? safeParams.dateRange : [];
    const from = dateRange.length === 2 ? dateRange[0] : undefined;
    const to = dateRange.length === 2 ? dateRange[1] : undefined;
    const orgid = Array.isArray(safeParams.orgid) ? safeParams.orgid : undefined;

    return request({
        url: '/itemState/franchiseeState',
        method: 'post',
        data: {
            from,
            to,
            orgid
        }
    }).then((resp) => {
        const data = resp && resp.data ? resp.data : resp;
        if (data && typeof data.code !== 'undefined' && data.code !== 0) return data;

        const rawList =
            (data && Array.isArray(data.result) ? data.result : null) ||
            (data && Array.isArray(data.data) ? data.data : null) ||
            (Array.isArray(data) ? data : []);

        const barData = rawList
            .map((it) => {
                if (!it) return null;
                const axis = it.axis;
                const series = it.series;
                const value = Number(it.value ?? 0);
                if (!axis || !series) return null;
                return { axis, series, value };
            })
            .filter(Boolean);

        return {
            code: 0,
            result: {
                barData
            }
        };
    });
}

export async function queryFranchiseeRejectRate(params) {
    const safeParams = params || {};
    const dateRange = Array.isArray(safeParams.dateRange) ? safeParams.dateRange : [];
    const from = dateRange.length === 2 ? dateRange[0] : undefined;
    const to = dateRange.length === 2 ? dateRange[1] : undefined;
    const orgid = Array.isArray(safeParams.orgid) ? safeParams.orgid : undefined;

    return request({
        url: '/itemState/rejectItem',
        method: 'post',
        data: {
            from,
            to,
            orgid
        }
    }).then((resp) => {
        const data = resp && resp.data ? resp.data : resp;
        if (data && typeof data.code !== 'undefined' && data.code !== 0) return data;

        const rawList =
            (data && Array.isArray(data.result) ? data.result : null) ||
            (data && Array.isArray(data.data) ? data.data : null) ||
            (Array.isArray(data) ? data : []);

        const rejectRateData = rawList
            .map((it) => {
                if (!it) return null;
                const name = it.name || '';
                const value = Number(it.value ?? 0);
                const count = Number(it.count ?? 0);
                if (!name) return null;
                return { name, value, count };
            })
            .filter(Boolean);

        return {
            code: 0,
            result: {
                rejectRateData
            }
        };
    });
}

export async function queryStyleStatusItemList(params) {
    const safeParams = params || {};
    const pageSize = Number(safeParams.pageSize || 10);
    const page = Number(safeParams.page || 1);

    const resp = await request({
        url: '/itemState/detail',
        method: 'post',
        data: {
            ...safeParams,
            page,
            pageSize
        }
    });

    console.log("查询结果", resp)

    const data = resp.data;
    if (data && typeof data.code !== 'undefined' && data.code !== 0) return data;

    const payload = data && data.data ? data.data : data;
    const tableData = payload && Array.isArray(payload.tableData) ? payload.tableData : [];
    const total = payload && typeof payload.total !== 'undefined' ? Number(payload.total || 0) : 0;

    return {
        code: 0,
        result: {
            tableData,
            total
        }
    };
}

export async function exportStyleStatusItemList(params) {
    const safeParams = params || {};

    const resp = await request({
        url: '/itemState/export',
        method: 'post',
        data: safeParams
    });

    const data = resp && resp.data ? resp.data : resp;
    if (data && typeof data.code !== 'undefined' && data.code !== 0) return data;

    const payload = data && data.data ? data.data : data;
    const base64 = payload ? payload.base64 : undefined;
    const fileName = payload ? payload.fileName : undefined;

    return {
        code: 0,
        result: {
            base64,
            fileName
        }
    };
}

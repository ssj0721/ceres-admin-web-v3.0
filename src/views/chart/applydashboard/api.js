import request from '@/utils/request';

export async function queryPlanSaleList() {
  const resp = await request({
    url: '/apply/plansale',
    method: 'get'
  });

  const data = resp.data;

  const list = data && Array.isArray(data.tableData) ? data.tableData : [];

  const normalized = list
    .map((it) => {
      if (it === null || it === undefined) return null;
      if (typeof it === 'object') {
        const id = it.id;
        const name = it.name;
        if (id === null || id === undefined) return null;
        return { id, name };
      }
      return null;
    })
    .filter(Boolean);

  return normalized;
}

const normalizePieList = (list) => {
  if (!Array.isArray(list)) return [];
  return list
    .map((it) => {
      if (!it) return null;
      const id = it.id;
      const name = it.name;
      const value = Number(it.value ?? 0);
      if (id === null || id === undefined || name === '') return null;
      const item = { id, name, value };
      if (Array.isArray(it.children) && it.children.length > 0) {
        item.children = normalizePieList(it.children);
      }
      return item;
    })
    .filter(Boolean);
};

const normalizeSunburstList = (list) => {
  if (!Array.isArray(list)) return [];
  const map = new Map();
  
  list.forEach((it) => {
    if (!it) return;
    const id = it.id;
    const name = it.name;
    const childId = it.childid;
    const childName = it.childname;
    const value = Number(it.value ?? 0);

    if (id === null || id === undefined || name === '') return;

    if (!map.has(id)) {
      map.set(id, { id, name, value: 0, children: [] });
    }

    const parent = map.get(id);
    parent.value += value;

    if (childId !== null && childId !== undefined && childName !== '') {
      parent.children.push({
        id: childId,
        parentid: id,
        name: childName,
        value
      });
    }
  });

  return Array.from(map.values());
};

const PIE_DIM_TO_KEY = {
  '试销款/正常款/试销转正常款': 'testSaleTypePie',
  '试销款-联营商': 'franchiseePieData',
  '试销款-平台': 'platformPieData',
  '真实上架与销售状态': 'queryUpshelfPieData',
  '销售状态': 'querySalePieData'
};

const buildDashboardRequestData = (params) => {
  const safeParams = params || {};
  const dateRange = Array.isArray(safeParams.dateRange) ? safeParams.dateRange : [];

  return {
    ...safeParams,
    from: dateRange.length === 2 ? dateRange[0] : undefined,
    to: dateRange.length === 2 ? dateRange[1] : undefined
  };
};

const fetchDashboardPayload = async (url, reqData, errorLabel) => {
  return request({ url, method: 'post', data: reqData })
    .then((resp) => {
      return resp.data;
    })
    .catch((err) => {
      console.error(errorLabel, err);
      return {};
    });
};

const buildPieDataMap = (dimensions, payload) => {
  const pieDataMap = {};
  dimensions.forEach((d) => {
    const key = PIE_DIM_TO_KEY[d];
    if (!key) return;
    const payloadData = payload ? payload[key] : [];
    pieDataMap[d] = d === '真实上架与销售状态' ? normalizeSunburstList(payloadData) : normalizePieList(payloadData);
  });
  return pieDataMap;
};

export async function queryStyleStatusDashboard(params, onData) {
  const safeParams = params || {};
  const { dimensions: rawDims } = safeParams;
  const dimensions = Array.isArray(rawDims) ? rawDims : [];
  const reqData = buildDashboardRequestData(safeParams);
  const payload = await fetchDashboardPayload('/apply/pieData', reqData, 'queryStyleStatusDashboard request failed:');
  console.log('payload:', payload);

  const pieDataMap = buildPieDataMap(dimensions, payload);

  if (onData) onData(pieDataMap);

  return {
    code: 0,
    result: {
      pieDataMap: pieDataMap
    }
  };
}

export async function queryStyleStatusDashboardUpshelf(params, onData) {
  const safeParams = params || {};
  const { dimensions: rawDims } = safeParams;
  const dimensions = Array.isArray(rawDims) ? rawDims : [];
  const reqData = buildDashboardRequestData(safeParams);
  const payload = await fetchDashboardPayload('/apply/pieDataUpshelf', reqData, 'queryStyleStatusDashboardUpshelf request failed:');
  console.log('payloadUpshelf:', payload);

  const pieDataMap = buildPieDataMap(dimensions, payload);

  if (onData) onData(pieDataMap);

  return {
    code: 0,
    result: {
      pieDataMap: pieDataMap
    }
  };
}

export async function queryStyleStatusDashboardOut(params, onData) {
  console.log('queryStyleStatusDashboardOut', params)
  const safeParams = params || {};
  const { dimensions: rawDims } = safeParams;
  const dimensions = Array.isArray(rawDims) ? rawDims : [];
  const reqData = buildDashboardRequestData(safeParams);
  const payload = await fetchDashboardPayload('/apply/pieDataOut', reqData, 'queryStyleStatusDashboardOut request failed:');
  console.log('payloadOut:', payload);

  const pieDataMap = buildPieDataMap(dimensions, payload);

  if (onData) onData(pieDataMap);

  return {
    code: 0,
    result: {
      pieDataMap: pieDataMap
    }
  };
}

export async function queryStyleStatusSummaryPie(params) {
  const safeParams = params || {};
  const dateRange = Array.isArray(safeParams.dateRange) ? safeParams.dateRange : [];
  const from = dateRange.length === 2 ? dateRange[0] : undefined;
  const to = dateRange.length === 2 ? dateRange[1] : undefined;
  const planSaleDate = Array.isArray(safeParams.planSaleDate) ? safeParams.planSaleDate : undefined;
  const orgid = Array.isArray(safeParams.orgid) ? safeParams.orgid : undefined;

  return request({
    url: '/apply/itemState',
    method: 'post',
    data: {
      from,
      to,
      planSaleDate,
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
  const planSaleDate = Array.isArray(safeParams.planSaleDate) ? safeParams.planSaleDate : undefined;
  const orgid = Array.isArray(safeParams.orgid) ? safeParams.orgid : undefined;

  return request({
    url: '/apply/franchiseeUpshelf',
    method: 'post',
    data: {
      from,
      to,
      planSaleDate,
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

export async function queryStyleStatusItemList(params) {
  const safeParams = params || {};
  const pageSize = Number(safeParams.pageSize || 10);
  const page = Number(safeParams.page || 1);

  const resp = await request({
    url: '/apply/detail',
    method: 'post',
    data: {
      ...safeParams,
      page,
      pageSize
    }
  });

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
    url: '/apply/export',
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

export async function exportStyleStatusUpshelf(params) {
  const safeParams = params || {};

  const resp = await request({
    url: '/apply/exportUpshelf',
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

export async function getMaxkeyToken() {
  const resp = await request({
    url: '/admin/getSKtoken',
    method: 'get'
  });
  return resp.data;
}

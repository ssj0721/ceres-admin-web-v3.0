import request from '@/utils/request'

export function query (goodsData) {
  return request({
    url: '/ows/owsrp002/querySalPoData',
    method: 'post',
    data: goodsData,
  });
}

export function submitToExcel (goodsData) {
  return request({
    url: '/ows/owsrp002/generateReport',
    method: 'post',
    data: goodsData,
  });
}
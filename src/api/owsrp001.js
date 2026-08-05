// import { api } from '@/plugins/axios';

/**
 * @param {*} goodsData 货物信息
 */

import request from '@/utils/request'

export function goodsQuery (goodsData) {
  return request({
    url: '/ows/owsrp001/querySalPoData',
    method: 'post',
    data: goodsData,
  });
}

export function queryPogoods () {
  return request({
    url: '/ows/owsrp001/querySalPoList',
    method: 'post',
  });
}

export function submitToExcel (goodsData) {
  return request({
    url: '/ows/owsrp001/generateReport',
    method: 'post',
    data: goodsData,
  });
}

export function queryTempTest (goodsData) {
  return request({
    url: '/ows/owsrp001/queryTest',
    method: 'post',
    data: goodsData,
  });
}
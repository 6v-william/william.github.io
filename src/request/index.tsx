import _ from 'lodash';
import { RequestOptionsInit, extend } from 'umi-request';
import { getRequestExtend } from './extend';

const requestExtend = getRequestExtend()

/**
 * 发送一个远程请求
 * @param url 请求地址
 * @param options 请求配置项，同 umi 提供的 request 函数
 * @returns Promise
 */
export async function request(url: string, options?: RequestOptionsInit) {

  return requestExtend(url, {
    method: 'get',
  })
}

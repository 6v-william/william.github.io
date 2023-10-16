import { request } from '@flc/workbench-tools';
import {
  getAlbumQueryParams,
} from './interface';

export const getAlbumQuery = (params: getAlbumQueryParams) => {
  return request('/fitting/albumQuery', {
    method: 'post',
    params,
  });
};

import { useEffect } from 'react';
import Style from './index.less';
import { request } from '@flc/workbench-tools';

export default function home() {

  useEffect(() => {
    request('/user/logout', {
      method: 'get',
    }).then(res => {
      console.log(res);
    });
  }, []);

  return (
    <main className={Style['home']}>home</main>
  );
}

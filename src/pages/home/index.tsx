import { useEffect } from 'react';
import Style from './index.less';
import { request } from '@/request';

export default function home() {

  useEffect(() => {
    request('/proxy/user/logout', {
      method: 'get',
    }).then(res => {
      console.log(res)
    })
  }, [])

  return (
    <main className={Style['home']}>home</main>
  );
}

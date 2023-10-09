import { useEffect } from 'react';
import { Outlet } from 'umi';

export default () => {

  useEffect(() => {
    console.log('存在layout');
  }, []);

  return <Outlet />;
};

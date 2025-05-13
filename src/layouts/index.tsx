import { Outlet } from 'umi';
import Style from './index.less';

export default () => {

  // useEffect(() => {
  //   console.log('存在layout');
  // }, []);

  return <div className={Style.root_wrap}>
    <Outlet />
  </div>;
};

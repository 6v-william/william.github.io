import { ConfigProvider } from 'antd';

import zhCN from 'antd/lib/locale/zh_CN';
import 'moment/locale/zh-cn';

// import 'antd/dist/antd.css';
import '@/public/styles/reset.less';
import '@/public/styles/editor.less';

export function rootContainer(container: any) {
  return (
    <ConfigProvider locale={zhCN}>{container}</ConfigProvider>
  );
}

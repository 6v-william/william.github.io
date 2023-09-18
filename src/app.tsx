import { ConfigProvider } from 'antd';

import zhCN from 'antd/lib/locale/zh_CN';
import 'moment/locale/zh-cn';

// import 'antd/dist/antd.css';
import '@/public/styles/reset.less';
import '@/public/styles/editor.less';
import { Root } from '@rp/iwlc-renderer';

export function rootContainer(container: any) {
  return (
    <Root>
      <ConfigProvider locale={zhCN}>{container}</ConfigProvider>
    </Root>
  );
}

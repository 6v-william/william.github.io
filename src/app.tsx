
import 'moment/locale/zh-cn';

import '@/public/styles/reset.less';
import '@/public/styles/common.less';

import { WithTranslation, initExtend } from '@flc/workbench-tools';
import { RecoilRoot } from 'recoil';

// 处理request请求baseurl
if (process.env.DEBUG_ENV) {
  initExtend(
    process.env.DEBUG_ENV === "prod"
      ? "https://flytool.cn"
      : process.env.DEBUG_ENV === "test"
        ? "https://test.flytool.cn"
        : undefined
  );
} else {
  initExtend();
}

export function rootContainer(container: any) {
  return (
    <RecoilRoot>
      <WithTranslation>{container}</WithTranslation>
    </RecoilRoot>
  );
}

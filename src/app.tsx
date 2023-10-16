
import { SafeArea } from 'antd-mobile';
import 'moment/locale/zh-cn';

import '@/public/styles/reset.less';
import '@/public/styles/common.less';
import '@/public/styles/flex.less';

import { WithTranslation, initTranslation } from '@flc/workbench-tools';

initTranslation({ defaultLanguage: 'en-US' });

export function rootContainer(container: any) {
  return <WithTranslation>
    <SafeArea position="top" />
    { container }
    <SafeArea position="bottom" />
  </WithTranslation>;
}

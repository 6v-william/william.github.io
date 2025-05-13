
import { WagmiProvider } from 'wagmi';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrum, base, mainnet, optimism, polygon } from 'wagmi/chains';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import 'moment/locale/zh-cn';

import '@/public/styles/reset.less';
import '@/public/styles/common.less';
import '@rainbow-me/rainbowkit/styles.css';

// import { WithTranslation, initExtend } from '@flc/workbench-tools';
// import { RecoilRoot } from 'recoil';

// 处理request请求baseurl
// if (process.env.DEBUG_ENV) {
//   initExtend(
//     process.env.DEBUG_ENV === "prod"
//       ? "https://flytool.cn"
//       : process.env.DEBUG_ENV === "test"
//         ? "https://test.flytool.cn"
//         : undefined
//   );
// } else {
//   initExtend();
// }

const config = getDefaultConfig({
  appName: 'RainbowKit demo',
  projectId: 'YOUR_PROJECT_ID',
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true,
});

const queryClient = new QueryClient();

export function rootContainer(container: any) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {container}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

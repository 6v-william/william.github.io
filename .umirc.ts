import { defineConfig } from 'umi';
import { name, version } from './package.json';

const isDebugProd = process.env.DEBUG_ENV === 'prod';
const proxyTarget = isDebugProd ? 'https://www.xx.com' : 'http://www.xx.net';

export default defineConfig({
  title: 'pc-template',
  outputPath: 'dist',
  history: {
    type: 'hash',
  },
  metas: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, maximum-scale=1',
    },
  ],
  fastRefresh: true,
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  ignoreMomentLocale: true,
  routes: [
    {
      path: '/',
      component: '@/layouts/index',
      layout: false
    },
    {
      path: '/editor',
      component: '@/layouts/skeleton',
    }
  ],
  proxy: {
    '/proxy': {
      target: proxyTarget,
      changeOrigin: true,
      pathRewrite: { '^/proxy': '' },
    },
    '/#/**': {
      pathRewrite: { '^/#': '' },
    },
  },
  define: {
    PACKAGE_NAME: name,
    VERSION: `${version}`,
    TIMESTAMP: '(localhost)',
  }
});

import { defineConfig } from 'umi';
import { name, version } from './package.json';

// const proxyTarget = process.env.DEBUG_ENV === 'prod' ? 'https://ai-api.feilianyun.cn' : 'https://ai-api-test.feilianyun.cn';

export default defineConfig({
  title: 'pc-template',
  outputPath: 'dist',
  history: {
    type: 'hash',
  },
  esbuildMinifyIIFE: true,
  jsMinifierOptions: {
    target: ['chrome80', 'es2020']
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
      // component: '@/layouts/index', // 不用挂载这个组件，UMI4会默认将layout挂载上去，如果再注册一会会导致layout渲染两次
      routes: [
        { path: '/', component: '@/pages/home' }, // 首页
      ]
    },
    {
      path: '/withoutLayout',
      component: '@/pages/withoutLayout',
      layout: false
    }
  ],
  proxy: {
    // '/proxy': {
    //   target: proxyTarget,
    //   changeOrigin: true,
    //   pathRewrite: { '^/proxy': '' },
    // },
    '/#/**': {
      pathRewrite: { '^/#': '' },
    },
  },
  define: {
    PACKAGE_NAME: name,
    VERSION: `${version}`,
    TIMESTAMP: '(localhost)',
    'process.env.DEBUG_ENV': process.env.DEBUG_ENV
  },
  scripts: []
});

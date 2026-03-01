import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
  {
    name: 'vite-pdf-system',
    entry: '//localhost:7101', // 对应子应用的 server.port
    container: '#pdfSystemApp', // 主应用中挂载的 DOM 节点
    activeRule: '/pdf', // 激活路径
  },
]);

start();
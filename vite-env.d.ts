declare module 'unocss/vite' {
  const UnoCSS: any;
  export default UnoCSS;
}

// 添加 CSS 模块类型声明
declare module '*.css' {
  const content: string;
  export default content;
}

// 添加 UnoCSS 虚拟模块声明
declare module 'virtual:uno.css' {
  const content: string;
  export default content;
}


interface Window {
  $progress: {
    show: () => void;
    update: (value: number) => void;
    hide: () => void;
  };
}
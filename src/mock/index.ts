// mock/user.ts

const createUserList = () => {
  return [
    {
      type: "page",
      path: "/home",
      level: 1,
      title: "首页",
      meta: {
        icon: "House",
        title: "首页",
        requiresAuth: false
      }
    },
    {
      type: "layout",
      path: "/Example",
      level: 1,
      title: "示例集合",
      meta: {
        icon: "Setting",
        title: "示例集合",
        requiresAuth: false
      },
      children: [
        {
          type: "page",
          path: "/Example/example01",
          level: 2,
          title: "案例1",
          meta: {
            icon: "Tickets",
            title: "案例1",
            requiresAuth: true
          }
        },
        
      ]
    },
    {
      type: "layout",
      path: "/docs",
      level: 1,
      title: "文档链接",
      meta: {
        icon: "Document",
        title: "文档链接",
        requiresAuth: false
      },
      children:[
        {
          type: "page",
          path: "/docs/chinese",
          level: 2,
          title: "中文文档",
          meta: {
            icon: "Tickets",
            title: "中文文档",
            requiresAuth: true
          }
        },
        {
          type: "page",
          path: "/docs/help",
          level: 2,
          title: "新手教程",
          meta: {
            icon: "Tickets",
            title: "新手教程",
            requiresAuth: true
          }
        }
      ]
    },

  ]
}
export default [
  // 用户登录接口
  {
    url: '/api/user/list',
    method: 'get',
    response: (request: any) => {
      // 获取请求头携带的 token
      return {
        code: 200,
        data: {
          message: 'SUCCESS',
          data: createUserList(),
        }
      }

    }
  }
]

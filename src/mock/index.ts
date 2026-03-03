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
      path: "/system",
      level: 1,
      title: "系统设置",
      meta: {
        icon: "Setting",
        title: "系统设置",
        requiresAuth: false
      },
      children: [
        {
          type: "page",
          path: "/system/settings",
          level: 2,
          title: "用户管理",
          meta: {
            icon: "Tickets",
            title: "用户管理",
            requiresAuth: true
          }
        },
        {
          type: "page",
          path: "/system/list",
          level: 2,
          title: "菜单管理",
          meta: {
            icon: "Tickets",
            title: "菜单管理",
            requiresAuth: true
          }
        },
        {
          type: "page",
          path: "/system/role",
          level: 2,
          title: "角色管理",
          meta: {
            icon: "Tickets",
            title: "角色管理",
            requiresAuth: true
          }
        }
      ]
    },
    {
      type: "layout",
      path: "/docs",
      level: 1,
      title: "文档中心",
      meta: {
        icon: "Document",
        title: "文档中心",
        requiresAuth: false
      },
      children:[
        {
          type: "page",
          path: "/docs/list",
          level: 2,
          title: "文档管理",
          meta: {
            icon: "Tickets",
            title: "文档管理",
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

// mock/user.ts

const createUserList = () => {
  return [
    {
      type: "page",
      path: "/home",
      level: 1,
      title: "首页",
      meta: {
        icon: "info",
        title: "首页",
        requiresAuth: false
      }
    },
    {
      type: "layout",
      path: "/dashboard",
      level: 1,
      title: "仪表盘",
      children: [
        {
          type: "page",
          path: "/dashboard/overview",
          level: 2,
          title: "概览",
          meta: {
            icon: "dashboard",
            title: "概览",
            requiresAuth: true
          }
        },
        {
          type: "page",
          path: "/dashboard/analytics",
          level: 2,
          title: "数据分析",
          meta: {
            icon: "analytics",
            title: "数据分析",
            requiresAuth: true
          }
        }
      ]
    },
    {
      type: "layout",
      path: "/user",
      level: 1,
      title: "用户管理",
      children: [
        {
          type: "layout",
          path: "/user/profile",
          level: 2,
          title: "个人资料",
          children: [
            {
              type: "page",
              path: "/user/profile/settings",
              level: 3,
              title: "设置",
            },
            {
              type: "page",
              path: "/user/profile/security",
              level: 3,
              title: "安全",
              meta: {
                icon: "security",
                title: "安全",
                requiresAuth: true
              }
            }
          ]
        },
        {
          type: "page",
          path: "/user/list",
          level: 2,
          title: "用户列表",
          meta: {
            icon: "users",
            title: "用户列表",
            requiresAuth: true
          }
        }
      ]
    },
    {
      type: "layout",
      path: "/admin",
      level: 1,
      title: "系统管理",
      children: [
        {
          type: "page",
          path: "/admin/dashboard",
          level: 2,
          title: "仪表盘",
          meta: {
            icon: "admin",
            title: "仪表盘",
            requiresAuth: true
          }
        },
        {
          type: "layout",
          path: "/admin/settings",
          level: 2,
          title: "系统设置",
          children: [
            {
              type: "page",
              path: "/admin/settings/system",
              level: 3,
              title: "系统配置",
              meta: {
                icon: "settings",
                title: "系统配置",
                requiresAuth: true
              }
            },
            {
              type: "page",
              path: "/admin/settings/roles",
              level: 3,
              title: "角色管理",
              meta: {
                icon: "role",
                title: "角色管理",
                requiresAuth: true
              }
            }
          ]
        }
      ]
    },
    {
      type: "page",
      path: "/docs",
      level: 1,
      title: "文档中心",
      meta: {
        icon: "docs",
        title: "文档中心",
        requiresAuth: false
      }
    },
    {
      type: "page",
      path: "/about",
      level: 1,
      title: "关于我们",
      meta: {
        icon: "info",
        title: "关于我们",
        requiresAuth: false
      }
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

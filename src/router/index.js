import { createRouter, createWebHistory } from 'vue-router'
import Layout from "@/views/Layout";

const routes = [
  {
    path: '/login',
    component: () => import("../views/Login")
  },
{
    path: '/',
    name: '首页',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: '仪表盘',
        icon: "Monitor",
        component: () => import('../views/dashboard/Dashboard.vue')
      }
    ]
  },

{
    path: '/server',
    name: '主机管理',
    icon: "PieChart",
    component: Layout,
    children: [
        {
          path: '/idc',
          name: '机房管理',
          component: () => import('../views/idc/Idc')
        },
        {
          path: '/server_group',
          name: '主机分组',
          component: () => import('../views/servergroup/ServerGroup')
        },{
          path: '/server',
          name: '主机管理',
          component: () => import('../views/server/Server')
        },
    ]
  },

{
    path: '/cicd',
    name: '传统发布系统',
    icon: "PieChart",
    component: Layout,
    children: [
        {
          path: '/app_env',
          name: '应用环境',
          component: () => import('../views/app_env/env')
        },
        {
          path: '/app_project',
          name: '项目管理',
          component: () => import('../views/app_project/project')
        },
        {
          path: '/app',
          name: '应用管理',
          component: () => import('../views/app/App')
        },
      {
          path: '/app_apply',
          name: '发布流水线',
          component: () => import('../views/app_apply/Apply')
        },
    ]
  },

{
    path: '/k8s',
    name: '容器发布系统',
    icon: "PieChart",
    component: Layout,
    children: [
        {
          path: '/k8s_colony',
          name: '集群管理',
          component: () => import('../views/k8s_colony/k8s_colony')
        },
        // {
        //   path: '/k8s_project',
        //   name: '命名空间',
        //   component: () => import('../views/k8s_colony/Idc')
        // },{
        //   path: '/k8s_data',
        //   name: '存储PV/PVC',
        //   component: () => import('../views/k8s_colony/Idc')111
        // },
    ]
  },

{
    path: '/sysconfig',
    name: '系统配置',
    icon: 'Setting',
    component: Layout,
    children: [
        {
          path: '/credential',
          name: '凭据管理',
          component: () => import('../views/credential/Credential')
        }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 添加导航守卫
router.beforeEach((to, from, next) => {
  // 如果用户访问登录页，直接放行
  if(to.path == '/login') {
    return next()
  }
  // 从sessionStorage获取token值
  // const token = window.sessionStorage.getItem('token');
  const token = window.localStorage.getItem('token');
  // 如果没有获取到token值，跳转到登录页
  if (!token) {
    return next('/login')
  }
  // 正常访问页面
  next()
});

export default router

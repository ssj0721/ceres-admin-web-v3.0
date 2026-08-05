import { createRouter, createWebHistory } from 'vue-router';

/* Layout */
import Layout from '@/layout/index.vue'
import {checkForceSSO} from "@/api/user.js";

export const mainRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    hidden: true,
    beforeEnter: async (to, from, next) => {
      if(to.query.maxkey) {next();return;}
      try {
        const res = await checkForceSSO();
        const {isForce, ssoUrl} = res.data;
        if(isForce) {
          window.location.href = ssoUrl;
        } else next();
      } catch (error) {
        console.log("sso登录查询失败");
        next();
      }
    }
  },
  {
    path: '/:catchAll(.*)',
    component: () => import('@/views/404.vue'),
    hidden: true,
  },
  // 以下特殊路由将通过权限系统动态添加
  // {
  //   path: '/etds/licHomePage',
  //   name: 'LicHomePage',
  //   component: () => import('@/views/etds/licZcChahuo/licHomePage.vue'),
  //   meta: {
  //     title: '自查报告',
  //   },
  //   hidden: true,
  // },
  // {
  //   path: '/etds/licZcReport',
  //   name: 'LicZcReport',
  //   component: () => import('@/views/etds/licZcChahuo/licZcReport/index.vue'),
  //   meta: {
  //     title: '写报告',
  //   },
  //   hidden: true,
  // },
  // {
  //   path: '/etds/licZcAudit',
  //   name: 'LicZcAudit',
  //   component: () => import('@/views/etds/licZcAudit/index.vue'),
  //   meta: {
  //     title: '写报告',
  //   },
  //   hidden: true,
  // },
  // {
  //   path: '/etds/GcHomePage',
  //   name: 'GcHomePage',
  //   component: () => import('@/views/etds/GcZcCfm/GcHomePage.vue'),
  //   meta: {
  //     title: '工厂报告',
  //   },
  //   hidden: true,
  // },
  // {
  //   path: '/etds/GcZcReport',
  //   name: 'GcZcReport',
  //   component: () => import('@/views/etds/GcZcCfm/GcZcReport/index.vue'),
  //   meta: {
  //     title: '写报告',
  //   },
  //   hidden: true,
  // },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: {
      title: '总览',
      icon: 'Monitor',
    },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: '总览',
          icon: 'Monitor',
        },
      },
    ],
  },
  {
    path: '/myiframe',
    component: Layout,
    redirect: '/myiframe',
    children: [{
        path: ":routerPath",
        name: 'iframe',
        component: () =>
            import('@/components/iframe/main.vue'),
        props: true
    }]
  },
  {
    path: '/etds/licDqr/licqr',
    name: 'Licqr',
    component: () => import('@/views/etds/licDqr/LicqrDialog.vue'),
    meta: {
      title: '联营业务/联营款确认',
    },
    hidden: true,
  }
]

const createRouterFun = () =>
  createRouter({
    scrollBehavior: () => ({
      y: 0,
    }),
    // routes: constantRoutes
    history: createWebHistory(import.meta.env.VITE_BASE_PREFIX),
    routes: mainRoutes,
  });

const router = createRouterFun()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter () {
  const newRouter = createRouterFun()
  router.matcher = newRouter.matcher // reset router
}

export default router

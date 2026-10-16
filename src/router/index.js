import { createRouter, createWebHistory } from 'vue-router';

/* Layout */
import Layout from '@/layout/index.vue'
import {checkForceSSO} from "@/api/user.js";
import { title } from '@/settings';

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
    redirect: '/trademark',
    meta: {
      title: '商标首页',
      icon: 'Monitor',
    },
    children: [
      {
        path: 'trademark',
        name: 'trademarkHome',
        component: () => import('@/views/trademark/ap/pending/index.vue'),
        meta: {
          title: '商标首页',
          icon: 'Monitor',
        },
      },
      {
        path:'/trademark/ap/pending',
        name:'Pending',
        component:()=>import("@/views/trademark/ap/pending/index.vue"),
      },
      {
        path:'/trademark/ap/pending/register',
        name:'Register',
        component:()=>import("@/views/trademark/ap/pending/form.vue"),
      },
      {
        path:'/trademark/ap/pending/register/confirm',
        name:'RegisterConfirm',
        component:()=>import("@/views/trademark/ap/pending/confirm.vue")
      },
      {
        path:'/trademark/br/brand/detail',
        name:'BrandDetail',
        component:()=>import("@/views/trademark/br/brand/detail.vue")
      },
      {
        path:'/trademark/ap/change/form',
        name:'Change',
        component:()=>import("@/views/trademark/ap/change/form.vue")
      },
      {
        path:'/trademark/ap/change/confirm',
        name:'ChangeConfirm',
        component:()=>import("@/views/trademark/ap/change/confirm.vue")
      },
      {
        path:'/trademark/ap/renewal/form',
        name:'Renewal',
        component:()=>import("@/views/trademark/ap/renewal/form.vue")
      },
      {
        path:'/trademark/ap/renewal/confirm',
        name:'RenewalConfirm',
        component:()=>import("@/views/trademark/ap/renewal/confirm.vue")
      },
      {
        path:'/trademark/ap/transfer/form',
        name:'Transfer',
        component:()=>import('@/views/trademark/ap/transfer/form.vue')
      },
      {
        path:'/trademark/ap/transfer/confirm',
        name:'TransferConfirm',
        component:()=>import('@/views/trademark/ap/transfer/confirm.vue')
      },
      {
        path:'/trademark/ap/correction/form',
        name:'Correction',
        component:()=>import('@/views/trademark/ap/correction/form.vue')
      },
      {
        path:'/trademark/ap/adminlit/form',
        name:'AdminLit',
        component:()=>import('@/views/trademark/ap/adminlit/form.vue')
      },
      {
        path:'/trademark/ap/respreview/form',
        name:'RespReview',
        component:()=>import('@/views/trademark/ap/respreview/form.vue')
      },
      {
        path:'/trademark/ap/respreview/confirm',
        name:'RespReviewConfirm',
        component:()=>import('@/views/trademark/ap/respreview/confirm.vue')
      },
      {
        path:'/trademark/ap/oppreview/form',
        name:'OppReview',
        component:()=>import('@/views/trademark/ap/oppreview/form.vue')
      },
      {
        path:'/trademark/ap/oppreview/confirm',
        name:'OppReviewConfirm',
        component:()=>import('@/views/trademark/ap/oppreview/confirm.vue')
      },
      {
        path:'/trademark/ap/defense/form',
        name:'Defense',
        component:()=>import('@/views/trademark/ap/defense/form.vue')
      },
      {
        path:'/trademark/ap/defense/confirm',
        name:'DefenseConfirm',
        component:()=>import('@/views/trademark/ap/defense/confirm.vue')
      },
      {
        path:'/trademark/ap/opposition/form',
        name:'Opposition',
        component:()=>import('@/views/trademark/ap/opposition/form.vue')
      },
      {
        path:'/trademark/ap/opposition/confirm',
        name:'OppositionConfirm',
        component:()=>import('@/views/trademark/ap/opposition/confirm.vue')
      },
      {
        path:'/trademark/ap/rejection/form',
        name:'RejectionReview',
        component:()=>import('@/views/trademark/ap/rejection/form.vue')
      },
      {
        path:'/trademark/ap/rejection/confirm',
        name:'RejectionReviewConfirm',
        component:()=>import('@/views/trademark/ap/rejection/confirm.vue')
      }
      // {
      //   path: 'dashboard',
      //   name: 'dashboard',
      //   component: () => import('@/views/dashboard/index.vue'),
      //   meta: {
      //     title: '总览',
      //     icon: 'Monitor',
      //   },
      // },
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

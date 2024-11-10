import Vue from 'vue';
import store from '@/store';
import Router from 'vue-router';
import watermark from '@/utils/watermark.js';

import Layout from '@/layout';
import { Message } from 'element-ui';
import { getToken } from '@/utils/auth';

Vue.use(Router);

/**
 * 路由相关属性说明
 * hidden: 如果设置为true，项目将不会显示在侧边栏中（默认为false）
 * mete{
 *  title: xxx,  设置sideBars侧边栏名称
 *  icon: xxx,  设置ideBars侧边栏图标
 *  noCache: true  当设置为true时不缓存该路由页面(默认为false)
 *  roles: ['admin', 'editor] 设置可查看该菜单权限的角色
 *  breadList: [] 定义路径结构，专用于面包屑导航
 * }
 */

/* 通用routers*/
export const currencyRoutes = [
  // {
  //   path: '/login',
  //   name: 'Login',
  //   component: () => import('@/views/login'),
  //   meta: { title: '登录页' },
  //   hidden: true
  // },
  {
    path: '/transit-page',
    component: () => import('@/views/error-page/404'),
    hidden: true,
  },
  {
    path: '/500',
    component: () => import('@/views/error-page/500'),
    hidden: true,
  },
];
/* 动态添加routers*/
export const asyncRoutes = [
  {
    path: '/',
    name: 'Demand',
    component: Layout,
    redirect: '/demand/list',
    meta: { title: '需求管理', icon: 'demand' },
    children: [
      {
        path: '/demand/list',
        name: 'DemandIndex',
        component: () => import('@/views/demand'),
        meta: {
          title: '需求列表',
          noCache: true,
          roles: ['suAdministrator', 'demander', 'coAdministrator', 'auditor'],
          breadList: [{ title: '需求列表', path: '' }],
        },
      },
      {
        path: '/demand/check',
        name: 'CheckList',
        component: () => import('@/views/check/index'),
        meta: {
          noCache: true,
          title: '审批列表',
          roles: ['suAdministrator', 'coAdministrator', 'auditor'],
          breadList: [{ title: '审批列表', path: '' }],
        },
      },
      {
        path: '/demand/check-detail',
        name: 'CheckDetail',
        hidden: true,
        component: () => import('@/views/check/detail'),
        meta: {
          title: '审批详情',
          noCache: true,
          breadList: [
            { title: '审批列表', path: '/demand/check' },
            { title: '审批详情', path: '' },
          ],
        },
      },
      {
        path: '/demand/drafts',
        name: 'Drafts',
        component: () => import('@/views/demand/drafts'),
        meta: {
          title: '草稿箱',
          roles: ['demander', 'suAdministrator', 'coAdministrator', 'auditor'],
          noCache: true,
          breadList: [{ title: '草稿箱', path: '' }],
        },
      },
      {
        path: '/demand/detail',
        name: 'DemandDetail',
        hidden: true,
        component: () => import('@/views/demand/detail'),
        meta: {
          title: '需求跟踪',
          noCache: true,
          breadList: [
            { title: '需求列表', path: '/demand/list' },
            { title: '需求跟踪', path: '' },
          ],
        },
      },
      {
        path: '/demand/base-detail',
        name: 'DemandBaseDetail',
        hidden: true,
        component: () => import('@/views/demand/base-detail'),
        meta: {
          title: '需求跟踪',
          noCache: true,
          breadList: [
            { title: '需求列表', path: '/demand/list' },
            { title: '需求跟踪', path: '' },
          ],
        },
      },
      {
        path: '/demand/edit',
        name: 'DemandEdit',
        hidden: true,
        component: () => import('@/views/demand/edit'),
        meta: {
          title: '需求添加',
          noCache: true,
          breadList: [
            { title: '需求列表', path: '/demand/list' },
            { title: '需求创建', path: '' },
          ],
        },
      },
    ],
  },
  // {
  //   path: '/talentwarelist',
  //   component: Layout,
  //   name: 'Talentwarelist',
  //   redirect: '/talentwarelist/index',
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'TalentwarelistIndex',
  //       component: () => import('@/views/talentwarelist'),
  //       meta: {
  //         title: '智库',
  //         noCache: true,
  //         icon: 'talent',
  //         roles: ['demander', 'auditor', 'suAdministrator', 'coAdministrator']
  //       }
  //     },
  //     {
  //       path: 'detail',
  //       name: 'TalentwarelistDetail',
  //       hidden: true,
  //       component: () => import('@/views/talentwarelist/detail.vue'),
  //       meta: {
  //         noCache: true,
  //         title: '智库信息',
  //         roles: ['demander', 'auditor', 'suAdministrator', 'coAdministrator'],
  //         breadList: [
  //           { title: '智库', path: '/talentwarelist/index' },
  //           { title: '智库信息', path: '' },
  //         ]
  //       }
  //     }
  //   ]
  // },
  {
    path: '/daraBoard',
    name: 'daraBoard',
    component: Layout,
    redirect: '/daraBoard/index',
    meta: {
      title: '数据看板',
      icon: 'databoard',
      roles: ['suAdministrator', 'coAdministrator', 'demander', 'auditor'],
    },
    children: [
      {
        path: 'index',
        name: 'daraBoardIndex',
        component: () => import('@/views/data-board'),
        meta: {
          title: '数据看板',
          noCache: true,
          roles: ['suAdministrator', 'coAdministrator'],
          breadList: [{ title: '数据看板', path: '' }],
        },
      },
      {
        path: 'report',
        name: 'reportCenter',
        component: () => import('@/views/data-board/report'),
        meta: {
          title: '报表中心',
          roles: ['suAdministrator', 'coAdministrator', 'demander', 'auditor'],
          noCache: true,
          breadList: [{ title: '报表中心', path: '' }],
        },
      },
    ],
  },
  {
    path: '/project',
    component: Layout,
    name: 'Project',
    redirect: '/project/index',
    children: [
      {
        path: 'index',
        name: 'ProjectIndex',
        component: () => import('@/views/project'),
        meta: {
          title: '项目列表',
          icon: 'el-icon-picture-outline',
          roles: ['admin'],
        },
      },
    ],
  },
  // {
  //   path: '/resource',
  //   component: Layout,
  //   name: 'Resource',
  //   redirect: '/resource/index',
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'ResourceIndex',
  //       component: () => import('@/views/resource'),
  //       meta: {
  //         noCache: true,
  //         title: '资源管理',
  //         icon: 'resource',
  //         roles: ['suAdministrator', 'coAdministrator']
  //       }
  //     }
  //   ]
  // },
  {
    path: '/resourceSplit',
    component: Layout,
    name: 'Resource',
    redirect: '/resourceSplit/index',
    meta: {
      title: '资源管理',
      icon: 'resource',
      roles: ['suAdministrator', 'coAdministrator'],
    },
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/resourceSplit'),
        meta: {
          title: '内部资源',
          noCache: true,
          roles: ['suAdministrator', 'coAdministrator'],
          breadList: [{ title: '内部资源', path: '' }],
        },
      },
      {
        path: 'supplierIndex',
        name: 'supplierIndex',
        component: () => import('@/views/resourceSplit/supplierIndex'),
        meta: {
          title: '供应商资源',
          noCache: true,
          roles: ['suAdministrator', 'coAdministrator'],
          breadList: [{ title: '供应商资源', path: '' }],
        },
      },
      // 二级菜单....
      {
        path: 'dataConfig',
        name: 'dataConfig',
        component: () => import('@/views/resourceSplit/dataConfig'),
        meta: {
          title: '资源配置',
          noCache: true,
          roles: ['coAdministrator'],
          breadList: [{ title: '资源配置', path: '' }],
        },
      },
      // 内部资源配置新增编辑
      {
        path: 'insideAdd/:pageType',
        name: 'insideAdd',
        hidden: true,
        component: () => import('@/views/resourceSplit/addInsideConfig'),
        meta: {
          title: '内部资源配置',
          noCache: true,
          roles: ['suAdministrator', 'coAdministrator'],
          breadList: [
            { title: '资源配置', path: '/resourceSplit/dataConfig/' },
            { title: '内部资源配置', path: '' },
          ],
        },
      },
      // 内部资源配置详情
      {
        path: 'insideDetail/:billNumber',
        name: 'insideDetail',
        hidden: true,
        component: () => import('@/views/resourceSplit/insideConfigDetail'),
        meta: {
          title: '内部配置详情',
          noCache: true,
          roles: ['suAdministrator', 'coAdministrator'],
          breadList: [
            { title: '资源配置', path: '/resourceSplit/dataConfig' },
            { title: '内部配置详情', path: '' },
          ],
        },
      },
      // 供应商资源配置新增
      {
        path: 'superAdd/:pageType',
        name: 'superAdd',
        hidden: true,
        component: () => import('@/views/resourceSplit/addSuperConfig'),
        meta: {
          title: '供应商配置',
          noCache: true,
          roles: ['suAdministrator', 'coAdministrator'],
          breadList: [
            { title: '资源配置', path: '/dataConfig/' },
            { title: '供应商配置', path: '' }],
        },
      },
      // 供应商资源配置详情
      {
        path: 'superDetail/:billNumber',
        name: 'superDetail',
        hidden: true,
        component: () => import('@/views/resourceSplit/superConfigDetail'),
        meta: {
          title: '供应商配置详情',
          noCache: true,
          roles: ['suAdministrator', 'coAdministrator'],
          breadList: [
            { title: '资源配置', path: '/resourceSplit/dataConfig' },
            { title: '供应商配置详情', path: '' }],
        },
      },

      // 资源配置超管
      {
        path: 'dataConfigSuper',
        name: 'dataConfigSuper',
        component: () => import('@/views/resourceSplit/admin/dataConfigSuper'),
        meta: {
          title: '资源配置',
          noCache: true,
          roles: ['suAdministrator'],
          breadList: [{ title: '资源配置', path: '' }],
        },
      },
      { // 资源配置超管内部详情
        path: 'dataConfigSuperInsideDetail/:billNumber',
        name: 'dataConfigSuperInsideDetail',
        hidden: true,
        component: () => import('@/views/resourceSplit/admin/dataConfigSuperInsideDetail'),
        meta: {
          title: '资源配置内部配置详情',
          noCache: true,
          roles: ['suAdministrator'],
          breadList: [
            { title: '资源配置', path: '/resourceSplit/dataConfigSuper' },
            { title: '内部配置详情', path: '' }],
        },
      },
      { // 资源配置超管供应商详情
        path: 'dataConfigSuperDetail/:billNumber',
        name: 'dataConfigSuperDetail',
        hidden: true,
        component: () => import('@/views/resourceSplit/admin/dataConfigSuperDetail'),
        meta: {
          title: '资源配置供应商配置详情',
          noCache: true,
          roles: ['suAdministrator'],
          breadList: [
            { title: '资源配置', path: '/resourceSplit/dataConfigSuper' },
            { title: '供应商配置详情', path: '' }],
        },
      },
    ],
  },
  // {
  //   path: '/supplier',
  //   component: Layout,
  //   name: 'Supplier',
  //   redirect: '/supplier/index',
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'SupplierIndex',
  //       component: () => import('@/views/supplier'),
  //       meta: {
  //         noCache: true,
  //         title: '供应商管理',
  //         icon: 'supplier',
  //         roles: ['suAdministrator', 'coAdministrator']
  //       }
  //     }
  //   ]
  // },
  {
    path: '/account',
    component: Layout,
    name: 'Account',
    redirect: '/account/index',
    meta: {
      title: '账号管理',
      icon: 'account',
      roles: ['suAdministrator', 'coAdministrator'],
    },
    children: [
      {
        path: 'index',
        name: 'AccountIndex',
        component: () => import('@/views/account'),
        meta: {
          noCache: true,
          title: '内部账号',
          breadList: [{ title: '内部账号', path: '' }],
        },
      },
      {
        path: 'supplier',
        name: 'SupplierAccount',
        component: () => import('@/views/account/supplier'),
        meta: {
          noCache: true,
          title: '供应商账号',
          breadList: [{ title: '供应商账号', path: '' }],
        },
      },
    ],
  },
  {
    path: '/log',
    component: Layout,
    name: 'Log',
    redirect: '/log/index',
    children: [
      {
        path: 'index',
        name: 'LogIndex',
        component: () => import('@/views/log'),
        meta: {
          noCache: true,
          title: '日志管理',
          icon: 'log',
          roles: ['suAdministrator', 'coAdministrator'],
        },
      },
    ],
  },

  {
    path: '/msessage-push',
    component: Layout,
    name: 'msessagePush',
    redirect: '/msessage-push/index',
    hidden: true,
    meta: {
      noCache: true,
      title: '需求列表',
      icon: 'zip',
    },
    children: [
      {
        path: 'index',
        name: 'msessagePushIndex',
        component: () => import('@/views/message-push'),
        meta: {
          noCache: true,
          title: '消息列表',
          icon: 'zip',
          breadList: [{ title: '需求列表', path: '/demand/list' }, { title: '消息列表', path: '' }],
        },
      },
    ],
  },
  { path: '*', redirect: 'transit-page', hidden: true },
];

const creatRouter = () => new Router({
  routes: currencyRoutes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

const router = creatRouter();

// reset router
export function resetRouter() {
  const reset = creatRouter();
  router.matcher = reset.matcher;
}

// 导航守卫
router.beforeEach(async (to, from, next) => {
  if (getToken()) {
    if (['/500'].indexOf(to.path) !== -1) {
      next();
    } else {
      const hasRoles = store.getters.roles.length > 0;
      if (hasRoles) {
        next();
      } else {
        try {
          const { roles } = await store.dispatch('user/_getInfo');
          const addRoutes = await store.dispatch('permission/getAsyncRoutes', roles);
          store.dispatch('app/getMessages');
          router.addRoutes(addRoutes);
          next({ ...to, replace: true });
        } catch (error) {
          // Message.error(error.message)
          if (error.code == '100807') { // 账号被管理员禁用的情况
            next({ path: '/500', query: { type: 'disabled' } });
          } else {
            next('/500');
          }
        }
      }
    }
  } else {
    if (['/500'].indexOf(to.path) !== -1) {
      next();
    } else {
      store.dispatch('user/_login', { STAFFNAME: 'v_jojocyuan' }).then((res) => {
        // carenli  v_jojocyuan hebelwang
        next('/');
      })
        .catch((error) => {
          if (error.code == '100999') { // 账号首次登录没有权限的情况
            next({ path: '/500', query: { type: 'loginErr' } });
          } else {
            next('/500');
          }
        });
    }
  }
});
// 后置守卫获取水印内容-->因为此处必已获取user相关信息
router.afterEach((to) => {
  watermark.set(store.getters.userName || '');
});
export default router;

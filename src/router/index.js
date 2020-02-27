import Vue from 'vue';
import Router from 'vue-router';

import before from './before';
import after from './after';

import Layout from '@/views/layout/Layout';
import Login from '@/views/login/index';
import Err404 from '@/views/404';
import Personaldata from '@/views/personaldata/index';
import Workorder from '@/views/workorder/index';
import WorkorderDetail from '@/views/workorder/subpage/detail';
import Staffmanage from '@/views/staffmanage/index';
import Clientcompany from '@/views/clientcompany/index';
import Customer from '@/views/clientcompany/subpage/customer';
import Products from '@/views/clientcompany/subpage/products';
import Product from '@/views/staffmanage/subpage/products';
import Custproducts from '@/views/clientcompany/subpage/custproducts';

Vue.use(Router);

export const constantRouterMap = [
  {
    path: '/login',
    component: Login,
    hidden: true
  },
  {
    path: '/404',
    component: Err404,
    hidden: true
  },
  {
    path: '/',
    redirect: '/clientcompany/index',
    hidden: true
  }
];

export const asyncRouterMap = [
  {
    path: '/clientcompany',
    component: Layout,
    icon: 'zujian',
    noDropdown: true,
    children: [
      {
        path: 'index',
        component: Clientcompany,
        name: '客户管理',
        meta: {
          role: ['admin']
        }
      },
      {
        path: 'subpage/customer/:cid',
        /* 选择查看客户公司的cid */
        component: Customer,
        name: '员工管理',
        meta: {
          role: ['admin'],
          notKeepAlive: true
        }
      },
      {
        path: 'subpage/products/:pid',
        /* 选择查看客户产品的pid */
        component: Products,
        name: '产品管理',
        meta: {
          role: ['admin'],
          notKeepAlive: true
        }
      },
      {
        path: 'subpage/cusproducts/:id/:cid',
        /* 传的客户公司的cid和客户公司员工的id */
        component: Custproducts,
        name: '负责产品',
        meta: {
          role: ['admin']
        }
      }
    ]
  },
  {
    path: '/staffmanage',
    component: Layout,
    redirect: '/staffmanage/index',
    icon: 'xinrenzhinan',
    noDropdown: true,
    children: [
      {
        path: 'index',
        component: Staffmanage,
        name: '员工管理',
        meta: {
          role: ['admin']
        }
      },
      {
        path: 'subpage/product/:id',
        /* 传的我公司员工的id到产品管理界面 */
        component: Product,
        name: '产品管理',
        meta: {
          role: ['admin'],
          notKeepAlive: true
        }
      }
    ]
  },
  {
    path: '/workorder',
    component: Layout,
    redirect: '/workorder/index',
    icon: 'tubiaoleixingzhengchang',
    noDropdown: true,
    children: [
      {
        path: 'index',
        component: Workorder,
        name: '工单管理',
        meta: {
          role: ['admin']
        }
      },
      {
        path: 'subpage/detail/:id',
        component: WorkorderDetail,
        noDropdown: true,
        name: '工单详情',
        meta: {
          role: ['admin'],
          notKeepAlive: true
        }
      }
    ]
  },
  {
    path: '/personaldata',
    component: Layout,
    redirect: '/personaldata/index',
    icon: 'EXCEL',
    noDropdown: true,
    children: [{
      path: 'index',
      component: Personaldata,
      name: '个人资料',
      meta: {
        role: ['admin']
      }
    }]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
];

const router = new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
});

router.beforeEach(before);
router.afterEach(after);

export default router;
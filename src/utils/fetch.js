import axios from 'axios';
import { Message } from 'element-ui';
import store from '../store';
import router from '../router';

const except = [
  'qwadmin/login'
];

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000 // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers.Authorization = `Bearer ${store.getters.token}`;
    }

    return config;
  },
  error => Promise.reject(error.response.data)
)

// respone拦截器
service.interceptors.response.use(
  response => response,
  error => {
    const route = error.response.request.responseURL.replace(process.env.BASE_API, '');
    let message = '';

    switch (error.response.status) {
      case 400:
        message = '错误请求';
        break;
      case 401:
        message = '登录失败';
        break;
      case 403:
        message = '禁止访问';
        break;
      case 404:
        message = '请求不可用';
        break;
      case 500:
        message = '服务器内部错误！';
        break;
      case 502:
        message = '请求超时！';
        break;
      case 503:
        message = '服务器无响应！';
        break;
      case 504:
        message = '网关超时';
        break;
    }

    Message({
      message,
      type: 'error',
      duration: 3000
    });

    Message({
      message: error.response.data.message,
      type: 'error',
      duration: 3000
    });

    if (error.response && except.indexOf(route) === -1) {
      switch (error.response.status) {
        case 401:
          store.dispatch('LogOut');
          router.go('/login');
          break;
      }
    }

    return Promise.reject(error.response.data);
  }
)

export default service;
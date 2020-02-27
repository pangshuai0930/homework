import {
  login,
  // logout,
  getInfo
} from '@/api/login';
import Cookies from 'js-cookie';

const user = {
  state: {
    token: Cookies.get('qwadminAuthorization'),
    name: '',
    avatar: '',
    roles: [],
    username: ''
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_ACCOUNT: (state, username) => {
      state.username = username;
    }
  },
  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.account.trim();
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = JSON.parse(response.request.response).data

          Cookies.set('qwadminAuthorization', data.token || '', { expires: 30 });

          commit('SET_TOKEN', data.token);
          commit('SET_ACCOUNT', username);
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    },
    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const data = JSON.parse(response.request.response).data

          commit('SET_ROLES', data.role);
          commit('SET_NAME', data.name);
          commit('SET_AVATAR', data.avatar);
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    },
    // 登出
    LogOut({ commit }) {
      return new Promise(() => {
        commit('SET_TOKEN', '');
        commit('SET_ROLES', []);
        Cookies.remove('qwadminAuthorization');
      });
    },
    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        Cookies.remove('Admin-Token');
        resolve();
      });
    }
  }
};

export default user;
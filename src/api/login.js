import fetch from '@/utils/fetch';

// export function login(account, password) {
//   const data = {
//     account,
//     password
//   };
//   return fetch({
//     url: '/account/signin',
//     method: 'post',
//     params: {
//       account,
//       password
//     },
//     data
//   });
// }
export function login(username, password) {
  const data = {
    username,
    password
  };
  return fetch({
    url: 'qwadmin/login',
    method: 'post',
    data
  });
}
export function getInfo() {
  return fetch({
    url: 'qwadmin/profile',
    method: 'get'
  });
}

export function logout() {
  return fetch({
    url: '/user/logout',
    method: 'post'
  });
}
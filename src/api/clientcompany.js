import fetch from '@/utils/fetch';
export function getCompanyList(query) {
  return fetch({
    url: 'qwadmin/companies',
    method: 'get',
    params: query
  });
}
export function removeUser(ids) {
  return fetch({
    url: 'qwadmin/company/delete',
    method: 'post',
    params: {
      ids
    }
  });
}
export function saveCompany(data) {
  return fetch({
    url: 'qwadmin/company/save',
    method: 'post',
    data
  });
}
export function editCompany(data) {
  return fetch({
    url: 'qwadmin/company/save',
    method: 'post',
    data
  });
}
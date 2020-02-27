import fetch from '@/utils/fetch';
export function getCustomersList(para, query) {
  return fetch({
    url: 'qwadmin/company/' + para + '/customers',
    method: 'get',
    params: query
  });
}
export function removeCustomer(ids) {
  return fetch({
    url: 'qwadmin/customer/delete',
    method: 'post',
    params: {
      ids
    }
  });
}
export function saveCustomer(data) {
  return fetch({
    url: 'qwadmin/customer/save',
    method: 'post',
    data
  });
}
export function editCustomer(data) {
  return fetch({
    url: 'qwadmin/customer/save',
    method: 'post',
    data
  });
}
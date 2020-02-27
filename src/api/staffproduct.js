import fetch from '@/utils/fetch';
export function getStaffproducts(data) {
  return fetch({
    url: 'qwadmin/staff/' + data + '/manageProducts',
    method: 'get'
  });
}
export function getWithProducts() {
  return fetch({
    url: 'qwadmin/companies/withProducts',
    method: 'get'
  });
}

export function postProducts(data) {
  return fetch({
    url: 'qwadmin/staff/manageProducts/save',
    method: 'post',
    data
  });
}
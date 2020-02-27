import fetch from '@/utils/fetch';
export function getCustproducts(data) {
  return fetch({
    url: 'qwadmin/customer/' + data + '/manageProducts',
    method: 'get'
  });
}
export function getWithProducts() {
  return fetch({
    url: 'qwadmin/companies/withProducts',
    method: 'get'
  });
}

export function getProductsByCompany(data) {
  return fetch({
    url: 'qwadmin/company/' + data + '/products',
    method: 'get'
  });
}

export function postProducts(data) {
  return fetch({
    url: 'qwadmin/customer/manageProducts/save',
    method: 'post',
    data
  });
}
import fetch from '@/utils/fetch';
export function getProductsList(para, query) {
  return fetch({
    url: 'qwadmin/company/' + para + '/products',
    method: 'get',
    params: query
  });
}

export function removeProducts(ids) {
  return fetch({
    url: 'qwadmin/product/delete',
    method: 'post',
    params: {
      ids
    }
  });
}
export function saveProducts(data) {
  return fetch({
    url: 'qwadmin/product/save',
    method: 'post',
    data
  });
}
export function editProducts(data) {
  return fetch({
    url: 'qwadmin/product/save',
    method: 'post',
    data
  });
}
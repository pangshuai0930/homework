import fetch from '@/utils/fetch';

// 获取客户的工单列表
export function getWorkorderList(query) {
  return fetch({
    url: 'qwadmin/workorders',
    method: 'get',
    params: query
  });
}

export const getCompaniesWithProducts = query => fetch({
  url: 'qwadmin/companies/withProducts',
  method: 'get',
  params: query
});

export const getWorkorderById = id => fetch({
  url: `qwadmin/workorder/${id}`,
  method: 'get'
});

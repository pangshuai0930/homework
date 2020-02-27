import fetch from '@/utils/fetch';
export function getStaffsList(query) {
  return fetch({
    url: 'qwadmin/staffs',
    method: 'get',
    params: query
  });
}
// export function getCompanyList(per_page, current_page) {
// 	const data = {
// 		per_page,
// 		current_page
// 	}
// 	return fetch({
// 		url: 'qwadmin/companies',
// 		method: 'get',
// 		data
// 	});
// }
export function removeStaff(ids) {
  return fetch({
    url: 'qwadmin/staff/delete',
    method: 'post',
    params: {
      ids
    }
  });
}
export function saveStaff(data) {
  return fetch({
    url: 'qwadmin/staff/save',
    method: 'post',
    data
  });
}
export function editStaff(data) {
  return fetch({
    url: 'qwadmin/staff/save',
    method: 'post',
    data
  });
}
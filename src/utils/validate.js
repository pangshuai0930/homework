/**
 * Created by jiachenpan on 16/11/18.
 */


/* 合法uri */
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return urlregex.test(textval);
}

/* 验证邮箱 */
export function validateEmail(str) {
  const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  return reg.test(str.trim());
}

/* 验证手机 */
export function validateTelphone(str) {
  const reg = /^1[34578]\d{9}$/;
  return reg.test(str.trim());
}

/* 验证密码 注:最少6位,支持常用特殊字符 */
export function validatePassword(str) {
  const reg = /^([A-Z]|[a-z]|[0-9]|[./@#!$%^*()&_~+=]){6,20}$/;
  return reg.test(str.trim());
}

/* 验证账户名 注:最少6位,支持常用数字字母 */
export function validateUsername(str) {
  const reg = /^([A-Z]|[a-z]|[0-9]){6,20}$/;
  return reg.test(str.trim());
}

/* 验证公司名称 公司地址 注:最少6个字 */
export function validateClientCompany(str) {
  const reg = /^([\u4e00-\u9fa5 ]|[0-9]|\w){4,20}$/;
  return reg.test(str.trim());
}
/* 验证项目开始时间 2017-06-10 */
export function validateStartTime(str) {
  const reg = /\d{4}-\d{1,2}-\d{1,2}/;
  return reg.test(str.trim());
}

export const validateImage = path => {
  const reg = /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/;
  return reg.test(path);
}
import http from "./http";
const baseUrl = 'http://192.168.26.192:8080'

export const SUCCESS_CODE = 20000;
export const FAILED_CODE =40000;

//获取管理员信息
export const getAdminInfo = () => {
  if (process.client) {
    return http.requestGet('/user/user_info/802851652838096896');
  }else{
    return http.requestGet(baseUrl + '/user/user_info/802851652838096896');
  }
}

//获取分类
export const getCategories = () =>{
  if (process.client) {
    return http.requestGet('/portal/article/categories');
  }else{
    return http.requestGet(baseUrl + '/portal/article/categories');
  }
}

//获取轮播图
export const getLooper = () =>{
  if (process.client) {
    return http.requestGet('/portal/web_size_info/looper');
  }else{
    return http.requestGet(baseUrl + '/portal/web_size_info/looper');
  }
}

//获取置顶文章
export const getTopArticle = () =>{
  if (process.client) {
    return http.requestGet('/portal/article/top');
  }else{
    return http.requestGet(baseUrl + '/portal/article/top');
  }
}

//获取文章
export const getArticles = (categoryId,page,size) =>{
  if (categoryId !== '') {
    return http.requestGet('/portal/article/list/'+categoryId+'/'+page+'/'+size);
  }
  if (process.client) {
    return http.requestGet('/portal/article/list/'+page+'/'+size);
  }else{
    return http.requestGet(baseUrl + '/portal/article/list/'+page+'/'+size);
  }
}

//获取标签
export const getLabels = (count) =>{
  if (process.client) {
    return http.requestGet('/portal/article/label/'+count);
  }else{
    return http.requestGet(baseUrl + '/portal/article/label/'+count);
  }
}

//获取友情链接
export const getLinkList = () =>{

  if (process.client) {
    return http.requestGet('/portal/web_size_info/friend_link');
  }else{
    return http.requestGet(baseUrl + '/portal/web_size_info/friend_link');
  }
}


//搜索
export const getSearchContent = (categoryId, keyword, page, size, sort) =>{
  if (process.client) {
    return http.requestGet('/portal/search?keyword='+encodeURIComponent(keyword)+'&pageNum='+page+'&pageSize='+size+'&categoryId='+categoryId+'&sort='+sort);
  }else{
    return http.requestGet(baseUrl + '/portal/search?keyword='+encodeURIComponent(keyword)+'&pageNum='+page+'&pageSize='+size+'&categoryId='+categoryId+'&sort='+sort);
  }
}

//登录
export const doLogin = (verifyCode,captcha_key,User) => {
  return http.requestPost('/user/login/' + verifyCode+ '/' + captcha_key + '?from=p_',User);
}

//解析token
export const checkToken = () =>{
  return http.requestGet('/user/check-token');
}

//退出登录
export const logout = () =>{
  return http.requestGet('/user/logout');
}

//获取邮箱验证码
export const getEmailCode = (email, type) => {
  return http.requestGet('/user/email_code?email=' +email+ '&type=' +type);
}

// 注册
export const doRegister = (captcha_code,captcha_key,email_code,user) =>{
 return http.requestPost('/user/join_in?captcha_code='+captcha_code+'&captcha_key='+captcha_key+'&email_code='+email_code,user)
}

// 用户名检查
export const checkUserName = (userName) =>{
  return http.requestGet('/user/user_name?userName=' + userName)
}

//忘记密码
export const doForget = (emailCode,user) =>{
  return http.requestPut('/user/password/'+emailCode,user)
}

//获取文章
export const getArticlesDetail = (id) =>{
  return http.requestGet(baseUrl + '/portal/article/'+id);
}

//获取评论
export const getComment = (id,page,size) =>{
  if (process.client) {
    return http.requestGet('/portal/comment/list/'+id+'/'+page+'/'+size);
  } else {
    return http.requestGet(baseUrl + '/portal/comment/list/'+id+'/'+page+'/'+size);
  }
}

//发表评论
export const postComment = (comment) =>{
  return http.requestPost('/portal/comment',comment)
}

//更新管理员信息
export const updateUserInfo = (user,userId) => {
    return http.requestPut('/user/user_info/' + userId, user);
}

//修改邮箱地址
export const updateEmailAddress = (oldEmailAdr,newEmailAdr,verifyCode) => {
    return http.requestPut('/user/email/?oldEmail=' +oldEmailAdr+ '&newEmail=' +newEmailAdr+ '&verify_code=' +verifyCode);
}


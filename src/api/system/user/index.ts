// 导入二次封装axios
import koi from "@/utils/axios.ts";
// 引入接口类型
import type { ILoginParams } from "./type.ts";

// 统一管理接口
enum API {
  KOI_LOGIN = "/user/login",
  KOI_LOGIN_OUT = "/user/logout",
  KOI_DYNAMIC_DATA = "/koi/sysLoginUser/getLoginUserInfo",
  KOI_USERINFO = "/user/info",
  LIST_PAGE = "/user/page",
  GET_BY_ID = "/user/info",
  UPDATE = "/user/update",
  ADD = "/koi/sysLoginUser/add",
  DELETE = "/koi/sysLoginUser/deleteById",
  BATCH_DELETE = "/koi/sysLoginUser/batchDelete",
  UPDATE_STATUS = "/koi/sysLoginUser/updateStatus"
}

// 暴露请求函数
// 登录接口方法
export const koiLogin = (params: ILoginParams) => {
  return koi.post(API.KOI_LOGIN, params);
};

// 退出登录接口方法
export const koiLogout = () => {
  return koi.post(API.KOI_LOGIN_OUT);
};

// 通过token查询相关用户信息、按钮权限、菜单权限数据，token必须有效
export const koiDynamicData = () => {
  return koi.get(API.KOI_DYNAMIC_DATA);
};

// 查询用户信息
export const koiUserInfo = (params: ILoginParams) => {
  return koi.get(API.KOI_USERINFO, params);
};

// 多条件分页查询数据
export const listPage = (params: any) => {
  return koi.get(API.LIST_PAGE, params);
};

// 根据ID进行查询
export const getById = (uid: any) => {
  return koi.get(API.GET_BY_ID + "/" + uid);
};

// 根据ID进行修改
export const update = (data: any) => {
  return koi.post(API.UPDATE, data);
};

// 添加
export const add = (data: any) => {
  if (!data.postIds || data.postIds.length === 0) {
    data.postIds = [-1];
  }
  if (!data.roleIds || data.roleIds.length === 0) {
    data.roleIds = [-1];
  }
  return koi.post(API.ADD, data);
};

// 删除
export const deleteById = (id: any) => {
  return koi.post(API.DELETE + "/" + id);
};

// 批量删除
export const batchDelete = (ids: any) => {
  return koi.post(API.BATCH_DELETE, ids); // 第一种传参方式
};

// 修改状态
export const updateStatus = (id: any, status: any) => {
  return koi.post(API.UPDATE_STATUS + "/" + id + "/" + status); // 第一种传参方式
};

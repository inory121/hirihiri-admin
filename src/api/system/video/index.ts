// 导入二次封装axios
import koi from "@/utils/axios.ts";

// 统一管理接口
enum API {
  LIST_PAGE = "/video/all",
  GET_BY_ID = "/video/",
  UPDATE = "/video/update",
  ADD = "/koi/sysLoginUser/add",
  DELETE = "/koi/sysLoginUser/deleteById",
  BATCH_DELETE = "/koi/sysLoginUser/batchDelete",
  UPDATE_STATUS = "/video/update/status"
}

// 暴露请求函数
// 多条件分页查询数据
export const listPage = (params: any) => {
  return koi.get(API.LIST_PAGE, params);
};

// 根据ID进行查询
export const getById = (vid: any) => {
  return koi.get(API.GET_BY_ID + "/" + vid);
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
export const updateStatus = (params: any) => {
  return koi.post(API.UPDATE_STATUS,params); // 第一种传参方式
};

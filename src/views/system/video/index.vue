<template>
  <div class="koi-flex">
    <KoiCard>
      <!-- 搜索条件 -->
      <el-form v-show="showSearch" :inline="true">
        <el-form-item label="视频ID" prop="vid">
          <el-input
            placeholder="请输入视频ID"
            v-model="searchParams.vid"
            clearable
            style="width: 200px"
            @keyup.enter.native="handleListPage"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input
            placeholder="请输入用户名"
            v-model="searchParams.username"
            clearable
            style="width: 200px"
            @keyup.enter.native="handleListPage"
          ></el-input>
        </el-form-item>
        <el-form-item label="视频标题" prop="title">
          <el-input
            placeholder="请输入视频标题"
            v-model="searchParams.title"
            clearable
            style="width: 200px"
            @keyup.enter.native="handleListPage"
          ></el-input>
        </el-form-item>
        <el-form-item label="上传时间" prop="createDate">
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            value-format="YYYY-MM-DD HH:mm:ss"
            start-placeholder="开始日期"
            range-separator="至"
            end-placeholder="结束日期"
            :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" plain v-debounce="handleSearch">搜索</el-button>
          <el-button type="danger" icon="refresh" plain v-throttle="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格头部按钮 -->
      <el-row :gutter="10">
        <el-col :span="1.5" v-auth="['system:role:add']">
          <el-button type="primary" icon="plus" plain @click="handleAdd()">新增</el-button>
        </el-col>
        <el-col :span="1.5" v-auth="['system:role:update']">
          <el-button type="success" icon="edit" plain @click="handleUpdate()" :disabled="single">修改</el-button>
        </el-col>
        <el-col :span="1.5" v-auth="['system:role:delete']">
          <el-button type="danger" icon="delete" plain @click="handleBatchDelete()" :disabled="multiple">删除</el-button>
        </el-col>
        <el-col :span="1.5" v-auth="['system:role:update']">
          <el-button type="primary" icon="edit" plain @click="handleAssignRoles()" :disabled="single">分配角色</el-button>
        </el-col>
        <el-col :span="1.5" v-auth="['system:role:export']">
          <el-button type="warning" icon="download" plain>导出</el-button>
        </el-col>
        <el-col :span="1.5" v-auth="['system:role:import']">
          <el-button type="info" icon="upload" plain>导入</el-button>
        </el-col>
        <KoiToolbar v-model:showSearch="showSearch" @refreshTable="handleListPage"></KoiToolbar>
      </el-row>

      <div class="h-20px"></div>
      <!-- 数据表格 :data="tableList" -->
      <el-table
        v-loading="loading"
        border
        :data="tableList.slice((searchParams.pageNo - 1) * searchParams.pageSize, searchParams.pageNo * searchParams.pageSize)"
        empty-text="暂时没有数据哟🌻"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" fixed />
        <el-table-column
          label="VID"
          prop="vid"
          width="80px"
          align="center"
          type="index"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="UID" prop="uid" width="80px" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column
          label="用户名"
          prop="username"
          width="80px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="视频标题"
          prop="title"
          width="120px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="视频类型" prop="type" width="100px" align="center">
          <template #default="scope">
            <KoiTag :tagOptions="videoTypeOptions" :value="scope.row.type"></KoiTag>
          </template>
        </el-table-column>
        <el-table-column label="作者声明" prop="auth" width="100px" align="center" :show-overflow-tooltip="true">
          <template #default="scope">
            <KoiTag :tagOptions="authTypeOptions" :value="scope.row.auth"></KoiTag>
          </template>
        </el-table-column>
        <el-table-column label="视频状态" prop="status" width="100px" align="center">
          <template #default="scope">
            <KoiTag :tagOptions="videoStatusOptions" :value="scope.row.status"></KoiTag>
          </template>
        </el-table-column>

        <el-table-column label="分区信息" width="200px" align="center" :show-overflow-tooltip="true">
          <template #default="scope">
            <el-tag type="success">{{ scope.row.mcId }}</el-tag>
            →
            <el-tag type="warning">{{ scope.row.scId }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="视频时长" prop="duration" width="100px" align="center">
          <template #default="scope">
            {{ formatDuration(scope.row.duration) }}
          </template>
        </el-table-column>
        <el-table-column label="视频标签" prop="tags" width="100px" align="center" :show-overflow-tooltip="true">
          <template #default="scope">
            <el-tag v-for="(tag, index) in scope.row.tags.split('\n')" :key="index" style="margin-right: 5px">
              {{ tag }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="视频简介"
          prop="descr"
          width="100px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="视频封面" prop="coverUrl" width="200px"  align="center" :show-overflow-tooltip="true">
          <template #default="scope">
            <div class="flex flex-justify-center">
              <el-image
                class="video-cover"
                :preview-teleported="true"
                :preview-src-list="[scope.row.coverUrl]"
                :src="
                  scope.row.coverUrl != null && scope.row.coverUrl != ''
                    ? scope.row.coverUrl
                    : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
                "
              >
                <template #error>
                  <el-icon class="text-[--el-color-primary]" :size="36">
                    <CircleCloseFilled />
                  </el-icon>
                </template>
              </el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="视频地址"
          prop="videoUrl"
          width="150px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>

        <el-table-column label="上传时间" prop="createDate" width="100px" align="center">
          <template #default="scope">
            {{ formatDateTime(scope.row.createDate) }}
          </template>
        </el-table-column>
        <el-table-column label="删除时间" prop="delDate" width="100px" align="center">
          <template #default="scope">
            {{ formatDateTime(scope.row.delDate) }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="150"
          fixed="right"
          v-auth="['system:role:update', 'system:role:delete']"
        >
          <template #default="{ row }">
            <el-tooltip content="审核🌻" placement="top">
              <el-button
                type="success"
                icon="DocumentChecked"
                circle
                plain
                @click="handleReview(row)"
                v-auth="['system:role:update']"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="修改🌻" placement="top">
              <el-button
                type="primary"
                icon="Edit"
                circle
                plain
                @click="handleUpdate(row)"
                v-auth="['system:role:update']"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除🌻" placement="top">
              <el-button
                type="danger"
                icon="Delete"
                circle
                plain
                @click="handleDelete(row)"
                v-auth="['system:role:delete']"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="h-20px"></div>
      <!-- 分页 -->
      <el-pagination
        background
        v-model:current-page="searchParams.pageNo"
        v-model:page-size="searchParams.pageSize"
        v-show="total > 0"
        :page-sizes="[10, 20, 50, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleListPage"
        @current-change="handleListPage"
      />
      <!-- 审核 -->
      <KoiDrawer
        ref="DrawerRef"
        :title="title"
        @koiConfirm="handleReviewCancel"
        @koiCancel="handleReviewCancel"
        :loading="confirmLoading"
        size="600"
      >
        <template #content>
          <el-row>
            <video
              :src="form.videoUrl"
              controls
              style="margin-bottom: 18px; width: 100%; height: 100%; aspect-ratio: 16/9; background-color: black"
            />
          </el-row>
          <el-row>
            <el-card style="width: 100%" shadow="always">
              <el-row>
                <el-col style="display: flex; justify-content: space-between">
                  <KoiTag
                    :tagOptions="videoStatusOptions"
                    :value="form.status"
                    style="display: inline; align-content: center"
                  ></KoiTag>
                  <div>
                    <el-button type="primary" @click="handleReviewClick(form.vid, 1)">审核通过</el-button>
                    <el-button type="warning" @click="handleReviewClick(form.vid, 2)">不予过审</el-button>
                    <el-button type="danger" @click="handleReviewClick(form.vid, 3)">删除视频</el-button>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-row>
        </template>
      </KoiDrawer>
      <!-- 添加 OR 修改 -->
      <KoiDrawer
        ref="koiDrawerRef"
        :title="title"
        @koiConfirm="handleConfirm"
        @koiCancel="handleCancel"
        :loading="confirmLoading"
      >
        <template #content>
          <el-form ref="formRef" :rules="rules" :model="form" label-width="80px" status-icon>
            <el-row>
              <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
                <el-form-item label="视频标题" prop="title">
                  <el-input v-model="form.title" placeholder="请输入视频标题" clearable />
                </el-form-item>
              </el-col>
              <!--              <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">-->
              <!--                <el-form-item label="视频封面" prop="videoUrl">-->
              <!--                  <KoiUploadImage v-model:imageUrl="form.coverUrl">-->
              <!--                    <template #content>-->
              <!--                      <el-icon>-->
              <!--                        <Avatar />-->
              <!--                      </el-icon>-->
              <!--                      <span>请上传视频封面</span>-->
              <!--                    </template>-->
              <!--                    <template #tip>图片最大为 3M</template>-->
              <!--                  </KoiUploadImage>-->
              <!--                </el-form-item>-->
              <!--              </el-col>-->
              <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
                <el-form-item label="视频简介" prop="descr">
                  <el-input v-model="form.descr" :rows="5" type="textarea" placeholder="请输入视频简介" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </template>
      </KoiDrawer>

      <KoiDialog ref="koiDialogRef" title="分配角色" :height="450" :loading="confirmLoading" :footerHidden="true">
        <template #content>
          <div class="flex flex-justify-center">
            <el-transfer
              :props="{
                key: 'value',
                label: 'label'
              }"
              :titles="['角色列表', '拥有角色']"
              target-order="original"
              filterable
              filter-placeholder="关键字搜索"
              :format="{
                noChecked: '${total}',
                hasChecked: '${checked}/${total}'
              }"
              v-model="transferRightList"
              :data="transferLeftList"
              @change="handleTransferChange"
            />
          </div>
        </template>
      </KoiDialog>
    </KoiCard>
  </div>
</template>

<script setup lang="ts" name="userPage">
// 已使用字典案例
import { nextTick, ref, reactive, onMounted } from "vue";
// @ts-ignore
import {
  koiMsgSuccess,
  koiNoticeSuccess,
  koiNoticeError,
  koiMsgError,
  koiMsgWarning,
  koiMsgBox,
  koiMsgInfo
} from "@/utils/koi.ts";
// @ts-ignore
import { listPage, getById, add, update, deleteById, batchDelete, updateStatus } from "@/api/system/video/index.ts";
import { listNormalRole, assignUserRole } from "@/api/system/role/index.ts";
// @ts-ignore
import { listDataByType } from "@/api/system/dict/data/index.ts";
import { formatDateTime, formatDuration, koiDatePicker } from "@/utils/index.ts";

// 表格加载动画Loading
const loading = ref(false);
// 是否显示搜索表单[默认显示]
const showSearch = ref<boolean>(true); // 默认显示搜索条件

const tableList = ref<any>([]);
// 查询参数
const searchParams = ref({
  pageNo: 1, // 第几页
  pageSize: 10, // 每页显示多少条
  vid: "",
  username: "",
  title: ""
});

const total = ref<number>(0);

/** 重置搜索参数 */
const resetSearchParams = () => {
  searchParams.value = {
    pageNo: 1,
    pageSize: 10,
    vid: "",
    username: "",
    title: ""
  };
  dateRange.value = [];
};

/** 搜索 */
const handleSearch = () => {
  console.log("搜索");
  searchParams.value.pageNo = 1;
  handleListPage();
};

/** 重置 */
const resetSearch = () => {
  console.log("重置搜索");
  resetSearchParams();
  handleListPage();
};

// 时间
const dateRange = ref();

/** @current-change：点击分页组件页码发生变化：例如：切换第2、3页 OR 上一页 AND 下一页 OR 跳转某一页 */
/** @size-change：点击分页组件下拉选择条数发生变化：例如：选择10条/页、20条/页等 */
// 分页查询，@current-change AND @size-change都会触发分页，调用后端分页接口
/** 数据表格 */
const handleListPage = async () => {
  try {
    loading.value = true;
    tableList.value = [];
    const res = await listPage(koiDatePicker(searchParams.value, dateRange.value));
    tableList.value = res.data.map((item: any) => ({
      ...item.video,
      username: item.user.username // 添加 username 字段
    }));
    total.value = res.data.length;
    loading.value = false;
  } catch (error) {
    console.log(error);
    koiNoticeError("数据查询失败，请刷新重试🌻");
  }

  // try {
  //   loading.value = true;
  //   tableList.value = []; // 重置表格数据
  //   const res: any = await listPage(
  //     koiDatePicker(searchParams.value, dateRange.value)
  //   );
  //   console.log("用户数据表格数据->", res.data);
  //   tableList.value = res.data.records;
  //   total.value = res.data.total;
  //   loading.value = false;
  // } catch (error) {
  //   console.log(error);
  //   koiNoticeError("数据查询失败，请刷新重试🌻");
  // }
};

// 静态页面防止报错(可直接删除)
// @ts-ignore
const handleStaticPage = () => {
  listPage(koiDatePicker(searchParams.value, dateRange.value));
};

/** 数据表格[删除、批量删除等刷新使用] */
const handleTableData = async () => {
  try {
    const res: any = await listPage(koiDatePicker(searchParams.value, dateRange.value));
    // console.log("用户数据表格数据->", res.data);
    tableList.value = res.data.records;
    total.value = res.data.total;
  } catch (error) {
    console.log(error);
    koiNoticeError("数据查询失败，请刷新重试🌻");
  }
};

onMounted(() => {
  // 获取表格数据
  handleListPage();
  handleDict();
});

// 翻译数据[用户类型]
const videoStatusOptions = ref();
const videoTypeOptions = ref();
const authTypeOptions = ref();
/** 字典翻译tag */
const handleDict = async () => {
  try {
    videoStatusOptions.value = [
      {
        dictLabel: "审核中",
        dictValue: 0,
        dictTag: "warning",
        dictColor: ""
      },
      {
        dictLabel: "已过审",
        dictValue: 1,
        dictTag: "success",
        dictColor: ""
      },
      {
        dictLabel: "未过审",
        dictValue: 2,
        dictTag: "danger",
        dictColor: ""
      },
      {
        dictLabel: "已删除",
        dictValue: 3,
        dictTag: "error",
        dictColor: ""
      }
    ];
    videoTypeOptions.value = [
      {
        dictLabel: "自制",
        dictValue: 1,
        dictTag: "primary",
        dictColor: ""
      },
      {
        dictLabel: "转载",
        dictValue: 2,
        dictTag: "warning",
        dictColor: ""
      }
    ];
    authTypeOptions.value = [
      {
        dictLabel: "未声明",
        dictValue: 0,
        dictTag: "primary",
        dictColor: ""
      },
      {
        dictLabel: "未经允许禁止转载",
        dictValue: 1,
        dictTag: "warning",
        dictColor: ""
      }
    ];
  } catch (error) {
    console.log(error);
    koiMsgError("数据字典查询失败，请刷新重试🌻");
  }
};
const ids = ref([]); // 选择数组
const single = ref<boolean>(true); // 非单个禁用
const multiple = ref<boolean>(true); // 非多个禁用

/** 是否多选 */
const handleSelectionChange = (selection: any) => {
  // console.log(selection);
  ids.value = selection.map((item: any) => item.userId);
  single.value = selection.length != 1; // 单选
  multiple.value = !selection.length; // 多选
};

/** 添加 */
const handleAdd = () => {
  // 打开对话框
  koiDrawerRef.value.koiOpen();
  koiMsgSuccess("添加🌻");
  // 重置表单
  resetForm();
  // 标题
  title.value = "用户添加";
  form.value.state = 0;
};

/** 回显数据 */
const handleEcho = async (id: any) => {
  console.log("回显数据ID", id);
  if (id == null || id == "") {
    koiMsgWarning("请选择需要修改的数据🌻");
    return;
  }
  try {
    const res: any = await getById(id);
    form.value = res.data.video;
  } catch (error) {
    koiNoticeError("数据获取失败，请刷新重试🌻");
    console.log(error);
  }
};
/** 审核 */
const handleReview = async (row?: any) => {
  // 打开对话框
  DrawerRef.value.koiOpen();
  koiMsgSuccess("审核🌻");
  // 重置表单
  resetForm();
  // 标题
  title.value = "视频审核";
  const vid = row ? row.vid : ids.value[0];
  if (vid == null || vid == "") {
    koiMsgError("请选择需要修改的数据🌻");
  }
  console.log(vid);
  // 回显数据
  await handleEcho(vid);
};
const handleReviewClick = async (vid: number, status: number) => {
  if (!vid || !status) {
    koiMsgWarning("请选择需要修改的数据🌻");
    return;
  }
  try {
    await updateStatus({ vid, status });
    await handleEcho(vid);
    await handleListPage();
  } catch (error) {
    koiNoticeError("数据修改失败，请刷新重试🌻");
    console.log(error);
  }
};
/** 修改 */
const handleUpdate = async (row?: any) => {
  // 打开对话框
  koiDrawerRef.value.koiOpen();
  koiMsgSuccess("修改🌻");
  // 重置表单
  resetForm();
  // 标题
  title.value = "视频修改";
  const vid = row ? row.vid : ids.value[0];
  if (vid == null || vid == "") {
    koiMsgError("请选择需要修改的数据🌻");
  }
  console.log(vid);
  // 回显数据
  await handleEcho(vid);
};

// 添加 OR 修改抽屉Ref
const koiDrawerRef = ref();
//审核抽屉Ref
const DrawerRef = ref();
// 标题
const title = ref("视频管理");
// form表单Ref
const formRef = ref<any>();

// form表单
let form = ref<any>({
  title: "",
  videoUrl: "",
  descr: ""
});

/** 清空表单数据 */
const resetForm = () => {
  // 等待 DOM 更新完成
  nextTick(() => {
    if (formRef.value) {
      // 重置该表单项，将其值重置为初始值，并移除校验结果
      formRef.value.resetFields();
    }
  });
  form.value = {
    title: "",
    videoUrl: "",
    descr: ""
  };
};

/** 表单规则 */
const rules = reactive({
  title: [{ required: true, message: "请输入视频标题字", trigger: "blur" }],
  videoUrl: [{ required: true, message: "请选择视频封面", trigger: "blur" }],
  descr: [{ required: true, message: "请输入视频简介", trigger: "blur" }]
});

// 确定按钮是否显示Loading
const confirmLoading = ref(false);

/** 确定  */
const handleConfirm = () => {
  if (!formRef.value) return;
  confirmLoading.value = true;
  (formRef.value as any).validate(async (valid: any) => {
    if (valid) {
      console.log("表单ID", form.value.uid);
      if (form.value.uid != null && form.value.uid != "") {
        try {
          await update(form.value);
          koiNoticeSuccess("修改成功🌻");
          confirmLoading.value = false;
          koiDrawerRef.value.koiQuickClose();
          resetForm();
          handleListPage();
        } catch (error) {
          console.log(error);
          confirmLoading.value = false;
          koiNoticeError("修改失败，请刷新重试🌻");
        }
      } else {
        try {
          await add(form.value);
          koiNoticeSuccess("添加成功🌻");
          confirmLoading.value = false;
          koiDrawerRef.value.koiQuickClose();
          resetForm();
          handleListPage();
        } catch (error) {
          console.log(error);
          confirmLoading.value = false;
          koiNoticeError("添加失败，请刷新重试🌻");
        }
      }

      // let loadingTime = 1;
      // setInterval(() => {
      //   loadingTime--;
      //   if (loadingTime === 0) {
      //     koiNoticeSuccess("朕让你提交了么？信不信锤你🌻");
      //     confirmLoading.value = false;
      //     resetForm();
      //     koiDrawerRef.value.koiQuickClose();
      //   }
      // }, 1000);
    } else {
      koiMsgError("验证失败，请检查填写内容🌻");
      confirmLoading.value = false;
    }
  });
};

/** 取消 */
const handleCancel = () => {
  koiDrawerRef.value.koiClose();
};
const handleReviewCancel = () => {
  DrawerRef.value.koiClose();
};

/** 状态开关 */
// const handleSwitch = (row: any) => {
//   let text = row.state === "0" ? "启用" : "停用";
//   koiMsgBox("确认要[" + text + "]-[" + row.userName + "]吗？")
//     .then(async () => {
//       if (!row.userId || !row.state) {
//         koiMsgWarning("请选择需要修改的数据🌻");
//         return;
//       }
//       try {
//         await updateStatus(row.userId, row.state);
//         koiNoticeSuccess("修改成功🌻");
//       } catch (error) {
//         console.log(error);
//         koiNoticeError("修改失败，请刷新重试🌻");
//         handleTableData();
//       }
//     })
//     .catch(() => {
//       koiMsgError("已取消🌻");
//     });
// };

// 分配角色对话框
const koiDialogRef = ref();

/** 分配角色 */
const handleAssignRoles = async () => {
  try {
    // 传递当前登录用户ID
    const res: any = await listNormalRole(1);
    transferLeftList.value = res.data.data1; // 左侧所有数据，右边出现一样的会自动进行去除
    transferRightList.value = res.data.data2;
  } catch (error) {
    console.log(error);
    koiMsgError("加载角色数据失败");
  }
  koiDialogRef.value.koiOpen();
};
// 右侧选择数据，必须是['1']数据
const transferRightList = ref(["1"]);
const transferLeftList = ref<any>([
  {
    label: "王者农药",
    value: "1"
  },
  {
    label: "QQ飞车",
    value: "2"
  },
  {
    label: "举例数据",
    value: "3"
  },
  {
    label: "三国杀",
    value: "4"
  },
  {
    label: "和平精英",
    value: "5"
  },
  {
    label: "刺激战场",
    value: "6"
  }
]);

/** 右侧列表元素变化时触发 */
const handleTransferChange = async (value: any) => {
  console.log(value);
  try {
    await assignUserRole(value);
    koiNoticeSuccess("分配角色成功🌻");
  } catch (error) {
    console.log(error);
    handleAssignRoles();
    koiMsgError("分配角色失败，请重试");
  }
};

/** 删除 */
const handleDelete = (row: any) => {
  const id = row.userId;
  if (id == null || id == "") {
    koiMsgWarning("请选择需要删除的数据🌻");
    return;
  }
  koiMsgBox("您确认需要删除用户名称[" + row.username + "]么？")
    .then(async () => {
      try {
        await deleteById(id);
        handleTableData();
        koiNoticeSuccess("删除成功🌻");
      } catch (error) {
        console.log(error);
        handleTableData();
        koiNoticeError("删除失败，请刷新重试🌻");
      }
    })
    .catch(() => {
      koiMsgError("已取消🌻");
    });
};

/** 批量删除 */
const handleBatchDelete = () => {
  if (ids.value.length == 0) {
    koiMsgInfo("请选择需要删除的数据🌻");
    return;
  }
  koiMsgBox("您确认需要进行批量删除么？")
    .then(async () => {
      try {
        console.log("ids", ids.value);
        await batchDelete(ids.value);
        handleTableData();
        koiNoticeSuccess("批量删除成功🌻");
      } catch (error) {
        console.log(error);
        koiNoticeError("批量删除失败，请刷新重试🌻");
        handleTableData();
      }
    })
    .catch(() => {
      koiMsgError("已取消🌻");
    });
};
</script>

<style lang="scss" scoped>
// 穿梭框高度调整
:deep(.el-transfer-panel__body) {
  height: 400px;
}
.video-cover {
  width: 200px;
  //aspect-ratio: 16/9;
  object-fit: cover;
  overflow: hidden;
}
</style>

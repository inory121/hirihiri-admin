<template>
  <!-- 头像 -->
  <el-image class="w-34px h-34px rounded-full select-none user-avatar" :src="userStore.user.avatar">
    <template #error>
      <el-image class="w-34px h-34px rounded-full select-none user-avatar" :src="errorAvatar"></el-image>
    </template>
  </el-image>
  <el-dropdown class="m-l-10px" :hide-on-click="false" @command="handleCommand">
    <div class="koi-dropdown">
      <div class="max-w-113px text-14px m-r-6px line-clamp-1 select-none">{{ userStore.user.username }}(管理员)</div>
      <el-icon>
        <arrow-down />
      </el-icon>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="koiMine">{{ $t("header.personalCenter") }}</el-dropdown-item>
        <el-dropdown-item command="logout">{{ $t("header.logout") }}</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { koiSessionStorage, koiLocalStorage } from "@/utils/storage.ts";
import { LOGIN_URL } from "@/config";
import { useRouter } from "vue-router";
import { koiLogout } from "@/api/system/user";
import { koiMsgError, koiMsgSuccess } from "@/utils/koi.ts";
import useUserStore from "@/stores/modules/user.ts";

const userStore = useUserStore();
const router = useRouter();
// 退出登录
const handleLayout = async () => {
  const res = await koiLogout();
  if (res.code === 200) {
    koiMsgSuccess("退出成功🌻");
  } else {
    koiMsgError("退出失败，请稍后重试🌻");
  }
  koiSessionStorage.clear();
  // 如果不想要保存上次登录设置的全局颜色、布局等，则将下方第一行清空全部代码打开。
  // koiLocalStorage.clear();
  koiLocalStorage.remove("user");
  koiLocalStorage.remove("keepAlive");
  koiLocalStorage.remove("tabs");
  // 退出登录。必须使用replace把页面缓存刷掉。
  window.location.replace(LOGIN_URL);
};
// 用户头像
const avatar = ref(
  "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2Fae90b4c7-98b6-4a47-b1b3-9ee8bc71acf6%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1692146441&t=6fca60f3a0d323869b81d8fb53b5dd1b"
);
const errorAvatar = "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png";
// 下拉折叠
const handleCommand = (command: string | number) => {
  switch (command) {
    case "koiMine":
      router.push("/system/personage");
      break;
    case "logout":
      handleLayout();
      break;
  }
};
</script>

<style lang="scss" scoped>
// dropdown字体颜色
.koi-dropdown {
  color: var(--el-color-primary);
  white-space: nowrap; /* 不换行 */
  cursor: pointer;
  outline: none; // 去除伪元素
  display: flex;
  align-items: center;
}
</style>

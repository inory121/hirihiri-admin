<template>
  <div class="overflow-x-hidden">
    <el-card class="rounded-md" shadow="hover">
      <div class="flex flex-items-center" v-waterMarker="{ text: 'HIRIHIRI-ADMIN', textColor: '#D9D9D9' }">
        <img class="w-60px h-60px rounded-full select-none user-avatar" :src="avatar" alt="avatar" />
        <div class="p-l-20px">
          <div class="font-bold p-b-8px whitespace-nowrap">
            <span>HIRIHIRI-ADMIN🌻</span>
          </div>
          <div class="font-bold whitespace-nowrap">君可愿白衣饮茶，清风瘦马，再听一曲六月雨下。🌻</div>
        </div>
      </div>
    </el-card>
    <el-row :gutter="20" class="m-t-5px">
      <KoiCard></KoiCard>
      <el-col :span="24" class="m-t-5px">
        <el-card class="rounded-md" shadow="hover">
          <template #header> 🦀日变化趋势 </template>
          <KoiTradeChart></KoiTradeChart>
        </el-card>
      </el-col>
      <el-col :span="12" :lg="12" :md="12" :sm="24" :xs="24" class="m-t-5px">
        <el-card class="rounded-md" shadow="hover">
          <template #header> 🐻地区数据排行 </template>
          <KoiLeftChart></KoiLeftChart>
        </el-card>
      </el-col>
      <el-col :span="12" :lg="12" :md="12" :sm="24" :xs="24" class="m-t-5px">
        <el-card class="rounded-md" shadow="hover">
          <template #header> 🐻‍❄️近10日数据变化 </template>
          <KoiRightChart></KoiRightChart>
        </el-card>
      </el-col>
    </el-row>
<!--    <el-row :gutter="20" class="m-t-5px">-->
<!--      <el-col :span="12" :lg="12" :md="12" :sm="24" :xs="24">-->
<!--        <el-card class="rounded-md" shadow="hover">-->
<!--          <KoiTimeline1></KoiTimeline1>-->
<!--        </el-card>-->
<!--      </el-col>-->
<!--      <el-col :span="12" :lg="12" :md="12" :sm="24" :xs="24">-->
<!--        <el-card class="rounded-md" shadow="hover">-->
<!--          <KoiTimeline2></KoiTimeline2>-->
<!--        </el-card>-->
<!--      </el-col>-->
<!--    </el-row>-->
  </div>
</template>

<script setup lang="ts" name="homePage">
import { getDayText } from "@/utils/random.ts";
import { koiNoticeSuccess } from "@/utils/koi.ts";
import KoiCard from "./components/KoiCard.vue";
import KoiTradeChart from "./components/KoiTradeChart.vue";
import KoiLeftChart from "./components/KoiLeftChart.vue";
import KoiRightChart from "./components/KoiRightChart.vue";
import KoiTimeline1 from "./components/KoiTimeline1.vue";
import KoiTimeline2 from "./components/KoiTimeline2.vue";
import { onMounted } from "vue";

onMounted(() => {
  // 时间问候语
  koiNoticeSuccess(getDayText(), "欢迎回来~");
});

// 头像
const avatar =
  "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2Fae90b4c7-98b6-4a47-b1b3-9ee8bc71acf6%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1692146441&t=6fca60f3a0d323869b81d8fb53b5dd1b";

</script>

<style lang="scss" scoped></style>

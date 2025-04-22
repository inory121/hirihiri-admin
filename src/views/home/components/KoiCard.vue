<template>
    <!-- 注意：如果不进行操作数组，使用index当key没有问题，若是数组会用来增删改查则不能使用index当key。 -->
    <el-col :span="6" :lg="6" :md="12" :sm="12" :xs="24" v-for="(item, index) in cardList" :key="index">
      <el-card class="rounded-md" shadow="hover">
        <div class="flex flex-justify-between">
          <span class="text-sm">{{ item.title1 }}</span>
          <el-tag :type="index == 0 ? 'primary' : index == 1 ? 'success' : index == 2 ? 'warning' : 'danger'">{{ item.unit }}</el-tag>
        </div>
        <div class="text-2xl"><CountTo :startVal="0" :endVal="item.value1" :duration="2000"></CountTo></div>
        <el-divider direction="horizontal" content-position="left"></el-divider>
        <div class="flex flex-justify-between">
          <span class="text-sm">{{ item.title2 }}</span>
          <span><CountTo :startVal="0" :endVal="item.value2" :duration="2000"></CountTo></span>
        </div>
      </el-card>
    </el-col>
</template>

<script setup lang="ts">
// @ts-ignore
import { CountTo } from "vue3-count-to";
import { reactive } from "vue";

const cardList = reactive([
  { title1: "总视频数量", unit: "总", value1: 6600, title2: "今日视频数量", value2: 3000 },
  { title1: "总评论数量", unit: "总", value1: 40000, title2: "今日评论数量", value2: 8000 },
  { title1: "总弹幕数量", unit: "总", value1: 66000, title2: "今日弹幕数量", value2: 6666 },
  { title1: "上月新增用户", unit: "月", value1: 996, title2: "上月登录用户", value2: 1145 }
]);
</script>

<style lang="scss" scoped></style>

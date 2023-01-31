<script setup lang="ts">
import { ref, type Ref } from "vue";
interface IWorkForm {
  workIdentifier: string;
}

type TWorkText = string;
let workText: Ref<TWorkText> = ref("");
let workForm: Ref<IWorkForm> = ref({
  workIdentifier: "",
});
</script>

<template>
  <div id="app">
    <div>
      文字识别
      <el-input
        type="textarea"
        v-model="workText"
        placeholder="请输入工单编号"
      ></el-input>
      <el-button type="primary">提交</el-button>
    </div>
    <div>
      <div>新建工单</div>
      <el-input
        v-model="workForm.workIdentifier"
        placeholder="请输入工单编号"
      ></el-input>
      <el-button type="primary">提交</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}
</style>

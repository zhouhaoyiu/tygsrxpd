<script setup lang="ts">
import { onMounted } from "vue";

onMounted(async () => {});
</script>

<template>
  <div class="page">
    <title-com>
      <template #title>
        <span>人员管理</span>
      </template>
    </title-com>
  </div>
</template>

<style lang="scss" scoped>
.page {
  background-color: #f5f5f5;
  padding: 10px;
  width: 100%;
  min-height: 100vh;
}
</style>

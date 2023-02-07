<script lang="ts" setup>
import SideBar from "./components/leftBar.vue";
</script>

<template>
  <div class="content">
    <SideBar />
    <RouterView />
  </div>
</template>

<style scoped lang="scss">
.content {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
}
</style>

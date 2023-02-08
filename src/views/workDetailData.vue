<template>
  <div class="page"></div>
</template>

<script lang="ts" setup>
import { onBeforeMount } from "vue";

onBeforeMount(() => {
  console.log("mounted");
  console.log("workIdentifier: ", localStorage.getItem("workIdentifier"));
});
</script>

<style lang="scss" scoped>
.page {
  background-color: #f5f5f5;
  padding: 16px;
  width: 100%;
  min-height: 100vh;
  overflow-y: hidden;
}
</style>

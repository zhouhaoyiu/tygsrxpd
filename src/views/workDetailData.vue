<template>
  <div class="page">
    <!-- {{ workData[0] }} -->
    <h1>工单数据</h1>
    {{ JSON.stringify(workData[0], null, 4) }}
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from "vue";

let workData = ref([]) as any;
onBeforeMount(async () => {
  const res = await fetch("http://localhost:5000/getWorkDetail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      workIdentifier: localStorage.getItem("workIdentifier"),
    }),
  });

  const data = await res.json();
  workData.value = data;
  console.log(JSON.stringify(workData.value[0], null, 4));
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

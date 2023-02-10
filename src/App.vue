<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable no-undef -->
<script lang="ts" setup>
import { onBeforeMount, ref } from "vue";
import SideBar from "./components/leftBar.vue";
import usePersonList from "./stores/personList";
const UsePersonList = usePersonList();
let personList = ref(undefined) as any;

onBeforeMount(async () => {
  // @ts-ignore
  const loadingInstance1 = ElLoading.service({
    fullscreen: true,
    text: "加载中",
  });
  try {
    console.log("mounted");
    const res = await fetch("http://localhost:5000/getPersonList");
    const data = await res.json();
    personList.value = data;
    console.log(data);
    UsePersonList.setPersonList(personList.value);
    loadingInstance1.close();
  } catch (error) {
    /* empty */
    console.log(error);
  }
});
</script>

<template>
  <div class="content">
    <SideBar />
    <RouterView v-if="!(personList === undefined)" />
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

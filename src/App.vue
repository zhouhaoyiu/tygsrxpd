<script lang="ts" setup>
import { onBeforeMount, ref } from "vue";
import { ElLoading } from "element-plus";
import SideBar from "./components/leftBar.vue";
import usePersonList from "./stores/personList";
const UsePersonList = usePersonList();
let personList = ref(undefined) as any;

onBeforeMount(async () => {
  const loadingInstance1 = ElLoading.service({ fullscreen: true });
  console.log("mounted");
  const res = await fetch("http://localhost:5000/getPersonList");
  const data = await res.json();
  console.log(data);
  personList.value = data;
  UsePersonList.setPersonList(personList.value);
  loadingInstance1.close();
});
</script>

<template>
  <div class="content">
    <SideBar />
    <!-- {{ personList === undefined }} -->
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

<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable no-undef -->
<script lang="ts" setup>
import { onBeforeMount, ref } from "vue";
import SideBar from "./components/leftBar.vue";
import usePersonList from "./stores/personList";
import type { Person } from "./types/domain";
const UsePersonList = usePersonList();
let personList = ref<Person[]>([]);
let loadingTrue = ref(true);
let ErrorInfo = ref("");
onBeforeMount(async () => {
  // @ts-ignore
  const loadingInstance1 = ElLoading.service({
    fullscreen: true,
    text: "加载中",
  });
  try {
    console.log("mounted");
    const res = await fetch("http://localhost:5000/getPersonList");
    const data = (await res.json()) as Person[];
    personList.value = data;
    console.log(data);
    UsePersonList.setPersonList(personList.value);
    loadingTrue.value = true;
    loadingInstance1.close();
  } catch (error) {
    /* empty */
    console.log(error);
    ErrorInfo.value = String(error);
    loadingTrue.value = false;
    // 变为加载失败状态
    loadingInstance1.close();
  }
});
</script>

<template>
  <div class="content">
    <SideBar />
    <RouterView />
    <!-- <div class="loadingTrue"> -->
    <!-- <div>
        {{ ErrorInfo }}
      </div>
      <div>加载失败</div>
    </div> -->
  </div>
  <!-- <footer>powered by <a href="www.github.com/zhouhaoyiu">zhouhaoyiu</a></footer> -->
</template>

<style scoped lang="scss">
.content {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  .loadingTrue {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    font-size: 48px;
    color: red;
  }
}
</style>

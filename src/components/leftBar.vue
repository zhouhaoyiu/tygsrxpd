<script lang="ts" setup>
// 获得当前路由
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";

const $route = useRoute();
const $router = useRouter();

const routerList = ref([
  {
    label: "新建工单",
    path: "/createWork",
  },
  {
    label: "工单管理",
    path: "/manageWork",
  },
  {
    label: "工单数据",
    path: "/workDetailData",
  },
  {
    label: "工单数据可视化",
    path: "/workDataAnalysis",
  },
  {
    label: "人员管理",
    path: "/managePerson",
  },
]);
const matchHilight = (path: string): boolean => {
  return path === $route.path;
};

const goPath = (path: string) => {
  event?.preventDefault();
  $router.push(path);
};
</script>

<template>
  <section class="sideBar">
    <div class="leftbar-title">热线工单<br />派单系统</div>
    <ul class="router-ul">
      <li
        :class="matchHilight(item.path) ? 'ul-li-hilight' : ''"
        v-for="item in routerList"
        :key="item.path"
        @click="goPath(item.path)"
      >
        <router-link style="height: 100%; width: 100%" :to="item.path">{{
          item.label
        }}</router-link>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.sideBar {
  width: 180px;
  max-width: 180px;
  min-width: 180px;
  height: 100vh;
  // background-color: red;
  border-right: 1px solid #e8e8e8;
  user-select: none;
  .leftbar-title {
    text-align: center;
    padding: 10px 0;
    font-size: 24px;
    font-weight: 600;
    color: #2b5cab;
    border-bottom: 1px solid #e8e8e8;
  }
  .router-ul {
    list-style: none;
    padding: 0;
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    li {
      padding: 10px 0;
      margin: 4px 0;
      text-align: center;
      border: 1px solid #e8e8e8;
      border-radius: 8px;
      width: 80%;
      cursor: pointer;
      a {
        color: #333;
        text-decoration: none;
      }
    }
    .ul-li-hilight {
      background-color: #2b5cabee;
      a {
        color: white;
      }
    }
  }
}
</style>

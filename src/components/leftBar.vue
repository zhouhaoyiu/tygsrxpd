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

const barSize = ref("min");

const toggleSideBar = () => {
  const sideBar = document.querySelector(".sideBar");
  barSize.value = barSize.value === "min" ? "max" : "min";

  if (sideBar?.classList.contains("sideBar-min")) {
    sideBar.classList.remove("sideBar-min");
  } else {
    sideBar?.classList.add("sideBar-min");
  }
};

const goPath = (path: string) => {
  event?.preventDefault();
  $router.push(path);
};
</script>

<template>
  <section class="sideBar" v-if="$route.path !== '/login'">
    <div class="size-button">
      <el-button type="text" @click="toggleSideBar">
        {{ barSize === "max" ? "展开" : "收起" }}
      </el-button>
    </div>
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
    <div class="logout" v-if="false">
      <el-button type="danger" @click="() => $router.push('/login')">
        退出登录
      </el-button>
    </div>
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
  display: flex;
  flex-direction: column;

  .size-button {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    border-bottom: 1px solid #e8e8e8;
  }

  &.sideBar-min {
    width: 60px;
    max-width: 60px;
    min-width: 60px;
    .leftbar-title {
      display: none;
    }
    .router-ul {
      li {
        padding: 0;
        margin: 0;
        border: none;
        width: 100%;
        a {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          width: 100%;
        }
      }
    }
  }

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
  .logout {
    // 退出登录
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    // 自身在父元素的底部
    margin-top: auto;
    margin-bottom: 20px;
  }
}
</style>

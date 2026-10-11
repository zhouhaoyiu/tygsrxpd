<script setup lang="ts">
import logo from "@/assets/water-logo.png";
import { useRoute, useRouter } from "vue-router";
import { api } from "./api";
import {
  ClipboardList,
  FilePlus2,
  ChartNoAxesColumn,
  Users,
  LogOut,
} from "@lucide/vue";
const route = useRoute();
const router = useRouter();
const isAdmin = () => sessionStorage.getItem("dispatchRole") === "admin";
async function logout() {
  try {
    await api("/logout", {});
  } finally {
    sessionStorage.removeItem("dispatchToken");
    sessionStorage.removeItem("dispatchRole");
    router.push("/login");
  }
}
</script>
<template>
  <RouterView v-if="route.path === '/login'" />
  <div v-else class="workspace">
    <header class="masthead">
      <img class="brand-mark" :src="logo" alt="太原供水标志" />
      <div><strong>太原供水</strong><span>热线派单</span></div>
      <button class="icon-button" title="退出登录" @click="logout">
        <LogOut :size="19" />
      </button>
    </header>
    <nav class="navigation">
      <RouterLink to="/manageWork"
        ><ClipboardList :size="18" />工单台账</RouterLink
      ><RouterLink to="/createWork"><FilePlus2 :size="18" />新建工单</RouterLink
      ><RouterLink to="/workDataAnalysis"
        ><ChartNoAxesColumn :size="18" />办理统计</RouterLink
      ><RouterLink v-if="isAdmin()" to="/managePerson"
        ><Users :size="18" />人员管理</RouterLink
      >
    </nav>
    <main><RouterView /></main>
  </div>
</template>

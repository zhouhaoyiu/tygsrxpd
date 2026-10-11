<script setup lang="ts">
import logo from "@/assets/water-logo.png";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { api } from "@/api";
const username = ref("");
const password = ref("");
const busy = ref(false);
const error = ref("");
const router = useRouter();
async function login() {
  if (busy.value) return;
  busy.value = true;
  error.value = "";
  try {
    const data = await api<{ token: string; role: string }>("/userLogin", {
      username: username.value,
      password: password.value,
    });
    if (!data.token) throw new Error("登录未返回会话");
    sessionStorage.setItem("dispatchToken", data.token);
    sessionStorage.setItem("dispatchRole", data.role);
    sessionStorage.setItem("dispatchUser", username.value);
    await router.replace("/manageWork");
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    busy.value = false;
  }
}
</script>
<template>
  <main class="login">
    <form @submit.prevent="login">
      <img class="brand-mark" :src="logo" alt="太原供水标志" />
      <p>太原供水 · 城北营销</p>
      <h1>热线派单</h1>
      <label
        >账号<input
          v-model="username"
          required
          autocomplete="username" /></label
      ><label
        >密码<input
          v-model="password"
          required
          type="password"
          autocomplete="current-password"
      /></label>
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <button class="primary" :disabled="busy">
        {{ busy ? "登录中…" : "登录" }}
      </button>
    </form>
  </main>
</template>

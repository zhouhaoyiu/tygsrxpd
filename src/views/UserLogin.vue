<!-- eslint-disable no-undef -->
<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const $router = useRouter();

interface LoginForm {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  token?: string;
}

interface LoginRule {
  required: boolean;
  message: string;
  trigger: string;
}

let userLogin = ref<LoginForm>({
  username: "",
  password: "",
});
let rules = ref<Record<keyof LoginForm, LoginRule[]>>({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
});

const submitLogin = async () => {
  try {
    const res = await fetch("http://localhost:5000/userLogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userLogin.value.username,
        password: userLogin.value.password,
      }),
    });
    const data = (await res.json()) as LoginResponse;
    if (data.success && data.token) {
      localStorage.setItem("token", data.token);
      $router.push("/workList");
      // @ts-ignore
      ElMessage.success("登录成功");
    } else {
      // @ts-ignore
      ElMessage.error("登录失败");
    }
  } catch {
    // @ts-ignore
    ElMessage.error("登录失败");
  }
};
</script>

<template>
  <div class="userLogin">
    <el-form
      :model="userLogin"
      :rules="rules"
      ref="userLogin"
      label-width="80px"
      label-position="left"
      class="userLogin-form"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="userLogin.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="userLogin.password" type="password"></el-input>
      </el-form-item>
      <el-button type="primary" @click="submitLogin">登录</el-button>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.userLogin {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background-color: #f5f5f5;
  .userLogin-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    // background-color: aquamarine;
  }
}
</style>

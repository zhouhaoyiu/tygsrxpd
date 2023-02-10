<!-- eslint-disable no-undef -->
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const $router = useRouter();

let userLogin = ref({
  username: "",
  password: "",
}) as any;
let rules = ref({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
}) as any;

const submitLogin = async () => {
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
  const data = await res.json();
  if (data.success) {
    localStorage.setItem("token", data.token);
    $router.push("/workList");
    // @ts-ignore
    ElMessage.success("登录成功");
  } else {
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
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="userLogin.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="userLogin.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.userLogin {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>

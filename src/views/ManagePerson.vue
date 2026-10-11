<script setup lang="ts">
import { onMounted, ref } from "vue";
import { api } from "@/api";
import type { Person } from "@/types/domain";
import { Pencil, UserPlus, RefreshCw, UserX, X } from "@lucide/vue";
const people = ref<Person[]>([]);
const form = ref<Person | null>(null);
const busy = ref(false);
const loading = ref(false);
const error = ref("");
async function load() {
  loading.value = true;
  error.value = "";
  try {
    people.value = await api<Person[]>("/getPersonList");
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    loading.value = false;
  }
}
async function save() {
  if (busy.value || !form.value) return;
  busy.value = true;
  error.value = "";
  try {
    const { data } = await api<{ data: Person }>(
      form.value.personId ? "/changePerson" : "/addPerson",
      { personInfo: { ...form.value } },
    );
    const i = people.value.findIndex((p) => p.personId === data.personId);
    if (i < 0) people.value.push(data);
    else people.value[i] = data;
    form.value = null;
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    busy.value = false;
  }
}
async function disable(person: Person) {
  if (
    busy.value ||
    !confirm("停用 " + person.personName + "？已有工单记录会保留。")
  )
    return;
  busy.value = true;
  try {
    await api("/deletePerson", { personId: person.personId });
    await load();
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    busy.value = false;
  }
}
onMounted(load);
</script>
<template>
  <header class="page-heading">
    <div>
      <p>组织与分工</p>
      <h1>人员管理</h1>
    </div>
    <div class="actions">
      <button
        class="icon-button"
        title="刷新"
        :disabled="loading"
        @click="load"
      >
        <RefreshCw :size="18" /></button
      ><button
        class="primary"
        @click="form = { personId: '', personName: '', personWx: '' }"
      >
        <UserPlus :size="18" />新增人员
      </button>
    </div>
  </header>
  <p v-if="error" class="error" role="alert">{{ error }}</p>
  <div class="table-scroll">
    <table>
      <thead>
        <tr>
          <th>编号</th>
          <th>姓名</th>
          <th>联系标识</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in people" :key="p.personId">
          <td>{{ p.personId }}</td>
          <td>
            <strong>{{ p.personName }}</strong>
          </td>
          <td>{{ p.personWx }}</td>
          <td>
            <div class="actions">
              <button
                class="icon-button"
                :title="'编辑' + p.personName"
                @click="form = { ...p }"
              >
                <Pencil :size="17" /></button
              ><button
                class="icon-button danger"
                title="停用人员"
                :disabled="busy"
                @click="disable(p)"
              >
                <UserX :size="17" />
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="!people.length">
          <td colspan="4" class="empty">
            {{ loading ? "加载中…" : "暂无人员" }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-if="form" class="modal-backdrop">
    <form class="modal" @submit.prevent="save">
      <header>
        <h2>{{ form.personId ? "编辑人员" : "新增人员" }}</h2>
        <button
          type="button"
          class="icon-button"
          title="关闭"
          :disabled="busy"
          @click="form = null"
        >
          <X :size="18" />
        </button>
      </header>
      <label
        >姓名<input
          v-model="form.personName"
          required
          maxlength="128"
          :disabled="busy" /></label
      ><label
        >联系标识<input
          v-model="form.personWx"
          required
          maxlength="128"
          :disabled="busy"
      /></label>
      <p v-if="error" class="error">{{ error }}</p>
      <button class="primary" :disabled="busy">
        {{ busy ? "保存中…" : "保存" }}
      </button>
    </form>
  </div>
</template>

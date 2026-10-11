<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { api } from "@/api";
import { emptyWork, parseWork } from "@/workflow";
import WorkEditor from "@/components/WorkEditor.vue";
import type { WorkRecord, Person } from "@/types/domain";
import { Save, ClipboardPaste, Trash2 } from "@lucide/vue";
const router = useRouter();
const form = ref(emptyWork());
const people = ref<Person[]>([]);
const text = ref("");
const busy = ref(false);
const error = ref("");
const saved = ref("");
const key = "dispatch-draft-v1:" + sessionStorage.getItem("dispatchUser");
let completed = false;
try {
  const draft = localStorage.getItem(key);
  if (draft) {
    form.value = { ...emptyWork(), ...JSON.parse(draft) };
    saved.value = "已恢复草稿";
  }
} catch {
  error.value = "草稿读取失败";
}
watch(
  form,
  (value) => {
    if (completed) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      saved.value = "草稿已保存 · " + new Date().toLocaleTimeString();
    } catch {
      saved.value = "草稿保存失败";
    }
  },
  { deep: true, flush: "sync" },
);
function paste() {
  const parsed = parseWork(text.value);
  if (!Object.keys(parsed).length) {
    error.value = "未识别到工单字段";
    return;
  }
  form.value = { ...form.value, ...parsed, status: "待接单" };
  error.value = "";
}
function clear() {
  if (confirm("清空当前草稿？")) {
    form.value = emptyWork();
    text.value = "";
    localStorage.removeItem(key);
    saved.value = "";
  }
}
async function submit() {
  if (busy.value) return;
  busy.value = true;
  error.value = "";
  try {
    const result = await api<{ data: WorkRecord }>("/createWork", {
      ...form.value,
      status: "待接单",
    });
    completed = true;
    localStorage.removeItem(key);
    await router.push({
      path: "/workDetailData",
      query: { id: result.data.workIdentifier },
    });
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    busy.value = false;
  }
}
onMounted(async () => {
  try {
    people.value = await api<Person[]>("/getPersonList");
  } catch (e) {
    error.value = (e as Error).message;
  }
});
</script>
<template>
  <header class="page-heading">
    <div>
      <p>热线受理</p>
      <h1>新建工单</h1>
    </div>
    <span class="muted" role="status">{{ saved }}</span>
  </header>
  <details class="paste-panel">
    <summary>粘贴工单</summary>
    <textarea v-model="text" rows="6" aria-label="原始工单文本" /><button
      :disabled="busy"
      @click="paste"
    >
      <ClipboardPaste :size="17" />填入表单
    </button>
  </details>
  <form @submit.prevent="submit">
    <WorkEditor
      v-model="form"
      :people="people"
      :statuses="['待接单']"
      :disabled="busy"
    />
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <footer class="form-footer">
      <button type="button" :disabled="busy" @click="clear">
        <Trash2 :size="17" />清空草稿</button
      ><button class="primary" :disabled="busy">
        <Save :size="17" />{{ busy ? "提交中…" : "创建工单" }}
      </button>
    </footer>
  </form>
</template>

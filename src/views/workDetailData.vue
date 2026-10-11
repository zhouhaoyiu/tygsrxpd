<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute } from "vue-router";
import { api } from "@/api";
import { transitions } from "@/workflow";
import type { WorkRecord, Person } from "@/types/domain";
import WorkEditor from "@/components/WorkEditor.vue";
import { Save, RefreshCw, ArrowLeft } from "@lucide/vue";
const route = useRoute();
const form = ref<WorkRecord | null>(null);
const original = ref("");
const originalStatus = ref("");
const people = ref<Person[]>([]);
const history = ref<
  { action: string; actor: string; reason: string; createdAt: string }[]
>([]);
const reason = ref("");
const error = ref("");
const busy = ref(false);
let requestId = 0;
const dirty = computed(
  () => !!form.value && JSON.stringify(form.value) !== original.value,
);
const states = computed(() => [
  originalStatus.value,
  ...(originalStatus.value === "已完成" &&
  sessionStorage.getItem("dispatchRole") !== "admin"
    ? []
    : transitions[originalStatus.value] || []),
]);
async function load() {
  if (dirty.value && !confirm("重新读取会放弃未保存修改，继续？")) return;
  const current = ++requestId;
  busy.value = true;
  error.value = "";
  form.value = null;
  try {
    const id = String(route.query.id || "");
    if (!id) throw new Error("缺少工单编号");
    const data = await api<WorkRecord[]>("/getWorkDetail", {
      workIdentifier: id,
    });
    const p = await api<Person[]>("/getPersonList");
    const h = await api<typeof history.value>(
      "/workHistory?workIdentifier=" + encodeURIComponent(id),
    );
    if (current !== requestId) return;
    if (!data[0]) throw new Error("工单不存在");
    form.value = data[0];
    original.value = JSON.stringify(data[0]);
    originalStatus.value = data[0].status;
    people.value = p;
    history.value = h;
    reason.value = "";
  } catch (e) {
    if (current === requestId) error.value = (e as Error).message;
  } finally {
    if (current === requestId) busy.value = false;
  }
}
async function save() {
  if (busy.value || !form.value) return;
  busy.value = true;
  error.value = "";
  try {
    const result = await api<{ data: WorkRecord }>("/changeWork", {
      workData: { ...form.value },
      reason: reason.value,
    });
    form.value = result.data;
    original.value = JSON.stringify(result.data);
    originalStatus.value = result.data.status;
    reason.value = "";
    history.value = await api(
      "/workHistory?workIdentifier=" +
        encodeURIComponent(result.data.workIdentifier),
    );
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    busy.value = false;
  }
}
const canLeave = () =>
  !busy.value && (!dirty.value || confirm("离开会放弃未保存修改，继续？"));
onBeforeRouteLeave(canLeave);
onBeforeRouteUpdate(canLeave);
watch(
  () => route.query.id,
  () => {
    original.value = JSON.stringify(form.value);
    load();
  },
);
onMounted(load);
</script>
<template>
  <header class="page-heading">
    <div>
      <RouterLink class="back" to="/manageWork"
        ><ArrowLeft :size="16" />工单台账</RouterLink
      >
      <h1>{{ form?.workIdentifier || "工单详情" }}</h1>
    </div>
    <button class="icon-button" title="重新读取" :disabled="busy" @click="load">
      <RefreshCw :size="18" />
    </button>
  </header>
  <p v-if="error" class="error" role="alert">{{ error }}</p>
  <form v-if="form" @submit.prevent="save">
    <div class="record-meta">
      <span>版本 {{ form.version }}</span
      ><span>{{ form.createTime }}</span
      ><span>{{ dirty ? "有未保存修改" : "已保存" }}</span>
    </div>
    <WorkEditor
      v-model="form"
      :people="people"
      :statuses="states"
      editing
      :disabled="busy"
    /><label
      >变更原因<textarea
        v-model="reason"
        rows="2"
        maxlength="2000"
        :disabled="busy"
      />
    </label>
    <footer class="form-footer">
      <span class="muted">{{ form.status }}</span
      ><button class="primary" :disabled="busy || !dirty">
        <Save :size="17" />{{ busy ? "保存中…" : "保存修改" }}
      </button>
    </footer>
  </form>
  <p v-else class="empty">{{ busy ? "加载中…" : "未载入工单" }}</p>
  <section v-if="history.length" class="history">
    <h2>操作记录</h2>
    <ol>
      <li v-for="(entry, i) in history" :key="i">
        <strong>{{ entry.action }}</strong
        ><span>{{ entry.actor }} · {{ entry.createdAt }}</span>
        <p v-if="entry.reason">{{ entry.reason }}</p>
      </li>
    </ol>
  </section>
</template>

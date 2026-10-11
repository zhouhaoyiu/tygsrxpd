<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { api } from "@/api";
import { getAssigneeName, type WorkRecord } from "@/types/domain";
import { transitions, overdue } from "@/workflow";
import { RefreshCw } from "@lucide/vue";
const rows = ref<WorkRecord[]>([]);
const error = ref("");
const loading = ref(false);
const byPerson = computed(() =>
  Array.from(new Set(rows.value.map((w) => getAssigneeName(w.assignee)))).map(
    (name) => {
      const work = rows.value.filter(
        (w) => getAssigneeName(w.assignee) === name,
      );
      return {
        name,
        total: work.length,
        complete: work.filter((w) => w.status === "已完成").length,
        late: work.filter((w) => overdue(w)).length,
      };
    },
  ),
);
async function load() {
  loading.value = true;
  error.value = "";
  try {
    rows.value = await api("/getWorkList");
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    loading.value = false;
  }
}
onMounted(load);
</script>
<template>
  <header class="page-heading">
    <div>
      <p>当前未归档工单</p>
      <h1>办理统计</h1>
    </div>
    <button class="icon-button" title="刷新" :disabled="loading" @click="load">
      <RefreshCw :size="18" />
    </button>
  </header>
  <p v-if="error" class="error">{{ error }}</p>
  <section class="status-breakdown">
    <div v-for="state in Object.keys(transitions)" :key="state">
      <span>{{ state }}</span
      ><meter
        :value="rows.filter((w) => w.status === state).length"
        :max="rows.length || 1"
      /><strong>{{ rows.filter((w) => w.status === state).length }}</strong>
    </div>
  </section>
  <h2>人员办理情况</h2>
  <div class="table-scroll">
    <table>
      <thead>
        <tr>
          <th>办理人</th>
          <th>工单数</th>
          <th>已完成</th>
          <th>超时未完成</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in byPerson" :key="p.name">
          <td>{{ p.name }}</td>
          <td>{{ p.total }}</td>
          <td>{{ p.complete }}</td>
          <td>{{ p.late }}</td>
        </tr>
        <tr v-if="!byPerson.length">
          <td colspan="4" class="empty">暂无工单</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

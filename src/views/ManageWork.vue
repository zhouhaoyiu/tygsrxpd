<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { api } from "@/api";
import { transitions, overdue } from "@/workflow";
import { getAssigneeName, type WorkRecord } from "@/types/domain";
import { RefreshCw, Plus, ArrowUpRight, Archive } from "@lucide/vue";
const items = ref<WorkRecord[]>([]);
const query = ref("");
const status = ref("");
const onlyLate = ref(false);
const loading = ref(false);
const error = ref("");
const page = ref(1);
const role = sessionStorage.getItem("dispatchRole");
const filtered = computed(() =>
  items.value.filter(
    (w) =>
      (!status.value || w.status === status.value) &&
      (!onlyLate.value || overdue(w)) &&
      [
        w.workIdentifier,
        w.workAddress,
        w.workContent,
        w.contactPerson,
        getAssigneeName(w.assignee),
      ]
        .join(" ")
        .includes(query.value.trim()),
  ),
);
const pages = computed(() =>
  Math.max(1, Math.ceil(filtered.value.length / 20)),
);
const current = computed(() => Math.min(page.value, pages.value));
const rows = computed(() =>
  filtered.value.slice((current.value - 1) * 20, current.value * 20),
);
async function load() {
  loading.value = true;
  error.value = "";
  try {
    items.value = await api<WorkRecord[]>("/getWorkList");
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    loading.value = false;
  }
}
async function archive(w: WorkRecord) {
  const reason = prompt("归档原因");
  if (!reason?.trim()) return;
  try {
    await api("/deleteWork", {
      workIdentifier: w.workIdentifier,
      version: w.version,
      reason,
    });
    await load();
  } catch (e) {
    error.value = (e as Error).message;
  }
}
onMounted(load);
</script>
<template>
  <header class="page-heading">
    <div>
      <p>城北营销 · 服务工单</p>
      <h1>工单台账</h1>
    </div>
    <div class="actions">
      <button
        class="icon-button"
        title="刷新"
        :disabled="loading"
        @click="load"
      >
        <RefreshCw :size="18" /></button
      ><RouterLink class="button primary" to="/createWork"
        ><Plus :size="18" />新建工单</RouterLink
      >
    </div>
  </header>
  <section class="metrics">
    <div>
      <span>当前工单</span><strong>{{ items.length }}</strong>
    </div>
    <div>
      <span>待接单</span
      ><strong>{{ items.filter((w) => w.status === "待接单").length }}</strong>
    </div>
    <div>
      <span>待回访</span
      ><strong>{{ items.filter((w) => w.status === "待回访").length }}</strong>
    </div>
    <div class="warning">
      <span>超过完成时限</span
      ><strong>{{ items.filter((w) => overdue(w)).length }}</strong>
    </div>
  </section>
  <div class="toolbar">
    <input
      v-model="query"
      aria-label="搜索工单"
      placeholder="案件编号、地址、内容或办理人"
      @input="page = 1"
    /><select v-model="status" aria-label="工单状态" @change="page = 1">
      <option value="">全部状态</option>
      <option v-for="state in Object.keys(transitions)" :key="state">
        {{ state }}
      </option></select
    ><label class="check"
      ><input
        v-model="onlyLate"
        type="checkbox"
        @change="page = 1"
      />仅看超时</label
    ><span class="muted">{{ filtered.length }} 条</span>
  </div>
  <p v-if="error" class="error" role="alert">{{ error }}</p>
  <div class="table-scroll">
    <table>
      <thead>
        <tr>
          <th>案件 / 反映内容</th>
          <th>地址 / 联系人</th>
          <th>办理人</th>
          <th>完成时限</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="w in rows" :key="w.workIdentifier">
          <td>
            <RouterLink
              class="record-link"
              :to="{ path: '/workDetailData', query: { id: w.workIdentifier } }"
              >{{ w.workIdentifier }}</RouterLink
            ><span class="cell-secondary">{{ w.workContent }}</span>
          </td>
          <td>
            {{ w.workAddress
            }}<span class="cell-secondary">{{ w.contactPerson }}</span>
          </td>
          <td>{{ getAssigneeName(w.assignee) }}</td>
          <td :class="{ danger: overdue(w) }">
            {{ w.completionTimeLimit || "未设置" }}
          </td>
          <td>
            <span
              class="badge"
              :class="{
                done: w.status === '已完成',
                pending: w.status === '待接单',
              }"
              >{{ w.status }}</span
            >
          </td>
          <td>
            <div class="actions">
              <RouterLink
                class="icon-button"
                title="查看工单"
                :to="{
                  path: '/workDetailData',
                  query: { id: w.workIdentifier },
                }"
                ><ArrowUpRight :size="18" /></RouterLink
              ><button
                v-if="role === 'admin'"
                class="icon-button"
                title="归档工单"
                @click="archive(w)"
              >
                <Archive :size="17" />
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="!rows.length">
          <td colspan="6" class="empty">
            {{ loading ? "加载中…" : "没有符合条件的工单" }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <footer class="pagination">
    <button :disabled="current === 1" @click="page = current - 1">上一页</button
    ><span>{{ current }} / {{ pages }}</span
    ><button :disabled="current === pages" @click="page = current + 1">
      下一页
    </button>
  </footer>
</template>

<!-- eslint-disable no-undef -->
<script lang="ts" setup>
import { onMounted, ref, watch, type Ref } from "vue";

let workData = ref([]) as any;
let selectDisplay = ref(false) as Ref<boolean>;
let selectList = ref([]) as any;
let workIdentifier = ref("") as Ref<string>;
let displayMode = ref(false) as Ref<boolean>;

const submitChangeWork = async () => {
  const res = await fetch("http://localhost:5000/changeWork", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      workIdentifier: workIdentifier.value,
      workData: workData.value[0],
    }),
  });
  const data = await res.json();
  if (data.success) {
    localStorage.setItem("workIdentifier", workIdentifier.value);
    displayMode.value = false;
    // 刷新组件
    const res = await fetch("http://localhost:5000/getWorkDetail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workIdentifier: workIdentifier.value,
      }),
    });
    const data = await res.json();
    workData.value = data;
    // @ts-ignore
    ElMessage.success("修改成功");
  } else {
    // @ts-ignore
    ElMessage.error("修改失败");
  }
};
onMounted(async () => {
  const res = await fetch("http://localhost:5000/getWorkList");
  const data = await res.json();
  selectList.value = data;
  if (!localStorage.getItem("workIdentifier")) {
    selectDisplay.value = true;
    const WorkIdentifier = data[0].workIdentifier;
    workIdentifier.value = WorkIdentifier;
    const res2 = await fetch("http://localhost:5000/getWorkDetail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workIdentifier: WorkIdentifier,
      }),
    });
    const data2 = await res2.json();
    workData.value = data2;
    return;
  } else {
    workIdentifier.value = localStorage.getItem("workIdentifier") || "";
    const res = await fetch("http://localhost:5000/getWorkDetail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workIdentifier: localStorage.getItem("workIdentifier"),
      }),
    });

    const data = await res.json();
    workData.value = data;
  }
});

// 当workIdentifier改变时，重新请求数据
watch(workIdentifier, async (newVal) => {
  const res = await fetch("http://localhost:5000/getWorkDetail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      workIdentifier: newVal,
    }),
  });
  const data = await res.json();
  workData.value = data;
  localStorage.setItem("workIdentifier", newVal);
});
</script>

<template>
  <div class="page">
    <!-- {{ workData[0] }} -->
    <title-com>
      <template #title>
        <span>工单数据</span>
      </template>
    </title-com>
    <el-select v-model="workIdentifier" placeholder="请选择">
      <el-option
        v-for="item in selectList"
        :key="item.workIdentifier"
        :label="item.workIdentifier"
        :value="item.workIdentifier"
      ></el-option>
    </el-select>
    <div>
      <el-switch
        v-model="displayMode"
        active-text="编辑"
        inactive-text="查看"
        style="--el-switch-on-color: #2b5cab; --el-switch-off-color: #2b5cab"
        size="large"
      />
    </div>
    <el-descriptions
      :title="workIdentifier"
      v-if="!displayMode"
      :column="3"
      border
    >
      <template #extra>
        <el-button
          color="#2b5cab"
          @click="() => (displayMode = true)"
          type="primary"
        >
          编辑
        </el-button>
      </template>
      <el-descriptions-item align="center" label="案件编号">
        {{ workData[0]?.workIdentifier }}
      </el-descriptions-item>
      <el-descriptions-item align="center" label="业务类型">
        {{ workData[0]?.workType }}
      </el-descriptions-item>
      <el-descriptions-item align="center" label="反映来源">
        {{ workData[0]?.workSource }}
      </el-descriptions-item>
      <el-descriptions-item align="center" label="反映内容">
        {{ workData[0]?.workContent }}
      </el-descriptions-item>
      <el-descriptions-item align="center" label="联系人">
        {{ workData[0]?.contactPerson }}
      </el-descriptions-item>
      <el-descriptions-item align="center" label="联系电话">
        {{ workData[0]?.contactPhone }}
      </el-descriptions-item>
      <el-descriptions-item align="center" label="反映地址">
        {{ workData[0]?.workAddress }}
      </el-descriptions-item>
      <el-descriptions-item align="center" label="户号">
        {{ workData[0]?.householdNumber }}
      </el-descriptions-item>
      <el-descriptions-item align="center" label="表身号">
        {{ workData[0]?.waterMeterNumber }}
      </el-descriptions-item>
      <el-descriptions-item align="center" label="到场时限">
        {{ workData[0]?.arrivalTimeLimit }}
      </el-descriptions-item>
      <el-descriptions-item align="center" label="完成时限">
        {{ workData[0]?.completionTimeLimit }}
      </el-descriptions-item>
      <el-descriptions-item align="center" label="反映区名">
        {{ workData[0]?.workArea }}
      </el-descriptions-item>
      <el-descriptions-item align="center" label="用水性质">
        {{ workData[0]?.waterUseNature }}
      </el-descriptions-item>
      <el-descriptions-item align="center" label="反映方式">
        {{ workData[0]?.workMode }}
      </el-descriptions-item>
      <el-descriptions-item align="center" label="来电电话">
        {{ workData[0]?.callerPhone }}
      </el-descriptions-item>
      <el-descriptions-item align="center" label="案卷号">
        {{ workData[0]?.fileNo }}
      </el-descriptions-item>
      <el-descriptions-item align="center" label="标签">
        {{ workData[0]?.label }}
      </el-descriptions-item>
      <el-descriptions-item align="center" label="备注">
        {{ workData[0]?.remark }}
      </el-descriptions-item>
      <el-descriptions-item align="center" label="状态">
        {{ workData[0]?.status }}
      </el-descriptions-item>
    </el-descriptions>
    <div v-else>
      <el-descriptions :column="3" border>
        <template #extra>
          <el-button color="#2b5cab" @click="submitChangeWork" type="primary"
            >保存</el-button
          >
        </template>
        <el-descriptions-item label="案件编号">
          {{ workData[0]?.workIdentifier }}
        </el-descriptions-item>
        <el-descriptions-item label="业务类型">
          <el-input v-model="workData[0].workType" />
        </el-descriptions-item>
        <el-descriptions-item label="反映来源">
          <el-input v-model="workData[0].workSource" />
        </el-descriptions-item>
        <el-descriptions-item label="反映内容">
          <el-input v-model="workData[0].workContent" />
        </el-descriptions-item>
        <el-descriptions-item label="联系人">
          <el-input v-model="workData[0].contactPerson" />
        </el-descriptions-item>
        <el-descriptions-item label="联系电话">
          <el-input v-model="workData[0].contactPhone" />
        </el-descriptions-item>
        <el-descriptions-item label="反映地址">
          <el-input v-model="workData[0].workAddress" />
        </el-descriptions-item>
        <el-descriptions-item label="户号">
          <el-input v-model="workData[0].householdNumber" />
        </el-descriptions-item>
        <el-descriptions-item label="表身号">
          <el-input v-model="workData[0].waterMeterNumber" />
        </el-descriptions-item>
        <el-descriptions-item label="到场时限">
          <el-input v-model="workData[0].arrivalTimeLimit" />
        </el-descriptions-item>
        <el-descriptions-item label="完成时限">
          <el-input v-model="workData[0].completionTimeLimit" />
        </el-descriptions-item>
        <el-descriptions-item label="反映区名">
          <el-input v-model="workData[0].workArea" />
        </el-descriptions-item>
        <el-descriptions-item label="用水性质">
          <el-input v-model="workData[0].waterUseNature" />
        </el-descriptions-item>
        <el-descriptions-item label="反映方式">
          <el-input v-model="workData[0].workMode" />
        </el-descriptions-item>
        <el-descriptions-item label="来电电话">
          <el-input v-model="workData[0].callerPhone" />
        </el-descriptions-item>
        <el-descriptions-item label="案卷号">
          <el-input v-model="workData[0].fileNo" />
        </el-descriptions-item>
        <el-descriptions-item label="标签">
          <el-input v-model="workData[0].label" />
        </el-descriptions-item>
        <el-descriptions-item label="备注">
          <el-input v-model="workData[0].remark" />
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-input v-model="workData[0].status" />
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <!-- {{ JSON.stringify(workData[0], null, 4) }} -->
  </div>
</template>

<style lang="scss" scoped>
.page {
  background-color: #f5f5f5;
  padding: 10px;
  width: 100%;
  min-height: 100vh;
  overflow-y: hidden;
}
</style>

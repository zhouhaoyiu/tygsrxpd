<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const $router = useRouter();

onMounted(async () => {
  console.log("%c manageWork mounted", "color: red;font-size: 20px");
  const res = await fetch("http://localhost:5000/getWorkList");
  const data = await res.json();
  console.log(data);
  tableData.value = data;
});

const goWorkDetailData = (workIdentifier: string) => {
  console.log(workIdentifier);
  localStorage.setItem("workIdentifier", workIdentifier);
  $router.push({
    // path: "/workDetailData/:id",
    path: "/workDetailData",
    name: "workDetailData",
  });
};

let tableData = ref([]);
</script>

<template>
  <div class="page">
    <h1>Manage Job</h1>
    <el-table
      height="500"
      size="small"
      stripe
      border
      :data="tableData"
      style="max-width: 95%; font-size: 12px; text-align: center"
    >
      <el-table-column align="center" label="案件编号" width="100px">
        <template #default="scope">
          <div
            style="cursor: pointer; text-decoration: underline"
            @click="goWorkDetailData(scope.row.workIdentifier)"
          >
            {{ scope.row.workIdentifier }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="workType"
        label="业务类型"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="workSource"
        label="反映来源"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="workContent"
        label="反映内容"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="contactPerson"
        label="联系人"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="contactPhone"
        label="联系电话"
        width="100"
      ></el-table-column>
      <!-- <el-table-column
        align="center"
        prop="workAddress"
        label="反映地址"
        width="100"
      ></el-table-column> -->
      <el-table-column label="反映地址" align="center">
        <template #default="scope">
          <el-popover
            effect="light"
            trigger="hover"
            placement="top"
            width="auto"
          >
            <template #default>
              <div>{{ scope.row.workAddress }}</div>
            </template>
            <template #reference>
              <el-tag>查看</el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="householdNumber"
        label="户号"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="waterMeterNumber"
        label="表身号"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="arrivalTimeLimit"
        label="到场时限"
        width="180px"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="completionTimeLimit"
        label="完成时限"
        width="180px"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="workArea"
        label="反映区名"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="waterUseNature"
        label="用水性质"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="workMode"
        label="反映方式"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="callerPhone"
        label="来电电话"
        width="100px"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="fileNo"
        label="案卷号"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="label"
        label="标签"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="remark"
        label="备注"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="status"
        label="状态"
      ></el-table-column>
      <el-table-column align="center" label="指派人员">
        <template #default="scope"
          >{{ JSON.parse(scope.row.assignee || "{}")?.name || "未指派" }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style lang="scss" scoped>
.page {
  background-color: #f5f5f5;
  padding: 16px;
  width: 100%;
  min-height: 100vh;
  overflow-y: hidden;
}
</style>

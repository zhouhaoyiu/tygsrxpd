<!-- eslint-disable no-undef -->
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const $router = useRouter();
let tableData = ref([]);

onMounted(async () => {
  console.log("%c manageWork mounted", "color: red;font-size: 20px");
  const res = await fetch("http://localhost:5000/getWorkList");
  const data = await res.json();
  console.log(data);
  tableData.value = data;
});

const goWorkDetailData = (workIdentifier: string): void => {
  console.log(workIdentifier);
  localStorage.setItem("workIdentifier", workIdentifier);
  $router.push({
    // path: "/workDetailData/:id",
    path: "/workDetailData",
    name: "workDetailData",
  });
};

const deleteWork = async (workIdentifier: string): Promise<void> => {
  try {
    // @ts-ignore
    const confirmDelete = await ElMessageBox.confirm("是否删除该工单", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    if (confirmDelete === "cancel") {
      return;
    }

    console.log(workIdentifier);
    const res = await fetch("http://localhost:5000/deleteWork", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workIdentifier: workIdentifier,
      }),
    });
    const data = await res.json();
    if (data.success) {
      // @ts-ignore
      ElMessage.success("删除成功");
      const res = await fetch("http://localhost:5000/getWorkList");
      const data = await res.json();
      tableData.value = data;
    } else {
      // @ts-ignore
      ElMessage.error("删除失败");
    }
  } catch (error) {
    if (error === "cancel") {
      return;
    }
  }
};
</script>

<template>
  <div class="page">
    <title-com>
      <template #title>
        <span>工单管理</span>
      </template>
    </title-com>
    <div style="height: 90%; width: 100%">
      <el-table
        :header-cell-style="{ background: '#2b5cab08', color: '#2b5cab' }"
        height="100%"
        stripe
        border
        :data="tableData"
        style="max-width: 98%; font-size: 12px; text-align: center"
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
          width="150px"
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
        <!-- <el-table-column
          align="center"
          prop="remark"
          label="备注"
        ></el-table-column> -->
        <el-table-column label="备注" align="center">
          <template #default="scope">
            <el-popover
              effect="light"
              trigger="hover"
              placement="top"
              width="auto"
            >
              <template #default>
                <div>{{ scope.row.remark }}</div>
              </template>
              <template #reference>
                <el-tag>查看</el-tag>
              </template>
            </el-popover>
          </template>
        </el-table-column>
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
        <!-- TODO  新增操作区域 编辑/删除 -->
        <el-table-column fixed="left" align="center" label="操作" width="130px">
          <template #default="scope">
            <div
              style="
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <el-button
                size="small"
                type="primary"
                @click="goWorkDetailData(scope.row.workIdentifier)"
              >
                编辑
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click="deleteWork(scope.row.workIdentifier)"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
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

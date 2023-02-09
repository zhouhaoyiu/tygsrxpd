<script lang="ts" setup>
import * as echarts from "echarts";
import { onMounted } from "vue";

onMounted(async () => {
  const res = await fetch("http://localhost:5000/getWorkList");
  const data = await res.json();
  console.log(data);
  // 根据status分类
  const statusList = data.map((item: any) => item.status);
  const statusSet = new Set(statusList);
  const statusArray = Array.from(statusSet);
  const statusCount = statusArray.map((item: any) => {
    return statusList.filter((status: any) => status === item).length;
  });

  const statusCharts = echarts.init(
    document.querySelector(".statusCharts") as HTMLDivElement
  );

  const option = {
    title: {
      text: "案件状态统计",
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    label: {
      show: true,
      position: "outside",
      formatter: "{b} {c}",
      color: "#235894",
      fontSize: 14,
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "案件状态",
        type: "pie",
        radius: "50%",
        data: statusArray.map((item: any, index: number) => {
          return {
            name: item,
            value: statusCount[index],
          };
        }),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  statusCharts.setOption(option);

  // 根据assignee分类
  const assigneeList = data.map(
    (item: any) => JSON.parse(item.assignee || "{}").name || "未分配"
  );
  const assigneeSet = new Set(assigneeList);
  const assigneeArray = Array.from(assigneeSet);
  const assigneeCount = assigneeArray.map((item: any) => {
    return assigneeList.filter((assignee: any) => assignee === item).length;
  });

  const assigneeCharts = echarts.init(
    document.querySelector(".assigneeCharts") as HTMLDivElement
  );

  const assigneeOption = {
    title: {
      text: "案件办理人统计",
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    label: {
      show: true,
      position: "outside",
      formatter: "{b} {c}",
      color: "#235894",
      fontSize: 14,
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "案件办理人",
        type: "pie",
        radius: "50%",
        data: assigneeArray.map((item: any, index: number) => {
          return {
            name: item,
            value: assigneeCount[index],
          };
        }),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  assigneeCharts.setOption(assigneeOption);
});
</script>

<template>
  <div class="page">
    <h1>数据可视化</h1>
    <div style="width: 300px; height: 300px" class="statusCharts"></div>
    <div style="width: 400px; height: 300px" class="assigneeCharts"></div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  background-color: #f5f5f5;
  padding: 16px;
  width: 100%;
  min-height: 100vh;
}
</style>

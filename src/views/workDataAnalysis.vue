<script lang="ts" setup>
import * as echarts from "echarts";
import { onMounted, ref } from "vue";

let workCount = ref(0);
// 待处理工单数
let waitCount = ref(0);

onMounted(async () => {
  const res = await fetch("http://localhost:5000/getWorkList");
  const data = await res.json();
  console.log(data);
  workCount.value = data.length;
  waitCount.value = data.filter((item: any) => item.status === "处理中").length;
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

  // 图表居中
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
  const assigneeCharts = echarts.init(
    document.querySelector(".assigneeCharts") as HTMLDivElement
  );

  const assigneeList = data.map(
    (item: any) => JSON.parse(item.assignee || "{}").name || "未分配"
  );
  const assigneeSet = new Set(assigneeList);
  const assigneeArray = Array.from(assigneeSet);
  const assigneeCount = assigneeArray.map((item: any) => {
    return assigneeList.filter((assignee: any) => assignee === item).length;
  });

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
  const newWorkCharts = echarts.init(
    document.querySelector(".newWorkCharts") as HTMLDivElement
  );

  const newWorkList = data
    .map((item: any) => {
      // 2023/2/9 11:16:45
      const date = new Date(item.createTime);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}/${month}/${day}`;
    })
    .slice(0, 15)
    .reverse();

  const newWorkSet = new Set(newWorkList);
  const newWorkArray = Array.from(newWorkSet);
  const newWorkCount = newWorkArray.map((item: any) => {
    return newWorkList.filter((newWork: any) => newWork === item).length;
  });

  const newWorkOption = {
    title: {
      text: "每日新增案件统计",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: newWorkArray,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: newWorkCount,
        type: "line",
      },
    ],
  };

  newWorkCharts.setOption(newWorkOption);
});
</script>

<template>
  <div class="page">
    <title-com>
      <template #title>
        <span>数据可视化</span>
      </template>
    </title-com>
    <div>
      <h1>目前共有工单{{ workCount }}个，处理中工单{{ waitCount }}个</h1>
      <div
        style="
          width: 100%;
          height: 300px;
          background-color: #fbfbfb99;
          border-radius: 5px;
          margin-bottom: 20px;
          box-shadow: 1px 1px 8px 1px #eee;
          padding: 4px;
        "
        class="newWorkCharts"
      ></div>
    </div>
    <div style="display: flex">
      <div
        style="
          width: 420px;
          height: 300px;
          background-color: #fbfbfb99;
          margin-right: 20px;
          border-radius: 5px;
          box-shadow: 1px 1px 8px 1px #eee;
          padding: 4px;
        "
        class="statusCharts"
      ></div>
      <div
        style="
          width: 400px;
          height: 300px;
          background-color: #fbfbfb99;
          border-radius: 5px;
          box-shadow: 1px 1px 8px 1px #eee;
          padding: 4px;
        "
        class="assigneeCharts"
      ></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  background-color: #f5f5f5;
  padding: 10px;
  width: 100%;
  min-height: 100vh;
}
</style>

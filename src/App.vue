<script setup lang="ts">
import { onMounted, ref, type Ref } from "vue";
interface IWorkForm {
  workIdentifier: string;
}

let workTextTemplate = ref(`
案件编号
CC2301310143

业务类型
立案

反映来源
户表用户

反映内容
供水设施及其他附属设施 \\ 其他

联系人
用户

联系电话
15034199838

反映地址
艺苑巷药材公司宿舍小二楼平房16号

户号
表身号
到场时限
2024-01-31 15:42(随接随到)按时 2023-01-31 15:42

完成时限
2023-02-01 15:42(24小时)--未完成--

反映区名
杏花岭区

用水性质
居民用水

反映方式
城北热线

来电电话
15034199838

案卷号

标签
无标签

备注
无水
`);

function workTextTemplateParser(workTextTemplate: string) {
  // 匹配workTextTemplate的案件编号，业务类型，反映来源，反映内容，联系人，
  // 联系电话，反映地址，户号，表身号，到场时限，完成时限，
  // 反映区名，用水性质，反映方式，来电电话，案卷号，标签，备注
  if (!workTextTemplate || workTextTemplate == null) return;
  console.time("workTextTemplateParser");
  // 案件编号和业务类型之间的是案件编号内容
  const ajbh = (workTextTemplate as string)
    .match(/案件编号[\s\S]*业务类型/)![0]
    .replace(/案件编号/, "")
    .replace(/业务类型/, "")
    .trim();
  const ywlx = (workTextTemplate as string)
    .match(/业务类型[\s\S]*反映来源/)![0]
    .replace(/业务类型/, "")
    .replace(/反映来源/, "")
    .trim();
  const fyly = (workTextTemplate as string)
    .match(/反映来源[\s\S]*反映内容/)![0]
    .replace(/反映来源/, "")
    .replace(/反映内容/, "")
    .trim();
  const fynr = (workTextTemplate as string)
    .match(/反映内容[\s\S]*联系人/)![0]
    .replace(/反映内容/, "")
    .replace(/联系人/, "")
    .trim();
  const lxr = (workTextTemplate as string)
    .match(/联系人[\s\S]*联系电话/)![0]
    .replace(/联系人/, "")
    .replace(/联系电话/, "")
    .trim();
  const lxdh = (workTextTemplate as string)
    .match(/联系电话[\s\S]*反映地址/)![0]
    .replace(/联系电话/, "")
    .replace(/反映地址/, "")
    .trim();
  const fydz = (workTextTemplate as string)
    .match(/反映地址[\s\S]*户号/)![0]
    .replace(/反映地址/, "")
    .replace(/户号/, "")
    .trim();
  const hh = (workTextTemplate as string)
    .match(/户号[\s\S]*表身号/)![0]
    .replace(/户号/, "")
    .replace(/表身号/, "")
    .trim();
  const bsh = (workTextTemplate as string)
    .match(/表身号[\s\S]*到场时限/)![0]
    .replace(/表身号/, "")
    .replace(/到场时限/, "")
    .trim();
  const dcsx = (workTextTemplate as string)
    .match(/到场时限[\s\S]*完成时限/)![0]
    .replace(/到场时限/, "")
    .replace(/完成时限/, "")
    .trim();
  const wcsx = (workTextTemplate as string)
    .match(/完成时限[\s\S]*反映区名/)![0]
    .replace(/完成时限/, "")
    .replace(/反映区名/, "")
    .trim();
  const fyqm = (workTextTemplate as string)
    .match(/反映区名[\s\S]*用水性质/)![0]
    .replace(/反映区名/, "")
    .replace(/用水性质/, "")
    .trim();
  const ysxz = (workTextTemplate as string)
    .match(/用水性质[\s\S]*反映方式/)![0]
    .replace(/用水性质/, "")
    .replace(/反映方式/, "")
    .trim();
  const fyfs = (workTextTemplate as string)
    .match(/反映方式[\s\S]*来电电话/)![0]
    .replace(/反映方式/, "")
    .replace(/来电电话/, "")
    .trim();
  const lddh = (workTextTemplate as string)
    .match(/来电电话[\s\S]*案卷号/)![0]
    .replace(/来电电话/, "")
    .replace(/案卷号/, "")
    .trim();
  // 案卷号和标签之间的是案卷号的内容，可能为空,所以要判断一下
  // const ajh = (workTextTemplate as string).match(/案卷号[\s\S]*标签/)
  //   ? (workTextTemplate as string)
  //       .match(/案卷号[\s\S]*标签/)![0]
  //       .replace(/案卷号/, "")
  //       .replace(/标签/, "")
  //       .trim()
  //   : "";
  const ajh = (workTextTemplate as string).match(/案卷号[\s\S]*标签/)
    ? (workTextTemplate as string)!
        .match(/案卷号[\s\S]*标签/)![0]
        // 案卷号

        // 标签
        // 取得案卷号的内容，去掉案卷号和标签还有标签之后的内容
        .replace(/案卷号/, "")
        .replace(/标签/, "")
        .trim()
    : // .replace(/案卷号/, "")
      // .replace(/标签/, "")
      // .trim()
      "";
  // const ajh = (workTextTemplate as string)
  //   .match(/案卷号[\s\S]*标签/)![0]
  //   .replace(/案卷号/, "")
  //   .replace(/标签/, "")
  //   .trim();
  const bq = (workTextTemplate as string)
    .match(/标签[\s\S]*备注/)![0]
    .replace(/标签/, "")
    .replace(/备注/, "")
    .trim();
  const bz = (workTextTemplate as string)
    .match(/备注[\s\S]*$/)![0]
    .replace(/备注/, "")
    .trim();
  console.log(ajh);

  console.log(
    "%33反映时间\n" + ajbh + "\n",
    "%33业务类型\n" + ywlx + "\n",
    "%33反映来源\n" + fyly + "\n",
    "%33反映内容\n" + fynr + "\n",
    "%33联系人\n" + lxr + "\n",
    "%33联系电话\n" + lxdh + "\n",
    "%33反映地址\n" + fydz + "\n",
    "%33户号\n" + hh + "\n",
    "%33表身号\n" + bsh + "\n",
    "%33到场时限\n" + dcsx + "\n",
    "%33完成时限\n" + wcsx + "\n",
    "%33反映区名\n" + fyqm + "\n",
    "%33用水性质\n" + ysxz + "\n",
    "%33反映方式\n" + fyfs + "\n",
    "%33来电电话\n" + lddh + "\n",
    "%33案卷号\n" + ajh + "\n",
    "%33标签\n" + bq
  );
  console.timeEnd("workTextTemplateParser");
}
onMounted(() => {
  workTextTemplateParser(workTextTemplate.value);
});

type TWorkText = string;
let workText: Ref<TWorkText> = ref("");
let workForm: Ref<IWorkForm> = ref({
  workIdentifier: "",
});
</script>

<template>
  <div id="app">
    <div>
      <span>文字识别</span>
      <el-input
        type="textarea"
        v-model="workText"
        placeholder="请输入工单内容"
      ></el-input>
      <el-button @click="workTextTemplateParser(workText)" type="primary">
        识别
      </el-button>
    </div>
    <div>
      <div>新建工单</div>
      <el-input
        v-model="workForm.workIdentifier"
        placeholder="请输入工单编号"
      ></el-input>
      <el-button type="primary">提交</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}
</style>

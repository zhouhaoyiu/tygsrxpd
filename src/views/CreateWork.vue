<!-- eslint-disable no-undef -->
<script setup lang="ts">
import { onMounted, ref, type Ref } from "vue";
import usePersonList from "@/stores/personList";
const personList = usePersonList();

type TWorkText = string;
let workText: Ref<TWorkText> = ref("");
let workForm: Ref<IWorkForm> = ref({
  workIdentifier: "",
  workType: "",
  workSource: "",
  workContent: "",
  contactPerson: "",
  contactPhone: "",
  workAddress: "",
  householdNumber: "",
  waterMeterNumber: "",
  arrivalTimeLimit: "",
  completionTimeLimit: "",
  workArea: "",
  waterUseNature: "",
  workMode: "",
  callerPhone: "",
  fileNo: "",
  label: "",
  remark: "",
  status: "",
  assignee: "",
  createTime: "",
});
interface IWorkForm {
  workIdentifier: string;
  workType: string;
  workSource: string;
  workContent: string;
  contactPerson: string;
  contactPhone: string;
  workAddress: string;
  householdNumber: string;
  waterMeterNumber: string;
  arrivalTimeLimit: string;
  completionTimeLimit: string;
  workArea: string;
  waterUseNature: string;
  workMode: string;
  callerPhone: string;
  fileNo: string;
  label: string;
  remark: string;
  status: string;
  assignee: string;
}
//  待接单待到场待处理已完成已挂起已终止已作废
const statusList = [
  {
    label: "待接单",
    value: "待接单",
  },
  {
    label: "待到场",
    value: "待到场",
  },
  {
    label: "待处理",
    value: "待处理",
  },
  {
    label: "已完成",
    value: "已完成",
  },
  {
    label: "已挂起",
    value: "已挂起",
  },
  {
    label: "已终止",
    value: "已终止",
  },
  {
    label: "已作废",
    value: "已作废",
  },
];

let submitWork = async (): Promise<void> => {
  if (!workForm.value.status) {
    // @ts-ignore
    ElMessage.error("请选择工单状态");
    return;
  }
  let res = await fetch("http://localhost:5000/createWork", {
    method: "POST",
    // body: JSON.stringify(workForm.value assign createTime) ,
    body: JSON.stringify({
      ...workForm.value,
      createTime: new Date().toLocaleString(),
    }),
  });
  let data = await res.json();
  console.log(data);

  if (data.success) {
    // @ts-ignore
    ElMessage.success("创建成功");
    // clear workForm
    workForm.value = {
      workIdentifier: "",
      workType: "",
      workSource: "",
      workContent: "",
      contactPerson: "",
      contactPhone: "",
      workAddress: "",
      householdNumber: "",
      waterMeterNumber: "",
      arrivalTimeLimit: "",
      completionTimeLimit: "",
      workArea: "",
      waterUseNature: "",
      workMode: "",
      callerPhone: "",
      fileNo: "",
      label: "",
      remark: "",
      status: "",
      assignee: "",
    };
    workText.value = "";
  } else {
    // @ts-ignore
    ElMessage.error("创建失败");
  }
};
let assigneeList: Ref<Record<string, any>[]> = ref([]);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let defaultWorkTextTemplate = ref(`
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
  try {
    const ajbh = (workTextTemplate as string)
      .match(/案件编号[\s\S]*业务类型/)![0]
      .replace(/案件编号/, "")
      .replace(/业务类型/, "")
      .split("\n")[1];
    const ywlx = (workTextTemplate as string)
      .match(/业务类型[\s\S]*反映来源/)![0]
      .replace(/业务类型/, "")
      .replace(/反映来源/, "")
      .split("\n")[1];
    const fyly = (workTextTemplate as string)
      .match(/反映来源[\s\S]*反映内容/)![0]
      .replace(/反映来源/, "")
      .replace(/反映内容/, "")
      .split("\n")[1];

    // 只匹配到下面一行的联系人

    const fynr = (workTextTemplate as string)
      .match(/反映内容[\s\S]*联系人/)![0]
      .replace(/反映内容/, "")
      .replace(/联系人/, "")
      // 取第一行
      .split("\n")[1];
    console.log(fynr);

    const lxr = (workTextTemplate as string)
      .match(/联系人[\s\S]*联系电话/)![0]
      .replace(/联系人/, "")
      .replace(/联系电话/, "")
      .split("\n")[1];
    const lxdh = (workTextTemplate as string)
      .match(/联系电话[\s\S]*反映地址/)![0]
      .replace(/联系电话/, "")
      .replace(/反映地址/, "")
      .split("\n")[1];
    const fydz = (workTextTemplate as string)
      .match(/反映地址[\s\S]*户号/)![0]
      .replace(/反映地址/, "")
      .replace(/户号/, "")
      .split("\n")[1];
    const hh = (workTextTemplate as string)
      .match(/户号[\s\S]*表身号/)![0]
      .replace(/户号/, "")
      .replace(/表身号/, "")
      .split("\n")[1];
    const bsh = (workTextTemplate as string)
      .match(/表身号[\s\S]*到场时限/)![0]
      .replace(/表身号/, "")
      .replace(/到场时限/, "")
      .split("\n")[1];
    const dcsx = (workTextTemplate as string)
      .match(/到场时限[\s\S]*完成时限/)![0]
      .replace(/到场时限/, "")
      .replace(/完成时限/, "")
      .split("\n")[1];
    const wcsx = (workTextTemplate as string)
      .match(/完成时限[\s\S]*反映区名/)![0]
      .replace(/完成时限/, "")
      .replace(/反映区名/, "")
      .split("\n")[1];
    const fyqm = (workTextTemplate as string)
      .match(/反映区名[\s\S]*用水性质/)![0]
      .replace(/反映区名/, "")
      .replace(/用水性质/, "")
      .split("\n")[1];
    const ysxz = (workTextTemplate as string)
      .match(/用水性质[\s\S]*反映方式/)![0]
      .replace(/用水性质/, "")
      .replace(/反映方式/, "")
      .split("\n")[1];
    const fyfs = (workTextTemplate as string)
      .match(/反映方式[\s\S]*来电电话/)![0]
      .replace(/反映方式/, "")
      .replace(/来电电话/, "")
      .split("\n")[1];
    const lddh = (workTextTemplate as string)
      .match(/来电电话[\s\S]*案卷号/)![0]
      .replace(/来电电话/, "")
      .replace(/案卷号/, "")
      .split("\n")[1];
    const ajh =
      (workTextTemplate as string)
        // 去掉标签之后的内容
        .match(/案卷号[\s\S]*标签/)![0]
        .replace(/标签[\s\S]*$/, "")
        // 去掉案卷号
        .replace(/案卷号/, "")
        // 去掉标签
        .replace(/标签/, "")
        // 去掉空行
        .trim() || "无案卷号";
    const bq = (workTextTemplate as string)
      .match(/标签[\s\S]*备注/)![0]
      .replace(/标签/, "")
      .replace(/备注/, "")
      .split("\n")[1];
    const bz = (workTextTemplate as string)
      .match(/备注[\s\S]*$/)![0]
      .replace(/备注/, "")
      .split("\n")[1];
    workForm.value.workIdentifier = ajbh;
    workForm.value.workType = ywlx;
    workForm.value.workSource = fyly;
    workForm.value.workContent = fynr;
    workForm.value.contactPerson = lxr;
    workForm.value.contactPhone = lxdh;
    workForm.value.workAddress = fydz;
    workForm.value.householdNumber = hh;
    workForm.value.waterMeterNumber = bsh;
    workForm.value.arrivalTimeLimit = dcsx;
    workForm.value.completionTimeLimit = wcsx;
    workForm.value.workArea = fyqm;
    workForm.value.waterUseNature = ysxz;
    workForm.value.workMode = fyfs;
    workForm.value.callerPhone = lddh;
    workForm.value.fileNo = ajh;
    workForm.value.label = bq;
    workForm.value.remark = bz;
    console.log(ajh);

    // console.log(
    //   "%33反映时间\n" + ajbh + "\n",
    //   "%33业务类型\n" + ywlx + "\n",
    //   "%33反映来源\n" + fyly + "\n",
    //   "%33反映内容\n" + fynr + "\n",
    //   "%33联系人\n" + lxr + "\n",
    //   "%33联系电话\n" + lxdh + "\n",
    //   "%33反映地址\n" + fydz + "\n",
    //   "%33户号\n" + hh + "\n",
    //   "%33表身号\n" + bsh + "\n",
    //   "%33到场时限\n" + dcsx + "\n",
    //   "%33完成时限\n" + wcsx + "\n",
    //   "%33反映区名\n" + fyqm + "\n",
    //   "%33用水性质\n" + ysxz + "\n",
    //   "%33反映方式\n" + fyfs + "\n",
    //   "%33来电电话\n" + lddh + "\n",
    //   "%33案卷号\n" + ajh + "\n",
    //   "%33标签\n" + bq + "\n",
    //   "%33备注\n" + bz + "\n"
    // );
    console.timeEnd("workTextTemplateParser");
  } catch (error) {
    // @ts-ignore
    ElMessage.error("工单模板解析失败");
    return;
  }
}
console.log(personList.getPersonList);
onMounted(async () => {
  assigneeList.value = personList.getPersonList;
  // workTextTemplateParser(defaultWorkTextTemplate.value);
  // workText.value = defaultWorkTextTemplate.value;
});
</script>
<template>
  <div class="page">
    <title-com>
      <template #title>
        <span>数据可视化</span>
      </template>
    </title-com>
    <div
      style="
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
      "
    >
      <div style="padding: 12px 16px; background: transparent">
        <el-input
          type="textarea"
          :autosize="false"
          clearable
          rows="10"
          v-model="workText"
          placeholder="请输入工单内容"
          style="padding-bottom: 8px"
        ></el-input>
        <el-button @click="workTextTemplateParser(workText)" type="primary">
          识别
        </el-button>
      </div>
      <div style="background: transparent; padding: 12px 16px">
        <h2>新建工单</h2>
        <div style="display: flex; flex-direction: row">
          <div>
            <div style="width: 300px">
              <label for="workIdentifier">工单编号</label>
              <el-input
                id="workIdentifier"
                width="500px"
                v-model="workForm.workIdentifier"
                placeholder="请输入工单编号"
              ></el-input>
            </div>
            <div>
              <label for="workType">业务类型</label>
              <el-input
                id="workType"
                v-model="workForm.workType"
                placeholder="请输入业务类型"
              ></el-input>
            </div>
            <div>
              <label for="workSource">反映来源</label>
              <el-input
                id="workSource"
                v-model="workForm.workSource"
                placeholder="请输入反映来源"
              ></el-input>
            </div>
            <div>
              <label for="workContent">反映内容</label>
              <el-input
                id="workContent"
                v-model="workForm.workContent"
                placeholder="请输入反映内容"
              ></el-input>
            </div>
            <div>
              <label for="contactPerson">联系人</label>
              <el-input
                id="contactPerson"
                v-model="workForm.contactPerson"
                placeholder="请输入联系人"
              ></el-input>
            </div>
            <div>
              <label for="contactPhone">联系电话</label>
              <el-input
                id="contactPhone"
                v-model="workForm.contactPhone"
                placeholder="请输入联系电话"
              ></el-input>
            </div>
            <div>
              <label for="workAddress">反映地址</label>
              <el-input
                id="workAddress"
                v-model="workForm.workAddress"
                placeholder="请输入反映地址"
              ></el-input>
            </div>
            <div>
              <label for="householdNumber">户号</label>
              <el-input
                id="householdNumber"
                v-model="workForm.householdNumber"
                placeholder="请输入户号"
              ></el-input>
            </div>
            <div>
              <label for="waterMeterNumber">表身号</label>
              <el-input
                id="waterMeterNumber"
                v-model="workForm.waterMeterNumber"
                placeholder="请输入表身号"
              ></el-input>
            </div>
            <div>
              <label for="arrivalTimeLimit">到场时限</label>
              <el-input
                id="arrivalTimeLimit"
                type="textarea"
                :autosize="true"
                v-model="workForm.arrivalTimeLimit"
                placeholder="请输入到场时限"
              ></el-input>
            </div>
            <div>
              <label for="completionTimeLimit">完成时限</label>
              <el-input
                id="completionTimeLimit"
                type="textarea"
                :autosize="true"
                v-model="workForm.completionTimeLimit"
                placeholder="请输入完成时限"
              ></el-input>
            </div>
          </div>
          <div style="padding-left: 16px">
            <div style="width: 300px">
              <label for="workArea">反映区名</label>
              <el-input
                id="workArea"
                v-model="workForm.workArea"
                placeholder="请输入反映区名"
              ></el-input>
            </div>
            <div>
              <label for="waterUseNature">用水性质</label>
              <el-input
                id="waterUseNature"
                v-model="workForm.waterUseNature"
                placeholder="请输入用水性质"
              ></el-input>
            </div>
            <div>
              <label for="workMode">反映方式</label>
              <el-input
                id="workMode"
                v-model="workForm.workMode"
                placeholder="请输入反映方式"
              ></el-input>
            </div>
            <div>
              <label for="callerPhone">来电电话</label>
              <el-input
                id="callerPhone"
                v-model="workForm.callerPhone"
                placeholder="请输入来电电话"
              ></el-input>
            </div>
            <div>
              <label for="fileNo">案卷号</label>
              <el-input
                id="fileNo"
                v-model="workForm.fileNo"
                placeholder="请输入案卷号"
              ></el-input>
            </div>
            <div>
              <label for="label">标签</label>
              <el-input
                id="label"
                v-model="workForm.label"
                placeholder="请输入标签"
              ></el-input>
            </div>
            <div>
              <label for="remark">备注</label>
              <el-input
                id="remark"
                type="textarea"
                :autosize="true"
                v-model="workForm.remark"
                placeholder="请输入备注"
              ></el-input>
            </div>
            <div>
              <div>
                <label for="status">状态</label>
              </div>
              <!-- <el-input
                id="status"
                v-model="workForm.status"
                placeholder="请输入状态"
              ></el-input> -->
              <el-select
                id="status"
                v-model="workForm.status"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div>
              <div>
                <label for="assignee">指派人员</label>
              </div>
              <!-- <el-input
                v-model="workForm.assignee"
                placeholder="请输入指派人员"
              ></el-input> -->
              <el-select
                id="assignee"
                v-model="workForm.assignee"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in assigneeList"
                  :key="item.value"
                  :label="item.personName"
                  :value="
                    JSON.stringify({ wx: item.personWx, name: item.personName })
                  "
                ></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <el-button style="margin-top: 8px" type="primary" @click="submitWork">
          提交
        </el-button>
      </div>
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

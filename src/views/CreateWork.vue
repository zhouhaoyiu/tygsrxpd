<!-- eslint-disable no-undef -->
<script setup lang="ts">
import { onMounted, ref, type Ref } from "vue";
// import { ElMessage } from "element-plus";
import usePersonList from "@/stores/personList";
const personList = usePersonList();
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

let submitWork = async () => {
  let res = await fetch("http://localhost:5000/createWork", {
    method: "POST",
    body: JSON.stringify(workForm.value),
  });
  let data = await res.json();
  console.log(data);

  if (data.success) {
    // @ts-ignore
    ElMessage.success("创建成功");
  } else {
    // @ts-ignore
    ElMessage.error("创建失败");
  }
};
let assigneeList: Ref<Record<string, any>[]> = ref([]);
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
  try {
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
      .trim();
    const bz = (workTextTemplate as string)
      .match(/备注[\s\S]*$/)![0]
      .replace(/备注/, "")
      .trim();
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
      "%33标签\n" + bq + "\n",
      "%33备注\n" + bz + "\n"
    );
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
  workTextTemplateParser(workTextTemplate.value);
});

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
});
</script>
<template>
  <div class="page">
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
          <div>
            工单编号
            <el-input
              v-model="workForm.workIdentifier"
              placeholder="请输入工单编号"
            ></el-input>
          </div>
          <div>
            业务类型
            <el-input
              v-model="workForm.workType"
              placeholder="请输入业务类型"
            ></el-input>
          </div>
          <div>
            反映来源
            <el-input
              v-model="workForm.workSource"
              placeholder="请输入反映来源"
            ></el-input>
          </div>
          <div>
            反映内容
            <el-input
              v-model="workForm.workContent"
              placeholder="请输入反映内容"
            ></el-input>
          </div>
          <div>
            联系人
            <el-input
              v-model="workForm.contactPerson"
              placeholder="请输入联系人"
            ></el-input>
          </div>
          <div>
            联系电话
            <el-input
              v-model="workForm.contactPhone"
              placeholder="请输入联系电话"
            ></el-input>
          </div>
          <div>
            反映地址
            <el-input
              v-model="workForm.workAddress"
              placeholder="请输入反映地址"
            ></el-input>
          </div>
          <div>
            户号
            <el-input
              v-model="workForm.householdNumber"
              placeholder="请输入户号"
            ></el-input>
          </div>
          <div>
            表身号
            <el-input
              v-model="workForm.waterMeterNumber"
              placeholder="请输入表身号"
            ></el-input>
          </div>
          <div>
            到场时限
            <el-input
              v-model="workForm.arrivalTimeLimit"
              placeholder="请输入到场时限"
            ></el-input>
          </div>
          <div>
            完成时限
            <el-input
              v-model="workForm.completionTimeLimit"
              placeholder="请输入完成时限"
            ></el-input>
          </div>
        </div>
        <div style="padding-left: 16px">
          <div>
            反映区名
            <el-input
              v-model="workForm.workArea"
              placeholder="请输入反映区名"
            ></el-input>
          </div>
          <div>
            用水性质
            <el-input
              v-model="workForm.waterUseNature"
              placeholder="请输入用水性质"
            ></el-input>
          </div>
          <div>
            反映方式
            <el-input
              v-model="workForm.workMode"
              placeholder="请输入反映方式"
            ></el-input>
          </div>
          <div>
            来电电话
            <el-input
              v-model="workForm.callerPhone"
              placeholder="请输入来电电话"
            ></el-input>
          </div>
          <div>
            案卷号
            <el-input
              v-model="workForm.fileNo"
              placeholder="请输入案卷号"
            ></el-input>
          </div>
          <div>
            标签
            <el-input
              v-model="workForm.label"
              placeholder="请输入标签"
            ></el-input>
          </div>
          <div>
            备注
            <el-input
              v-model="workForm.remark"
              placeholder="请输入备注"
            ></el-input>
          </div>
          <div>
            状态
            <el-input
              v-model="workForm.status"
              placeholder="请输入状态"
            ></el-input>
          </div>
          <div>
            <div>指派人员</div>
            <!-- <el-input
              v-model="workForm.assignee"
              placeholder="请输入指派人员"
            ></el-input> -->
            <el-select
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
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  height: 100vh;
  overflow-x: auto;
  overflow-y: hidden;
  background-color: #f5f5f5;
  padding: 16px;
}
</style>

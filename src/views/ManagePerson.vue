<!-- eslint-disable no-undef -->
<script setup lang="ts">
import usePersonList from "@/stores/personList";
import { onMounted, ref, type Ref } from "vue";

type TPerson = {
  personId: string;
  personName: string;
  personWx: string;
};

const { personList } = usePersonList();
let PersonList = ref([]) as any;
let personEditDialogVisible = ref(false) as Ref<boolean>;
let personInfoForm = ref({
  personId: "",
  personName: "",
  personWx: "",
}) as Ref<TPerson>;
let addPersonForm = ref({
  personId: "",
  personName: "",
  personWx: "",
}) as Ref<TPerson>;
const editPerson = (personId: string) => {
  console.log(personId);
  personEditDialogVisible.value = true;
  const person = (personList as unknown as TPerson[]).find(
    (item: TPerson) => item.personId === personId
  ) || {
    personId: "",
    personName: "",
    personWx: "",
  };
  personInfoForm.value = person;
};

const deletePerson = async (personId: string) => {
  // @ts-ignore
  const res = await ElMessageBox.confirm("确认删除吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  });

  if (res === "confirm") {
    const result = await fetch("http://localhost:5000/deletePerson", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personId,
      }),
    });
    const data = await result.json();
    if (data.success) {
      // @ts-ignore
      ElMessage.success("删除成功");
      PersonList.value = PersonList.value.filter(
        (item: TPerson) => item.personId !== personId
      );
    } else {
      // @ts-ignore
      ElMessage.error("删除失败");
    }
  } else {
    // @ts-ignore
    ElMessage.success("取消删除");
  }
};

const addPerson = async () => {
  // 检查addPersonForm是否为空
  if (!addPersonForm.value.personName || !addPersonForm.value.personWx) {
    // @ts-ignore
    ElMessage.error("请填写完整信息");
    return;
  }
  const result = await fetch("http://localhost:5000/addPerson", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personInfo: addPersonForm.value,
    }),
  });
  const data = await result.json();
  if (data.success) {
    // @ts-ignore
    ElMessage.success("添加成功");
    PersonList.value = [...PersonList.value, addPersonForm.value];
  } else {
    // @ts-ignore
    ElMessage.error("添加失败");
  }
};

const submitPersonInfo = async (): Promise<void> => {
  console.log(personInfoForm.value);
  // @ts-ignore
  const res = await ElMessageBox.confirm("确认提交更改吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  });
  if (res === "confirm") {
    const result = await fetch("http://localhost:5000/changePerson", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personInfo: personInfoForm.value,
      }),
    });
    const data = await result.json();

    if (data.success) {
      // @ts-ignore
      ElMessage.success("提交成功");
      personEditDialogVisible.value = false;
    } else {
      // @ts-ignore
      ElMessage.error("提交失败");
    }
  } else {
    // @ts-ignore
    ElMessage.success("取消提交");
  }
};
onMounted(async () => {
  console.log(personList);
  PersonList.value = personList;
});
</script>

<template>
  <div class="page">
    <title-com>
      <template #title>
        <span>人员管理</span>
      </template>
    </title-com>
    <div style="display: flex; width: 60%">
      <div
        style="
          display: flex;
          flex-direction: column;
          width: 40%;
          margin: 0 5%;
          align-items: center;
          justify-content: center;
          background: white;
          border-radius: 8px;
          box-shadow: 1px 1px 8px 1px #eee;
        "
      >
        <h1 style="margin-bottom: 10px">新增人员</h1>
        <el-input
          placeholder="请输入人员姓名"
          v-model="addPersonForm.personName"
          style="width: 200px; margin-bottom: 10px"
        />
        <el-input
          placeholder="请输入人员微信"
          v-model="addPersonForm.personWx"
          style="width: 200px; margin-bottom: 20px"
        />
        <el-button type="primary" @click="addPerson"> 提交 </el-button>
      </div>
      <div style="width: 50%">
        <el-table
          height="500"
          size="small"
          stripe
          border
          :data="PersonList"
          style="
            font-size: 12px;
            text-align: center;
            border-radius: 8px;
            box-shadow: 1px 1px 8px 1px #eee;
          "
        >
          <el-table-column align="center" prop="personName" label="人员姓名">
          </el-table-column>
          <el-table-column align="center" prop="personWx" label="人员微信">
          </el-table-column>
          <!-- 操作区 删除/编辑 -->
          <el-table-column align="center" label="操作">
            <template #default="scope">
              <el-button
                type="primary"
                size="small"
                auto-insert-space
                @click="($event: Event) => editPerson(scope.row.personId)"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                size="small"
                auto-insert-space
                @click="($event: Event)=>deletePerson(scope.row.personId)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog v-model="personEditDialogVisible" title="Shipping address">
      <el-form :model="personInfoForm">
        <el-form-item label="人员姓名">
          <el-input v-model="personInfoForm.personName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="人员微信">
          <el-input v-model="personInfoForm.personWx" autocomplete="off"
        /></el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="($event: Event) =>personEditDialogVisible = false"
            >取消</el-button
          >
          <el-button
            type="primary"
            @click="($event: Event) => submitPersonInfo()"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
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

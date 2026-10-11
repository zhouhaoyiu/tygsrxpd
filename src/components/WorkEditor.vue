<script setup lang="ts">
import type { WorkRecord, Person } from "@/types/domain";
import { fields } from "@/workflow";
const props = defineProps<{
  modelValue: WorkRecord;
  people: Person[];
  editing?: boolean;
  statuses: string[];
  disabled?: boolean;
}>();
const emit = defineEmits<{ "update:modelValue": [value: WorkRecord] }>();
function set(key: keyof WorkRecord, value: string) {
  emit("update:modelValue", { ...props.modelValue, [key]: value });
}
function selectedId() {
  try {
    return String(JSON.parse(props.modelValue.assignee || "{}").id || "");
  } catch {
    return "";
  }
}
function setPerson(id: string) {
  const p = props.people.find((p) => String(p.personId) === id);
  set(
    "assignee",
    p
      ? JSON.stringify({ id: p.personId, name: p.personName, wx: p.personWx })
      : "",
  );
}
</script>
<template>
  <fieldset :disabled="disabled" class="form-grid">
    <label
      v-for="[key, label] in fields"
      :key="key"
      :class="{ wide: ['workContent', 'workAddress', 'remark'].includes(key) }"
      >{{ label
      }}<span
        v-if="['workIdentifier', 'workContent', 'workAddress'].includes(key)"
        class="required"
      >
        *</span
      >
      <textarea
        v-if="['workContent', 'remark'].includes(key)"
        :value="modelValue[key]"
        rows="3"
        @input="set(key, ($event.target as HTMLTextAreaElement).value)" />
      <input
        v-else
        :value="modelValue[key]"
        :readonly="editing && key === 'workIdentifier'"
        :required="['workIdentifier', 'workAddress'].includes(key)"
        @input="set(key, ($event.target as HTMLInputElement).value)"
    /></label>
    <label
      >办理人<select
        :value="selectedId()"
        @change="setPerson(($event.target as HTMLSelectElement).value)"
      >
        <option value="">未指派</option>
        <option
          v-for="p in people"
          :key="p.personId"
          :value="String(p.personId)"
        >
          {{ p.personName }}
        </option>
      </select></label
    >
    <label
      >工单状态<select
        :value="modelValue.status"
        @change="set('status', ($event.target as HTMLSelectElement).value)"
      >
        <option v-for="state in statuses" :key="state">{{ state }}</option>
      </select></label
    >
  </fieldset>
</template>

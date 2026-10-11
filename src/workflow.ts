import type { WorkRecord } from "./types/domain";
export const fields = [
  ["workIdentifier", "案件编号"],
  ["workType", "业务类型"],
  ["workSource", "反映来源"],
  ["workContent", "反映内容"],
  ["contactPerson", "联系人"],
  ["contactPhone", "联系电话"],
  ["workAddress", "反映地址"],
  ["householdNumber", "户号"],
  ["waterMeterNumber", "表身号"],
  ["arrivalTimeLimit", "到场时限"],
  ["completionTimeLimit", "完成时限"],
  ["workArea", "反映区名"],
  ["waterUseNature", "用水性质"],
  ["workMode", "反映方式"],
  ["callerPhone", "来电电话"],
  ["fileNo", "案卷号"],
  ["label", "标签"],
  ["remark", "备注"],
] as const;
export const transitions: Record<string, string[]> = {
  待接单: ["待到场", "已挂起", "已终止", "已作废"],
  待到场: ["待处理", "已挂起", "已终止"],
  待处理: ["待回访", "已挂起", "已终止"],
  待回访: ["已完成", "待处理"],
  已挂起: ["待接单", "待到场", "待处理", "已终止"],
  已完成: ["待处理"],
  已终止: [],
  已作废: [],
};
export function emptyWork(): WorkRecord {
  return {
    ...Object.fromEntries(fields.map(([key]) => [key, ""])),
    status: "待接单",
    assignee: "",
    createTime: "",
  } as WorkRecord;
}
export function parseWork(text: string): Partial<WorkRecord> {
  const result: Record<string, string> = {};
  let key = "";
  for (const line of text.replace(/\r/g, "").split("\n")) {
    const label = fields.find(([, label]) => label === line.trim());
    if (label) {
      key = label[0];
      result[key] = "";
    } else if (key) result[key] += (result[key] ? "\n" : "") + line;
  }
  return Object.fromEntries(
    Object.entries(result).map(([key, value]) => [key, value.trim()]),
  );
}
export function overdue(work: WorkRecord, now = Date.now()) {
  if (["已完成", "已终止", "已作废"].includes(work.status)) return false;
  const match = work.completionTimeLimit.match(
    /\d{4}[-/]\d{1,2}[-/]\d{1,2}(?:[ T]\d{1,2}:\d{2})?/,
  );
  if (!match) return false;
  const timestamp = new Date(
    match[0].replace(/-/g, "/").replace("T", " "),
  ).getTime();
  return Number.isFinite(timestamp) && timestamp < now;
}

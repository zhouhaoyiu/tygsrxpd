export interface Person {
  personId: string;
  personName: string;
  personWx: string;
}

export interface WorkRecord {
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
  createTime: string;
}

export function getAssigneeName(value: string): string {
  try {
    const parsed: unknown = JSON.parse(value || "{}");
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "name" in parsed &&
      typeof parsed.name === "string" &&
      parsed.name
    ) {
      return parsed.name;
    }
  } catch {
    // Invalid legacy values are displayed as unassigned.
  }

  return "未指派";
}

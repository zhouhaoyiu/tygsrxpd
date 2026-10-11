import { describe, expect, it } from "vitest";
import { emptyWork, parseWork, overdue, transitions } from "../workflow";
describe("dispatch workflow", () => {
  it("parses multiline content without swallowing adjacent empty fields", () => {
    const work = parseWork("案件编号\nDEMO-1\n反映内容\n第一行\n第二行\n联系人\n\n联系电话\n000\n反映地址\n演示街道");
    expect(work.workContent).toBe("第一行\n第二行");
    expect(work.contactPerson).toBe("");
    expect(work.workAddress).toBe("演示街道");
  });
  it("does not erase unmentioned fields", () => { expect(parseWork("无效内容")).toEqual({}); });
  it("new forms do not share references", () => { const a=emptyWork(); a.workContent="one"; expect(emptyWork().workContent).toBe(""); });
  it("does not mark finished or undated work overdue", () => {
    const work={...emptyWork(), completionTimeLimit:"2020-01-01 12:00(24小时)"};
    expect(overdue(work)).toBe(true);
    expect(overdue({...work,status:"已完成"})).toBe(false);
    expect(overdue({...work,completionTimeLimit:""})).toBe(false);
  });
  it("requires a visit before completion", () => { expect(transitions["待处理"]).not.toContain("已完成"); expect(transitions["待回访"]).toContain("已完成"); });
});

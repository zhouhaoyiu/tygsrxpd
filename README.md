# 太原供水热线派单

Vue 3 工作台，与 rxpd-server 配套使用。

运行 `pnpm install`，设置 `VITE_API_BASE` 后运行 `pnpm dev`。同域部署可将 /api 代理到后端。默认不连接生产服务。

新建工单保留按账号保存的本机草稿。人员新增使用服务端编号，人员停用保留历史。工单详情通过 URL 编号读取；转派和状态变更填写原因，修改带版本号，归档不删除记录。

后端需执行工作流迁移并配置账号。微信通知未启用。

验证：`pnpm test:unit`、`pnpm type-check`、`pnpm build`。

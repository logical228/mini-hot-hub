# Mock 数据备份

`hot.json` 为本地静态备份，**应用运行时不读取此文件**。

前端通过 `GET /api/hot` 获取热榜；后端 Mock 数据见 `server/src/services/`。

如需离线调试，可临时在 `useHotList` 中切换为 import 本文件。

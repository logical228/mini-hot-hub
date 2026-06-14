# 迷你今日热榜 · Mini Hot Hub

多平台热搜聚合门户（微博 / 知乎 / B站），前后端分离架构。

| 目录 | 说明 | 默认端口 |
|---|---|---|
| `client/` | React + TypeScript + Vite 前端 | 5173 |
| `server/` | Node.js + Express 后端 | 3001 |

---

## 环境要求

- **Node.js** ≥ 18
- **npm** ≥ 9

---

## 安装依赖

前后端各自独立管理依赖。推荐在**项目根目录**一键安装：

```bash
# 根目录：安装 concurrently（用于 npm run dev）
npm install

# 安装 client + server 依赖
npm run install:all
```

也可分别在子目录安装：

```bash
cd client && npm install
cd server && npm install
```

首次克隆仓库后，需完成上述安装后再启动开发环境。

---

## 启动开发环境

**前后端需同时运行**，前端通过 Vite 代理将 `/api` 转发至后端。

### 方式一：根目录一条命令（推荐）

在项目根目录执行：

```bash
npm run dev
```

等同于同时启动 `dev:client`（5173）与 `dev:server`（3001）。也可单独启动：

```bash
npm run dev:server   # 仅后端
npm run dev:client   # 仅前端
```

浏览器打开 http://localhost:5173/

### 方式二：两个终端

**终端 1 — 后端**

```bash
cd server
npm run dev
```

看到 `Server listening on http://localhost:3001` 即表示成功。

**终端 2 — 前端**

```bash
cd client
npm run dev
```

看到 `Local: http://localhost:5173/` 后，在浏览器打开该地址。

### 方式三：生产模式预览

```bash
# 构建并启动后端
cd server
npm run build
npm run start:prod

# 构建并预览前端
cd client
npm run build
npm run preview
```

---

## API 速览

| 接口 | 说明 |
|---|---|
| `GET /api/health` | 健康检查 |
| `GET /api/hot` | 全部平台 `{ platforms: [...] }` |
| `GET /api/hot/weibo` | 微博热搜 |
| `GET /api/hot/zhihu` | 知乎热榜 |
| `GET /api/hot/bilibili` | B站热搜 |

本地可直接访问 http://localhost:3001/api/hot 验证后端是否正常。

---

## 数据来源说明

本项目的榜单数据由**后端服务端**从各平台公开 JSON 接口抓取，经统一解析为 `HotPlatform` 结构后返回前端。浏览器不直接请求第三方域名。

### 各平台获取方式

| 平台 | 榜单 | 上游 JSON 接口 | 后端缓存 Key |
|---|---|---|---|
| 微博 | 微博热搜榜 | `https://weibo.com/ajax/side/hotSearch` | `weibo:hot` |
| 知乎 | 知乎热榜 | `https://api.zhihu.com/topstory/hot-list` | `zhihu:hot` |
| B站 | B站热搜 | `https://api.bilibili.com/x/web-interface/search/square?limit=50` | `bilibili:hot` |

实现代码见 `server/src/services/weibo.ts`、`zhihu.ts`、`bilibili.ts`。各平台均使用 Node.js 内置 `fetch` 请求 JSON 接口，**不解析 HTML 网页**。

开发环境可通过单平台强制跳过缓存（仅 `NODE_ENV !== production` 时生效）：

```bash
GET /api/hot/weibo?refresh=1
```

### 更新频率（缓存 TTL）

| 配置项 | 环境变量 | 默认值 | 说明 |
|---|---|---|---|
| 缓存 TTL | `CACHE_TTL` | `600`（秒） | 每个平台独立缓存，默认 **10 分钟** 内复用同一份数据 |
| 上游超时 | `FETCH_TIMEOUT` | `5000`（毫秒） | 单次抓取超时时间 |

### 开发环境：模拟平台失败（验证 error 卡片）

仅在 `NODE_ENV !== production` 时生效。设置后对应平台**跳过缓存**，每次请求均返回 `error: true` 的 `HotPlatform`，其他平台不受影响。

| 环境变量 | 说明 |
|---|---|
| `MOCK_FAIL_WEIBO=1` | 模拟微博抓取失败 |
| `MOCK_FAIL_ZHIHU=1` | 模拟知乎抓取失败 |
| `MOCK_FAIL_BILIBILI=1` | 模拟 B 站抓取失败 |
| `MOCK_FAIL_ALL=1` | 模拟全部平台失败 |

**Windows PowerShell 示例**（在 `server/` 目录）：

```powershell
$env:MOCK_FAIL_WEIBO = "1"
npm run dev
```

**macOS / Linux**：

```bash
MOCK_FAIL_WEIBO=1 npm run dev
```

启动后终端会输出 `[dev] 模拟抓取失败已启用: weibo`。浏览器刷新首页即可看到微博卡片 error 态；知乎 / B 站卡片仍正常。

可将变量写入 `server/.env.example` 所示格式，配合 shell 导出或 IDE 运行配置使用（本仓库未内置 dotenv，需自行注入环境变量）。

- 各平台缓存**互相独立**：刷新微博（`?refresh=1`）不会清除知乎 / B 站缓存。
- 缓存命中时，响应头 `X-Cache: HIT`，JSON 中 `fromCache: true`；`updatedAt` 为写入缓存时的快照时间，缓存有效期内保持不变。
- 缓存未命中或过期后，后端重新请求上游 JSON 并更新 `updatedAt`。

### 学习项目免责声明

- 本项目为**个人学习 / 技术交流**用途，**非商用**，不对数据的准确性、完整性、时效性作任何保证。
- 榜单内容版权归原作者及各平台所有；本项目仅作聚合展示，不代表任何官方立场。
- 请通过各平台官方页面访问原文：
  - [微博热搜](https://s.weibo.com/top/summary)
  - [知乎热榜](https://www.zhihu.com/hot)
  - [B站热搜](https://www.bilibili.com/v/popular/rank/all)
- 上游接口可能随平台策略变更；若抓取失败，接口返回 `error: true` 及友好提示，不影响其他平台卡片展示。

---

## 常见问题

### 1. 前端打不开（localhost:5173 无法访问）

**原因**：Vite 开发服务器未启动，或之前启动的进程已退出。

**处理**：

```bash
cd client
npm run dev
```

确认终端保持运行，不要关闭。

---

### 2. 端口被占用

**现象**：

- 前端：`Port 5173 is in use`（Vite 可能自动改用 5174 等端口）
- 后端：`EADDRINUSE: address already in use :::3001`

**处理**：

1. 查看终端实际输出的端口号（前端若被占用会换端口）
2. 结束占用进程，或修改端口：

**Windows（PowerShell）— 查看占用 3001 的进程**

```powershell
Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | Select-Object OwningProcess
Stop-Process -Id <PID> -Force
```

**后端换端口**

```bash
# Windows PowerShell
$env:PORT=3002; npm run dev

# macOS / Linux
PORT=3002 npm run dev
```

若修改后端端口，需同步更新 `client/vite.config.ts` 中的 `proxy.target`。

---

### 3. 代理不生效（页面加载失败 / API 请求 404 或 Network Error）

开发环境下，浏览器请求 `http://localhost:5173/api/*` 应由 Vite 代理到 `http://localhost:3001`。

**排查清单**：

| 检查项 | 说明 |
|---|---|
| 后端是否已启动 | 先确认 http://localhost:3001/api/health 返回 `{ "ok": true }` |
| 是否只启动了前端 | 仅 `client/npm run dev` 不够，必须同时运行 `server/npm run dev` |
| 请求路径是否正确 | 前端应请求 `/api/hot`，不要写死后端完整 URL（开发环境） |
| 是否重启过 Vite | 修改 `vite.config.ts` 后需重启 `npm run dev` |
| 端口是否一致 | `vite.config.ts` 中 `target` 须与后端实际端口一致（默认 3001） |

**代理配置**（`client/vite.config.ts`）：

```ts
proxy: {
  '/api': {
    target: 'http://localhost:3001',
    changeOrigin: true,
  },
},
```

**注意**：Vite 代理**仅在开发模式**（`npm run dev`）生效。生产构建需配置 `VITE_API_BASE` 指向后端地址，参见 `client/.env.example`。

---

### 4. 页面空白或「加载失败，请稍后重试」

1. 打开浏览器开发者工具 → Network，查看 `/api/hot` 请求状态
2. 若状态为 `(failed)` 或 `502`：后端未启动或代理 target 错误
3. 若状态为 `404`：检查后端路由与请求路径是否匹配

---

## Railway 部署（从仓库根目录启动 server）

本项目前后端分离：**Railway 仅部署 `server/`**，前端可另行部署到 Vercel / Netlify 等，并通过 `VITE_API_BASE` 指向 Railway 后端地址。

在 Railway 新建 Service，连接本仓库，**Root Directory 留空**（使用仓库根目录 `/`），配置如下：

| Railway 配置项 | 推荐值 | 说明 |
|---|---|---|
| **Root Directory** | `/`（默认，不填） | 从 monorepo 根目录构建 |
| **Build Command** | `npm install --prefix server && npm run build --prefix server` | 安装 server 依赖并 `tsc` 编译到 `server/dist/` |
| **Start Command** | `npm run start:prod --prefix server` | 等价于 `node server/dist/index.js` |
| **Watch Paths** | `server/**` | 可选；仅 server 变更时触发 redeploy |

也可使用根目录 `package.json` 中的脚本（需先在 Build 中安装根依赖）：

| Railway 配置项 | 值 |
|---|---|
| **Build Command** | `npm install && npm run install:all && npm run build:server` |
| **Start Command** | `npm run start:server` |

**环境变量**（Railway → Variables）：

| 变量 | 说明 |
|---|---|
| `PORT` | Railway 自动注入，无需手动设置 |
| `CACHE_TTL` | 缓存秒数，默认 `600` |
| `FETCH_TIMEOUT` | 上游超时毫秒，默认 `5000` |
| `NODE_ENV` | 设为 `production` |

部署完成后访问 `https://<your-app>.up.railway.app/api/health` 应返回 `{ "ok": true }`。

> **说明**：若将 Root Directory 设为 `server`，Build / Start 可简化为 `npm install && npm run build` 与 `npm run start:prod`，与从根目录部署效果相同。

---

## 根目录脚本速查

在项目根目录 `package.json` 中提供：

| 命令 | 说明 |
|---|---|
| `npm run install:all` | 安装 client + server 依赖 |
| `npm run dev` | concurrently 同时启动前后端 |
| `npm run dev:client` | 仅 Vite 前端 |
| `npm run dev:server` | 仅 Express 后端 |
| `npm run build` | 先后构建 server、client |
| `npm run build:server` | 仅编译后端 |
| `npm run build:client` | 仅构建前端 |
| `npm run start:server` | 生产模式启动后端（`node server/dist/index.js`） |

---

## 项目文档

- [PRD.md](./PRD.md) — 产品需求
- [TECH_DESIGN.md](./TECH_DESIGN.md) — 技术设计
- [AGENTS.md](./AGENTS.md) — 开发规范

---

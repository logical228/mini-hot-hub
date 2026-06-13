# 🤖 今日热搜 · AI 开发指令（AGENTS.md）

> **文档版本**：v1.0
> **创建日期**：2025-06-11
> **关联文档**：[RESEARCH.md](./RESEARCH.md) | [PRD.md](./PRD.md) | [TECH_DESIGN.md](./TECH_DESIGN.md)

---

## 📌 项目概述

使用 **React 18 + TypeScript + Vite + Tailwind CSS** 开发前端；
使用 **Node.js 18 + Express 5** 开发后端；
聚合 **微博热搜 / 知乎热榜 / B 站热搜** 三大平台热榜数据。

**项目目标**：生成「高大上」的热搜聚合门户，视觉精致、交互流畅、代码质量高。

---

## 📐 一、开发规范

### 1.1 通用规范
- 全程使用 **TypeScript**，前后端类型与 `TECH_DESIGN.md` 中定义的 `HotItem` / `HotPlatform` 严格一致
- 禁止使用 `any`，所有接口响应必须有类型定义
- 前后端共享类型定义（通过 `types/` 目录，后端可软链接或复制）

### 1.2 前端规范
- 使用 **函数式组件 + Hooks**，禁止使用 Class Component
- 状态管理优先使用 **React Query（@tanstack/react-query）** 做数据 fetching + 缓存
- 样式方案：**Tailwind CSS**（快速布局）+ **CSS Modules**（组件级定制样式）
- 每个组件单文件，配套 `.module.css`（如需）
- 组件命名 **PascalCase**，工具函数命名 **camelCase**

### 1.3 后端规范
- 使用 **ES Module**（`import/export`），不使用 CommonJS
- 路由层（`routes/`）只做请求分发和参数校验，业务逻辑下沉到 `services/`
- 所有上游请求通过 `utils/fetcher.ts` 封装（带超时 + 重试）
- 缓存操作统一走 `utils/cache.ts`，禁止在路由中直接操作 Map

---

## 🎨 二、设计指令

### 2.1 整体视觉风格
- **关键词**：极简现代、信息密度适中、微动效、卡片式布局
- **对标质感**：Linear 的精致感 + Vercel Dashboard 的克制 + 今日热榜的信息效率
- **背景色**：`#FAFBFC`（暖白灰），卡片色 `#FFFFFF`，文字主色 `#1A1A2E`

### 2.2 卡片设计（HotCard）
- 每张卡片 **独立数据通道**，互不阻塞
- 卡片头部：平台名称（带色条 🔴🔵🩷）+ 榜单名称 + 「更新于 x 分钟前」
- **排名 TOP 1-3 视觉强调**：金色/银色/铜色徽章，`font-size` 放大 1.2x
- 卡片 Body：每条热搜 = 排名徽章 + 标题（左对齐）+ 热度值（右对齐，灰色小字）
- Hover 动效：卡片整体上浮 2px，`box-shadow` 加深
- 骨架屏：卡片加载中展示 shimmer 动画（1.5s 循环）

### 2.3 布局规范
- 桌面（≥1024px）：**3 列** Grid 布局，卡片等宽
- 平板（768-1023px）：**2 列**
- 手机（<768px）：**1 列**，卡片宽度 100%
- 全局最大宽度 `max-w-7xl`，居中

### 2.4 页脚设计
- 居中排列，小字号（`text-xs text-gray-400`）
- 内容：「学习项目 · 非商用」| 「数据来源：微博 / 知乎 / B站」| GitHub 链接

---

## 🔌 三、接口契约

| 约定 | 值 |
|---|---|
| 基地址 | 开发：`/api`（Vite 代理到 localhost:3001）；生产：`VITE_API_BASE` |
| 获取全部 | `GET /api/hot` → 返回 `{ success, data: { weibo?, zhihu?, bilibili? } }` |
| 获取单平台 | `GET /api/hot/:source` → 返回 `HotPlatform` |
| 错误格式 | `{ error: true, message: string, items: [] }` |
| 缓存头 | 响应 Header 携带 `X-Cache: HIT/MISS` |

**⛔ 严禁**：在前端直接 `fetch` 微博/知乎/B 站原始域名。

---

## ⚠️ 四、注意事项

1. **上游请求**：必须设置合理的 `User-Agent` 和 `Referer`（参照各平台文档），避免被 WAF 拦截
2. **缓存 TTL**：默认 600 秒，可通过环境变量 `CACHE_TTL` 覆盖
3. **超时控制**：上游 fetch 超时 5 秒，超时后返回 error 态，不无限等待
4. **敏感信息**：API Key / Token 等一律走环境变量（`.env`），**禁止提交到 GitHub**
5. **CORS**：生产环境后端 `Access-Control-Allow-Origin` 白名单配置，不使用 `*`
6. **页脚声明**：必须包含「学习项目 · 非商用 · 数据来源」说明

---

## 🧪 五、测试要求

### 5.1 手动验证清单（每完成一个平台必跑）

- [ ] 正常渲染 ≥ 10 条热搜数据
- [ ] 每条数据含 rank / title / url，heat 可选
- [ ] TOP 1-3 排名视觉高亮正确
- [ ] 点击标题 → 正确跳转到原文（新标签页）
- [ ] 「更新于 x 分钟前」时间计算正确

### 5.2 异常场景测试

- [ ] **单平台挂掉**：其他平台卡片正常渲染
- [ ] **全部平台挂掉**：全局 Fallback 页展示「系统维护中」+ 重试按钮
- [ ] **重复刷新**：10 秒内刷新多次 → 仅首次触发上游请求（缓存命中）
- [ ] **慢网络（3G 模拟）**：Skeleton 正确展示，不白屏

### 5.3 响应式测试

- [ ] Chrome DevTools 切换桌面 / 平板 / 手机视口，布局正确
- [ ] 手机端单列滚动流畅，无横向溢出

---

## 📋 六、文件命名与组织

| 约定 | 示例 |
|---|---|
| 组件文件 | `HotCard/index.tsx` + `HotCard.module.css` |
| Hook 文件 | `useHotList.ts` |
| 类型文件 | `types/hot.ts` |
| 服务文件 | `services/weibo.ts` |
| 工具文件 | `utils/cache.ts` |
| 测试文件 | 暂不需要（手动验证为主） |

---

## 💡 七、打卡思考

### Q1：为什么需要给 AI 写指令文件？

> **AGENTS.md 是「AI 的宪法」——它把模糊的审美判断转化为可执行的代码约束。**

具体来说：
- **消除歧义**："好看一点" 对每个人含义不同，但 `box-shadow: 0 2px 12px rgba(0,0,0,0.08)` 是精确的
- **保持一致性**：AI 每次对话是独立上下文，AGENTS.md 是跨会话的"记忆锚点"
- **提高效率**：不用每次都重复强调 "用 TypeScript""用函数式组件"，一次写入，永久生效

### Q2：三份文档分别解决什么问题？

| 文档 | 回答的问题 | 受众 |
|---|---|---|
| **RESEARCH.md** | 我们要解决什么用户痛点？市场上有没有类似产品？ | 产品思维 / 需求侧 |
| **PRD.md** | 具体要做什么功能？做到什么程度算完成？ | 产品规格 / AI Prompt 总纲 |
| **TECH_DESIGN.md** | 用什么技术？怎么架构？接口长什么样？ | 技术实现 / AI 代码生成依据 |
| **AGENTS.md** | 写代码时要遵守哪些规则？审美标准是什么？ | AI 编码助手（Cursor/Windsurf） |

**四者关系**：RESEARCH 定方向 → PRD 定功能 → TECH_DESIGN 定方案 → AGENTS 定执行标准。层层递进，缺一不可。

---

## 🚀 八、开发节奏建议

| 阶段 | 动作 | 验证方式 |
|---|---|---|
| **Step 1** | 按 TECH_DESIGN 结构初始化前后端项目 | `npm run dev` 能跑通 |
| **Step 2** | 实现后端一个平台的数据抓取 + 缓存 | Postman 调 `/api/hot/weibo` 有数据 |
| **Step 3** | 前端实现 HotCard + Skeleton + 响应式 | 浏览器能看到真实数据渲染 |
| **Step 4** | 接入全部 3 个平台 | 首页 3 张卡片全部正常 |
| **Step 5** | 打磨细节：排名高亮、Hover 动效、页脚 | 对照 PRD 逐项验收 |

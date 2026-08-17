# 北山Besson 教程检索技能 & DSH 插件

> 北山Besson（BeiShan_Besson）Minecraft 模组开发教程站 [Tomorrow-Land](https://beishanair.github.io/) 的检索技能/插件
> 数据同步日期：**2026-08-17**（站点文章 195 篇全覆盖）
> 站点：https://beishanair.github.io/ · 作者 B站：[@北山Besson](https://space.bilibili.com/489671468) · GitHub：[BeiShanair](https://github.com/BeiShanair)

## 目录结构

```
besson-tutorials/
├── README.md                        # 本文件
├── LICENSE                          # CC BY-NC-SA 4.0
├── skill/                           # ① Claude Code 技能（也可作为任何 Agent 的知识库）
│   ├── SKILL.md                     #    技能主文件（六大系列 195 篇索引 + 版本对照 + 选型建议）
│   └── references/
│       └── version-matrix.md        #    版本矩阵（JDK/Loader/构建系统，官方源核实）
├── dsh-plugin/                      # ② DeepSeek Harness（DSH）插件
│   ├── besson-tools.mjs             #    插件本体（零依赖，注册 3 个检索工具）
│   ├── preset-files/                #    整预设安装时需要的文件
│   │   └── preset.yml               #    预设元数据（名称/描述）
│   └── agent.cordis.yml.snippet     #    往现有预设追加插件行时复制此片段
├── mcp/                             # ③ MCP 服务器（任何支持 MCP 的客户端都能用）
│   ├── mcp-server.mjs               #    stdio（默认）或 HTTP（--http）双模式
│   ├── test-client.mjs              #    stdio 端到端测试
│   ├── test-http.mjs                #    HTTP 冒烟测试
│   └── package.json                 #    npm install 后即可运行
└── tools/
    ├── index_data.json              # 教程索引数据（脚本与 MCP 服务器共用）
    └── sync-data.mjs                # 站点数据更新脚本（重新生成 index_data.json / besson-tools.mjs）
```

## ① 作为 Claude Code 技能使用

```bash
# 把 skill/ 目录放到你的 Claude 技能目录（或任意 Agent 的技能目录）
cp -r skill ~/.claude/skills/besson-tutorials
```

使用效果：Agent 直接掌握教程站全部 195 篇文章的索引（Fabric 1.20.1/1.21.X/26.1、Forge 1.20.1、NeoForge 1.21.1/26.1），
能按"版本 + 主题"直接给出对应教程链接，并内置版本-Java 对照与选型建议。

## ② 作为 DeepSeek Harness（DSH）插件使用

### 方式 A：整预设安装（推荐，自带完整编码 Agent）

把 `dsh-plugin/preset-files/preset.yml` 与 `dsh-plugin/besson-tools.mjs` 放入：

```
~/.dsh/.agent-presets/<你的预设id>/
├── agent.cordis.yml     # 在文件末尾追加 agent.cordis.yml.snippet 的内容
├── preset.yml           # ← 来自本包 preset-files/
└── besson-tools.mjs     # ← 来自本包
```

然后在 DSH Web 新建会话时选择该预设。

### 方式 B：只给现有预设加工具

1. 把 `besson-tools.mjs` 复制到你的预设目录（与 `agent.cordis.yml` 同级）
2. 在 `agent.cordis.yml` 末尾追加 `agent.cordis.yml.snippet` 中的内容
3. 重启会话即可拥有 3 个工具

### 工具清单

| 工具 | 作用 | 示例参数 |
|------|------|----------|
| `besson_tutorial_lookup` | 关键词检索章节（版本/Loader/章节号/主题） | `query: "NeoForge 生物群系"`, `limit: 8` |
| `besson_tutorial_index` | 六大系列总览 + Java 版本 + 缺号 + 生态现状 | 无参数 |
| `besson_tutorial_series` | 单系列（A-F）全部章节列表 | `series: "D"` |

系列字母：A=Fabric 1.20.1（Java 17）、B=Fabric 1.21.X（Java 21）、C=Forge 1.20.1（Java 17）、
D=NeoForge 1.21.1（Java 21）、E=Fabric 26.1（Java 25）、F=NeoForge 26.1（待开）。

## ③ 作为 MCP 服务器使用（Claude Desktop / Cursor / 任意 MCP 客户端）

```bash
cd mcp
npm install          # 安装 @modelcontextprotocol/sdk
node mcp-server.mjs  # stdio 模式（默认）
node mcp-server.mjs --http   # HTTP 模式（环境变量 PORT，默认 3987）
```

客户端配置示例（stdio）：

```json
{
  "mcpServers": {
    "besson-tutorials": {
      "command": "node",
      "args": ["/绝对路径/besson-tutorials/mcp/mcp-server.mjs"],
      "env": { "BESSON_DATA_PATH": "/绝对路径/besson-tutorials/tools/index_data.json" }
    }
  }
}
```

HTTP 模式接入地址：`http://127.0.0.1:3987/mcp`（Streamable HTTP，会话由 `mcp-session-id` 头管理）。

自带测试：`npm test`（stdio 端到端）与 `node test-http.mjs`（HTTP 冒烟）。

## 数据维护（站点更新后）

```bash
node tools/sync-data.mjs          # 从站点重新抓取 → 重新生成 dsh-plugin/besson-tools.mjs
```

脚本会自动抓取站点归档页/标签页，重建完整索引并注入插件模块。技能文件 `skill/SKILL.md`
的表格可对照生成的 `index_data.json` 手工同步（或等作者更新教程总汇页）。

## 已知站点注意事项（内置在数据中）

- 站点「教程总汇」页部分章节列表滞后，**以实际文章为准**
- 章节编号存在空缺：Forge C 缺 #22~#27；NeoForge D 缺 #13~#24；Fabric B 无 #54
- D39「矿物的世界生成」站点标题误标 1.20.1，实为 1.21.1

## 许可

本包数据源自 [Tomorrow-Land](https://beishanair.github.io/)，遵循站点声明的
**CC BY-NC-SA 4.0**（署名-非商业性使用-相同方式共享），见 [LICENSE](LICENSE)。
转载/分发请保留来源署名。

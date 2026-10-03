---
name: besson-tutorials
description: 北山Besson Minecraft 模组开发教程 — 中文，覆盖 Fabric 1.20.1/1.21.X/26.1、Forge 1.20.1、NeoForge 1.21.1/26.1
metadata:
  type: skill
---

# 北山Besson Minecraft 模组开发教程

> **站点:** [Tomorrow-Land](https://beishanair.github.io/) · 作者: **BeiShan_Besson**
> **B站:** [@北山Besson](https://space.bilibili.com/489671468)
> **GitHub:** [BeiShanair](https://github.com/BeiShanair)
> **交流频道:** pd09376785 · **爱发电:** https://afdian.com/a/bessonair
>
> 所有教程均采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可
>
> **最后与站点同步校验:** 2026-10-03（文章总数 195）

使用本技能时，用户提到的需求对应到下方具体的教程系列和章节，可以直接输出对应的链接和指引。

---

## 📋 教程系列总览

| # | 系列 | MC 版本 | Loader | 章节数 | 状态 |
|---|------|---------|--------|--------|------|
| A | [Fabric 长线教程计划](#a-fabric-1201) | 1.20.1 | Fabric | #1~#55 | 🚧 更新中 |
| B | [Fabric 长线教程计划](#b-fabric-121x) | 1.21.X | Fabric | #1~#56 | ✅ 完整 |
| C | [Forge 长线教程计划](#c-forge-1201) | 1.20.1 | Forge | #1~#21、#28~#44 | 🚧 进行中 |
| D | [NeoForge 长线教程计划](#d-neoforge-1211) | 1.21.1 | NeoForge | #1~#12、#25~#44 | 🚧 进行中 |
| E | [Fabric 教程计划](#e-fabric-261) | 26.1 | Fabric | #1~#8 | 🆕 新开 |
| F | [NeoForge 教程计划](#f-neoforge-261) | 26.1 | NeoForge | — | ⏳ 待开 |

> ⚠️ **章节编号有跳号：** 站点按章节号编号，但存在未发布的空缺章节
> （Forge 1.20.1 缺 #22~#27；NeoForge 1.21.1 缺 #13~#24；Fabric 1.21.X 本站无 #54）。
> 如用户提到的章节号落在空缺区间，说明该章节尚未发布，建议推荐相邻章节或提示等待更新。

### 🌐 社区对照与版本现状（2026-10-03 官方源核实）

> 本节为对教程站内容的独立核对与建议，来源：Mojang 官方版本清单（piston-meta version manifest v2）、Fabric 官方元数据（meta.fabricmc.net）、NeoForge 官网新闻、Forge 下载页。

**① 各版本对应 Java 版本（官方版本清单 `javaVersion` 字段核实，与教程站写法一致）：**

| MC 版本 | Java | 官方运行时组件 |
|---------|------|----------------|
| 1.20.1 | Java 17 | java-runtime-gamma |
| 1.21 / 1.21.1 | Java 21 | java-runtime-delta |
| 26.1（含 26.1.1 / 26.1.2） | **Java 25** | java-runtime-epsilon |

**② 生态现状（影响选型的事实）：**

- 当前 Minecraft 最新正式版为 **26.2**（26.1.1、26.1.2 补丁已发布，26.3 快照开发中）。教程站主线仍是 **26.1**，尚未覆盖 26.2 —— 用户若问 26.2 内容，站点暂无对应教程，建议沿用 26.1 教程原理或提示等待。
- **Fabric Loader** 当前稳定版为 **0.19.3**（meta.fabricmc.net 可见，1.20.1 与 26.1 均用此 Loader），技能版本矩阵中“≥0.15”的旧表述已过时。
- **NeoForge 官方已于 2026-03-24 宣布 MC 26.1 适配**，但作者 F 系列仍标注“待开” —— 需要 NeoForge 26.1 教程的用户可关注作者后续更新（GitHub 已有 `Tutorial-Mod-26.1-Neo` 占位仓库）。
- Forge 官网下载页已列入 26.1/26.2，但作者 Forge 系列只写了 1.20.1。

**③ 选系列建议（按用户目标推荐）：**

| 用户目标 | 推荐系列 | 说明 |
|----------|----------|------|
| 完整跟一遍、最稳定 | **B** Fabric 1.21.X（56 章） | 唯一标“完整”的系列 |
| 最新版本 | **E** Fabric 26.1（8 章） | Java 25，内容最少但最新 |
| 1.20.1 生态 + 深度内容 | **A** Fabric 1.20.1（55 章） | 含网络包/机器等进阶章节 |
| NeoForge 路线 | **D** NeoForge 1.21.1（32 章） | 1.21.1 是目前 NeoForge 主流 |
| Forge 路线 | **C** Forge 1.20.1 | 注意 #22~#27 缺失 |

**④ 站点已知问题汇总（引用时注意纠正）：**

- 教程总汇页（sum）部分章节列表滞后：26.1 与粒子部分仍显示“等待开行”、NeoForge 只列到 #12，**以实际文章为准**。
- D39 矿物的世界生成，站点页面标题误标为“1.20.1”，实为 1.21.1。
- 各系列章节号存在空缺：Forge C 缺 #22~#27；NeoForge D 缺 #13~#24；Fabric B 无 #54；Fabric A 的 “S1/S2 补充”实际为 #51/#52。

### 📄 其他独立文章

| 标题 | 链接 |
|------|------|
| 📖 开篇（博客第一篇文章） | [→](https://beishanair.github.io/2024/07/13/121/first-blog/) |
| ❓ FAQ（常见问题，全版本通用） | [→](https://beishanair.github.io/2024/09/04/faq/) |
| 🟢 前言 1.20 Fabric 长线教程计划 | [→](https://beishanair.github.io/2025/02/19/120/120/) |
| 🐍 Python × Minecraft 粒子特效教程 | [→](https://beishanair.github.io/2025/07/20/particle/) |

---

## A — Fabric 1.20.1 长线教程计划

**Loader:** Fabric · **MC 版本:** 1.20.1 · **章节:** #1~#55（#51/#52 原称“补充”章节）

| # | 标题 | 链接 |
|---|------|------|
| 1 | 开发环境配置 | [→](https://beishanair.github.io/2025/04/15/120/start120/) |
| 2 | 第一个物品 | [→](https://beishanair.github.io/2025/04/16/120/item120/) |
| 3 | 创造模式物品栏 | [→](https://beishanair.github.io/2025/04/17/120/itemgroup120/) |
| 4 | 第一个方块 | [→](https://beishanair.github.io/2025/04/20/120/block120/) |
| 5 | 战利品列表 | [→](https://beishanair.github.io/2025/04/21/120/loot120/) |
| 6 | 配方 | [→](https://beishanair.github.io/2025/04/22/120/recipe120/) |
| 7 | 数据生成 | [→](https://beishanair.github.io/2025/04/25/120/datagen120/) |
| 8 | 食物 | [→](https://beishanair.github.io/2025/05/06/120/food120/) |
| 9 | 燃料 | [→](https://beishanair.github.io/2025/05/06/120/fuel120/) |
| 10 | Tags·标签 | [→](https://beishanair.github.io/2025/05/07/120/tag120/) |
| 11 | Jar打包 | [→](https://beishanair.github.io/2025/05/07/120/jar120/) |
| 12 | 建材类方块 | [→](https://beishanair.github.io/2025/05/07/120/build120/) |
| 13 | DeepSeek IDEA部署 | [→](https://beishanair.github.io/2025/05/08/120/ds120/) |
| 14 | 工具 | [→](https://beishanair.github.io/2025/05/08/120/tool120/) |
| 15 | 自定义工具 | [→](https://beishanair.github.io/2025/05/08/120/pickaxe120/) |
| 16 | 工具信息 | [→](https://beishanair.github.io/2025/05/09/120/tooltip120/) |
| 17 | 盔甲 | [→](https://beishanair.github.io/2025/05/09/120/armor120/) |
| 18 | 全套盔甲效果 | [→](https://beishanair.github.io/2025/05/13/120/armoreffect120/) |
| 19 | 马铠 | [→](https://beishanair.github.io/2025/05/13/120/horsearmor120/) |
| 20 | 作物 | [→](https://beishanair.github.io/2025/05/13/120/crop120/) |
| 21 | 多方块作物 | [→](https://beishanair.github.io/2025/05/14/120/twohighcrop120/) |
| 22 | 村民交易 | [→](https://beishanair.github.io/2025/05/14/120/trade120/) |
| 23 | 自定义村民 | [→](https://beishanair.github.io/2025/05/15/120/villager120/) |
| 24 | 声音事件 | [→](https://beishanair.github.io/2025/05/16/120/sound120/) |
| 25 | 音乐唱片 | [→](https://beishanair.github.io/2025/05/16/120/musicdisc120/) |
| 26 | Blockbench模型 | [→](https://beishanair.github.io/2025/05/16/120/blockbench120/) |
| 27 | 方块朝向 | [→](https://beishanair.github.io/2025/05/19/120/facing120/) |
| 28 | 沙发类方块 | [→](https://beishanair.github.io/2025/05/19/120/sofa120/) |
| 29 | 可坐实体 | [→](https://beishanair.github.io/2025/05/19/120/seat120/) |
| 30 | 光源方块 | [→](https://beishanair.github.io/2025/05/20/120/light120/) |
| 31 | 床 | [→](https://beishanair.github.io/2025/05/20/120/bed120/) |
| 32 | 柱类方块 | [→](https://beishanair.github.io/2025/05/20/120/pillar120/) |
| 33 | 栅栏类方块 | [→](https://beishanair.github.io/2025/05/21/120/fence120/) |
| 34 | 储物类方块 | [→](https://beishanair.github.io/2025/05/21/120/chest120/) |
| 35 | 流体 | [→](https://beishanair.github.io/2025/06/12/120/fluid120/) |
| 36 | 木头 | [→](https://beishanair.github.io/2025/07/05/120/wood120/) |
| 37 | Gradle配置文件 | [→](https://beishanair.github.io/2025/07/06/120/gradle/) |
| 38 | 告示牌 | [→](https://beishanair.github.io/2025/07/06/120/sign120/) |
| 39 | 船 | [→](https://beishanair.github.io/2025/07/07/120/boat120/) |
| 40 | 树 | [→](https://beishanair.github.io/2025/07/15/120/tree120/) |
| 41 | 树的世界生成 | [→](https://beishanair.github.io/2025/07/17/120/treegen120/) |
| 42 | 花 & 盆栽花 | [→](https://beishanair.github.io/2025/07/17/120/flower120/) |
| 43 | 花的世界生成 | [→](https://beishanair.github.io/2025/07/17/120/flowergen120/) |
| 44 | 矿物的世界生成 | [→](https://beishanair.github.io/2025/07/18/120/oregen120/) |
| 45 | 耐久合成 | [→](https://beishanair.github.io/2025/07/18/120/reciperemainder/) |
| 46 | 生物群系 | [→](https://beishanair.github.io/2026/05/20/120/biome/) |
| 47 | 结构 | [→](https://beishanair.github.io/2026/05/20/120/structure/) |
| 48 | 维度 & 传送门 | [→](https://beishanair.github.io/2026/05/20/120/dimension/) |
| 49 | GeckoLib | [→](https://beishanair.github.io/2026/05/21/120/gecko/) |
| 50 | 矿机 | [→](https://beishanair.github.io/2026/05/22/120/rig/) |
| 51 | 自定义配方类型（原“补充S1”） | [→](https://beishanair.github.io/2026/05/22/120/recipeType/) |
| 52 | REI（原“补充S2”） | [→](https://beishanair.github.io/2026/05/26/120/rei/) |
| 53 | 网络包初步 | [→](https://beishanair.github.io/2026/07/07/120/53network/) |
| 54 | 精炼炉 | [→](https://beishanair.github.io/2026/07/07/120/54refining/) |
| 55 | 罐装机 | [→](https://beishanair.github.io/2026/07/07/120/55filling/) |

---

## B — Fabric 1.21.X 长线教程计划

**Loader:** Fabric · **MC 版本:** 1.21.X · **章节:** #1~#56（本站无 #54）

| # | 标题 | 链接 |
|---|------|------|
| 1 | 开发环境配置 | [→](https://beishanair.github.io/2024/07/23/121/start121/) |
| 2 | 第一个物品 | [→](https://beishanair.github.io/2024/09/01/121/item121/) |
| 2-1 | 关于1.21.2中物品的注册 | [→](https://beishanair.github.io/2025/08/02/121/item1212/) |
| 3 | 物品栏 | [→](https://beishanair.github.io/2024/09/07/121/itemgroup121/) |
| 4 | 第一个方块 | [→](https://beishanair.github.io/2024/09/08/121/block121/) |
| 5 | 战利品列表 | [→](https://beishanair.github.io/2024/09/15/121/loottable121/) |
| 6 | 配方 | [→](https://beishanair.github.io/2024/09/18/121/recipe121/) |
| 7 | 数据生成 | [→](https://beishanair.github.io/2024/09/19/121/datagen121/) |
| 8 | 食物 | [→](https://beishanair.github.io/2024/09/22/121/food121/) |
| 9 | Mixin | [→](https://beishanair.github.io/2024/09/23/121/mixin121/) |
| 10 | 燃烧物 | [→](https://beishanair.github.io/2024/09/25/121/fuelItem121/) |
| 11 | 探矿器（进阶物品） | [→](https://beishanair.github.io/2024/09/26/121/prospector121/) |
| 12 | Tag | [→](https://beishanair.github.io/2024/09/27/121/tag121/) |
| 13 | 提示信息 | [→](https://beishanair.github.io/2024/09/29/121/tooltip121/) |
| 14 | 2D -> 3D（Mixin） | [→](https://beishanair.github.io/2024/10/08/121/2d3d121/) |
| 15 | 建筑类方块 | [→](https://beishanair.github.io/2024/10/09/121/buildingblocks121/) |
| 15-1 | 特殊渲染 | [→](https://beishanair.github.io/2024/10/10/121/renderer121/) |
| 16 | 自定义工具 | [→](https://beishanair.github.io/2024/10/11/121/tool121/) |
| 17 | 自定义盔甲 | [→](https://beishanair.github.io/2024/10/12/121/armor121/) |
| 18 | 全套盔甲效果 | [→](https://beishanair.github.io/2024/10/13/121/armoreffect121/) |
| 19 | 头饰（盔甲衍生案例） | [→](https://beishanair.github.io/2024/10/14/121/hat121/) |
| 20 | 作物 | [→](https://beishanair.github.io/2024/10/15/121/crop121/) |
| 21 | 多方块作物 | [→](https://beishanair.github.io/2024/10/16/121/doublecrop121/) |
| 22 | 修改战利品列表（非数据包） | [→](https://beishanair.github.io/2024/10/17/121/modifyloottable121/) |
| 23 | 自定义交易 | [→](https://beishanair.github.io/2024/10/18/121/trade121/) |
| 24 | 自定义村民 | [→](https://beishanair.github.io/2024/10/19/121/villager121/) |
| 25 | 自定义声音 | [→](https://beishanair.github.io/2024/10/20/121/sound121/) |
| 26 | 音乐唱片 | [→](https://beishanair.github.io/2024/10/21/121/musicdisc121/) |
| 27 | 流体 | [→](https://beishanair.github.io/2024/10/22/121/fluid121/) |
| 28 | 马铠 | [→](https://beishanair.github.io/2024/10/23/121/horsearmor121/) |
| 29 | 箱子（方块实体） | [→](https://beishanair.github.io/2024/10/24/121/box121/) |
| 30 | Jar构建 | [→](https://beishanair.github.io/2024/10/25/121/jar121/) |
| 31 | 方块实体2 | [→](https://beishanair.github.io/2024/10/26/121/polishingmachine121/) |
| 32 | 自定义配方类型 | [→](https://beishanair.github.io/2024/10/27/121/recipetype121/) |
| 33 | REI | [→](https://beishanair.github.io/2024/10/28/121/rei121/) |
| 34 | 自定义物品和方块 | [→](https://beishanair.github.io/2024/10/29/121/customitemblock121/) |
| 35 | 方块朝向（方块状态） | [→](https://beishanair.github.io/2024/10/30/121/facing121/) |
| 36 | 可连接方块 | [→](https://beishanair.github.io/2024/10/31/121/connectable121/) |
| 37 | 木头 | [→](https://beishanair.github.io/2024/11/01/121/wood121/) |
| 38 | 告示牌 | [→](https://beishanair.github.io/2024/11/10/121/sign121/) |
| 39 | 船 | [→](https://beishanair.github.io/2024/11/10/121/boat121/) |
| 40 | 树 | [→](https://beishanair.github.io/2024/11/11/121/tree121/) |
| 41 | 树的世界生成 | [→](https://beishanair.github.io/2024/11/11/121/treegen121/) |
| 42 | 花 & 盆栽花 | [→](https://beishanair.github.io/2024/11/12/121/flower121/) |
| 43 | 花的世界生成 | [→](https://beishanair.github.io/2024/11/12/121/flowergen121/) |
| 44 | 矿物的世界生成 | [→](https://beishanair.github.io/2024/11/14/121/oregen121/) |
| 45 | 耐久合成（配方剩余） | [→](https://beishanair.github.io/2024/11/14/121/reciperemainder121/) |
| 46 | 锻造台耐久合成（Mixin） | [→](https://beishanair.github.io/2024/11/15/121/smithingtransf121/) |
| 47 | 生物实体 | [→](https://beishanair.github.io/2024/11/15/121/entity121/) |
| 48 | 生物实体动画 | [→](https://beishanair.github.io/2024/11/16/121/entityani121/) |
| 49 | 攻击型生物实体 | [→](https://beishanair.github.io/2024/11/16/121/attackentity121/) |
| 50 | 生物群系 | [→](https://beishanair.github.io/2024/11/16/121/biome121/) |
| 51 | 自定义粒子 | [→](https://beishanair.github.io/2024/11/16/121/particle121/) |
| 52 | 自定义结构 | [→](https://beishanair.github.io/2024/11/16/121/structure121/) |
| 53 | 维度&传送门 | [→](https://beishanair.github.io/2024/11/16/121/dim121/) |
| 55 | 附魔 | [→](https://beishanair.github.io/2025/08/01/121/enchantment/) |
| 56 | 升级到1.21.2 | [→](https://beishanair.github.io/2025/08/01/121/update1212/) |

---

## C — Forge 1.20.1 长线教程计划

**Loader:** Forge · **MC 版本:** 1.20.1 · **章节:** #1~#21、#28~#44（缺 #22~#27）

| # | 标题 | 链接 |
|---|------|------|
| 1 | 开发环境配置 | [→](https://beishanair.github.io/2025/07/20/f120/start/) |
| 2 | 第一个物品 | [→](https://beishanair.github.io/2025/07/21/f120/item/) |
| 3 | 创造模式物品栏 | [→](https://beishanair.github.io/2025/07/21/f120/itemgroup/) |
| 4 | 第一个方块 | [→](https://beishanair.github.io/2025/07/21/f120/block/) |
| 5 | 战利品列表 | [→](https://beishanair.github.io/2025/07/21/f120/loot/) |
| 6 | 配方 | [→](https://beishanair.github.io/2025/07/21/f120/recipe/) |
| 7 | 数据生成 | [→](https://beishanair.github.io/2025/08/07/f120/datagen/) |
| 8 | 食物 | [→](https://beishanair.github.io/2025/11/18/f120/food/) |
| 9 | 燃料 | [→](https://beishanair.github.io/2025/11/18/f120/fuel/) |
| 10 | 探矿器 | [→](https://beishanair.github.io/2025/11/20/f120/prospector/) |
| 11 | Tags | [→](https://beishanair.github.io/2025/11/20/f120/tag/) |
| 12 | Jar打包 | [→](https://beishanair.github.io/2025/11/20/f120/jar/) |
| 13 | 建材类方块 | [→](https://beishanair.github.io/2026/04/27/f120/buildingblock/) |
| 14 | 工具 | [→](https://beishanair.github.io/2026/04/27/f120/tool/) |
| 15 | 斧 + 镐（进阶工具） | [→](https://beishanair.github.io/2026/04/29/f120/pickaxeaxe/) |
| 16 | 工具信息 | [→](https://beishanair.github.io/2026/04/29/f120/tooltip/) |
| 17 | 盔甲 | [→](https://beishanair.github.io/2026/04/29/f120/armor/) |
| 18 | 全套盔甲增益 | [→](https://beishanair.github.io/2026/04/29/f120/armoreffect/) |
| 19 | 作物 | [→](https://beishanair.github.io/2026/04/29/f120/crop/) |
| 20 | 多方块作物 | [→](https://beishanair.github.io/2026/04/30/f120/doublecrop/) |
| 21 | 村民交易 | [→](https://beishanair.github.io/2026/04/30/f120/trade/) |
| 28 | 座椅 | [→](https://beishanair.github.io/2026/06/30/f120/seat/) |
| 29 | 光源方块 | [→](https://beishanair.github.io/2026/06/30/f120/light/) |
| 30 | 床 | [→](https://beishanair.github.io/2026/06/30/f120/bed/) |
| 31 | 柱类方块 | [→](https://beishanair.github.io/2026/06/30/f120/pillar/) |
| 32 | 栅栏类方块 | [→](https://beishanair.github.io/2026/06/30/f120/fence/) |
| 33 | 流体 | [→](https://beishanair.github.io/2026/06/30/f120/fluid/) |
| 34 | 木头 | [→](https://beishanair.github.io/2026/06/30/f120/wood/) |
| 35 | 树 | [→](https://beishanair.github.io/2026/06/30/f120/tree/) |
| 36 | 树的世界生成 | [→](https://beishanair.github.io/2026/07/01/f120/treegen/) |
| 37 | 花 & 盆栽花 | [→](https://beishanair.github.io/2026/07/01/f120/flower/) |
| 38 | 花的世界生成 | [→](https://beishanair.github.io/2026/07/01/f120/flowergen/) |
| 39 | 矿物的世界生成 | [→](https://beishanair.github.io/2026/07/01/f120/oregen/) |
| 40 | 告示牌 | [→](https://beishanair.github.io/2026/07/01/f120/sign/) |
| 41 | 船 | [→](https://beishanair.github.io/2026/07/01/f120/boat/) |
| 42 | 结构 | [→](https://beishanair.github.io/2026/07/02/f120/structure/) |
| 43 | 生物群系 | [→](https://beishanair.github.io/2026/07/02/f120/biome/) |
| 44 | 维度 & 传送门 | [→](https://beishanair.github.io/2026/07/02/f120/dimension/) |

---

## D — NeoForge 1.21.1 长线教程计划

**Loader:** NeoForge · **MC 版本:** 1.21.1 · **章节:** #1~#12、#25~#44（缺 #13~#24）

| # | 标题 | 链接 |
|---|------|------|
| 1 | 开发环境配置 | [→](https://beishanair.github.io/2025/07/22/nf121/start/) |
| 2 | 第一个物品 | [→](https://beishanair.github.io/2025/07/25/nf121/item/) |
| 3 | 创造模式物品栏 | [→](https://beishanair.github.io/2025/07/25/nf121/itemgroup/) |
| 4 | 第一个方块 | [→](https://beishanair.github.io/2025/07/25/nf121/block/) |
| 5 | 战利品列表 | [→](https://beishanair.github.io/2025/07/25/nf121/loottable/) |
| 6 | 配方 | [→](https://beishanair.github.io/2025/07/25/nf121/recipe/) |
| 7 | 数据生成 | [→](https://beishanair.github.io/2025/08/19/nf121/datagen/) |
| 8 | 食物 | [→](https://beishanair.github.io/2025/11/18/nf121/food/) |
| 9 | 燃料 | [→](https://beishanair.github.io/2025/11/18/nf121/fuel/) |
| 10 | 探矿器 | [→](https://beishanair.github.io/2025/11/20/nf121/prospector/) |
| 11 | Tags | [→](https://beishanair.github.io/2025/11/20/nf121/tag/) |
| 12 | Jar打包 | [→](https://beishanair.github.io/2025/11/20/nf121/jar/) |
| 25 | Blockbench模型 | [→](https://beishanair.github.io/2026/07/09/nf121/25blockbench/) |
| 26 | 方块朝向 | [→](https://beishanair.github.io/2026/07/09/nf121/26facing/) |
| 27 | 沙发类方块 | [→](https://beishanair.github.io/2026/07/09/nf121/27sofa/) |
| 28 | 座椅 | [→](https://beishanair.github.io/2026/08/09/nf121/28seat/) |
| 29 | 光源方块 | [→](https://beishanair.github.io/2026/08/09/nf121/29light/) |
| 30 | 床 | [→](https://beishanair.github.io/2026/08/09/nf121/30bed/) |
| 31 | 柱类方块 | [→](https://beishanair.github.io/2026/08/09/nf121/31pillar/) |
| 32 | 栅栏类方块 | [→](https://beishanair.github.io/2026/08/09/nf121/32fence/) |
| 33 | 流体 | [→](https://beishanair.github.io/2026/08/14/nf121/33fluid/) |
| 34 | 木头 | [→](https://beishanair.github.io/2026/08/15/nf121/34wood/) |
| 35 | 树 | [→](https://beishanair.github.io/2026/08/15/nf121/35tree/) |
| 36 | 树的世界生成 | [→](https://beishanair.github.io/2026/08/15/nf121/36treegen/) |
| 37 | 花 & 盆栽花 | [→](https://beishanair.github.io/2026/08/15/nf121/37flower/) |
| 38 | 花的世界生成 | [→](https://beishanair.github.io/2026/08/15/nf121/38flowergen/) |
| 39 | 矿物的世界生成（站点标题误标为1.20.1，实为1.21.1） | [→](https://beishanair.github.io/2026/08/15/nf121/39oregen/) |
| 40 | 告示牌 | [→](https://beishanair.github.io/2026/08/15/nf121/40sign/) |
| 41 | 船 | [→](https://beishanair.github.io/2026/08/16/nf121/41boat/) |
| 42 | 结构 | [→](https://beishanair.github.io/2026/08/16/nf121/42structure/) |
| 43 | 生物群系 | [→](https://beishanair.github.io/2026/08/16/nf121/43biome/) |
| 44 | 维度 & 传送门 | [→](https://beishanair.github.io/2026/08/16/nf121/44dimension/) |

---

## E — Fabric 26.1 教程计划

**Loader:** Fabric · **MC 版本:** 26.1（自 26.1 起 Minecraft 使用 **Java 25**）· **章节:** #1~#8

| # | 标题 | 链接 |
|---|------|------|
| 1 | 开发环境配置 | [→](https://beishanair.github.io/2026/05/27/fa261/start/) |
| 2 | 第一个物品 | [→](https://beishanair.github.io/2026/05/27/fa261/item/) |
| 3 | 创造模式物品栏 | [→](https://beishanair.github.io/2026/05/28/fa261/tabs/) |
| 4 | 第一个方块 | [→](https://beishanair.github.io/2026/05/28/fa261/block/) |
| 5 | 战利品列表 | [→](https://beishanair.github.io/2026/06/29/fa261/loottable/) |
| 6 | 配方 | [→](https://beishanair.github.io/2026/06/29/fa261/recipe/) |
| 7 | 数据生成 | [→](https://beishanair.github.io/2026/06/29/fa261/datagen/) |
| 8 | 食物 | [→](https://beishanair.github.io/2026/06/29/fa261/food/) |

---

## F — NeoForge 26.1 教程计划

**Loader:** NeoForge · **MC 版本:** 26.1

⏳ **等待开行**（站点「教程总集」页面同样标注为等待开行）

---

## 其他资源

### GitHub 源码仓库

> 注意：原 `TutorialMod-1.20.1-Fabric` 仓库已重命名为 `TutorialMod-1.20.1`（旧链接会 404）。

- [TutorialMod-1.20.1（原 TutorialMod-1.20.1-Fabric）](https://github.com/BeiShanair/TutorialMod-1.20.1)
- [tutorialmod-template-1.21](https://github.com/BeiShanair/tutorialmod-template-1.21)
- [TutorialMod-1.20.1-Forge](https://github.com/BeiShanair/TutorialMod-1.20.1-Forge)
- [Tutorial-Mod-1.21.1-NeoForge](https://github.com/BeiShanair/Tutorial-Mod-1.21.1-NeoForge)
- [Tutorial-Mod-26.1-Fab（26.1 Fabric 教程仓库）](https://github.com/BeiShanair/Tutorial-Mod-26.1-Fab)
- [Tutorial-Mod-26.1-Neo（26.1 NeoForge 教程仓库）](https://github.com/BeiShanair/Tutorial-Mod-26.1-Neo)

### 标签索引

- [Fabric](https://beishanair.github.io/tags/Fabric/)
- [Fabric 1.20](https://beishanair.github.io/tags/Fabric-1-20/)
- [Fabric 1.21](https://beishanair.github.io/tags/Fabric-1-21/)
- [Forge](https://beishanair.github.io/tags/Forge/)
- [Forge 1.20.1](https://beishanair.github.io/tags/Forge-1-20-1/)
- [NeoForge](https://beishanair.github.io/tags/NeoForge/)
- [NeoForge 1.21.1](https://beishanair.github.io/tags/NeoForge-1-21-1/)
- [Particle](https://beishanair.github.io/tags/Particle/)
- [FAQ](https://beishanair.github.io/tags/FAQ/)

### FA工具

- 教程总汇页面: https://beishanair.github.io/2099/12/31/sum/

> ℹ️ 提示：站点自带的「教程总汇」页面（sum）部分章节列表更新滞后（如 26.1 与粒子部分仍显示“等待开行”、NeoForge 只列到 #12），
> 以上表格已按站点实际发布的文章核对（2026-10-03），并以实际文章为准。
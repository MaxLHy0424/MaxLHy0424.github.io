---
title: "破解机房管理助手"
description: "揭露机房管理助手其作者的 “恶行”，提供破解手段。"
published: 2026-02-24
pinned: false
tags: [电子教室软件]
category: "技术"
draft: false
---

## 前言

要数最恶心的机房管理软件，绝对是 “机房管理助手”（以下简称“助手”）。

所谓的 “助手” 并非单纯的管理工具，而是带有云控功能的受控端，违反了《网络安全法》甚至《刑法》中关于破坏计算机信息系统的相关规定。

其云控服务器被微步情报标记为 “高危”，正是对其恶意性质的权威认证。

其官网与云控地址被工信部直接吊销备案，这意味着其服务器备案信息造假、用途不符，或者涉及违法违规活动被举报查实。失去了合法的备案，其所有的网络服务运营均属于 “黑产” 范畴。

为了推广软件，钟鸣在宣传中隐瞒其恶意云控和高资源占用的真相，将 “后门” 包装成 “远程更新”，将 “恶意屏蔽” 包装成 “安全防护”，实质是以次充好，向教育机构提供存在严重安全隐患的产品，即使免费，也足够构成涉嫌商业欺诈。

钟鸣还曾使用小号潜入我们的技术交流群，试图窃取核心开发计划，这违背了开源社区的公开交流原则，采用间谍手段进行不正当竞争。

其软件通过恶意手段阻止用户使用更优秀的工具。代码内部充斥着试错残留、未关闭的句柄、冗余逻辑。他不是在创造价值，而是在制造 “技术垃圾” 和 “网络污染”，增加了教育机构的维护成本和安全风险。

这是钟鸣的无耻，恰是 “破解者” 的光荣！“人民的力量是要胜利的，真理是永远存在的。历史上没有一个反人民的势力不被人民毁灭的！希特勒，墨索里尼，不都在人民之间倒下去了吗？翻开历史看看，你们还站得住几天！你们完了，快完了！我们的光明就要出现了。我们看，光明就在我们眼前，而现在正式黎明前那个最黑暗的时候。我们有力量打破这个黑暗，争到光明！”（闻一多就李公朴因参加爱国民主运动遭国民党特务暗杀发表的最后一次演讲）

在此，收集各路 “破解者” 破解 “助手” 的方法，向着 “光明” 再近一步。

## 方法 1 - VBA 宏法

破解者：<a href="https://space.bilibili.com/1627165457" target="_blank" rel="noopener noreferrer">WangWei_CM</a>

视频介绍：<a href="https://www.bilibili.com/video/BV1QYfnB4Eoo" target="_blank" rel="noopener noreferrer">BV1QYfnB4Eoo</a>

附件：<a href="https://wangweicm.lanzouu.com/iRQXQ3iwxv8b" target="_blank" rel="noopener noreferrer">蓝奏云分享链接</a>

操作步骤：

1. 下载文件，把所得文件的文件扩展名改为 `.xlsm`。
2. 用 Excel 打开文件，启用宏。
3. 转到 “操作面板” Sheet，点击 “一件提权”，如有 UAC，点击 “确定” 即可。
4. 转到 “进程管理器” Sheet，点击 “刷新进程”，等待一会儿，找出所有 “助手” 相关进程，可以用记事本记下来。
5. 再次转到 “操作面板” Sheet，根据提示把上一步记录下来的 “助手” 相关进程依次终止。

## 方法 2 - XML 法

破解者：<a href="https://space.bilibili.com/1793717543" target="_blank" rel="noopener noreferrer">YunhaiTV_BD8ELY</a>

视频介绍：<a href="https://www.bilibili.com/video/BV1vjfqBVEx1" target="_blank" rel="noopener noreferrer">BV1vjfqBVEx1</a>

附件：<a href="https://www.coffee-studio.top/Functions/FuckJFZS.txt" target="_blank" rel="noopener noreferrer">FuckJFZS.txt</a>

操作步骤：

1. 创建文件 `C:\FuckJFZS.txt`，代码从 “附件” 对应的网站复制。
2. 在文件资源管理器的地址栏初粘贴如下命令

```batch
regsvr32.exe /s /u /i:C:\FuckJFZS.txt scrobj.dll
```

3. 按住 Ctrl 键和 Shift 键，接着按下回车键，如有 UAC，点击 “确定” 即可。
4. 点击弹出的数个对话框的 “确定”。

## 方法 3 - 运行库法

破解者：<a href="https://space.bilibili.com/3494360163289931" target="_blank" rel="noopener noreferrer">-雪山冻堇瓜-</a>

视频介绍：<a href="https://www.bilibili.com/video/BV1tk6tBfEmt" target="_blank" rel="noopener noreferrer">BV1tk6tBfEmt</a>

附注：这种方法只能停止助手的运行，建议搭配 SCLTK 使用。

操作步骤：

1. 在 C 盘下新建一个随即名字的文件夹（文件夹名越乱越好），创建文件 `stop.cmd`，内容如下：

```batch
sc stop zmserv
sc delete zmserv
logoff
```

2. 运行 `stop.cmd`，快速重新登录账户。
3. 快速把 `C:\Windows\Microsoft.NET` 改成其他名字，这一步对手速要求很高。
4. 等待 “助手” 弹出报错窗口后，把文件夹名字改回去。

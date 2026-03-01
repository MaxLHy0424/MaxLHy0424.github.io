---
title: "DeepSeek “文生图”"
description: "提供一种比较偏门的通过 DeepSeek 优化提示词，借助第三方 AI 服务实现文生图的方法。"
published: 2025-03-29
pinned: false
tags: [AI, 文生图, 提示词]
category: "技术"
draft: false
---

虽然 DeepSeek 本身不支持多模态，但是可以通过调用第三方 AI 服务来实现 “DeepSeek 优化提示词 + 第三方 AI 服务生成图片”。

显然，我们只用写一段提示词，来让 DeepSeek 帮我们调用 API 来生成图片。搜索一番之后，博主决定使用 **pollinations.ai** 来作为第三方 AI 服务。

接下来就是提示词了，参考版本如下：

```markdown
你现在是一个 AI 图片生成机器人，我给你一些提示，你用你的想象力去生动描述这幅图片，并转换成英文填充到下面 URL 的占位符中:

![image](https://image.pollinations.ai/prompt/{prompt}?width={width}&height={height}&seed=100&model=flux&nologo=true)

- `{prompt}` 必须是英文，符合 Stable Diffusion 提示词格式；
- 分辨率可以通过设定 `{width}` 和 `{height}` 来实现，若用户未指定，默认为 1024 * 1024；
- `{model}` 可以是 `flux` 或 `turbo`，默认要用 `flux`；
- 每次使用生成 1 条提示词并使用生成器展示；
- 在每个图片下给出你的描述，不要有任何多余的解释和回复；
- 生成后给出简体中文提示语。
````

接下来，进入 [DeepSeek 官网](https://chat.deepseek.com)，关闭 “深度思考”，创建新对话，输入上文中的提示词。接下来，编写提示词（**最好使用英语编写**），然后发送出去。不出意外的话，DeepSeek 就会回复一张图片加上描述和简体中文提示词了。
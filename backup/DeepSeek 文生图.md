> 参考自 [BV1rAoqYRETP](https://www.bilibili.com/video/BV1rAoqYRETP).

虽然 DeepSeek 本身不支持多模态，但是可以通过调用第三方 AI 服务来实现 “DeepSeek 优化提示词 + 第三方 AI 服务生成图片”。

显然，我们只用写一段提示词，来让 DeepSeek 帮我们调用 API 来生成图片。搜索一番之后，笔者决定使用 **pollinations.ai** 来作为第三方 AI 服务。

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

接下来，进入 [DeepSeek 官网](https://chat.deepseek.com)，关闭 “深度思考”，创建新对话，输入上文中的提示词。接下来，编写提示词 \(**最好使用英语编写**\)，然后发送出去。不出意外的话，DeepSeek 就会回复一张图片加上描述和简体中文提示词了。

感兴趣可以看看笔者通过此方法生成的一些图片：

<details>
<summary>点击展开</summary>

![image](https://github.com/user-attachments/assets/10f38dff-f171-470d-8d78-b94ef941f476)

**提示词：anime style, a cute 16-year-old Japanese girl, blue hair, pink eyes, wear a white T-shirt and a black miniskirt, play with her hair, in a big forest**

---
![image](https://github.com/user-attachments/assets/19ab51d2-0857-4e67-b09a-ee798334e1dc)

**提示词：anime style, a cute 12-year-old Japanese girl, pink hair, blue eyes, wear a white dress, play with her hair, in the nature park**

---

![image](https://github.com/user-attachments/assets/7ff8f33d-0f47-4929-8182-aed59e8b275c)

**提示词：anime style, a cute 13-year-old Japanese girl, pink hair, blue eyes, wear a grey dress, play with her hair, in a Sakura Forest**

---

![image](https://github.com/user-attachments/assets/807f6be5-3371-4514-8d1a-7e4e8f445baa)

**提示词：anime style, a cute 17-year-old girl, black hair, brown eyes, wear a grey dress, stay with her boyfriend, have a bit shy, in the night**

---

![image](https://github.com/user-attachments/assets/0a3980dd-a27f-4309-aeaa-673c789c6577)

**提示词：anime style, a boy, about 13 years old, brown eyes, black hair, wear a black T-shirt and grey shorts, sit at a desk, feel tired, programming with C++, in the midnight**
</details>
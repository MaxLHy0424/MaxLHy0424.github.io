## 0 总述

SCLTK 作为机房控制软件破解工具，很容易受到各种控制软件的限制。尤其是 “机房管理助手”，几乎封堵了绝大多数获取 SCLTK 和其他破解工具的途径。除了访问 [SCLTK 开源仓库发行版页面](https://github.com/MaxLHy0424/SCLTK/releases)，还有一些其他的方法可以方便地获取 SCLTK，在此罗列。

## 1 调用 Windows API 下载

> [!NOTE]
> SCLTK 的开源许可证内容如下，如有需要请自行保存。
> ```
> MIT License
> 
> Copyright (c) 2023 - present MaxLHy0424
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.
> ```

“机房管理助手” 在最近的更新中提供了禁止浏览器下载文件的功能。不过仍有方法可以方便的获取 SCLTK，具体请参考如下步骤：

1. 在 C 盘顶级目录下新建一个文件夹（例如 `C:\SCLTK`），在文件夹内创建文件 `SCLTK.cpp`、`SCLTK-i686-msvcrt.cpp`、`SCLTK-x86_64-ucrt.cpp`。
2. 使用 Dev-C++ 打开 `SCLTK.cpp`，复制如下代码并保存：
> [!NOTE]
> 代码将在晚些时候公开。
3. 编译并运行，等待 SCLTK 下载完毕。

## 2 借助 Python 3 下载

该方法与上一个方法相似，步骤如下：

1. 在 C 盘顶级目录下新建一个文件夹（例如 `C:\SCLTK`），在文件夹内创建文件 `SCLTK.py`、`SCLTK-i686-msvcrt.cpp`、`SCLTK-x86_64-ucrt.cpp`。
2. 使用文本编辑器打开 `SCLTK.py`，复制如下代码并保存：
> [!NOTE]
> 代码将在晚些时候公开。
3. 使用 Python 3 运行 `SCLTK.py`，等待 SCLTK 下载完毕。
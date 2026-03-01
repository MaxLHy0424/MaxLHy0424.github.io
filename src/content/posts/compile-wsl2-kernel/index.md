---
title: "编译适用于 WSL 2 的 Linux Kernel"
description: "使用默认配置快速编译为 WSL 2 的 Linux Kernel。"
published: 2024-06-21
pinned: false
tags: [Arch Linux, WSL2]
category: "技术"
draft: false
---

## 0 引入

WSL 2 即使更新到最新预发布版本，Linux Kernel 版本也是 `6.6.xxx`。一部分软件可能会需要更高的内核版本，或者是用户想要测试最新的 Linux Kernel 特性。因此，网上替换 WSL 2 的 Linux Kernel 的教程才会如此涌现。

> [!CAUTION]  
> 这可能会导致部分 GNU/Linux 发行版不稳定，软件无法运行等问题。所以不建议在生产环境中替换 WSL 2 的 Linux Kernel。

## 1 安装依赖

Debian 系：

```bash
sudo apt install build-essential flex bison dwarves libssl-dev libelf-dev
```

Arch 系：

```bash
sudo pacman -S base-devel flex bison pahole openssl libelf bc
```

## 2 下载 Linux Kernel 源代码

访问 [The Linux Kernel Archive](https://kernel.org)，等待加载完成后，可以看到网页中间的 Linux Kernel 源代码存档列表。在此之前，我们需要了解 Linux Kernel 的主要开发分支：

- `mainline`（主线）  
    - Linux Kernel 的主要开发分支，由 ***Linus Torvalds*** 管理，包含最新的 Linux Kernel 特性及漏洞修复。  
    - 常常作为下一个 Linux Kernel 的开发分支，可能存在一些稳定性问题。

- `stable`（稳定）  
    - 最常用的 Linux Kernel 分支，包含最新的漏洞修复，日常使用首选。

- `longterm`（长期）  
    - 较旧的 Linux Kernel 分支，持续进行漏洞修复，长期使用首选。

根据具体需求下载对应的 Linux Kernel，然后通过 Windows 资源管理器复制到前面安装好依赖的 GNU/Linux 发行版的用户家目录中。

然后执行以下命令（将 `<File>` 替换为您的 Linux Kernel 压缩包文件名，将 `<Dir>` 替换为您的 Linux Kernel 压缩包解压后的目录名）：

```bash
cd ~
tar xf <File>
cd <Dir>
```

## 3 编译内核

> [!NOTE]  
> 如果您在中国大陆，此步骤可能需要使用网络代理。

执行以下命令下载适用于 WSL 2 的 Linux Kernel 构建配置并保存：

```bash
wget https://raw.githubusercontent.com/microsoft/WSL2-Linux-Kernel/linux-msft-wsl-6.1.y/arch/x86/configs/config-wsl -O arch/x86/configs/config-wsl
```

然后执行以下命令来使用全部线程编译内核：

```bash
make KCONFIG_CONFIG=arch/x86/configs/config-wsl -j$(nproc)
```

途中的编译配置选择一路按回车即可。

## 4 保存并替换

执行以下命令（将 `<PATH>` 替换为 C 盘下的文件路径，例如 `Data/WslLinuxKernel`）：

```bash
cp arch/x86/boot/bzImage /mnt/c/<PATH>
```

然后将文件名改为 `kernel`。

接着，在当前 Windows 用户目录下创建文件 `.wslconfig`（有则不用），添加（`[wsl2]` 无需重复添加；将 `C:\\<PATH>\\kernel` 替换为您的 Linux Kernel 文件路径；把路径分隔符替换为 `\\`）：

```
[wsl2]
kernel=C:\\<PATH>\\kernel
```

接着，在 Windows Terminal 中执行以下命令：

```batch
wsl --shutdown
```

再次启动 WSL 2 中的 GNU/Linux 发行版，执行：

```bash
uname -a
```

Linux Kernel 已经成功替换，一切大功告成！

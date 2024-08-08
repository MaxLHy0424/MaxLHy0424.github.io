在 Windows OS 上开发 GNU/Linux 软件时, WSL 2 常为不二之选.

但是, WSL 2 上开箱即用的 GNU/Linux 发行版, 几乎只有 Ubuntu. 想要在 WSL 2 上使用 Arch Linux, 配置较为麻烦.

本教程将帮助您在 WSL 2 上安装并配置 Arch Linux.

> 适用于 Windows 11 22H2 及以上版本, 其以下的版本可能会出现各种问题.

# 0 准备工作

WSL 2 的硬件需求及启用方法在此处不多赘述, 请自行查阅.

> 如果您有安装 VMware Workstation Pro 等寄居型虚拟机, 推荐改用 Microsoft Hyper-V. 否则其运行的虚拟机性能可能会受到影响.

启用后, 在 Windows Terminal (管理员权限) 中执行以下命令:
```Batch
wsl --update
wsl --update --pre-release
```

接着, 在当前的 Windows OS 用户目录下创建文件`.wslconfig`, 在文件中添加以下内容:
```
[wsl2]
ipv6=true
networkingMode=mirrored
dnsTunneling=true
firewall=true
autoProxy=true
defaultVhdSize=137438953472
[experimental]
autoMemoryReclaim=gradual
bestEffortDnsParsing=true
useWindowsDnsCache=true
```

然后, 在 Microsoft Store 中搜索`Arch WSL`, 点击下图中所示的软件 (一般为第1个):

![Microsoft Store 搜索结果的局部截图](https://github.com/MaxLHy0424/MaxLHy0424.github.io/assets/142279449/ef60802e-5e57-4b6f-81cf-aa6add640178)

按照正常流程安装, 打开, 创建账户. 

# 1 登录 root 用户并修改密码

执行`sudo su`进入`root`用户后, 通过`passwd root`修改`root`用户密码.

# 2 配置 *GNU Nano* 文本编辑器

打开`/etc/nanorc`, 在末尾追加:
```
bind ^X cut main
bind ^C copy main
bind ^V paste all
bind ^Q exit all
bind ^S savefile main
bind ^W writeout main
bind ^O insert main
bind ^H help all
bind ^H exit help
bind ^F whereis all
bind ^G findnext all
bind ^B wherewas all
bind ^D findprevious all
bind ^R replace main
unbind ^U all
unbind ^N main
unbind ^Y all
unbind M-J main
unbind M-T main
bind ^A mark main
bind ^P location main
bind ^T gotoline main
bind ^T gotodir browser
bind ^T cutrestoffile execute
bind ^L linter execute
bind ^E execute main
bind ^K "{mark}{end}{zap}" main
bind ^U "{mark}{home}{zap}" main
bind ^Z undo main
bind ^Y redo main
set tabsize 4
set autoindent
set noconvert
set smarthome
set tabstospaces
set mouse
set linenumbers
set casesensitive
set multibuffer
set nonewlines
set magic
set softwrap
set wordbounds
set constantshow
include /usr/share/nano/*.*
```

# 3 配置包管理器

打开`/etc/pacman.d/mirrorlist`, 在顶部添加:
```
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinux/$repo/os/$arch
```

打开`/etc/pacman.conf`, 找到:
```
#UseSyslog
#Color
NoProgressBar
```
换成:
```
UseSyslog
Color
#NoProgressBar
```

然后找到这一行:
```
ParallelDownloads = 5
```
将后面的`5`修改成你想要同时下载的软件包的数量.

接着把后面的软件源全部删掉, 换成下面的:
```
[testing]
Include = /etc/pacman.d/mirrorlist
[staging]
Include = /etc/pacman.d/mirrorlist
[core-testing]
Include = /etc/pacman.d/mirrorlist
[core-staging]
Include = /etc/pacman.d/mirrorlist
[core]
Include = /etc/pacman.d/mirrorlist
[extra-testing]
Include = /etc/pacman.d/mirrorlist
[extra-staging]
Include = /etc/pacman.d/mirrorlist
[extra]
Include = /etc/pacman.d/mirrorlist
[community-testing]
Include = /etc/pacman.d/mirrorlist
[community-staging]
Include = /etc/pacman.d/mirrorlist
[community]
Include = /etc/pacman.d/mirrorlist
[multilib-testing]
Include = /etc/pacman.d/mirrorlist
[multilib-staging]
Include = /etc/pacman.d/mirrorlist
[multilib]
Include = /etc/pacman.d/mirrorlist
[archlinuxcn]
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinuxcn/$arch
[blackarch]
SigLevel = Never
Server = https://mirrors.tuna.tsinghua.edu.cn/blackarch/$repo/os/$arch
```

执行以命令:
```bash
pacman-key --init
pacman-key --lsign-key "farseerfc@archlinux.org"
pacman -Sy archlinuxcn-keyring blackarch-keyring
```

执行以下命令安装 *yay* 稳定版 (安装开发版把`yay`改为`yay-git`):
````bash
pacman -S yay
````

# 4 汉化

打开`/etc/locale.gen`, 找到:
```
#en_GB.UTF-8 UTF-8
```
```
#zh_CN.UTF-8 UTF-8
```
将前面的`#`去掉.

打开`/etc/locale.conf`, 在末尾追加:
```
LANG=en_GB.UTF-8
```

打开`/etc/profile`, 在末尾追加:
```
export LC_ALL=zh_CN.UTF-8
export LANG=zh_CN.UTF-8:en_GB.UTF-8
```

然后执行以下命令:
```bash
pacman -S adobe-source-han-sans-cn-fonts adobe-source-han-serif-cn-fonts wqy-microhei wqy-microhei-lite ttf-hannom wqy-zenhei wqy-bitmapfont ttf-arphic-ukai ttf-arphic-uming ttf-hannom noto-fonts opendesktop-fonts noto-fonts-emoji
locale-gen
```

# 5 解决 *WSLg* 及 *Systemd* 问题

执行以下命令:
```bash
echo \
'# Type Path           Mode UID  GID  Age Argument
L+     /tmp/.X11-unix -    -    -    -   /mnt/wslg/.X11-unix' | tee /etc/tmpfiles.d/wslg.conf
echo -e "[boot]\nsystemd=true" | tee -a /etc/wsl.conf
```

# 6 善后工作及后续使用注意事项

执行以下命令:
```bash
pacman -Syyu net-tools tree sed python wget
yay -Rcns $(pacman -Qtdq)
yay -Scc
rm -rf /tmp/*
```

如果后续需要安装软件源`blackarch`内的软件包, 推荐在此之前先打开`/etc/pacman.conf`, 注释以下几行:
```
[extra-testing]
Include = /etc/pacman.d/mirrorlist
[extra-staging]
Include = /etc/pacman.d/mirrorlist
```
然后使用`sudo pacman -Syy`更新软件源, 再安装软件包, 完成之后再将上面的几行取消注释.

# *? 预告*

WSL 2 即使更新到最新预发布版本, Linux Kernel 版本也是`6.6.xxx`. 下一篇教程将教您自己编译 Linux Kernel, 并在 WSL 2 中使用!
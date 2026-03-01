---
title: "为 Hyper-V 中的 Arch Linux 启用增强会话"
description: "通过一些手段为运行在 Hyper-V 中的 Arch Linux 虚拟机启用非官方支持的增强会话。"
published: 2024-06-24
pinned: false
tags: [Arch Linux, Hyper-V]
category: "技术"
draft: false
---

## 0 引入

使用 Hyper-V 去安装 GNU/Linux 发行版，启用增强会话最令人头大。不清楚是不是 Microsoft 有意为之让大家用 WSL 2。但总归，这并不容易。

本教程将教您如何为 Hyper-V 中的 Arch Linux 虚拟机启用增强会话。

## 1 准备工作

> [!IMPORTANT]  
> 请确保您的 Arch Linux 虚拟机是第二代虚拟机，同时使用 pipewire 作声音服务，并且在 Hyper-V 设置中允许使用增强会话。

然后，在主机 Windows OS 下以管理员权限打开 PowerShell，执行（`<VM>` 改成 Arch Linux 虚拟机的名字，最好加上英文半角双引号）：

```powershell
Set-VM -VMName <VM> -EnhancedSessionTransportType HvSocket
```

## 2 配置包管理器

这一块不做过多赘述，简而言之，换源，安装 paru。

## 3 安装集成服务

执行以下命令：

```bash
sudo pacman -S hyperv
for i in {vss,fcopy,kvp}; do sudo systemctl enable hv_${i}_daemon.service; done
```

## 4 安装软件包

如果没有安装 git，请先执行以下命令：

```bash
sudo pacman -S git base-devel
```

执行以下命令：

```bash
git clone https://github.com/microsoft/linux-vm-tools.git  
git clone https://aur.archlinux.org/xrdp-devel-git.git  
```

首先切换到文件夹 `xrdp-devel-git`，在文件 `PKGBUILD` 中的 `build()` 部分中，添加以下参数到构建选项中：

```
--enable-vsock
```

即整个 `build()` 变为：

```bash
build() {
  cd $pkgname
  ./configure --prefix=/usr \
              --sysconfdir=/etc \
              --localstatedir=/var \
              --sbindir=/usr/bin \
	      --libexecdir=/usr/lib \
              --with-systemdsystemdunitdir=/usr/lib/systemd/system \
              --enable-jpeg \
              --enable-tjpeg \
              --enable-fuse \
	      --enable-opus \
	      --enable-rfxcodec \
	      --enable-mp3lame \
	      --enable-pixman \
              --enable-vsock
  # Fight unused direct deps
  sed -i -e 's/ -shared / -Wl,-O1,--as-needed\0 /g' -e 's/    if test "$export_dynamic" = yes && test -n "$export_dynamic_flag_spec"; then/      func_append compile_command " -Wl,-O1,--as-needed"\n      func_append finalize_command " -Wl,-O1,--as-needed"\n\0/' libtool
  make V=0
}
```

就是 `# Fight unused direct deps` 上面的两行改了一下。

编辑完成后，执行命令：

```bash
makepkg --skipchecksum -si
```

然后执行以下命令：

```bash
paru -S xorg-xinit xorgxrdp-devel-git openssl-1.1 pipewire-module-xrdp
```

接着切换回当初克隆仓库时所在的目录，切换到 `linux-vm-tools/arch`，执行：

```bash
sudo ./install-config.sh
```

> [!WARNING]  
> 不要使用 `linux-vm-tools/arch` 中的 `makepkg.sh` 脚本，其编译选项并不正确。

## 5 解决 XRDP 反复连接问题

在当前用户的家目录下创建 `.xinitrc`。

根据不同的桌面环境添加内容：
- i3w / dwm：

```
exec i3w
```

- Gnome：

```
unset SESSION_MANAGER
unset DBUS_SESSION_BUS_ADDRESS
exec dbus-launch  gnome-shell --x11
```

- KDE Plasma：

```
export DESKTOP_SESSION=plasma
exec startplasma-x11
```

- Xfce4：

```
unset SESSION_MANAGER
unset DBUS_SESSION_BUS_ADDRESS
exec dbus-launch startxfce4
```

然后执行：

```bash
sudo systemctl enable xrdp.service
sudo systemctl enable xrdp-sesman.service
sudo xrdp-keygen xrdp /etc/xrdp/rsakeys.ini
sudo pacman -Rcns $(pacman -Qtdq)
```

接着重启虚拟机。

重启后依次输入用户名、用户密码登录账户，然后在弹出窗口中再次输入账户密码即可。

> [!TIP]  
> 实际上直接关闭弹出的窗口也是可以正常使用的，不过最好还是输入一下账户密码。

至此，一切大功告成！

## Extra 汉化 SDDM

这一部分和本篇教程没什么关系，了解下就可以。

如果是以 Systemd 启动 SDDM，可以打开 `/usr/lib/systemd/system/sddm.service`，在 `[Service]` 下添加：

```
Environment=LANG=zh_CN.UTF-8
```

如果不是 Systemd 启动，只能改 `/etc/locale.conf` 了（不建议改，虚拟终端会乱码）。

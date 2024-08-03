*Hyper-V* 去安装 *GNU/Linux*, 启用增强会话最令人头大. 不清楚是不是 *Microsoft* 有意为之让大家用 *WSL2* 还是什么的, 但总归, 这并不容易.

本教程将教您如何为 *Hyper-V* 中的 *Arch Linux* 虚拟机启用增强会话.

# 0 准备工作

在开始之前, 首先确保您的 *Arch Linux* 虚拟机是第二代虚拟机, 且使 *Systemd* 作为引导.

其次, 请确保您的 *Arch Linux* 使用的是 *KDE Plasma* 桌面环境, 其他桌面环境可能略有不同.

另外, 请在 *Hyper-V* 设置中允许使用增强会话, 这很重要.

然后, 在主机 *Windows OS* 下以管理员权限打开 *PowerShell*, 执行 (`<VM>`改成 *Arch Linux* 虚拟机的名字, 加上英文半角双引号):
```PowerShell
Set-VM -VMName <VM> -EnhancedSessionTransportType HvSocket
```

# 1 配置包管理器

详见[这篇教程](https://maxlhy0424.github.io/post/2.html)的第 3 部分.

# 2 安装集成服务

执行以下命令:
```bash
sudo pacman -S hyperv
for i in {vss,fcopy,kvp}; do sudo systemctl enable hv_${i}_daemon.service; done
```

# 3 安装配置 *XRDP*, *XORG*, *Pipeware-module-xrdp* 

执行以下命令:
```bash
yay -S git base-devel paru openssl-1.1 pipewire-module-xrdp
yay -Rcns python2 ceph
```

然后, 执行以下命令克隆所需软件仓库:
```bash
git clone https://github.com/microsoft/linux-vm-tools.git
git clone https://aur.archlinux.org/xrdp-devel-git.git
git clone https://aur.archlinux.org/xorgxrdp-devel-git.git
```

接着, 打开`xrdp-devel-git/PKGBUILD`, 找到开头为`build()`的一行, 将参数部分的文本替换为:
```Makefile
   ./configure --prefix=/usr \
               --sysconfdir=/etc \
               --localstatedir=/var \
               --sbindir=/usr/bin \
               --with-systemdsystemdunitdir=/usr/lib/systemd/system \
               --enable-jpeg \
               --enable-tjpeg \
               --enable-fuse \
               --enable-opus \
               --enable-rfxcodec \
               --enable-mp3lame \
               --enable-pixman \
               --enable-vsock
```

接下来, 在当前目录执行:
```bash
makepkg --skipchecksums -si
```

然后返回上一级目录, 再进入目录`xorgxrdp-devel-git`, 执行:
```bash
makepkg -si
```

再次返回上一级目录, 进入目录`linux-vm-tools/arch`, 执行:
```bash
./makepkg.sh
sudo ./install-config.sh
```

# 4 解决 *XRDP* 反复连接问题

执行以下命令 (仅适用于 *KDE Plasma* 桌面环境):
```bash
echo "/usr/lib/plasma-dbus-run-session-if-needed startplasma-x11" > ~/.xinitrc
```

然后执行:
```bash
sudo systemctl enable xrdp.service
sudo systemctl enable xrdp-sesman.service
sudo xrdp-keygen xrdp /etc/xrdp/rsakeys.ini
```

接着重启虚拟机.

重启后依次输入用户名, 用户密码登录账户, 然后在弹出窗口中再次输入账户密码即可.

至此, 一切大功告成!
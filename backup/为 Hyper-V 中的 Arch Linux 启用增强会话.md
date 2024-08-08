*Hyper-V* 去安装 *GNU/Linux*, 启用增强会话最令人头大. 不清楚是不是 *Microsoft* 有意为之让大家用 *WSL2* 还是什么的, 但总归, 这并不容易.

本教程将教您如何为 *Hyper-V* 中的 *Arch Linux* 虚拟机启用增强会话.

# 0 准备工作

在开始之前, 首先确保您的 *Arch Linux* 虚拟机是第二代虚拟机, 同时使用 *pipewire* 作声音服务.

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

# 3 安装软件包

执行以下命令:
```bash
yay -S git base-devel
```

然后, 执行以下命令克隆仓库:
```bash
git clone https://github.com/microsoft/linux-vm-tools.git
```

进入目录`linux-vm-tools/arch`, 执行:
```bash
./makepkg.sh
yay -S xorg-xinit xrdp xorgxrdp paru openssl-1.1 pipewire-module-xrdp
sudo ./install-config.sh
```

# 4 解决 *XRDP* 反复连接问题

在当前用户的家目录下创建`.xinitrc`.

根据不同的桌面环境添加内容:
 - *i3w / dwm*:
 ``` 
 exec i3w
 ```
 - *Gnome*:
 ```
 unset SESSION_MANAGER
 unset DBUS_SESSION_BUS_ADDRESS
 exec dbus-launch  gnome-shell --x11
 ```
 - *KDE Plasma*:
 ```
 export DESKTOP_SESSION=plasma
 /usr/lib/plasma-dbus-run-session-if-needed startplasma-x11 
 ```
 - *Xfce4*:
 ```
 unset SESSION_MANAGER
 unset DBUS_SESSION_BUS_ADDRESS
 exec dbus-launch startxfce4
 ```

然后执行:
```bash
sudo systemctl enable xrdp.service
sudo systemctl enable xrdp-sesman.service
sudo xrdp-keygen xrdp /etc/xrdp/rsakeys.ini
yay -Rcns $(pacman -Qtdq)
```

接着重启虚拟机.

重启后依次输入用户名, 用户密码登录账户, 然后在弹出窗口中再次输入账户密码即可.

至此, 一切大功告成!
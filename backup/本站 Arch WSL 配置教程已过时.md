如题, 本站最初发布的 Arch WSL 配置指南, 随着 WSL 和 Arch Linux 的更新已经过时. 以下为最新自动化配置脚本:

```bash
#!/bin/bash
sudo pacman -S sed nano --needed --noconfirm
echo 'bind ^X cut main
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
include /usr/share/nano/*.*' | sudo tee -a /etc/nanorc
sudo sed -i '1iServer = https:\/\/mirrors.tuna.tsinghua.edu.cn\/archlinux\/\$repo\/os\/\$arch' /etc/pacman.d/mirrorlist
sudo sed -i 's/#UseSyslog/UseSyslog/g' /etc/pacman.conf
sudo sed -i 's/#Color/Color/g' /etc/pacman.conf
sudo sed -i 's/NoProgressBar/#NoProgressBar/g' /etc/pacman.conf
sudo sed -i 's/ParallelDownloads = 5/ParallelDownloads = 100/g' /etc/pacman.conf
sudo sed -i '68,$d' /etc/pacman.conf
echo '[core-testing]
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
[multilib-testing]
Include = /etc/pacman.d/mirrorlist
[multilib-staging]
Include = /etc/pacman.d/mirrorlist
[multilib]
Include = /etc/pacman.d/mirrorlist
[kde-unstable]
Include = /etc/pacman.d/mirrorlist
[gnome-unstable]
Include = /etc/pacman.d/mirrorlist
[archlinuxcn]
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinuxcn/$arch
[blackarch]
SigLevel = Never
Server = https://mirrors.tuna.tsinghua.edu.cn/blackarch/$repo/os/$arch' | sudo tee -a /etc/pacman.conf
sudo pacman-key --init
sudo pacman-key --lsign-key 'farseerfc@archlinux.org'
sudo pacman -Sy archlinuxcn-keyring blackarch-keyring --noconfirm
sudo pacman -S paru vifm --noconfirm
echo '#
# $PARU_CONF
# /etc/paru.conf
# ~/.config/paru/paru.conf
#
# See the paru.conf(5) manpage for options
#
# GENERAL OPTIONS
#
[options]
PgpFetch
Devel
Provides
DevelSuffixes = -git -cvs -svn -bzr -darcs -always -hg -fossil
#AurOnly
BottomUp
RemoveMake
SudoLoop
#UseAsk
SaveChanges
#CombinedUpgrade
CleanAfter
UpgradeMenu
NewsOnUpgrade
#LocalRepo
#Chroot
#Sign
#SignDb
#KeepRepoCache
#
# Binary OPTIONS
#
[bin]
FileManager = vifm
MFlags = --skipinteg
#Sudo = doas' | sudo tee /etc/paru.conf
sudo sed -i 's/#en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/g' /etc/locale.gen
sudo sed -i 's/#zh_CN.UTF-8 UTF-8/zh_CN.UTF-8 UTF-8/g' /etc/locale.gen
echo 'LANG=en_US.UTF-8' | sudo tee /etc/locale.conf
echo 'export LC_ALL=zh_CN.UTF-8
export LANG=zh_CN.UTF-8
export LANGUAGE=zh_CN:en_US' | sudo tee -a /etc/profile
sudo pacman -S adobe-source-han-sans-cn-fonts adobe-source-han-serif-cn-fonts wqy-microhei wqy-microhei-lite ttf-hannom wqy-zenhei wqy-bitmapfont ttf-arphic-ukai ttf-arphic-uming ttf-hannom noto-fonts opendesktop-fonts noto-fonts-emoji --noconfirm
sudo locale-gen
echo '# Type Path           Mode UID  GID  Age Argument
L+     /tmp/.X11-unix -    -    -    -   /mnt/wslg/.X11-unix' | sudo tee /etc/tmpfiles.d/wslg.conf
echo '[boot]
systemd=true' | sudo tee /etc/wsl.conf
sudo ln -sf /mnt/wslg/.X11-unix/* /tmp/.X11-unix/
sudo ln -sf /mnt/wslg/runtime-dir/wayland-0* /run/user/$(id -g)/
sudo pacman -Syyu base base-devel git zip unzip net-tools tree python wget btop fastfetch --needed --noconfirm
sudo pacman -Rcns $(pacman -Qtdq) --noconfirm
sudo pacman -Scc --noconfirm
sudo sed -i '38a\DownloadUser = alpm\n#DisableSandbox' /etc/pacman.conf
echo '#!/hint/bash
# shellcheck disable=2034

#
# /etc/makepkg.conf.d/rust.conf
#

#########################################################################
# RUST LANGUAGE SUPPORT
#########################################################################

# Flags used for the Rust compiler, similar in spirit to CFLAGS. Read
# linkman:rustc[1] for more details on the available flags.
RUSTFLAGS="-Cforce-frame-pointers=yes"

# Additional compiler flags appended to `RUSTFLAGS` for use in debugging.
# Usually this would include: ``-C debuginfo=2''. Read linkman:rustc[1] for
# more details on the available flags.
DEBUG_RUSTFLAGS="-C debuginfo=2"' | sudo tee /etc/makepkg.conf.d/rust.conf
sudo rm -rf /etc/pacman.conf.pacnew /etc/makepkg.conf.d/rust.conf.pacnew /etc/nanorc.pacnew /etc/sudoers.pacnew
sudo rm -rf /tmp/*
for i in {font,ICE,X11,XIM}; do sudo rm -rf /tmp/.${i}-unix; done
for i in {cache,log,tmp}; do sudo rm -rf /var/${i}/*; done
echo '
本 Shell 脚本已经帮助您:
  1. 配置 GNU Nano;
  2. 配置清华镜像源;
  3. 配置 pacman;
  4. 添加 archlinuxcn 和 blackarch 仓库;
  5. 启用所有测试仓库;
  6. 汉化系统, 安装常用字体;
  7. 启用 WSLg 和 Systemd;
  8. 安装必要软件包, paru, vifm, btop, fastfetch;
  9. 更新所有软件包;
  10. 清理无用软件包依赖和临时文件.
如果只有 root 用户, 建议您再创建一个普通用户.
如果不知道 root 用户密码, 请尽快使用命令 sudo passwd 修改.
请尽快重启 Arch WSL.'
```
[paru](https://github.com/Morganamilo/paru) 是 yay 的作者之一 Morganamilo 使用 Rust 编写的另一个 AUR 助手。基本命令与功能与 yay 和 pacman 几乎一样，所以迁移过来不会有任何困难。

# 0 安装

如果没有安装其他的 AUR 助手，可以执行以下命令：
```bash
sudo pacman -S --needed git base-devel
git clone https://aur.archlinux.org/paru-git.git  
cd paru-git
makepkg -si
```

如果有安装 yay，可以直接执行：
```bash
yay -S paru-git
```

# 1 基本用法

## 1.1 `paru`

当什么参数都不加的时候，默认执行 `paru -Syu`，首先从软件仓库查找更新，然后从 AUR 查找更新。

## 1.2 `paru <search terms>`

通过 paru 搜索关键词 `<search terms>` 的软件包，并询问要安装哪一个。

## 1.3 `paru <operation> [options] [targets]`

这里 `<operation>` 是一个必须参数，表示操作。用缩写的时候用一个大写字母表示，例如 `-S` 表示 `--sync`，`<options>` 是选项。多个选项可以写在一起，例如 `paru --sync -y -u` 就是常见的 `paru -Syu`。

# 2 paru 特有的操作

## 2.1 `-P`（`--show`）

打印相关的选项。

### 2.1.1 `-c`（`--complete`）

打印所有来自 AUR 和软件仓库的包，用于自动补全，**用户不应直接使用**。

### 2.1.2 `-s`（`--state`）

展示安装的软件包的信息以及系统健康情况，以及是否有过期包、孤儿包等。

### 2.1.3 `-w`（`--news`）

展示来自 Arch Linux 主页的新闻。只展示比所有本地软件包构建日期要新的新闻，要展示所有新闻，请使用 `-ww`。

### 2.1.4 `-o`（`--order`）

展示目标软件包的构建顺序。

## 2.2 `-G`（`--getpkgbuild`）

从 ABS（Arch Linux Build System，Arch Linux 构建系统）或者 AUR 下载 PKGBUILD，ABS 只能对 Arch Linux 软件仓库用。

### 2.2.1 `-p`（`--print`）

将 `PKGBUILD` 打印到终端，而不是下载 `PKGBUILD`。

### 2.2.2 `-c`（`--comments`）

展示软件包的 AUR 评论。

### 2.2.3 `-s`（`--ssh`）

通过 ssh 克隆 AUR 仓库。

## 2.3 `-U`（`--upgrade`）

当不带目标执行的时候，使用 makepkg 相同，构建当前文件夹下的 `PKGBUILD`。

### 2.3.1 `-i`（`--install`）

构建完毕后同时安装。

## 2.4 `-L`（`--repoctl`）

列出所有仓库。

### 2.4.1 `-l`（`--list`）

显示本地仓库的软件包。

### 2.4.2 `-d`（`--delete`）

移除本地的一个软件包，使用 `-dd` 同时卸载该软件包。

### 2.4.3 `-y`（`--refresh`）

刷新本地仓库。

### 2.4.4 `-q`（`--quiet`）

展示更少信息。

## 2.5 `-C`（`--chrootctl`）

到 chroot 的交互式命令行。

### 2.5.1 `-i`（`--install`）

将一个软件包安装到 chroot。

### 2.5.2 `-u`（`--sysupgrade`）

更新 chroot。

# 3 扩展 pacman 的操作

扩展到同时支持软件仓库和 AUR 的软件包的操作有 `-R`、`-S`、`-Si`、`-Sl`、`-Ss`、`-Su`、`-Sc`、`-Qu`、`-T`。

## 3.1 `-R`

paru 会同时清除关于 `devel` 包的缓存数据。

## 3.2 `-Sc`

paru 会同时清除缓存的 AUR 软件包以及缓存中任何未被跟踪的文件。清除未被跟踪的文件会清除所有下载的 source 以及构建好的软件包，但是下载的 VCS source 会被保留。添加 `-d` 或者 `--delete` 可以删除整个软件包，而不是仅仅清理它。

## 3.3 `-Ss`

可以通过正则表达式搜索 AUR 软件包，但是必须通过 `-x` 或 `--regex` 明确指定。不管 `--searchby` 如何设定，正则表达式都只匹配包名（`pkgname`）而不匹配描述（`pkgdesc`）。

## 3.4 `-Sss`

paru 会展示详细的搜索结果。

## 3.5 `-S`、`-Si`、`-Sl`、`-Ss`、`-Su`、`-Qu`

对于这些选项，paru 也能够处理 AUR 的包。

# 4 新的选项

## 4.1 `--repo`

假设所有目标来自于软件仓库，并且像 `-u` 只处理来自于软件仓库的软件包。

## 4.2 `-a`（`--aur`）

假设所有目标来自于 AUR，并且 `-u` 之类的选项只处理来自于 AUR 的包。

## 4.3 `--aururl`

设置 AUR 代理（只代理下载 AUR 仓库，不代理下载打包的 source）。

## 4.4 `--clonedir <dir>`

设置下载和运行 `PKGBUILD` 的目录。

## 4.5 `--makepkg <command>`

设置 makepkg 调用的命令，可以是 PATH 里面的命令或者任意一个绝对路径指向的文件。

## 4.6 `--makepkgconf <file>`

为 chroot 环境指定一个 makepkg 的配置文件，只能使用绝对路径。

## 4.7 `--pacman <command>`

调用 pacman 的命令，可以是 PATH 里面的命令或者任意一个绝对路径指向的文件。

## 4.8 `--git <command>`

设置自定义 git 的命令，可以是 PATH 里面的命令或者任意一个绝对路径指向的文件。

## 4.9 `--gitflags <flags>`

向 git 传递的参数，每次当 paru 调用 git 的时候都会传递。参数按空格分割，然后用引号包裹起来，即：
```bash
--gitflags "flag1 flag2 flag3"
```

## 4.10 `--fmflags <flags>`

向 fm 传递的参数，每次当 paru 调用 gpg 的时候都会传递。参数按空格分割，然后用引号包裹起来。即：
```bash
--fmflags "flag1 flag2 flag3"
```

## 4.11 `--asp <command>`

自定义的 `asp` 命令，可以是 PATH 里面的命令或者任意一个绝对路径指向的文件。

## 4.12 `--mflags <flags>`

向 makepkg 传递的参数，每次当 paru 调用 makepkg 的时候都会传递。参数按空格分割，然后用引号包裹起来，即：
```bash
--mflags "flag1 flag2 flag3"
```

## 4.13 `--bat <command>`

自定义的 `bat` 命令，可以是 PATH 里面的命令或者任意一个绝对路径指向的文件。

## 4.14 `--batflags <flags>`

向 bat 传递的参数，每次当 paru 调用 bat 的时候都会传。参数按空格分割，然后用引号包裹起来，即：
```bash
--batflags "flag1 flag2 flag3"
```

## 4.15 `--sudo <command>`

自定义的 `sudo` 命令，可以是 PATH 里面的命令或者任意一个绝对路径指向的文件。`--sudoloop` 选项不一定能和自定义的 `sudo` 命令兼容。

## 4.16 `--sudoflags <flags>`

向 sudo 传递的参数，每次当 paru 调用 sudo 的时候都会传递。参数按空格分割，然后用引号包裹起来，即：
```bash
--sudoflags "flag1 flag2 flag3"
```

## 4.17 `--completioninterval <days>`

刷新补全缓存的时间间隔，设置为 `0` 表示每次都刷新，`-1` 表示永不刷新，默认值为 `7`。

## 4.18 `--sortby <votes|popularity|id|baseid|name|base|submitted|modified>`

在搜索时对 AUR 的软件包按特定指标排序，默认按 `votes` 降序排列。

## 4.19 `--searchby <name|name-desc|maintainer|depends|checkdepends|makedepends|optdepends>`

按指定域进行 AUR 搜索，默认按 `name-desc` 搜索。

## 4.20 `--skipreview`

跳过审阅过程。

## 4.21 `--upgrademenu`

展示详细的更新清单，格式类似于 pacman 的 `VerbosePkgLists` 选项。可以使用数字、数字范围或者仓库名称跳过某些更新。**不建议跳过来自软件仓库的更新，因为这可能会导致部分更新。该选项的目的是用于跳过某些 AUR 更新。**

## 4.22 `--nogrademenu`

不展示更新菜单。

## 4.23 `--removemake [yes|no|ask]`

在安装完软件包后移除 `makedepends`。如果设置为 `ask`，在构建过程中会显示一个询问菜单。没有指定选项时，默认是 `yes`。

## 4.24 `--topdown`

从上往下打印搜索结果，首先打印来自软件仓库的软件包。这是默认行为。

## 4.25 `--bottomup`

从下往上打印搜索结果，首先打印来自 AUR 的软件包。

## 4.26 `--limit <limit>`

在一次搜索中限制返回的结果的数量，默认是 `0`（无限制）。可以分别对 AUR 和软件仓库进行限制。

## 4.27 `--nocheck`

不解决依赖或者不运行 `PKGBUILD` 中的 `check` 函数。

## 4.28 `--installdebug`

如果一个包提供 `debug` 包，同时安装 `debug` 包。

## 4.29 `--noinstalldebug`

当一个包提供 `debug` 包时，不安装 `debug` 包。

## 4.30 `--devel`

在系统更新（sysUpgrade）时，同时检查 AUR 包的 Development 更新，目前只支持 git 包（即 `*-git` 之类的包）。

## 4.31 `--nodevel`

在系统更新时，不检查 Development 的软件包。

## 4.32 `--develsuffixes`

paru 用来决定一个包是否是 Devel Package 的后缀，当启用 `--needed` 选项时用于决定是否要更新 `pkgver`。注意 `suffixes` 是复数，即可以有多个后缀。

## 4.33 `--cleanafter`

在安装后移除未被跟踪的文件（不移除目录）。这使得采用版本控制系统（VCS）的软件包能够轻松拉取更新，而不是重新克隆整个仓库。

## 4.34 `--nocleanafter`

安装后不移除软件包的源文件（source）。

## 4.35 `--redownload [yes|no|all]`

即使在本地缓存有 `PKGBUILD` 的时候也总是重新下载一份 `PKGBUILD`。如果指定 `all`，所有软件包的 `PKGBUILD` 都会重新下载，而不仅仅是目标（targets）软件包，当指定了该选项时，默认为 `yes`。

## 4.36 `--noredownload`

当下载 `PKGBUILD` 时，如果本地缓存的 `PKGBUILD` 跟 AUR 的一样新或者比 AUR 的新时，不重新下载 `PKGBUILD`。

## 4.37 `--provides`

查找匹配 Provides 的 AUR 软件包。当有多个结果时，提示用户选择一个。该选项会增加解决依赖的时间（但是感知不强）。

## 4.38 `--noprovides`

不查找 AUR 软件包的 Provides 部分。paru 不会展示 Provider 菜单，但是 pacman 仍然会为软件仓库中的包展示 Provider 菜单。

## 4.39 `--pgpfetch`

提示从每个 `PKGBUILD` 的 `validpgpkeys` 部分导入未知的 PGP 密钥。

## 4.40 `--nopgpfetch`

不提示导入未知的 PGP 密钥。这可能会导致软件包构建失败，除非使用 `--skippgpcheck` 或者自定义的 GPG 配置。

## 4.41 `--newsonupgrade`

在系统更新时打印新的新闻。

## 4.42 `--useask`

使用 pacman 的 `--ask` 来自动确认软件包冲突。paru 会提前列出冲突列表。paru 有可能会没有检测到软件包冲突，导致一个软件包没有经过询问就被移除。但是这是几乎不可能的。

## 4.43 `--nouseask`

在安装过程中手动解决冲突，不冲突的软件包不需要手动确认。

## 4.44 `--savechanges`

在审阅 `PKGBUILD` 的过程中提交更改。

## 4.45 `--nosavechanges`

不提交审阅过程中的更改。

## 4.46 `--combinedupgrade`

在系统更新的过程中，paru 首先刷新数据库，然后展示将要更新的软件包。在完成审阅 `PKGBUILD` 以后，来自软件仓库和 AUR 的更新将不需要手动干预。如果 paru 在刷新数据库后退出而没有进行系统更新，用户需要自己通过 pacman 进行更新。

## 4.47 `--nocombinedupgrade`

系统更新过程中，首先执行 `pacman -Syu`，然后更新来自 AUR 的软件包。

## 4.48 `--batchinstall`

当构建和安装 AUR 软件包的时候，将每个需要安装的软件包加入队列，当所有软件包都构建好之后，批量安装。

## 4.49 `--nobatchinstall`

当每个 AUR 软件包构建完成之后立即安装。

## 4.50 `--rebuild [yes|no|all]`

即使当本地有构建好的副本也重新构建软件包。如果选择 `all`，所有包都被重新构建，而不仅仅是目标软件包。默认值是 `no`。

## 4.51 `--norebuild`

当构建软件包时，如果本地有相同版本的软件包，则跳过构建，使用现有的软件包。

## 4.52 `--sudoloop [= args...]`

在后台周期性调用 sudo 来在耗时长的构建中防止超时。可选参数可以用来决定如何循环调用，在使用 doas 的时候可能会有用。

## 4.53 `--nosudoloop`

不在后台循环调用 sudo。

## 4.54 `--localrepo [= Repos...]`

使用一个本地仓库来构建和更新 AUR 软件包。

paru 会作用于启用的软件仓库而不是外部软件包上。这个仓库必须已经在 `pacman.conf` 中声明，但是不必已经存在于硬盘上。

可选地，可以传递一个仓库列表，paru 默认会考虑所有本地仓库，将软件包构建到第一个软件仓库，并更新其他启用的仓库的软件包。

## 4.55 `--chroot [= /path/to/chroot]`

在 chroot 中构建软件包，这需要启用 `localrepo` 选项，可选指定 chroot 的创建路径。

## 4.56 `--nochroot`

不在 chroot 中构建软件包。

## 4.57 `--sign [= key]`

使用 GPG 对软件包进行签名，可选指定使用哪个 Key 进行签名。

## 4.58 `--nosign`

不对软件包进行 GPG 签名。

## 4.59 `--keeprepocache`

通常情况下，当 AUR 的软件包升级时，旧的版本会被清理。这个选项禁用了上述行为，保留了所有版本，仅更新了数据库。

## 4.60 `--nokeeprepocache`

不保留旧的软件包。

## 4.61 `--signdb [= key]`

使用 GPG 对数据库进行签名，可选指定使用哪个 Key 进行签名。

## 4.62 `--nosigndb`

不对数据库进行 GPG 签名。

# 5 环境变量

## 5.1 `AURDEST`

用于设置构建软件包的目录，使用 `--clonedir` 覆盖该变量。

## 5.2 `PARU_CONF`

覆盖 paru 查找自身配置文件的位置。

## 5.3 `PARU_PAGER`

paru 用于审阅文件的 `pager`，优先级高于 `PAGER` 环境变量，但是低于 `paru.conf` 的设置。

# 6 相关文件

## 6.1 配置目录

paru 的配置文件目录位于 `$XDG_CONFIG_HOME/paru/`，如果 `$XDG_CONFIG_HOME` 未设定，则为 `$HOME/.config/paru`。`paru.conf` 用于保存 paru 所有的选项。实际上 `paru.conf` 在 `/etc` 下。

## 6.2 缓存目录

缓存目录在 `$XDG_CACHE_HOME/paru/`，如果 `$XDG_CACHE_HOME` 为空则是 `$HOME/.cache/paru`。`packages.aur` 保存了一份 AUR 软件包的列表用于补全，默认情况下补全文件 7 天更新一次。`devel.json` 保存了一份所有 VCS 软件包的名称以及它们最新的提交，如果任何一个提交发生变化，对应的软件包会被重新构建。

## 6.3 构建目录

除非重新指定，该目录的位置与缓存目录相同。该目录用于存放下载的 AUR 包以及它们的 source 文件和构建好的软件包。

## 6.4 `pacman.conf`

paru 使用 `pacman.conf` 通过 `alpm.rs` 或者 paru 本身来设置某些 pacman 选项。大部分的 libalpm 选项和 pacman 选项都被继承了。

# 7 使用 paru 编辑 `PKGBUILD`

首先执行以下命令：
```bash
sudo pacman -S vifm --needed
```

接下来，打开 `/etc/paru.conf`，找到：
```
#[bin]
#FileManager = vifm
#MFlags = --skippgpcheck
#Sudo = doas
```

改为：
```
[bin]
FileManager = vifm
MFlags = --skippgpcheck --skipchecksum
#Sudo = doas
```

顺便分享下我自己修改的 `paru.conf`：
```
#
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
#Sudo = doas
```
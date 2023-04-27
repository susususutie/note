# To be sorted out

待整理的记录笔记

**wsl.conf**

更改`wsl.conf`后需要关闭 linux 子系统, 并等待至少 8s 待其完全关闭, 再重启才能生效.

也可以使用`wsl --shutdown`关闭所有linux子系统.

位置: 在linux的/etc/wsl.conf

文件可能不存在, 需要手动创建, 管理员权限 `sudo touch wsl.conf`
更改wsl.conf需要管理员权限, `sudo vim wsl.conf` 部分发行版默认没有vim, 可以使用vi, 使用方法一致`sudo vi wsl.conf`

新增以下内容

```bash
[boot]
systemd=true
[interop]
appendWindowsPath=false
```
systemd=true用于启用systemd功能
appendWindowsPath=false用于禁用windows的path变量, 这样就无法在linux子系统里使用windows上的功能(如npm,yarn等工具), 做到隔离, 避免版本问题
但同时也无法使用code命令用windows的vscode打开linux上的文件,因此需要手动在linux的环境变量中添加code

查看环境变量, 检查配置是否生效
```bash
echo $PATH
```
更改$PATH有很多方法, 这里采用更改`~/.zshrc`方法实现, 前提是已经安装zsh

在.zshrc中添加一行, 用于在.zshrc生效时自动往$PATH上追加新的变量, 注意下方的/mnt/c...路径是宿主windows上vscode的路径, 具体可以查看windows的环境变量

```bash
export PATH="$PATH:/mnt/c/Users/sutie/AppData/Local/Programs/Microsoft VS Code/bin"
```

### zsh

- 安装zsh: `apt install zsh`, 安装好之后通过`zsh --version` 检查是否安装成功
- 设置为默认shell: 终端执行`chsh -s $(which zsh)`将zsh设置为默认shell, 重启后打印shell:`echo $SHELL`, 结果类似'/usr/bin/zsh'表示成功
- 新建zsh配置文件: `touch ~/.zshrc`
- 安装OnMyZsh: `sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"`

安装好后, `.zhsrc`会被写入配置数据, 更改其中的ZSH_THEME为'ZSH_THEME="agnoster"'以启用'agnoster'主题配色, 若部分符号显示异常,需要同时更改windows终端字体

参考:

[WSL官方文档](https://learn.microsoft.com/zh-cn/windows/wsl/wsl-config)
[install zsh](https://github.com/ohmyzsh/ohmyzsh/wiki/Installing-ZSH)
[install ohmyzsh](https://ohmyz.sh/#install)


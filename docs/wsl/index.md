# To be sorted out

待整理的记录笔记

实际测试发现，想在局域网中访问 wsl 中的服务，只需要配置 Windows 防火墙的入站规则，与`~/.wslconfig` 中的 `firewall` `ignoredPorts` `hostAddressLoopback` 配置没有关系。
打开 Windows 安全中心，防火墙和网络保护，高级设置 -》 入站规则中新建规则，规则类型为“端口”，协议 TCP，填入想暴露到局域网的端口如 5173，并在配置文件中只勾选“专用网络”，以避免安全风险。添加完成后
即可在”入站规则“中看到新增了一条。

**wsl.conf**

更改`wsl.conf`后需要关闭 linux 子系统, 并等待至少 8s 待其完全关闭, 再重启才能生效.

也可以使用`wsl --shutdown`关闭所有 linux 子系统.

位置: 在 linux 的/etc/wsl.conf

文件可能不存在, 需要手动创建, 管理员权限 `sudo touch wsl.conf`
更改 wsl.conf 需要管理员权限, `sudo vim wsl.conf` 部分发行版默认没有 vim, 可以使用 vi, 使用方法一致`sudo vi wsl.conf`

新增以下内容

```bash
[boot]
systemd=true
[interop]
appendWindowsPath=false
```

systemd=true 用于启用 systemd 功能
appendWindowsPath=false 用于禁用 windows 的 path 变量, 这样就无法在 linux 子系统里使用 windows 上的功能(如 npm,yarn 等工具), 做到隔离, 避免版本问题
但同时也无法使用 code 命令用 windows 的 vscode 打开 linux 上的文件,因此需要手动在 linux 的环境变量中添加 code

查看环境变量, 检查配置是否生效

```bash
echo $PATH
```

更改$PATH 有很多方法, 这里采用更改`~/.zshrc`方法实现, 前提是已经安装 zsh

在.zshrc 中添加一行, 用于在.zshrc 生效时自动往$PATH 上追加新的变量, 注意下方的/mnt/c...路径是宿主 windows 上 vscode 的路径, 具体可以查看 windows 的环境变量

```bash
export PATH="$PATH:/mnt/c/Users/sutie/AppData/Local/Programs/Microsoft VS Code/bin"
```

### zsh

- 安装 zsh: `apt install zsh`, 安装好之后通过`zsh --version` 检查是否安装成功
- 设置为默认 shell: 终端执行`chsh -s $(which zsh)`将 zsh 设置为默认 shell, 重启后打印 shell:`echo $SHELL`, 结果类似'/usr/bin/zsh'表示成功
- 新建 zsh 配置文件: `touch ~/.zshrc`
- 安装 OnMyZsh: `sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"`

安装好后, `.zhsrc`会被写入配置数据, 更改其中的 ZSH_THEME 为'ZSH_THEME="agnoster"'以启用'agnoster'主题配色, 若部分符号显示异常,需要同时更改 windows 终端字体

参考:

[WSL 官方文档](https://learn.microsoft.com/zh-cn/windows/wsl/wsl-config)
[install zsh](https://github.com/ohmyzsh/ohmyzsh/wiki/Installing-ZSH)
[install ohmyzsh](https://ohmyz.sh/#install)

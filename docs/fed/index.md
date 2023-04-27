# TODO

## NVM

注意:
nvm 默认使用 default 版本的 node, 这里的 default 只是一个别名. 当 node 发布新版本后, 当前安装的 node 版本不再是最新的, default 别名指向的最新版未安装, 导致全局环境下无法使用 node, 必须手动设置`nvm use <version>` 设置 node 版本后, 才可在当前文件夹下使用.此时应该手动设置 nvm 别名`nvm alias default <version>`, 使得 default 别名指向本地已安装的 node 版本, 这样下一次打开终端, nvm 会默认加载 default 版本, 即可在全局环境使用默认版本了.

[离屏 Canvas(OffscreenCanvas)](./off-screen-canvas.md)

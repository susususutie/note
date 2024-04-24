# 常用Linux命令

## tree

tree 命令用于生成文件夹的树状结构图

- `tree` 以树状结构列出当前目录下所有文件和子目录。
- `tree -a` 显示所有文件, 包含隐藏文件。
- `tree -L N` L: level, 只显示到第N层的目录层级。
- `tree -d` d: directories, 只显示目录,不显示文件。
- `tree -I 'node_modules'` 忽略node_modules文件夹。
- `tree -I 'pattern' --gitignore` 排除pattern匹配的, 并排除目录下`.gitignore`所匹配的文件, pattern可以是任何文件, 如果没有`pattern`, gitignore也不会生效。
- `tree -C` 使用不同颜色区分文件类型。
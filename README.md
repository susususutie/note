# note

个人技术笔记

## Work Flow

- 新增`__DEV__xx.md`文件, `__DEV__`开头的文件只在本地预览时展示
- `pnpm run docs:dev` 本地编写, 实时预览, 导航与侧边栏会自动生成
- 编写完成, 改名删掉`__DEV__`前缀
- 提交`feat: 新增xxx`, 合并至`main`分支, 触发自动打包与发布


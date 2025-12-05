# pnpm install 包管理策略

创建两个项目，一个做为测试项目 demo，一个作为库项目 utils。pnpm 版本均为 v10.17.1

1. 库项目 devDependencies，peerDependencies 中依赖 lodash@4.16.0，测试项目不依赖

测试项目 demo 的 package.json 文件如下：

```json
{
  "dependencies": {
    "utils": "^0.0.7"
  }
}
```

库项目的 package.json

```json
{
  "devDependencies": {
    "lodash": "4.16.0"
  },
  "peerDependencies": {
    "lodash": "4.16.0"
  }
}
```

查阅说明 pnpm 不会自动安装 peerDependencies，但实际 demo 中自动安装了 lodash@4.16.0。

2. 手动给测试项目安装lodash@4.17.21

pnpm install lodash@latest

提示 `unmet peer lodash@4.16.0: found 4.17.21`，此时项目实际使用的是 lodash@4.17.21

demo/package.json

```json
{
  "dependencies": {
    "lodash": "^4.17.21",
    "utils": "^0.0.7"
  }
}
```

3. 移除库项目的 peerDependencies

utils/package.json

```json
  "devDependencies": {
    "lodash": "4.16.0"
  },
```

demo/package.json

```json
  "dependencies": {
    "lodash": "^4.17.21",
    "utils": "^0.0.8"
  }
```

项目实际使用的依旧是 lodash@4.17.21

3. 移除测试项目的 lodash 依赖

测试项目未安装 lodash，pnpm instal 也无任何警告信息，但因缺少 lodash 依赖，demo 报错

utils/package.json

```json
  "devDependencies": {
    "lodash": "4.16.0"
  },
```

demo/package.json

```json
  "dependencies": {
    "utils": "^0.0.8"
  }
```

4. 库项目 dependencies 中依赖 lodash@4.16.0，测试项目不依赖

因为 lodash@4.16.0 是库项目的生产依赖，测试项目自动安装了 lodash@4.16.0

utils/package.json

```json
 "dependencies": {
    "lodash": "4.16.0"
  },
```

demo/package.json

```json
  "dependencies": {
    "utils": "^0.0.9"
  }
```

5. 库项目 dependencies 中依赖 lodash@4.16.0，测试项目 dependencies 中依赖 lodash@4.17.21

在已经安装 lodash@4.17.21 的测试项目下，再安装库项目，此时项目中 lodash 版本为 lodash@4.17.21。
在已经安装了库项目之后再安装 lodash@4.17.21，会存在两个版本的 lodash，库中使用的是 lodash@4.16.0，测试项目使用 lodash@4.17.21，打包后产物里也会存在两份 lodash

utils/package.json

```json
 "dependencies": {
    "lodash": "4.16.0"
  },
```

demo/package.json

```json
  "dependencies": {
    "lodash": "^4.17.21",
    "utils": "^0.0.9"
  }
```

6. 库项目 dependencies，peerDependencies 中依赖 lodash@4.16.0

此时测试项目 lodash@4.16.0 会被自动安装，库项目中能正常使用 lodash，但测试项目不依赖，无法使用 lodash

utils/package.json

```json
 "dependencies": {
    "lodash": "4.16.0"
  },
  "peerDependencies": {
    "lodash": "4.16.0"
  },
```

demo/package.json

```json
  "dependencies": {
    "utils": "^0.0.10"
  }
```

如果此时测试项目安装 lodash@4.17.21，则库项目中使用的也是 lodash@4.17.21，不会存在多个版本的 lodash

utils/package.json

```json
 "dependencies": {
    "lodash": "4.16.0"
  },
  "peerDependencies": {
    "lodash": "4.16.0"
  },
```

demo/package.json

```json
  "dependencies": {
    "utils": "^0.0.10",
    "lodash": "^4.17.21"
  }
```

### 最佳实践

库中将依赖添加到 dependencies，peerDependencies，这样不管项目是否安装了该依赖，库项目都可以使用。库中打包时不必将依赖打包，避免冗余。同时为了避
免多个版本的依赖，库中依赖要写在 peerDependencies 中，版本号范围可以适当放宽。

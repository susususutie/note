# 使用 docker + verdaccio 搭建私有 npm 仓库

有些时候，为了测试包管理器的安装策略，或者测试库的发布流程，需要搭建一个私有 npm 仓库，这里介绍使用 docker + verdaccio 搭建私有 npm 仓库。

## Quick Start

```bash
docker pull verdaccio/verdaccio
docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio
```

容器启动后即可打开 `http://localhost:4873` 查看仓库，此时仓库为空。

## 注册账号

1. 依次根据提示输入用户名、密码、邮箱，在私有源注册账号。以下以 pnpm 为例，npm 命令一致。

```bash
pnpm adduser --registry http://localhost:4873
# 密码不能过于简单
```

创建成功后会自动登录，也可手动登录

```bash
pnpm login --registry http://localhost:4873
# 输入用户名、密码
```

2. 检查账号是否注册成功

```bash
pnpm whoami --registry http://localhost:4873
# 或者查看容器的 htpasswd 文件是否新增了新的账号
docker exec verdaccio cat /verdaccio/conf/htpasswd
# 或者检查本机 ~/.npmrc 中是否有对应 registry 配置
cat ~/.npmrc
```

注册成功可进入网页 `http://localhost:4873` 登录上述账号

### 推送包

```bash
pnpm publish --registry http://localhost:4873
```

一定要记得加 `--registry` 选项，否则会误推送到公有源。为避免误推送，可以在 scripts 中添加 `"publish": "pnpm publish --registry http://localhost:4873"`。同时还可以在 package.json 中添加 `"publishConfig": {"registry": "http://localhost:4873"}`

包的 package.json 中需要添加 author 字段，否则网页上库作者 Author 一栏显示 Unknown。例如 `"author": "aa <aa@qq.com>"` 或以下形式

```json
{
  "author": {
    "name": "aa",
    "email": "aa@qq.com"
  }
}
```

### 数据持久化

上述方式启动的 verdaccio 容器在容器停止后数据会丢失，为了数据持久化，可以添加 `-v` 参数将容器数据保存在主机上。在本机创建目录 `~/verdaccio` ，并在该目录下创建子目录 `conf` `storage` `plugins`，用于持久化存储 verdaccio 数据

1. 创建数据目录

```bash
V_PATH=~/verdaccio
# 创建文件夹
mkdir -p $V_PATH/{conf,storage,plugins}
# 写入最小配置
V_PATH=~/verdaccio
cat > $V_PATH/conf/config.yaml <<'EOF'
storage: /verdaccio/storage
auth:
  htpasswd:
    file: /verdaccio/conf/htpasswd
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
packages:
  '**':
    access: $all
    publish: $authenticated
    proxy: npmjs
listen: 0.0.0.0:4873
EOF
```

> 注意：某些教程会在 htpasswd 栏中添加配置 max_users: -1 以表示不限制用户数。这是旧版本的做法，新版本设置为 -1 会被认为是 0 不允许注册，这会导致 pnpm adduser 失败

2. 启动容器，并挂载数据目录

```bash
V_PATH=~/verdaccio; docker run -it --rm --name verdaccio \
  -p 4873:4873 \
  -v $V_PATH/conf:/verdaccio/conf \
  -v $V_PATH/storage:/verdaccio/storage \
  -v $V_PATH/plugins:/verdaccio/plugins \
  verdaccio/verdaccio
```

docker 容器停止后，注册账号数据和上传的包会持久化在本机的 `~/verdaccio` 目录下，下次启动容器时，继续挂载该目录到容器的 `/verdaccio` 目录，即可从该目录加载数据。

# 安装多版本Chrome浏览器

本文旨在介绍如何在Windows电脑上同时安装多个Chrome浏览器.


## 步骤

0. 前提: 已下载所需Chrome版本的**离线安装包**, 注意: 离线安装包是一个至少几十M的`.exe`文件, 而安装器一般不到10M, 注意甄别. 本文以Chrome71版本为例, 可供参考的下载地址见文末.

1. 新建一个空文件夹, 建议以Chrome版本号作为文件夹名称. 以下以`chrome71`为例.

2. 解压离线安装包, 将得到的`Chrome-bin`文件夹放至`chrome71/APP/`, 当前文件结构如下:

```shell
chrome71
└── APP
    └── Chrome-bin
```

3. 在`https://portableapps.com/apps/internet/google_chrome_portable`下载Chrome启动器,
解压提取其中的`GoogleChromePortable.exe`文件, 移动至`chrome71`, 当前文件结构如下:

```shell
chrome71
├── APP
│   └── Chrome-bin
└── GoogleChromePortable.exe
```

4. 双击`GoogleChromePortable.exe`启动71版本的chrome, 此时会自动在`chrome71`文件夹下生成`Data`文件夹,
用于存放chrome相关数据, 以此即可实现多版本浏览器数据隔离, 此时文件结构如下:

```shell
chrome71
├── APP
│   └── Chrome-bin
├── GoogleChromePortable.exe
└── Data
```


## 注意

1. 下载的所有安装包资源, 都需要验证数字签名, 避免被植入恶意代码.
2. 以下列出的chrome离线安装包下载地址仅供参考, 本文不对其完整性和安全性负责.


## 参考

- [同一操作系统中安装多个不同版本谷歌Chrome浏览器](https://blog.csdn.net/weixin_43882265/article/details/125928571)
- [下载Chrome启动器](https://portableapps.com/apps/internet/google_chrome_portable)
- [手动制作 Chrome 浏览器多版本共存，可快速切换各个版本](https://liubing.me/article/other/chrome-multiple-versions.html)
- [自己制作Chrome便携版实现多版本共存](https://www.cnblogs.com/xiangyuecn/p/10583788.html)
- [Chrome浏览器最新离线版下载](https://www.chromedownloads.net/)
- [同一操作系统安装多个不同版本谷歌chrome浏览器](https://www.jianshu.com/p/ce848fd3674e)
- [Google Chrome Older Versions Download (Windows, Linux & Mac)](https://www.slimjet.com/chrome/google-chrome-old-version.php)


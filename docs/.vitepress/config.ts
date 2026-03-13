// import { version } from "../../package.json";
import { opendir } from "node:fs/promises";
import { env, exit } from "node:process";
import { URL } from "node:url";

let nav: { text: string; activeMatch: string; link: string }[] = [];
let sidebar: Record<string, { text: string; link: string }[]> = {};

/**
 * 自动生成 nav 和 sidebar
 * 文件夹或md文件以'__DEV__'开头时, 仅在开发时展示, 不能有__DEV__index.md否则默认导航会找不到首页
 */
(async () => {
  try {
    const dir = await opendir(new URL("../", import.meta.url));
    for await (const dirent of dir) {
      const dirName = dirent.name;
      // 1. dir
      // 2. not .xx
      if (dirent.isDirectory() && !dirName.startsWith(".") && dirName !== "public") {
        // 部分还在进行中的文档只在开发时展示
        if (env.NODE_ENV === "production" && dirName.startsWith("__DEV__")) {
          continue;
        }

        nav.push({
          text: dirName.toUpperCase(),
          activeMatch: `/${dirName}/`,
          link: `/${dirName}/`,
        });

        let sidebarArr: { text: string; link: string }[] = [];
        const cDir = await opendir(new URL(`../${dirName}`, import.meta.url));
        for await (const cDirName of cDir) {
          if (cDirName.isFile() && cDirName.name.endsWith(".md")) {
            const file = await open(new URL(`../${dirName}/${cDirName.name}`, import.meta.url));
            try {
              const contents = await file.readFile({ encoding: "utf8" });
              const lines = contents.split(/\n+/);
              const title = lines[0].split(/#\s+/)[1];
              const cname = cDirName.name.replace(/\.md$/, "");

              sidebarArr.push({
                text: title,
                link: cname === "index" ? `/${dirName}/` : `/${dirName}/${cname}`,
              });
            } finally {
              await file.close();
            }
          }
        }

        sidebar[`/${dirName}/`] = sidebarArr;
      }
    }
  } catch (err) {
    console.error(err);
    exit(1);
  }
})();

export default {
  base: "/note/",
  // outDir: "../docs",

  lang: "zh-CN",
  title: "Note",
  description: "VitePress 驱动的个人笔记.",

  lastUpdated: true,
  cleanUrls: false,

  head: [
    ["meta", { name: "theme-color", content: "#3c8772" }],
    ["link", { rel: "icon", href: "/note/favicon.ico" }],
  ],

  markdown: {
    headers: {
      level: [0, 0],
    },
  },

  themeConfig: {
    search: {
      provider: "local",
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: "搜索文档",
                buttonAriaLabel: "搜索文档",
              },
              modal: {
                noResultsText: "无法找到相关结果",
                resetButtonTitle: "清除查询条件",
                footer: {
                  selectText: "选择",
                  navigateText: "切换",
                  closeText: "关闭搜索框",
                },
              },
            },
          },
        },
      },
    },

    nav,
    sidebar,

    socialLinks: [
      { icon: "github", link: "https://github.com/susususutie/note" },
    ],
    outlineTitle: "文档目录",
    outline: [2, 3],

    // 下列许多label只在窄屏下才会显示, 例如切换按钮收缩到下拉框时才会展示
    darkModeSwitchLabel: "切换主题",
    sidebarMenuLabel: "菜单",
    returnToTopLabel: "回到顶部",
    editLink: {
      pattern: "https://github.com/susususutie/note/edit/main/docs/:path",
      text: "在 GitHub 上编辑",
    },
    footer: {
      message: "蛤? 👓",
      copyright: "Copyright © 2023 sutie",
    },
    lastUpdatedText: "更新时间",
    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },
  },
};

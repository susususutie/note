// import { version } from "../../package.json";
import { open, opendir } from "node:fs/promises";
import { exit, env } from "node:process";
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
            if (env.NODE_ENV === "production" && cDirName.name.startsWith("__DEV__")) {
              // continue;
            }

            const cname = cDirName.name.split(".md")[0];

            const file = await open(new URL(`../${dirName}/${cDirName.name}`, import.meta.url));
            const contents = await file.readFile({ encoding: "utf8" });
            const lines = contents.split(/\n+/);
            const title = lines[0].split(/#\s+/)[1];

            sidebarArr.push({
              text: title,
              link: cname === "index" ? `/${dirName}/` : `/${dirName}/${cname}`,
            });
            file.close();
          }
        }

        sidebar[`/${dirName}/`] = sidebarArr;
      }
    }
  } catch (err) {
    console.error(err);
    exit(1);
  }
  // exit(1);
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
      {
        icon: {
          svg: '<svg width="24px" height="24px" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg"><path d="M11.984 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.016 0zm6.09 5.333c.328 0 .593.266.592.593v1.482a.594.594 0 0 1-.593.592H9.777c-.982 0-1.778.796-1.778 1.778v5.63c0 .327.266.592.593.592h5.63c.982 0 1.778-.796 1.778-1.778v-.296a.593.593 0 0 0-.592-.593h-4.15a.592.592 0 0 1-.592-.592v-1.482a.593.593 0 0 1 .593-.592h6.815c.327 0 .593.265.593.592v3.408a4 4 0 0 1-4 4H5.926a.593.593 0 0 1-.593-.593V9.778a4.444 4.444 0 0 1 4.445-4.444h8.296z"/></svg>',
        },
        link: "https://gitee.com/susususutie/note",
      },
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

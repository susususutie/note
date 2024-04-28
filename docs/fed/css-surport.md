# CSS Property Surport

检查浏览器是否支持某个 css 特性, 有以下几种方案

1. `CSS.supports()` [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/CSS/supports_static)

```javascript
CSS.supports("gap", "12px");
// true
```

2. `@supports` (TODO)

3. `document.body.style`

```javascript
"opacity" in document.body.style;
// true
```

4. `style`

```javascript
const ele = document.createElement("div");
ele.style.rowGap = "12px";

ele.style.rowGap === "12px";
// true
```

5. 往页面插入元素, 计算 css 规则是否生效(最可靠)

以上方案(除去 2 未验证)都有个缺陷, 只能判断浏览器是否支持该 css, 但无法判断该 css 规则是否真的生效. 比如在 chrome72 中, 可以在 css 中写 gap 属性, 但浏览器实际并不支持, 只是不会报错, 但也不会生效. 这种时候只能实际生成元素, 插入文档中然后计算元素尺寸以此间接判断 css 是否生效. 以下是一个判断浏览器是否支持 gap 的实现, 来自`ant-design`[源码](https://github.com/ant-design/ant-design/blob/4.24.16/components/_util/styleChecker.tsx)

```javascript
const flex = document.createElement("div");
flex.style.display = "flex";
flex.style.flexDirection = "column";
flex.style.rowGap = "1px";

flex.appendChild(document.createElement("div"));
flex.appendChild(document.createElement("div"));

document.body.appendChild(flex);
flexGapSupported = flex.scrollHeight === 1; // 为true时说明支持gap
document.body.removeChild(flex);
```

## refs

- [stackoverflow How to check if a CSS property or value is supported by a browser?](https://stackoverflow.com/questions/36191797/how-to-check-if-a-css-property-or-value-is-supported-by-a-browser)

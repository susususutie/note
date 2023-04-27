# 离屏 Canvas(OffscreenCanvas)

## 定义

离屏 Canvas(OffscreenCanvas) 是 HTML5 提供的一个 API，可以在 Web Worker 中创建一个 Canvas 对象，这个对象没有对应的在 DOM 树中显示的 Canvas 元素，可用于在后台线程中执行复杂的绘图操作，而不会影响主线程的性能。

OffscreenCanvas 的主要作用是在 Web 应用程序中进行高效的图形处理。传统的 Canvas 绘图是在主线程中进行的，如果进行复杂的绘图操作，会占用主线程的资源，导致页面卡顿。使用 OffscreenCanvas 可以将复杂的绘图操作转移到 Web Worker 中，在后台线程中完成，避免了对主线程的影响，从而提高了 Web 应用程序的性能和用户体验。

## 与普通 canvas 的区别

OffscreenCanvas 与传统的 Canvas 对象非常相似，都同时支持 2D 和 WebGL 渲染上下文。不同的是，OffscreenCanvas 是在 Web Worker 中创建的，只能在 Web Worker 中使用, 并且不能直接显示在页面中。需要将绘制结果传递给主线程进行显示。

具体来说，OffscreenCanvas 的优势在于：

**多线程处理**
OffscreenCanvas 可以在 Web Worker 中进行多线程处理，不会阻塞主线程，从而提高页面的性能和响应速度。

**内存使用**
OffscreenCanvas 可以在 Web Worker 中创建，因此可以使用更多的内存进行图像处理。而普通的 Canvas 则受制于浏览器限制的内存大小。

**安全性**
由于 OffscreenCanvas 是在 Web Worker 中创建的，因此可以更好地保护页面的安全性，避免了恶意脚本的攻击。

## 浏览器支持情况

OffscreenCanvas 是一个实验性的特性, 但已获得所有主流浏览器的支持:

| 浏览器  | 支持版本 |
| :------ | :------- |
| Chrome  | >= 69    |
| Edge    | >= 79    |
| Safari  | >= 16.4  |
| Firefox | >= 105   |

## 如何使用

1. 创建 OffscreenCanvas 对象, 并传递给 Worker

在主线程中使用 `new OffscreenCanvas(width, height)` 方法创建 OffscreenCanvas 对象，其中 `width` 和 `height` 分别是 OffscreenCanvas 的宽度和高度。需要注意的是，OffscreenCanvas 不会被添加到 DOM 树中，因此不会显示在页面上，只能在 Web Worker 中进行绘图操作。

2. 在 Worker 中进行绘图操作, 并将绘图结果回传给主线程

在 `Web Worker` 中使用 `OffscreenCanvas.transferToImageBitmap()` 方法将 `OffscreenCanvas` 对象转换为 `ImageBitmap` 对象，并使用 `ImageBitmap` 对象进行绘图操作。可以使用 `CanvasRenderingContext2D` 或 `WebGL` 等 API 进行绘图，完成后将结果通过 `postMessage()` 方法发送回主线程，在主线程中将结果绘制到 Canvas 元素上。

需要注意的是，由于 OffscreenCanvas 在 Web Worker 中创建，因此需要注意跨线程通信的问题。可以通过 postMessage()方法在主线程和 Worker 线程之间进行通信，从而实现数据的传递和共享。

下面是一个简单的示例代码：

```js
// main.js
// 在主线程中创建 OffscreenCanvas 对象, 将其传递给Worker
// 并等待 Worker 传回的绘制结果, 将结果绘制在主线程的普通 Canvas 上
const offscreen = new OffscreenCanvas(300, 300);
const worker = new Worker("worker.js");

worker.postMessage({ canvas: offscreen }, [offscreen]);

worker.onmessage = function (event) {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.drawImage(event.data.imageBitmap, 0, 0);
};

// worker.js
// 在 Worker 线程中拿到 OffscreenCanvas 对象, 进行绘图操作
// 并将绘制结果传回主线程展示
self.onmessage = function (event) {
  const offscreen = event.data.canvas;
  const context = offscreen.getContext("2d");

  context.fillStyle = "red";
  context.fillRect(0, 0, 300, 300);

  const imageBitmap = offscreen.transferToImageBitmap();
  self.postMessage({ imageBitmap }, [imageBitmap]);
};
```

这个示例代码创建一个 300x300 的 OffscreenCanvas 对象，在 Worker 线程中绘制一个红色的矩形，并将结果通过 ImageBitmap 对象发送回主线程，最终将结果绘制到页面上的 Canvas 元素上。

另一种使用方法是, 将主线程现有的 canvas 元素转换成离屏 canvas, 将控制权转交给 worker, 在 worker 中绘制 canvas, 而不需要再通过 web worker 通信来传递绘制的效果

1. 使用 `HTMLCanvasElement.transferControlToOffscreen()` 从主线程的 HTMLCanvasElement 对象返回一个 OffscreenCanvas 对象
2. 将 OffscreenCanvas 传递给 worker, 直接在 worker 中更新 canvas

```js
// main.js
const offscreen = document
  .getElementById("canvas")
  .transferControlToOffscreen();
worker.postMessage({ canvas: offscreen }, [offscreen]);

// worker.js
onmessage = (event) => {
  const offscreen = event.data.canvas;
  const context = offscreen.getContext("2d");

  context.fillStyle = "red";
  context.fillRect(0, 0, 300, 300);
};
```

## 应用场景

**图像处理**
OffscreenCanvas 可以在 Web Worker 中对大量图像进行处理，从而提高页面性能。例如，可以使用 OffscreenCanvas 进行图像压缩, 尺寸缩放、风格滤镜、颜色调整等操作，从而实现前端图片处理。

**数据可视化**
OffscreenCanvas 可以用于可视化大屏中的高性能绘图，例如在绘制大量数据点时，可以使用 OffscreenCanvas 进行绘图，从而提高页面性能和响应速度。

## ref

- [CanIUse OffScreenCanvas 浏览器支持](https://caniuse.com/mdn-api_offscreencanvas)
- [MDN OffScreenCanvas](https://developer.mozilla.org/zh-CN/docs/Web/API/OffscreenCanvas)
- [使用 OffscreenCanvas 提升 Canvas 性能](https://juejin.cn/post/7026887864289853470)

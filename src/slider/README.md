# Slider

> Gui 的 Slider 缩略轴组件。

## 使用

```js
import { Slider } from '@antv/gui';

const slider = new Slider({ ... });
```

- 配置

```ts
```

- 事件


```ts
slider.on('sliderchange', (range) => {
  const [ start, end ] = range;
  // do something with selected range
});
```

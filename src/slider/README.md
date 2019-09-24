# Slider

> Gui 的 Slider 缩略轴组件。

## 使用

```js
import { Slider } from '@antv/gui';

const slider = new Slider({ ...cfg });
```

- 配置

```ts
export interface SliderCfg {
  // position size
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  // 背景趋势图组件的配置（不传则不需要背景）
  readonly trendCfg?: TrendCfg;
  // style
  readonly backgroundStyle?: CSSStyleDeclaration;
  readonly foregroundStyle?: CSSStyleDeclaration;
  readonly handlerStyle?: CSSStyleDeclaration;
  readonly textStyle?: CSSStyleDeclaration;
  // 初始位置
  readonly start?: number;
  readonly end?: number;
  // 最大最小文本
  readonly minText?: string;
  readonly maxText?: string;
}
```

- 事件

```ts
slider.on('sliderchange', (range) => {
  const [start, end] = range;
  // do something with selected range
});
```

- API

```ts
// 更新一些配置
// 位置，大小
// 滑块文本和位置
slider.update({
  x,
  y,
  width,
  height,
  minText,
  maxText,
  start,
  end,
});
```

## License

MIT.

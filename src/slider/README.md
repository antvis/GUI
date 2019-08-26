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
  // style
  readonly backgroundStyle?: CSSStyleDeclaration;
  readonly foregroundStyle?: CSSStyleDeclaration;
  readonly handlerStyle?: CSSStyleDeclaration;
  readonly textStyle?: CSSStyleDeclaration;
  // 初始位置
  readonly start?: number;
  readonly end?: number;
}
```

- 事件


```ts
slider.on('sliderchange', (range) => {
  const [ start, end ] = range;
  // do something with selected range
});
```

 - API
 
```ts
// 选中 0.2 ~ 0.8 范围
slider.setRange(0.2, 0.8);
```


## License

MIT.

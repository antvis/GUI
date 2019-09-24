# Slider

> Gui 的 Trend 趋势的缩略图，包含折线趋势、面积趋势。

## 使用

```js
import { Trend } from '@antv/gui';

const trend = new Trend({ ...cfg });
```

- 配置

```ts
export interface TrendCfg {
  // 位置大小
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
  // 数据
  readonly data?: number[];
  // 样式
  readonly smooth?: boolean;
  readonly isArea?: boolean;
  readonly backgroundStyle?: object;
  readonly lineStyle?: object;
  readonly areaStyle?: object;
}
```

- 事件

无

- API

无

## License

MIT.

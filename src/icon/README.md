# Icon

> Gui 的 Icon 组件，目前仅仅支持使用 iconfont 字体。

## 使用

```js
import { Icon } from '@antv/gui';

const icon = new Icon({ ... });
```

- 配置

```ts
export interface IconCfg {
  readonly position: Point;
  // icon 类型
  readonly icon: string;
  // 文本
  readonly text?: string;
  readonly margin?: number;
  // icon 样式
  readonly iconStyle?: object;
  // 文本样式
  readonly textStyle?: object;
}
```

- 事件

Icon 组件仅仅有点击事件的回调。

```ts
icon.on('click', () => {
  // do something
});
```

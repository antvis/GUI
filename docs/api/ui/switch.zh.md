---
title: Switch
order: 8
---

# 开关选择器

> 需要表示开关状态/两种状态之间的切换时。

## 引入

```ts
import { Switch } from '@antv/gui';
```

## 开关配置项

| **属性**          | **描述**         | **类型**                               | **默认值** |
| ----------------- | ---------------- | -------------------------------------- | ---------- |
| x                 | 起点 x 坐标位置  | <code>number</code>                    | `-`        |
| y                 | 起点 y 坐标位置  | <code>number</code>                    | `-`        |
| size              | 开关大小         | <code>'small' &#124; 'default'</code>  | `default`  |
| disabled          | 不可选           | <code>boolean</code>                   | `false`    |
| checked           | 指定当前是否选中 | <code>boolean<code>                    | `-`        |
| defaultChecked    | 初始是否选中     | <code>boolean<code>                    | `true`     |
| checkedChildren   | 选中时的内容     | <code>TagCfg<code>                     | `-`        |
| unCheckedChildren | 选中时的内容     | <code>TagCfg<code>                     | `-`        |
| onChange          | 变化时回调函数   | <code>function(checked: boolean)<code> | `-`        |
| onClick           | 点击时回调函数   | <code>function(checked: boolean)<code> | `-`        |
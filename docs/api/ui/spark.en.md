---
title: Spark
order: 6
---

# Spark

> A mini-chart is a very small line/bar chart that is usually drawn without axes or coordinates. It represents the general shape of changes in some measures in a simple and highly condensed manner.

## Usage

```ts
import { Spark } from '@antv/gui';
```

## Options

| **Property** | **Description**          | **Type**                                                 | **Default**                                              |
| ------------ | ------------------------ | -------------------------------------------------------- | -------------------------------------------------------- |
| type         | type of spark            | <code>line &#124; bar </code>                            | `default`                                                |
| width        | width                    | <code>number</code>                                      | `200`                                                    |
| height       | height                   | <code>number<code>                                       | `20`                                                     |
| data         | data of spark            | <code>number[] &#124; number[][]<code>                   | `[]`                                                     |
| isStack      | whether to stack         | <code>boolean<code>                                      | `false`                                                  |
| color        | color of visual elements | <code>color &#124; color[] &#124; (index) => color<code> | `'#83daad', '#edbf45', '#d2cef9', '#e290b3', '#6f63f4']` |
| smooth       | use smooth curves        | <code>boolean<code>                                      | `true`                                                   |
| lineStyle    | custom line styles       | <code>StyleAttr<code>                                    | `[]`                                                     |
| areaStyle    | custom area styles       | <code>StyleAttr<code>                                    | `[]`                                                     |
| isGroup      | whether to group series  | <code>boolean<code>                                      | `false`                                                  |
| columnStyle  | custom column styles     | ShapeAttrs                                               | `[]`                                                     |

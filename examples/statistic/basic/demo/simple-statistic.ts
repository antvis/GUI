import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Statistic } from '@antv/gui';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

// @ts-ignore
const canvas = new Canvas({
  container: 'container',
  width: 300,
  height: 300,
  renderer,
});

// 千位符
const groupSeparatorChange = (value: string, groupSeparator: string | number): string =>
  value.replace(/(\d)(?=(?:\d{3})+$)/g, `$&${groupSeparator}`);

// 适配text 的 千位符 精度
const getValueAdapter = (initValue) => {
  // 转化为 string 类型
  const value = typeof initValue === 'number' ? initValue.toString() : initValue;

  // 精度
  const precision = 2;

  if (/^[0-9]*(\.[0-9]*)?$/.test(value)) {
    // 没有 除数字和.外的其他字符
    const valueList = value.split('.');

    // 小数点
    const valueFloat = valueList[1]
      ? Number(`.${valueList[1]}`.slice(0, precision + 1))
          .toFixed(precision)
          .replace('0', '')
      : precision
      ? `.${new Array(precision + 1).join('0')}`
      : '';

    // 整型 添加千位符
    const valueInt = groupSeparatorChange(valueList[0], ',');

    return `${valueInt}${valueFloat}`;
  }

  return value;
};

const statistic = new Statistic({
  attrs: {
    x: 0,
    y: 0,
    title: {
      text: 'Simple statistic',
      style: {
        fontSize: 14, // 字体大小
        fill: '#00000073', // 颜色
      },
    },
    value: {
      text: '55515.151',
      style: {
        fontSize: 24,
        fill: '#000000d9',
      },
      formatter: (v) => getValueAdapter(v),
    },
  },
});

canvas.appendChild(statistic);

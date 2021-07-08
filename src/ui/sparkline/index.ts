import { Path, Rect } from '@antv/g';
import { clone, deepMix, isNumber, isArray, isFunction } from '@antv/util';
import { Linear, Band } from '@antv/scale';
import { PathCommand } from '@antv/g-base';
import { Data, SparklineOptions } from './types';
import {
  dataToLines,
  lineToLinePath,
  lineToCurvePath,
  linesToAreaPaths,
  linesToStackAreaPaths,
  linesToStackCurveAreaPaths,
} from './path';
import { getRange, getStackedData } from './utils';
import { CustomElement, DisplayObject } from '../../types';

export { SparklineOptions };

export class Sparkline extends CustomElement {
  public static tag = 'Sparkline';

  private static defaultOptions = {
    attrs: {
      type: 'line',
      width: 200,
      height: 20,
      // data: [],
      isStack: false,
      color: ['#83daad', '#edbf45', '#d2cef9', '#e290b3', '#6f63f4'],
      smooth: true,
      lineStyle: {
        lineWidth: 1,
      },
      isGroup: false,
      columnStyle: {
        lineWidth: 1,
        stroke: '#fff',
      },
      barPadding: 0.1,
    },
  };

  private sparkShapes: DisplayObject;

  constructor(options: SparklineOptions) {
    super(deepMix({}, Sparkline.defaultOptions, options));
    this.init();
  }

  attributeChangedCallback(name: string, value: any) {
    // 如果type变了，需要清空this.sparkShapes子元素
    if (name === 'type') {
      this.sparkShapes.removeChildren();
    }
    console.log(name, value);
  }

  public update(attrs: SparklineOptions['attrs']) {
    this.attr(attrs);
    this.init();
  }

  private init() {
    const { data, type } = this.attributes;
    this.createContainer();
    if (!data) return;
    switch (type) {
      case 'line':
        this.createLine();
        break;
      case 'column':
        this.createBar();
        break;
      default:
        break;
    }
  }

  /**
   * 根据数据索引获取color
   */
  private getColor(index: number) {
    const { color } = this.attributes;
    if (isArray(color)) {
      return color[index % color.length];
    }
    if (isFunction(color)) {
      return color.call(null, index);
    }
    return color;
  }

  /**
   * 根据数据生成scale
   */
  private createScales(data: number[][]) {
    const { type, width, height, isGroup, barPadding } = this.attributes;
    const [minVal, maxVal] = getRange(data);
    return {
      type,
      x:
        type === 'line'
          ? new Linear({
              domain: [0, data[0].length - 1],
              range: [0, width],
            })
          : new Band({
              domain: data[0].map((val, idx) => idx),
              range: [0, width],
              paddingInner: isGroup ? barPadding : 0,
            }),
      y: new Linear({
        domain: [minVal >= 0 ? 0 : minVal, maxVal],
        range: [height, 0],
      }),
    };
  }

  /**
   * 将data统一格式化为数组形式
   * 如果堆叠，则生成堆叠数据
   */
  private getData(): Data {
    const { data: _ } = this.attributes;
    let data = clone(_);
    // number[] -> number[][]
    if (isNumber(data[0])) {
      data = [data];
    }
    return data;
  }

  private createContainer() {
    const { width, height } = this.attributes;
    if (!this.sparkShapes) {
      this.sparkShapes = new Rect({
        attrs: {},
      });
      this.appendChild(this.sparkShapes);
    }
    this.sparkShapes.attr({ width, height });
  }

  /**
   * 创建迷你折线图
   */
  private createLine() {
    const { isStack, lineStyle, smooth, areaStyle, width } = this.attributes;
    let data = this.getData();
    if (isStack) data = getStackedData(data);
    const { x, y } = this.createScales(data) as { x: Linear; y: Linear };
    const lines = dataToLines(data, { type: 'line', x, y });
    const linesPaths: PathCommand[][] = [];
    // 线条path
    lines.forEach((line) => {
      linesPaths.push(smooth ? lineToCurvePath(line) : lineToLinePath(line));
    });
    // 绘制线条
    linesPaths.forEach((path, idx) => {
      const id = `line-path-${idx}`;
      let el = this.getElementById(id);
      if (!el) {
        el = new Path({
          id,
          name: 'line',
          attrs: {},
        });
        this.sparkShapes.appendChild(el);
      }
      el.attr({ path, stroke: this.getColor(idx), ...lineStyle });
    });

    // 生成area图形
    if (areaStyle) {
      const range = getRange(data);
      const baseline = y.map(range[0] < 0 ? 0 : range[0]);
      // 折线、堆叠折线和普通曲线直接
      let areaPaths: PathCommand[][];
      if (isStack) {
        areaPaths = smooth
          ? linesToStackCurveAreaPaths(lines, width, baseline)
          : linesToStackAreaPaths(lines, width, baseline);
      } else {
        areaPaths = linesToAreaPaths(lines, smooth, width, baseline);
      }

      areaPaths.forEach((path, idx) => {
        const id = `line-area-${idx}`;
        let el = this.getElementById(id);
        if (!el) {
          el = new Path({
            name: 'area',
            id: `line-area-${idx}`,
            attrs: {},
          });
          this.sparkShapes.appendChild(el);
        }
        el.attr({ path, fill: this.getColor(idx), ...areaStyle });
      });
    }
  }

  /**
   * 创建mini柱状图
   */
  private createBar() {
    const { isStack, height, columnStyle } = this.attributes;
    let data = this.getData();
    if (isStack) data = getStackedData(data);
    const { x, y } = this.createScales(data) as {
      x: Band;
      y: Linear;
    };
    const [minVal, maxVal] = getRange(data);
    const heightScale = new Linear({
      domain: [0, maxVal - (minVal > 0 ? 0 : minVal)],
      range: [0, height],
    });

    const bandWidth = x.getBandWidth();
    const rawData = this.getData();

    data.forEach((column, i) => {
      column.forEach((val, j) => {
        const id = `column-${i}-${j}`;
        let el = this.getElementById(id);
        const barWidth = bandWidth / data.length;
        if (!el) {
          el = new Rect({
            name: 'column',
            id: `column-${i}-${j}`,
            attrs: {},
          });
          this.sparkShapes.appendChild(el);
        }
        el.attr({
          fill: this.getColor(i),
          ...columnStyle,
          ...(isStack
            ? {
                x: x.map(j),
                y: y.map(val),
                width: bandWidth,
                height: heightScale.map(rawData[i][j]),
              }
            : {
                x: x.map(j) + barWidth * i,
                y: val >= 0 ? y.map(val) : y.map(0),
                width: barWidth,
                height: heightScale.map(Math.abs(val)),
              }),
        });
      });
    });
  }
}

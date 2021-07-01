import { Path, Rect } from '@antv/g';
import { clone, deepMix, isNumber, isEqual, isArray, isFunction } from '@antv/util';
import { catmullRom2Bezier } from '@antv/path-util';
import { Linear, Band } from '@antv/scale';
import { SparkOptions } from './types';
import { CustomElement, DisplayObject } from '../../types';

type Point = [number, number];
type PathCommand = any[][][];

export { SparkOptions };

export class Spark extends CustomElement {
  public static tag = 'Spark';

  private static defaultOptions = {
    attrs: {
      type: 'line',
      width: 200,
      height: 20,
      data: [],
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

  private reverseCurve: any[][];

  constructor(options: SparkOptions) {
    super(deepMix({}, Spark.defaultOptions, options));
    this.init();
  }

  attributeChangedCallback(name: string, value: any) {
    console.log(name, value);
  }

  private init() {
    const { x, y, type, width, height } = this.attributes;
    this.sparkShapes = new Rect({
      attrs: {
        x,
        y,
        width,
        height,
      },
    });
    this.appendChild(this.sparkShapes);
    switch (type) {
      case 'line':
        this.createLine();
        break;
      case 'bar':
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
    let minY = Infinity;
    let maxY = -Infinity;
    data.forEach((item) => {
      item.forEach((d) => {
        minY = d < minY ? d : minY;
        maxY = d > maxY ? d : maxY;
      });
    });

    return {
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
        domain: [minY, maxY],
        range: [height, 0],
      }),
    };
  }

  /**
   * 根据点数据生成折线path
   */
  private pointsToLine(points: Point[]) {
    return points.map((point, idx) => [idx === 0 ? 'M' : 'L', ...point]);
  }

  /**
   * 根据点数据生成曲线path
   */
  private pointsToCurve(points: Point[]) {
    if (points.length <= 2) {
      return this.pointsToLine(points);
    }
    const data = [];
    points.forEach((point) => {
      if (!isEqual(point, data.slice(data.length - 2))) {
        data.push(...point);
      }
    });
    const path = catmullRom2Bezier(data, false);
    path.unshift(['M', 0, 0], ['M', ...points[0]]);
    return path;
  }

  /**
   * 将折线转化为封闭path
   */
  private pathToArea(paths: PathCommand, yScale: Linear): PathCommand {
    const { width, isStack } = this.attributes;
    const areaPaths = clone(paths);
    const basePath = () => {
      const split = yScale.map(0);
      return [['L', width, split], ['L', 0, split], ['Z']];
    };

    for (let idx = paths.length - 1; idx >= 0; idx -= 1) {
      const curr = areaPaths[idx];
      if (isStack) {
        // 如果是最底下的线，则以y=0为基线
        // 其余线以其下方线为基线
        if (idx === 0) {
          curr.push(...basePath());
        } else {
          // 判断折线、曲线
          if (curr[1][0] === 'L') {
            const prev = clone(areaPaths[idx - 1]);
            // 直接连接成封闭图形
            prev.reverse();
            prev.forEach((point) => {
              curr.push(['L', ...point.slice(-2)]);
            });
          } else {
            // TODO 一系列骚操作，后期待优化
            const prevPathReversed = this.reverseCurve[idx - 1];
            prevPathReversed.shift();
            prevPathReversed[0][0] = 'L';
            curr.push(...prevPathReversed, curr[1]);
          }
          curr.push(['Z']);
        }
      } else {
        // 0 基准线
        curr.push(...basePath());
      }
    }
    return areaPaths;
  }

  /**
   * 将data统一格式化为数组形式
   * 如果堆叠，则生成堆叠数据
   */
  private getData(): number[][] {
    const { data: _, isStack } = this.attributes;
    let data = clone(_);
    // 将number[] -> number[][]
    if (isNumber(data[0])) {
      data = [data];
    }
    if (isStack) {
      // 生成堆叠数据
      for (let i = 1; i < _.length; i += 1) {
        const datum = data[i];
        for (let j = 0; j < datum.length; j += 1) {
          datum[j] += data[i - 1][j];
        }
      }
    }
    return data;
  }

  /**
   * 创建迷你折线图
   */
  private createLine() {
    const { lineStyle, smooth, areaStyle } = this.attributes;
    const data = this.getData();
    const { x, y } = this.createScales(data);
    const linesPath = data.map((points) => {
      const _ = points.map((val: number, idx: number) => {
        return [x.map(idx), y.map(val)] as Point;
      });
      if (smooth && areaStyle) {
        // 同时生成反向曲线
        if (!this.reverseCurve) {
          this.reverseCurve = [];
        }
        this.reverseCurve.push(this.pointsToCurve(clone(_).reverse()));
      }
      return smooth ? this.pointsToCurve(_) : this.pointsToLine(_);
    });

    linesPath.forEach((path, idx) => {
      this.sparkShapes.appendChild(
        new Path({
          name: 'line',
          id: `line-path-${idx}`,
          attrs: {
            path,
            stroke: this.getColor(idx),
            ...lineStyle,
          },
        })
      );
    });

    // 生成area图形
    if (areaStyle) {
      this.pathToArea(linesPath, y).forEach((path, idx) => {
        this.sparkShapes.appendChild(
          new Path({
            name: 'area',
            id: `line-area-${idx}`,
            attrs: {
              path,
              fill: this.getColor(idx),
              ...areaStyle,
            },
          })
        );
      });
    }

    // return lines;
  }

  /**
   * 创建mini柱状图
   */
  private createBar() {
    const { isStack, height, columnStyle } = this.attributes;
    const data = this.getData();
    const { x, y } = this.createScales(data) as {
      x: Band;
      y: Linear;
    };
    const bandWidth = x.getBandWidth();

    data.forEach((column, i) => {
      column.forEach((val, j) => {
        const barWidth = bandWidth / data.length;
        this.sparkShapes.appendChild(
          new Rect({
            name: 'bar',
            id: `bar-${i}-${j}`,
            attrs: {
              y: y.map(val),
              height: height - y.map(val) - (i > 0 ? 40 - y.map(data[i - 1][j]) : 0),
              fill: this.getColor(i),
              ...columnStyle,
              ...(isStack
                ? {
                    x: x.map(j),
                    width: bandWidth,
                    height: height - y.map(val) - (i > 0 ? 40 - y.map(data[i - 1][j]) : 0),
                  }
                : { x: x.map(j) + barWidth * i, width: barWidth, height: height - y.map(val) }),
            },
          })
        );
      });
    });
  }
}

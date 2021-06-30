import { Path, Rect } from '@antv/g';
import { deepMix, head, isNumber, isEqual } from '@antv/util';
import { catmullRom2Bezier } from '@antv/path-util';
import { Linear } from '@antv/scale';
import { SparkOptions } from './types';
import { CustomElement, DisplayObject } from '../../types';

type Point = [number, number];

export { SparkOptions };

export class Spark extends CustomElement {
  public static tag = 'Spark';

  private static defaultOptions = {
    attrs: {
      type: 'line',
      width: 200,
      height: 20,
      isStack: false,
      smooth: true,
      lineStyle: {
        lineWidth: 1,
        stroke: '#80a5fb',
      },
      data: [],
    },
  };

  private sparkShapes: DisplayObject;

  constructor(options: SparkOptions) {
    super(deepMix({}, Spark.defaultOptions, options));
    this.init();
  }

  attributeChangedCallback(name: string, value: any) {
    console.log(name, value);
  }

  private init() {
    const { type, width, height } = this.attributes;
    this.sparkShapes = new Rect({
      attrs: {
        width,
        height,
        x: 0,
        y: 0,
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

  private createScale(data: number[][]) {
    const { width, height } = this.attributes;

    let minY = Infinity;
    let maxY = -Infinity;

    data.forEach((item) => {
      item.forEach((d) => {
        minY = d < minY ? d : minY;
        maxY = d > maxY ? d : maxY;
      });
    });
    return {
      x: new Linear({
        domain: [0, data[0].length - 1],
        range: [0, width],
      }),
      y: new Linear({
        domain: [minY, maxY],
        range: [height, 0],
      }),
    };
  }

  private pointsToPath(points: Point[]) {
    return points.map((point, idx) => [idx === 0 ? 'M' : 'L', ...point]);
  }

  private getSmoothLinePath(points: Point[]) {
    if (points.length <= 2) {
      return this.pointsToPath(points);
    }

    const data = [];
    points.forEach((point) => {
      if (!isEqual(point, data.slice(data.length - 2))) {
        data.push(...point);
      }
    });

    const path = catmullRom2Bezier(data, false);
    path.unshift(['M', ...head(points)]);

    return path;
  }

  private getProcessedData(): number[][] {
    const { data: _, isStack } = this.attributes;
    let data = _;
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

  private createLine() {
    const { height, smooth, lineStyle } = this.attributes;
    // const { height, color, smooth, lineStyle, areaStyle } = this.attributes;

    const data = this.getProcessedData();
    const { x, y } = this.createScale(data);

    const linesPath = data.map((points) => {
      const _ = points.map((val: number, idx: number) => {
        return [x.map(idx), y.map(val)] as Point;
      });
      console.log(_);

      return smooth ? this.getSmoothLinePath(_) : this.pointsToPath(_);
    });

    linesPath.forEach((path, idx) => {
      this.sparkShapes.appendChild(
        new Path({
          name: 'line',
          id: `line-path-${idx}`,
          attrs: {
            height,
            ...lineStyle,
            path,
          },
        })
      );
    });

    // return lines;
  }

  private createBar() {
    // const { data, width, height, isStack, color, isGroup, columnStyle } = this.attributes;
  }
}

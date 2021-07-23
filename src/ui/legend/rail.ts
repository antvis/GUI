import { isString } from '@antv/util';
import { CustomElement, Group, Path } from '@antv/g';
import type { PathCommand } from '@antv/g-base';
import type { RailCfg as defaultCfg } from './types';
import type { ShapeCfg } from '../../types';
import { createTrapezoidRailPath, createRectRailPath, getValueOffset } from './utils';

type RailCfg = defaultCfg & {
  min: number;
  max: number;
  start: number;
  end: number;
  color: string | string[];
  orient: 'horizontal' | 'vertical';
};

export default class Rail extends CustomElement {
  // 色板的path group
  private rail: Group;

  // 背景的path group
  private background: Group;

  constructor({ attrs, ...rest }: ShapeCfg & { attrs: RailCfg }) {
    super({ type: 'rail', attrs, ...rest });
    this.init();
  }

  attributeChangedCallback(name: string, value: any) {
    if (['type', 'chunked'].includes(name)) {
      this.render();
    } else {
      this.update(value);
    }
    if (['start', 'end'].includes(name)) {
      this.updateSelection();
    }
  }

  public init() {
    this.rail = new Group({
      name: 'pathGroup',
      id: 'railPathGroup',
    });
    this.appendChild(this.rail);
    this.background = new Group({
      name: 'backgroundGroup',
      id: 'railBackgroundGroup',
    });
    this.appendChild(this.background);
    this.render();
  }

  public render() {
    this.clear();
    const { width, color, backgroundColor, orient } = this.attributes;
    const railPath = this.createRailPath();
    const railBackgroundPath = this.createBackgroundPath();

    // 绘制背景
    railBackgroundPath.forEach((path) => {
      this.background.appendChild(
        new Path({
          name: 'background',
          attrs: {
            path,
            fill: backgroundColor,
          },
        })
      );
    });

    railPath.forEach((path, idx) => {
      // chunked的情况下，只显示start到end范围内的梯形
      this.rail.appendChild(
        new Path({
          name: 'railPath',
          attrs: {
            path,
            fill: isString(color) ? color : color[idx],
          },
        })
      );
    });
    // 根据orient对railPath旋转
    if (orient === 'vertical') {
      this.setOrigin(0, width);
      this.translateLocal(0, -width);
      // this.rotate(45);
      setTimeout(() => {
        this.rotate(45);
      });
    }
  }

  public update(railCfg: RailCfg) {
    // deepMix railCfg into this.attributes
    this.render();
  }

  /**
   * 设置选区
   */
  public updateSelection() {
    // 更新背景
    const backgroundPaths = this.createBackgroundPath();
    this.background.children.forEach((shape, index) => {
      shape.attr({
        path: backgroundPaths[index],
      });
    });
  }

  public clear() {
    this.rail.removeChildren();
    this.background.removeChildren();
  }

  private getOrientVal<T>(val1: T, val2: T) {
    const { orient } = this.attributes;
    return orient === 'horizontal' ? val1 : val2;
  }

  /**
   * 获取值对应的offset
   */
  private getValueOffset(value: number) {
    const { min, max, width, height } = this.attributes;
    return getValueOffset(value, min, max, this.getOrientVal(width, height));
  }

  /**
   * 生成rail path
   */
  private createRailPath() {
    const { width, height, type, chunked, start, end } = this.attributes;
    let railPath: PathCommand[][];
    // 颜色映射
    if (chunked) {
      railPath = this.createChunkPath();
    } else {
      const startOffset = this.getValueOffset(start);
      const endOffset = this.getValueOffset(end);
      switch (type) {
        case 'color':
          railPath = [createRectRailPath(width, height, 0, 0, startOffset, endOffset)];
          break;
        case 'size':
          railPath = [createTrapezoidRailPath(width, height, 0, 0, startOffset, endOffset)];
          break;
        default:
          break;
      }
    }
    return railPath;
  }

  /**
   * 分块连续图例下的path
   */
  private createChunkPath(): PathCommand[][] {
    const { width, height, min, max, type, ticks: _t } = this.attributes;
    const range = max - min;
    const [len, thick] = this.getOrientVal([width, height], [height, width]);
    // 每块四个角的位置
    const blocksPoints = [];

    // 插入端值
    const ticks = [min, ..._t, max];
    // 块起始位置
    let prevPos = 0;
    let prevThick = type === 'size' ? 0 : thick;
    for (let index = 1; index < ticks.length; index += 1) {
      const ratio = (ticks[index] - ticks[index - 1]) / range;
      const currLen = len * ratio;
      // 根据type确定形状
      const currThick = type === 'size' ? thick * ratio + prevThick : thick;
      const currPos = prevPos + currLen;
      blocksPoints.push([
        [prevPos, thick],
        [prevPos, thick - prevThick],
        [currPos, thick - currThick],
        [currPos, thick],
      ]);
      prevPos = currPos;
      prevThick = currThick;
    }
    const paths = [];
    blocksPoints.forEach((points) => {
      const path = [];
      points.forEach((point, index) => {
        path.push([index === 0 ? 'M' : 'L', ...point]);
      });
      path.push(['Z']);
      paths.push(path);
    });
    return paths;
  }

  /**
   * 场景背景掩膜
   */
  private createBackgroundPath() {
    const { width, height, min, max, start, end, type } = this.attributes;
    const startOffset = this.getValueOffset(start);
    const endOffset = this.getValueOffset(end);
    const minOffset = this.getValueOffset(min);
    const maxOffset = this.getValueOffset(max);
    const creator = type === 'size' ? createTrapezoidRailPath : createRectRailPath;

    return [creator(width, height, 0, 0, minOffset, startOffset), creator(width, height, 0, 0, endOffset, maxOffset)];
  }
}

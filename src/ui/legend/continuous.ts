import { Path } from '@antv/g';
import { deepMix } from '@antv/util';
import LegendBase from './base';
import { ContinuousCfg, ContinuousOptions } from './types';
import { DisplayObject } from '../../types';
import { Handle } from '../slider/handle';
import { Pair } from '../slider/types';

export class Continuous extends LegendBase<ContinuousCfg> {
  public static tag = 'Continuous';

  /**
   * 结构：
   * -backgroundShape
   *  |- railBackgroundShape
   *     |- rail
   *        |- startHandle
   *        |- endHandle
   *        |- indicator
   */

  // 色板
  private rail: DisplayObject;

  // 色板背景 形状跟随色板
  private railBackgroundShape: DisplayObject;

  // 开始滑块
  private startHandle: Handle;

  // 结束滑块
  private endHandle: Handle;

  /**
   * drag事件当前选中的对象
   */
  private target: string;

  protected static defaultOptions = {
    ...LegendBase.defaultOptions,
    color: 'red',
    label: {
      style: {
        stroke: 'black',
      },
      spacing: 10,
      formatter: (value: number) => value,
      align: 'rail',
      offset: [0, 0],
    },
    rail: {
      type: 'color',
      chunked: false,
      items: [],
      isGradient: 'auto',
    },
    // 不可滑动时隐藏手柄
    slidable: true,
    handler: {
      show: true,
      size: 16,
      spacing: 10,
      icon: {
        marker: 'default',
        style: {
          stroke: '#c5c5c5',
          fill: '#fff',
          lineWidth: 1,
        },
      },
      text: {
        style: {
          fill: '#63656e',
          textAlign: 'center',
          textBaseline: 'middle',
        },
        formatter: (value: number) => value,
      },
    },
  };

  constructor(options: ContinuousOptions) {
    super(deepMix({}, Continuous.defaultOptions, options));
  }

  public init() {}

  public update(attrs: ContinuousCfg) {}

  public clear() {}

  // 设置指示器
  public setIndicator(value: number) {}

  // 获取色板属性
  private getRailAttrs() {
    // 基于rail.type/chunked确定形状
  }

  // 创建色板
  private createRail() {}

  // 创建色板背景
  private createRailBackground() {
    // 连续色板直接使用path绘制单个图形
    // 分块色板需绘制多个图形
  }

  // 创建手柄
  private createHandles() {}

  /**
   * 绑定事件
   */
  private bindEvents() {
    // 各种hover事件
    // 拖拽事件
  }

  // 开始拖拽
  private onDragStart = (target: string) => (e) => {};

  // 拖拽
  private onDragging = (e) => {};

  // 结束拖拽
  private onDragEnd = () => {};

  /**
   * 获取颜色
   */
  private getColor() {}

  /**
   * 生成渐变色配置
   */
  private createGradientColor() {}

  /**
   * 根据方向取值
   */
  private getOrientVal<T>([x, y]: Pair<T>) {
    const { orient } = this.attributes;
    return orient === 'horizontal' ? x : y;
  }
}

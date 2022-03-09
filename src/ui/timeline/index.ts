import { deepMix } from '@antv/util';
import { GUIOption } from 'types';
import { GUI } from '../../core/gui';
import { Checkbox } from '../checkbox';
import type { TimelineCfg, TimelineOptions } from './types';
import { CellAxis } from './cellaxis';
import { SliderAxis } from './slideraxis';
import { SpeedControl } from './speedcontrol';

export type { TimelineOptions };

export class Timeline extends GUI<Required<TimelineCfg>> {
  /**
   * 组件 timeline
   */
  public static tag = 'timeline';

  private singleTimeCheckbox!: Checkbox;

  private cellAxis: CellAxis | undefined;

  private sliderAxis: SliderAxis | undefined;

  private speedControl: SpeedControl | undefined;

  /**
   * 默认配置项
   */
  public static defaultOptions: GUIOption<TimelineCfg> = {
    type: Timeline.tag,
    style: {
      x: 0,
      y: 0,
      width: 500,
      height: 40,
      data: [],
      orient: { layout: 'row', controlButtonAlign: 'left' },
      type: 'cell',
    },
  };

  constructor(options: TimelineOptions) {
    super(deepMix({}, Timeline.defaultOptions, options));
    this.init();
  }

  public init() {}

  public update(cfg: Partial<Required<TimelineCfg>>): void {
    this.attr(deepMix({}, this.attributes, cfg));
    this.updateAxis();
    this.updateControl();
    this.updateSingleTime();
    this.layout();
  }

  // 在这里计算并设置元素的长宽与位置
  private layout() {
    throw new Error('Method not implemented.');
  }

  private updateSingleTime() {}

  private updateControl() {}

  private updateAxis() {
    this.updateAxisBackground();
    this.updateAxisCells();
    this.updateAxisTicks();
  }

  private updateAxisTicks() {
    throw new Error('Method not implemented.');
  }

  private updateAxisCells() {
    throw new Error('Method not implemented.');
  }

  private updateAxisBackground() {
    // if (!this.cellBackgroundShape) {
    //   this.cellBackgroundShape = new Rect({
    //     style: { x: 0, y: 0, height: 0, width: 0 },
    //   });
    // } else {
    //   const { cellOptions } = this.attributes;
    //   this.cellBackgroundShape.setAttribute('fill', cellOptions.background!.fill);
    // }
  }

  public clear() {}

  public destroy(): void {}
}

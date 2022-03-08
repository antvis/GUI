import { deepMix } from '@antv/util';
import { GUI } from 'core/gui';
import { GUIOption } from 'types';
import { Checkbox } from 'ui';
import { Rect, RectStyleProps } from '@antv/g';
import { CELL_STYLE, BACKGROUND_STYLE } from './constants';
import type { TimelineCfg, TimelineOptions } from './types';

export type { TimelineOptions };

export class Timeline extends GUI<Required<TimelineCfg>> {
  /**
   * 组件 timeline
   */
  public static tag = 'timeline';

  private singleTimeCheckbox!: Checkbox;

  /**
   * 默认配置项
   */
  public static defaultOptions = {
    type: Timeline.tag,
    style: {
      x: 20,
      y: 20,
      width: 500,
      height: 40,
      data: [],
      orient: { layout: 'row', controlButtonAlign: 'left' },
      type: 'cell',
      cellAxisCfg: {
        cellStyle: {
          selected: CELL_STYLE.selected,
          default: CELL_STYLE.default,
        },
        backgroundStyle: BACKGROUND_STYLE as RectStyleProps,
        padding: [2, 4, 2, 4] /* top | right | bottom | left */,
        cellGap: 2,
        tickCfg: {
          startPos: [0, 0],
          endPos: [0, 0],
          verticalFactor: -1,
          label: {
            offset: [0, 8],
            alignTick: true,
            style: {
              default: {
                fontSize: 8,
                fill: 'rgba(0,0,0,0.45)',
              },
            },
          },
          tickLine: {
            len: 4,
            style: {
              default: { stroke: 'rgba(0,0,0,0.25)', lineWidth: 1 },
            },
          },
          axisLine: false,
        },
      },
    },
  };

  constructor(options: TimelineOptions) {
    super(deepMix({}, Timeline.defaultOptions, options));
    this.init();
  }

  public init() {
    this.update(this.style);
  }

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

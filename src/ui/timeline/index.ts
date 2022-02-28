import { deepMix } from '@antv/util';
import { GUI } from 'core/gui';
import { GUIOption } from 'types';
import { Checkbox } from 'ui';
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
  public static defaultOptions: GUIOption<TimelineCfg> = {
    type: Timeline.tag,
    style: {
      x: 20,
      y: 20,
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

  public update(cfg: Partial<Required<TimelineCfg>>): void {}

  public clear() {}

  public destroy(): void {}
}

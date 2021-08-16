import { deepMix } from '@antv/util';
import { GUI } from '../core/gui';
import { normalPadding } from '../../util';
import type { TooltipPosition, TooltipCfg, TooltipItem } from './types';

export class Tooltip extends GUI<Required<TooltipCfg>> {
  public static tag = 'tooltip';

  private static defaultOptions = {
    style: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      padding: 5,
      title: {
        content: '',
        style: {
          fontSize: 12,
          fill: 'black',
          textAlign: 'center',
          textBaseline: 'middle',
        },
      },
      position: 'bottom-right',
      offset: [5, 5],
      follow: true,
      enterable: false,
      autoLayout: false,
      items: [],
      itemName: ({ name }: TooltipItem) => name,
      itemValue: ({ value }: TooltipItem) => String(value),
      template: {
        container: ``,
        item: ``,
      },
    },
  };

  constructor(options: TooltipCfg) {
    super(deepMix({}, Tooltip.defaultOptions, options));
  }

  public init() {}

  public update() {}

  public clear() {}

  private getPadding() {
    const { padding } = this.attributes;
    return normalPadding(padding);
  }

  /* 计算相对指针的偏移量 */
  private parsePosition() {
    const {
      position,
      offset: [hOffset, vOffset],
    } = this.attributes;
    const temp = position.split('-') as ('top' | 'bottom' | 'left' | 'right')[];
    let offset = [0, 0];
    const posMap = {
      left: [-1, 0],
      right: [1, 0],
      top: [0, -1],
      bottom: [0, 1],
    };
    temp.forEach((pos) => {
      const [o1, o2] = offset;
      const [p1, p2] = posMap[pos];
      offset = [o1 + hOffset * p1, o2 + vOffset * p2];
    });
    return offset;
  }

  private getItemsData(): Required<TooltipItem[]> {
    const { items } = this.attributes;
    return items.map(({ name = '', value = '' }) => {
      return { name, value };
    });
  }
}

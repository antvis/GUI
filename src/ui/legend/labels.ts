import { CustomElement, Text } from '@antv/g';
import type { ShapeCfg } from '../../types';

type LinesCfg = ShapeCfg[];

export class Labels extends CustomElement {
  constructor({ attrs, ...rest }: ShapeCfg) {
    super({ type: 'lines', attrs, ...rest });
    this.render(attrs.labelsAttrs);
  }

  public render(labelsAttrs: LinesCfg): void {
    // 清空label
    this.removeChildren(true);
    // 重新绘制
    labelsAttrs.forEach((attr) => {
      this.appendChild(
        new Text({
          name: 'label',
          attrs: attr,
        })
      );
    });
  }

  attributeChangedCallback(name: string, value: any) {
    if (name === 'linesCfg') {
      this.render(value);
    }
  }
}

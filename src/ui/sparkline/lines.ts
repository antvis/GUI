import { Path } from '@antv/g';
import { AttrsType } from '../../abstract/component';
import { CustomElement, ShapeCfg } from '../../types';

type LinesCfg = { linesAttrs: AttrsType[]; areasAttrs?: AttrsType[] };

export class Lines extends CustomElement {
  constructor({ attrs, ...rest }: ShapeCfg) {
    super({ type: 'lines', attrs, ...rest });
    this.render(attrs.linesCfg);
  }

  public render(linesCfg: LinesCfg): void {
    this.removeChildren(true);
    const { linesAttrs, areasAttrs } = linesCfg;
    linesAttrs.forEach((cfg) => {
      this.appendChild(
        new Path({
          name: 'line',
          attrs: cfg,
        })
      );
    });
    areasAttrs?.forEach((cfg, idx: number) => {
      const id = `line-area-${idx}`;
      this.appendChild(
        new Path({
          id,
          name: 'area',
          attrs: cfg,
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

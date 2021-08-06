import { CustomElement, DisplayObjectConfig, Path } from '@antv/g';
import type { PathStyleProps } from '@antv/g';

type LinesCfg = { linesAttrs?: PathStyleProps[]; areasAttrs?: PathStyleProps[] };

export class Lines extends CustomElement<{ linesCfg: LinesCfg }> {
  constructor(config: DisplayObjectConfig<{ linesCfg: LinesCfg }>) {
    super(config);
    this.render(config.style?.linesCfg);
  }

  public render(linesCfg?: LinesCfg): void {
    this.removeChildren(true);
    const { linesAttrs, areasAttrs } = linesCfg || {};
    linesAttrs?.forEach((cfg) => {
      this.appendChild(
        new Path({
          name: 'line',
          attrs: cfg,
        })
      );
    });
    areasAttrs?.forEach((cfg) => {
      this.appendChild(
        new Path({
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

import { CustomElement, DisplayObjectConfig, Path, PathStyleProps, RectStyleProps } from '@antv/g';
import { deepMix } from '@antv/util';
import { applyStyle, maybeAppend, normalPadding, select } from '../../util';

export type ButtonStyleProps = {
  x?: number;
  y?: number;
  symbol: string;
  // means the size of marker, button size is equal to [size + padding[1] + padding[3], size + padding[0] + padding[2]]
  size: number;
  padding?: number | number[];
  backgroundStyle?: {
    default?: Omit<RectStyleProps, 'x' | 'y' | 'width' | 'height'>;
    active?: Omit<RectStyleProps, 'x' | 'y' | 'width' | 'height'>;
  };
  markerStyle?: {
    default?: Omit<PathStyleProps, 'path'>;
    active?: Omit<PathStyleProps, 'path'>;
  };
};

const SymbolPool = new Map();

export class Button extends CustomElement<ButtonStyleProps> {
  constructor(options: DisplayObjectConfig<ButtonStyleProps>) {
    super(options);
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  public update(cfg: Partial<ButtonStyleProps> = {}) {
    this.attr(deepMix({}, this.attributes, cfg));
    this.render();
  }

  private render() {
    const { size = 8, symbol, markerStyle, backgroundStyle } = this.style;
    const r = (size as number) / 2;
    const [pt, pr, pb, pl] = normalPadding(this.style.padding);
    maybeAppend(this, '.background', 'rect')
      .attr('className', 'background')
      .style('x', -(r + pl))
      .style('y', -(r + pt))
      .style('width', size + pl + pr)
      .style('height', size + pt + pb)
      .call(applyStyle, backgroundStyle?.default);

    const symbolFn = typeof symbol === 'function' ? symbol : SymbolPool.get(symbol);
    maybeAppend(this, '.marker-symbol', 'path')
      .attr('className', 'marker-symbol')
      .style('x', 0)
      .style('y', 0)
      .style('path', symbolFn?.(0, 0, r))
      .call(applyStyle, markerStyle?.default);
  }

  private bindEvents() {
    const marker = select(this).select('.marker-symbol');
    const background = select(this).select('.background');

    background.on('mousemove', () => {
      applyStyle(marker, this.style.markerStyle?.active as any);
      applyStyle(background, this.style.backgroundStyle?.active as any);
    });
    background.on('mouseout', () => {
      applyStyle(marker, this.style.markerStyle?.default as any);
      applyStyle(background, this.style.backgroundStyle?.default as any);
    });
  }
}

SymbolPool.set('timeline-prev-button', (x: number, y: number, r: number) => {
  return [
    ['M', x + r, y + r],
    ['L', x, y],
    ['L', x + r, y - r],
    ['M', x, y + r],
    ['L', x - r, y],
    ['L', x, y - r],
  ];
});
SymbolPool.set('timeline-next-button', (x: number, y: number, r: number) => {
  return [
    ['M', x, y + r],
    ['L', x + r, y],
    ['L', x, y - r],
    ['M', x - r, y + r],
    ['L', x, y],
    ['L', x - r, y - r],
  ];
});
SymbolPool.set('timeline-play-button', (x: number, y: number, r: number) => {
  return [
    ['M', x + 2, y + 3],
    ['L', x + 2, y - 3],
    ['M', x - 2, y + 3],
    ['L', x - 2, y - 3],
  ];
});
SymbolPool.set('timeline-stop-button', (x: number, y: number, r: number) => {
  return [['M', x + 3, y], ['L', x - 1.5, y - 1.5 * Math.sqrt(3)], ['L', x - 1.5, y + 1.5 * Math.sqrt(3)], ['Z']];
});

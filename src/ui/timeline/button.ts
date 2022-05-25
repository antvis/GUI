import { CustomElement, DisplayObjectConfig } from '@antv/g';
import { deepMix } from '@antv/util';
import { applyStyle, maybeAppend, normalPadding, select } from '../../util';
import { ControlButtonStyleProps } from './types';

export type ButtonStyleProps = ControlButtonStyleProps & {
  x?: number;
  y?: number;
};

const SymbolPool = new Map();

export class Button extends CustomElement<ButtonStyleProps> {
  private active: boolean = false;

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
    const [mt, mr, mb, ml] = normalPadding(this.style.margin);
    const [pt, pr, pb, pl] = normalPadding(this.style.padding);

    const rx = (size - pr - pl) / 2;
    const ry = (size - pt - pb) / 2;

    maybeAppend(this, '.container', 'rect')
      .attr('className', 'container')
      .style('x', -(rx + pl + ml))
      .style('y', -(ry + pt + mt))
      .style('width', size + mr + ml)
      .style('height', size + mt + mb)
      .style('fill', 'transparent')
      .style('cursor', 'pointer')
      .style('zIndex', 1);

    maybeAppend(this, '.background', 'rect')
      .attr('className', 'background')
      .style('x', -(rx + pl))
      .style('y', -(ry + pt))
      .style('width', size)
      .style('height', size)
      .call(applyStyle, this.active ? backgroundStyle?.active : backgroundStyle?.default);

    const symbolFn = typeof symbol === 'function' ? symbol : SymbolPool.get(symbol);
    maybeAppend(this, '.marker-symbol', 'path')
      .attr('className', 'marker-symbol')
      .style('x', 0)
      .style('y', 0)
      .style('path', symbolFn?.(0, 0, Math.min(rx, ry)))
      .call(applyStyle, this.active ? markerStyle?.active : markerStyle?.default);
  }

  private bindEvents() {
    const container = select(this).select('.container');
    const marker = select(this).select('.marker-symbol');
    const background = select(this).select('.background');

    container.on('pointerup', () => (this.active = true));
    container.on('pointermove', () => {
      this.active = true;
      applyStyle(marker, this.style.markerStyle?.active as any);
      applyStyle(background, this.style.backgroundStyle?.active as any);
    });
    container.on('pointerout', () => {
      this.active = false;
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

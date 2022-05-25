import { CustomElement, CustomEvent, DisplayObjectConfig, PathCommand } from '@antv/g';
import { deepMix } from '@antv/util';
import { GUIOption } from '../../types';
import { applyStyle, maybeAppend, select } from '../../util';
import { SpeedControlStyleProps } from './types';

type StyleProps = SpeedControlStyleProps & {
  x?: number;
  y?: number;
};

function getOffsetByIndex(index: number, height: number): number {
  const OFFSET = [1.43, 2.79, 4.89, 7.57, 11.66];
  return (OFFSET[index] / 11.66) * height;
}

const formatter = (number: number = 0, fractionDigits = 1, suffix = 'x') =>
  `${number.toFixed(fractionDigits)}${suffix}`;

export class SpeedControl extends CustomElement<StyleProps> {
  public static tag = 'speed-control';

  private static defaultOptions: GUIOption<StyleProps> = {
    type: SpeedControl.tag,
    style: {
      size: 8,
      lineStroke: '#bfbfbf',
      markerFill: '#8c8c8c',
      speeds: [1.0, 2.0, 3.0, 4.0, 5.0] as number[],
      spacing: 1,
      labelStyle: {
        fontFamily: 'sans-serif',
        fill: 'rgba(0,0,0,0.45)',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: 10,
        textBaseline: 'alphabetic',
      },
    },
  };

  constructor(options: DisplayObjectConfig<StyleProps>) {
    super(deepMix({}, SpeedControl.defaultOptions, options));
  }

  connectedCallback(): void {
    this.render();
    this.bindEvents();
  }

  public update(cfg: Partial<StyleProps> = {}): void {
    this.attr(deepMix({}, this.attributes, cfg));
    this.render();
  }

  private get styles(): Required<SpeedControlStyleProps> {
    return deepMix({}, SpeedControl.defaultOptions.style, this.attributes);
  }

  private render() {
    const { initialSpeed, size, markerFill, lineStroke, speeds, labelStyle: label, spacing } = this.styles;
    const markerSize = size / 2;
    let initialSpeedIdx = speeds.indexOf(initialSpeed);
    if (initialSpeedIdx === -1) initialSpeedIdx = 0;
    const y = getOffsetByIndex(initialSpeedIdx, size * 2);
    const r = markerSize * Math.tan(Math.PI / 6) * 2;

    maybeAppend(this, '.speed-marker', 'path')
      .attr('className', 'speed-marker')
      .style('fill', markerFill)
      .style('path', [['M', 0, y - r / 2], ['L', markerSize, y], ['L', 0, y + r / 2], ['Z']]);

    const x = markerSize - 0.5;
    const group = maybeAppend(this, '.line-group', 'rect')
      .attr('className', 'line-group')
      .style('x', x)
      .style('y', 0)
      .style('width', size)
      .style('height', size * 2)
      .style('cursor', 'pointer')
      .style('fill', 'transparent')
      .node();

    const path = speeds.reduce((arr: PathCommand[], _: any, idx: number) => {
      const offset = getOffsetByIndex(idx, size * 2);
      arr.push(['M', 0, offset], ['L', size, offset]);
      return arr;
    }, [] as PathCommand[]);

    maybeAppend(group, '.speed-path', 'path')
      .attr('className', 'speed-path')
      .style('stroke', lineStroke)
      .style('path', path)
      .style('lineWidth', 1);

    maybeAppend(this, '.speed-label', 'text')
      .attr('className', 'speed-label')
      .style('x', x + size + spacing)
      .style('y', size * 2 + 1)
      .style('text', formatter(speeds[initialSpeedIdx]))
      .call(applyStyle, label);
  }

  private bindEvents() {
    const lineGroup = this.querySelector('.line-group')! as any;
    lineGroup.addEventListener('pointerdown', (evt: any) => this.listener(evt));
    // Only for mobile.
    lineGroup.addEventListener('touchmove', (evt: any) => this.listener(evt));
  }

  private listener(evt: any) {
    const { speeds, size } = this.styles;
    const height = size * 2;
    const lineGroup = this.querySelector('.line-group')! as any;
    const speedText = select(this).select('.speed-label').node();
    const speedMarker = select(this).select('.speed-marker').node();
    if (evt.currentTarget === lineGroup) {
      const diff = evt.y - lineGroup.getBBox().y;
      const idx = speeds.findIndex((_: any, idx: number) => {
        const offset = getOffsetByIndex(idx, height);
        const offset0 = getOffsetByIndex(idx - 1, height);
        const offset1 = getOffsetByIndex(idx + 1, height);

        if (idx === 0) return diff < offset + (getOffsetByIndex(1, height) - offset) / 2;
        if (idx === speeds.length - 1) return diff > offset - (offset - offset0) / 2;

        const range = [offset - (offset - offset0) / 2, offset + (offset1 - offset) / 2];
        return diff >= range[0] && diff < range[1];
      });
      if (idx === -1) return;
      speedText.setAttribute('text', formatter(speeds[idx]));
      speedMarker.setLocalPosition(0, getOffsetByIndex(idx, height) - size / 4);
      this.dispatchEvent(new CustomEvent('speedChanged', { detail: { speed: speeds[idx] } }));
    }
  }
}

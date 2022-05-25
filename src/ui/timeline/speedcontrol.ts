import { CustomEvent, DisplayObjectConfig, TextStyleProps } from '@antv/g';
import { deepMix } from '@antv/util';
import { GUIOption } from '../../types';
import { applyStyle, maybeAppend, select } from '../../util';
import { GUI } from '../../core/gui';
import { formatter } from './util';

type SpeedControlStyleProps = {
  x?: number;
  y?: number;

  // Size of SpeedPath is equal to [size, size * 2], size of marker is equal to size / 2.
  size?: number;
  lineStroke?: string;
  markerFill?: string;
  /**
   * @title 可调节的速度
   * @description 配置可调节的速度，建议配置范围在 5 个区间，如: [1.0, 2.0, 3.0, 4.0, 5.0], [0.5, 1.0, 1.5, 2.0, 2.5]
   */
  speeds?: number[];
  /**
   * @title   label
   * @description label配置
   */
  labelStyle?: Omit<TextStyleProps, 'text'>;
  /**
   * @title   spacing
   * @description label与按钮的间隔
   */
  spacing?: number;
  /**
   * @title        currentSpeed
   * @description 当前选择的时间下标
   */
  initialSpeedIdx?: number;
};

function getOffsetByIndex(index: number, height: number): number {
  const OFFSET = [1.43, 2.79, 4.89, 7.57, 11.66];
  return (OFFSET[index] / 11.66) * height;
}

export class SpeedControl extends GUI<Required<SpeedControlStyleProps>> {
  public static tag = 'speed-control';

  private static defaultOptions: GUIOption<SpeedControlStyleProps> = {
    type: SpeedControl.tag,
    style: {
      size: 8,
      lineStroke: '#bfbfbf',
      markerFill: '#8c8c8c',
      speeds: [1.0, 2.0, 3.0, 4.0, 5.0],
      initialSpeedIdx: 0,
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

  constructor(options: DisplayObjectConfig<SpeedControlStyleProps>) {
    super(deepMix({}, SpeedControl.defaultOptions, options));
  }

  connectedCallback(): void {
    this.render();
    this.bindEvents();
  }

  public update(cfg: Partial<SpeedControlStyleProps> = {}): void {
    this.attr(deepMix({}, this.attributes, cfg));
    this.render();
  }

  private render() {
    const { initialSpeedIdx, size, markerFill, lineStroke, speeds } = this.style;
    const markerSize = size / 2;
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

    const path = speeds.reduce((arr, _, idx) => {
      const offset = getOffsetByIndex(idx, size * 2);
      arr.push(['M', 0, offset], ['L', size, offset]);
      return arr;
    }, [] as any);

    maybeAppend(group, '.speed-path', 'path')
      .attr('className', 'speed-path')
      .style('stroke', lineStroke)
      .style('path', path)
      .style('lineWidth', 1);

    const { labelStyle: label, spacing } = this.attributes;

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
    const { speeds, size } = this.style;
    const height = size * 2;
    const lineGroup = this.querySelector('.line-group')! as any;
    const speedText = select(this).select('.speed-label').node();
    const speedMarker = select(this).select('.speed-marker').node();
    if (evt.currentTarget === lineGroup) {
      const diff = evt.y - lineGroup.getBBox().y;
      const idx = speeds.findIndex((_, idx) => {
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

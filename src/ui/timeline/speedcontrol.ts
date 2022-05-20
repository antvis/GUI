import { deepMix, isFunction } from '@antv/util';
import { GUIOption } from '../../types';
import { applyStyle, maybeAppend, select } from '../../util';
import { GUI } from '../../core/gui';
import { SpeedControlCfg, SpeedControlOptions } from './types';
import { formatter } from './util';

export class SpeedControl extends GUI<Required<SpeedControlCfg>> {
  public static tag = 'speed-control';

  private static defaultOptions: GUIOption<SpeedControlCfg> = {
    type: SpeedControl.tag,
    style: {
      width: 10,
      height: 16,
      markerSize: 4,
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
        textBaseline: 'bottom',
      },
    },
  };

  constructor(options: SpeedControlOptions) {
    super(deepMix({}, SpeedControl.defaultOptions, options));
  }

  connectedCallback(): void {
    this.update();
    this.bindEvents();
  }

  public update(cfg: Partial<Required<SpeedControlCfg>> = {}): void {
    this.attr(deepMix({}, this.attributes, cfg));
    this.createLines();
    this.createTriangle();
    this.createLabel();
  }

  private bindEvents() {
    const { onSpeedChange, speeds, markerSize } = this.style;
    const lineGroup = this.querySelector('.line-group')! as any;
    lineGroup.addEventListener('mousedown', (evt: any) => {
      const offset = this.offset;
      if (evt.currentTarget === lineGroup) {
        const diff = evt.y - lineGroup.getBBox().y;
        const idx = offset.findIndex((d, idx) => {
          if (idx === 0) return diff < d + (offset[1] - d) / 2;
          if (idx === offset.length - 1) return diff > d - (d - offset[idx - 1]) / 2;

          const range = [d - (d - offset[idx - 1]) / 2, d + (offset[idx + 1] - d) / 2];
          return diff >= range[0] && diff < range[1];
        });
        if (idx === -1) return;
        select(this).select('.speed-label').style('text', formatter(speeds[idx]));
        select(this)
          .select('.speed-marker')
          .node()
          .setLocalPosition(0, offset[idx] - markerSize / 2);
        isFunction(onSpeedChange) && onSpeedChange(idx);
      }
    });
  }

  private get offset() {
    const { height: size } = this.style;
    const OFFSET = [1, 3, 6, 10, 15];
    return OFFSET.map((d) => d * (size / 16));
  }

  private createTriangle() {
    const { initialSpeedIdx, markerSize, markerFill } = this.style;
    const size = markerSize;
    const y = this.offset[initialSpeedIdx] - size / 2;
    maybeAppend(this, '.speed-marker', 'path')
      .attr('className', 'speed-marker')
      .style('fill', markerFill)
      .style('path', [['M', 0, y], ['L', 0, y + size], ['L', markerSize, y + size / 2], ['Z']]);
  }

  private createLines() {
    const { width, height, markerSize, lineStroke: stroke } = this.style;

    const group = maybeAppend(this, '.line-group', 'rect')
      .attr('className', 'line-group')
      .style('x', markerSize - 0.5)
      .style('y', 0)
      .style('width', width)
      .style('height', height)
      .style('cursor', 'pointer')
      .style('fill', 'transparent')
      .node();
    const path = this.offset.reduce(
      (arr, offset) => (arr.push(['M', 0, offset], ['L', width, offset]), arr),
      [] as any
    );
    maybeAppend(group, '.speed-path', 'path')
      .attr('className', 'speed-path')
      .style('stroke', stroke)
      .style('path', path)
      .style('lineWidth', 1);
  }

  private createLabel() {
    const { speeds, labelStyle: label, spacing, initialSpeedIdx } = this.attributes;
    const { max } = (this.querySelector('.line-group') as any)!.getLocalBounds();

    maybeAppend(this, '.speed-label', 'text')
      .attr('className', 'speed-label')
      .style('x', max[0] + spacing)
      .style('y', max[1])
      .style('text', formatter(speeds[initialSpeedIdx]))
      .call(applyStyle, label);
  }
}

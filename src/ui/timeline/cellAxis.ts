import { DisplayObjectConfig, RectStyleProps, CustomEvent } from '@antv/g';
import { Band as BandScale } from '@antv/scale';
import { deepMix } from '@antv/util';
import { Linear } from '../axis';
import { applyStyle, maybeAppend, select } from '../../util';
import {
  AxisBase,
  AxisStyleProps,
  DEFAULT_AXIS_STYLE,
  DEFAULT_STYLE as BASE_DEFAULT_STYLE,
  normalSelection,
} from './playAxis';

type CellAxisStyleProps = AxisStyleProps & {};

const DEFAULT_STYLE: CellAxisStyleProps = deepMix({}, BASE_DEFAULT_STYLE, {
  backgroundStyle: {
    fill: '#416180',
    fillOpacity: 0.05,
  },
  size: 16,
  cellGap: 2,
  cellStyle: {
    fill: '#416180',
    fillOpacity: 0.1,
  },
  selectionStyle: {
    fillOpacity: 0.45,
  },
  label: {
    autoHideTickLine: true,
  },
});

function getScale(data: any[], range: [number, number]) {
  return new BandScale({
    domain: data.map((_, idx) => idx),
    range,
    paddingOuter: 0,
    paddingInner: 0,
  });
}

export class CellAxis extends AxisBase<CellAxisStyleProps> {
  // Cell padding is equal to [padding/2,padding,padding/2,padding]
  private padding = 4;

  constructor(options: DisplayObjectConfig<CellAxisStyleProps>) {
    super(deepMix({}, { tag: 'cell-axis', style: DEFAULT_STYLE }, options));
    this.selection = normalSelection(this.style.selection, this.style.singleMode);
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  protected setSelection(newSelection: { start?: number | undefined; end?: number | undefined }): void {
    const [s0, e0] = this.selection;
    this.selection = [newSelection.start ?? s0, newSelection.end ?? e0];
    this.dispatchEvent(new CustomEvent('timelineChanged', { detail: { selection: this.selection } }));
    this.render();
  }

  protected render() {
    const style: Required<CellAxisStyleProps> = deepMix({}, DEFAULT_STYLE, this.attributes);
    const { size: cellSize } = style;
    const [xName, yName, widthName, heightName] = this.ifH(
      ['x', 'y', 'width', 'height'],
      ['y', 'x', 'height', 'width']
    );
    const bg = maybeAppend(this, '.slider-background', 'rect')
      .attr('className', 'slider-background')
      .style('x', 0)
      .style('y', 0)
      .style(widthName, style.length)
      .style(heightName, cellSize + this.padding)
      .call(applyStyle, style.backgroundStyle)
      .node();

    const scale = this.getCellScale();
    const bandWidth = scale.getBandWidth();
    const cells = style.data.map((_, idx: number) => {
      return {
        [xName]: scale.map(idx),
        [yName]: this.padding / 2,
        [widthName]: bandWidth - style.cellGap,
        [heightName]: cellSize,
        ...style.cellStyle,
      };
    }) as RectStyleProps[];

    select(bg)
      .selectAll('.cell')
      .data(cells)
      .join(
        (enter) =>
          enter
            .append('rect')
            .attr('className', 'cell')
            .each(function (datum) {
              this.attr(datum);
            }),
        (update) =>
          update.each(function (datum) {
            this.attr(datum);
          }),
        (exit) => exit.remove()
      );

    const selectedCells = cells
      .filter((__, idx) => {
        const [a, b] = this.selection;
        return idx >= a && idx <= b;
      })
      .map((cell) => {
        return { ...cell, ...style.selectionStyle };
      });

    const animationOptions = {
      duration: this.style.playInterval! / 2,
      easing: 'cubic-bezier(0.250, 0.460, 0.450, 0.940)', // 缓动函数
      fill: 'both' as any,
    };

    select(bg)
      .selectAll('.selected-cell')
      .data(selectedCells)
      .join(
        (enter) =>
          enter
            .append('rect')
            .attr('className', 'selected-cell')
            .each(function (datum) {
              this.attr(datum);
            }),
        (update) =>
          update.each(function (datum) {
            this.animate([datum], animationOptions);
          }),
        (exit) => exit.remove()
      );

    const padding = this.padding;
    const axisLength = style.length - this.padding * 2 + style.cellGap;
    const tickScale = getScale(style.data, [0, axisLength]);
    const ticks = style.data.map((tick, idx) => ({
      value: (tickScale.map(idx) + (bandWidth - style.cellGap) / 2) / axisLength,
      text: tick.date,
    }));
    const { position: verticalFactor = -1, ...axisLabelCfg } = style.label || {};
    const y = verticalFactor === -1 ? -4 : this.padding + cellSize + 4;
    let startPos: any = [padding, y];
    let endPos: any = [padding + axisLength, y];
    if (this.orient === 'vertical') {
      startPos = [startPos[1], startPos[0]];
      endPos = [endPos[1], endPos[0]];
    }

    maybeAppend(
      bg,
      '.slider-axis',
      () =>
        new Linear({
          className: 'slider-axis',
          style: DEFAULT_AXIS_STYLE,
        })
    ).call((selection) =>
      (selection.node() as Linear).update({
        startPos,
        endPos,
        ticks,
        verticalFactor,
        tickLine: style.label === null ? null : {},
        label: style.label === null ? null : axisLabelCfg,
      })
    );
  }

  private bindEvents() {
    this.dragSelection();
  }

  private getCellScale() {
    const cellGap = this.style.cellGap || DEFAULT_STYLE.cellGap;
    const length = this.style.length || DEFAULT_STYLE.length;
    return getScale(this.style.data, [this.padding, length! - this.padding + cellGap!]);
  }

  private dragSelection() {
    const selection = select(this).select('.slider-background');

    let dragging = false; // 拖拽状态
    let firstPosition: number | undefined; // 保存首次位置

    const padding = this.padding;
    const mapPositionToIndex = (pos: number) => {
      const [x0, y0] = selection.node().getPosition();
      const offset = this.ifH(x0 + 4, y0 + padding);
      const cellGap = this.style.cellGap || DEFAULT_STYLE.cellGap;
      const scale = this.getCellScale();
      const step = scale.getStep();
      return Math.floor((pos - offset + cellGap!) / step);
    };

    const dragStart = (event: any) => {
      if (this.playTimer) {
        clearInterval(this.playTimer);
      }
      dragging = true;
      firstPosition = this.ifH(event.x, event.y);

      const pos = mapPositionToIndex(firstPosition!);
      this.setSelection({ start: pos, end: pos });
    };

    const dragMove = (event: any) => {
      if (!dragging) return;
      const idx1 = mapPositionToIndex(this.ifH(event.x, event.y));
      const idx0 = firstPosition ? mapPositionToIndex(firstPosition!) : idx1;
      const [start, end] = idx0 < idx1 ? [idx0, idx1] : [idx1, idx0];

      this.setSelection({ start, end });
    };

    const dragEnd = () => {
      dragging = false;

      if (this.playTimer) {
        this.play();
      }
    };

    selection
      // events for drag start
      .on('pointerdown', dragStart)
      // events for drag end
      .on('pointerup', dragEnd)
      .on('mouseupoutside', dragEnd)
      .on('touchendoutside', dragEnd)
      // events for drag move
      .on('pointermove', dragMove);
  }
}

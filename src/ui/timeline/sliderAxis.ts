import { ElementEvent, Line, CustomEvent } from '@antv/g';
import type { DisplayObjectConfig } from '@antv/g';
import { clamp, deepMix } from '@antv/util';
import { Point as PointScale } from '@antv/scale';
import { applyStyle, maybeAppend, select, Selection } from '../../util';
import { Linear } from '../axis';
import {
  AxisBase,
  AxisStyleProps,
  DEFAULT_AXIS_CFG,
  DEFAULT_STYLE as BASE_DEFAULT_STYLE,
  normalSelection,
} from './playAxis';

type SliderAxisOptions = DisplayObjectConfig<AxisStyleProps> & { tag?: string };

function getScale(data: any[], range: number[]) {
  return new PointScale({
    domain: data.map((_, idx) => idx),
    range,
    padding: 0,
  });
}

function getOffsetIntervalByOffsetDistance(offset: number, totalLength: number, data: any[]): number {
  const scale = getScale(data, [0, totalLength]);
  const step = scale.getStep();
  const round = offset > 0 ? Math.ceil : Math.floor;
  return step > 0 ? round(offset / step) : 0;
}

function getPositionByIndex(index: number, totalLength: number, data: any[]) {
  const scale = getScale(data, [0, totalLength]);
  return scale.map(index);
}

export class SliderAxis extends AxisBase<AxisStyleProps> {
  public static defaultOptions: SliderAxisOptions = {
    tag: 'slider-axis',
    style: deepMix({}, BASE_DEFAULT_STYLE, {
      size: 3,
      handleStyle: {
        r: 5,
        stroke: '#8AADF3',
        strokeOpacity: 0.75,
        lineWidth: 1,
        fill: '#fff',
        fillOpacity: 1,
      },
      backgroundStyle: {
        fill: '#416180',
        fillOpacity: 0.1,
      },
      selectionStyle: {
        cursor: 'grabbing',
      },
    }),
  };

  constructor(options: SliderAxisOptions) {
    super(deepMix({}, SliderAxis.defaultOptions, options));
    this.selection = normalSelection(this.style.selection, this.style.singleMode);
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  protected setSelection(newSelection: { start?: number; end?: number }) {
    const { start: startIndex, end: endIndex } = newSelection;
    const animationOptions = {
      duration: this.style.playInterval! / 2,
      easing: 'cubic-bezier(0.250, 0.460, 0.450, 0.940)', // 缓动函数
      fill: 'both' as any,
    };
    const { data = [] } = this.style;

    const posName = this.ifH('cx', 'cy');
    const startHandle = select(this).select('.slider-start-handle').node();
    if (startIndex !== undefined) {
      const pos = getPositionByIndex(startIndex, this.style.length!, data);
      startHandle.animate([{ [posName]: startHandle.style[posName] }, { [posName]: pos }], animationOptions);
    }
    if (endIndex !== undefined) {
      const endHandle = select(this).select('.slider-end-handle').node();
      const pos1 = getPositionByIndex(endIndex, this.style.length!, data);
      endHandle.animate([{ [posName]: endHandle.style[posName] }, { [posName]: pos1 }], animationOptions);
    }
    this.selection = [startIndex ?? this.selection[0], endIndex ?? this.selection[1]];
    this.dispatchEvent(new CustomEvent('timelineChanged', { detail: { selection: this.selection } }));
  }

  private get styles(): Required<AxisStyleProps> {
    return deepMix({}, SliderAxis.defaultOptions.style, this.attributes);
  }

  protected render() {
    const styles = this.styles;
    const [width, height] = this.ifH([styles.length, styles.size], [styles.size, styles.length]);

    const bg = maybeAppend(this, '.slider-background', 'line')
      .attr('className', 'slider-background')
      .style('x1', 0)
      .style('y1', 0)
      .style('x2', this.ifH(width, 0))
      .style('y2', this.ifH(0, height))
      .style('lineWidth', styles.size)
      .style('lineCap', 'round')
      .style('stroke', styles.backgroundStyle?.fill)
      .style('strokeOpacity', styles.backgroundStyle?.fillOpacity)
      .node();

    const tickScale = getScale(styles.data, [0, 1]);
    const [st = 0, et = st] = this.selection.map((d) => tickScale.map(d)) as number[];
    const x1 = this.ifH(st * width, 0);
    const x2 = this.ifH(et * width, 0);
    const y1 = this.ifH(0, st * height);
    const y2 = this.ifH(0, et * height);

    maybeAppend(bg, '.slider-selection', 'line')
      .attr('className', 'slider-selection')
      .style('x1', x1)
      .style('y1', y1)
      .style('x2', x2)
      .style('y2', y2)
      .style('lineWidth', styles.size)
      .style('lineCap', 'round')
      .style('stroke', styles.selectionStyle?.fill)
      .style('strokeOpacity', styles.selectionStyle?.fillOpacity)
      .style('visibility', styles.singleMode ? 'hidden' : 'visible')
      .call(applyStyle, styles.selectionStyle);

    maybeAppend(bg, '.slider-start-handle', 'circle')
      .attr('className', 'slider-start-handle')
      .style('cx', x1)
      .style('cy', y1)
      .call(applyStyle, styles.handleStyle);

    maybeAppend(bg, '.slider-end-handle', 'circle')
      .attr('className', 'slider-end-handle')
      .style('cx', x2)
      .style('cy', y2)
      .style('visibility', styles.singleMode ? 'hidden' : 'visible')
      .call(applyStyle, styles.handleStyle);

    const ticks = styles.data.map((tick, idx) => ({ value: tickScale.map(idx), text: tick.date }));
    const { position: verticalFactor = -1, tickLine: tickLineCfg, ...axisLabelCfg } = styles.label || {};

    maybeAppend(
      bg,
      '.slider-axis',
      () =>
        new Linear({
          className: 'slider-axis',
          style: DEFAULT_AXIS_CFG,
        })
    ).call((selection) =>
      (selection.node() as Linear).update({
        startPos: [verticalFactor * this.ifH(0, width + 2), verticalFactor * this.ifH(height + 2, 0)],
        endPos: [
          this.ifH(width, 0) + verticalFactor * this.ifH(0, width + 2),
          this.ifH(0, height) + verticalFactor * this.ifH(height + 2, 0),
        ],
        ticks,
        verticalFactor,
        tickLine: styles.label === null ? null : tickLineCfg,
        label: styles.label === null ? null : axisLabelCfg,
      })
    );
  }

  private bindEvents() {
    const target = select(this).select('.slider-background');

    this.dragHandle(target, 'start');
    this.dragHandle(target, 'end');
    this.dragSelection(target);

    const selection = target.select('.slider-selection').node() as Line;
    const startHandle = target.select('.slider-start-handle').node();
    const endHandle = target.select('.slider-end-handle').node();
    startHandle.addEventListener(ElementEvent.ATTR_MODIFIED, ({ attrName, newValue, prevValue }: any) => {
      if (attrName === 'cx' || attrName === 'cy') {
        const value = parseFloat(newValue) || 0;
        selection.style[attrName === 'cx' ? 'x1' : 'y1'] = value;
      }
    });
    endHandle.addEventListener(ElementEvent.ATTR_MODIFIED, ({ attrName, newValue, prevValue }: any) => {
      if (attrName === 'cx' || attrName === 'cy') {
        const value = parseFloat(newValue) || 0;
        selection.style[attrName === 'cx' ? 'x2' : 'y2'] = value;
      }
    });
  }

  private dragHandle(selection: Selection, type: 'start' | 'end') {
    let dragging = false; // 拖拽状态
    let lastPosition: any; // 保存上次位置
    let firstPosition: number[] | undefined; // 保存首次位置
    const onDragStart = (event: any) => {
      if (this.playTimer) {
        clearInterval(this.playTimer);
      }
      const shape = selection.select(`.slider-${type}-handle`).node();
      if (event.target === shape) {
        dragging = true;
        firstPosition = [event.x, event.y];
        lastPosition = [event.x, event.y];
      }
    };
    const onDragEnd = (event: any) => {
      if (!dragging) return;
      dragging = false;
      const offset = firstPosition ? this.ifH(event.x - firstPosition[0], event.y - firstPosition[1]) : 0;
      const interval = getOffsetIntervalByOffsetDistance(offset, this.style.length!, this.style.data);
      firstPosition = undefined;
      const [startIndex, endIndex] = this.selection;
      if (type === 'start') {
        this.setSelection({ start: clamp(startIndex + interval, 0, endIndex) });
      } else {
        const max = this.style.data.length - 1;
        if (startIndex === max) {
          this.setSelection({ start: endIndex + interval, end: endIndex + interval });
        } else {
          this.setSelection({ end: clamp(endIndex + interval, startIndex, max) });
        }
      }
      if (this.playTimer) {
        this.play();
      }
    };

    const onDragMove = (event: any) => {
      if (dragging) {
        const length = this.styles.length!;
        const shape = select(this).select(`.slider-${type}-handle`).node();
        const offset = this.ifH(event.x - lastPosition[0], event.y - lastPosition[1]);
        const position = shape.getLocalPosition();
        if (this.orient === 'vertical') {
          shape.style.cy = clamp(position[1] + offset, 0, length);
        } else {
          shape.style.cx = clamp(position[0] + offset, 0, length);
        }
        lastPosition = [event.x, event.y];
      }
    };

    selection
      // events for drag start
      .on('pointerdown', onDragStart.bind(this))
      // events for drag end
      .on('pointerup', onDragEnd)
      .on('mouseupoutside', onDragEnd)
      .on('touchendoutside', onDragEnd)
      // events for drag move
      .on('pointermove', onDragMove);
  }

  private dragSelection(selection: Selection) {
    const shape = selection.select('.slider-selection').node() as Line;
    const startHandle = selection.select('.slider-start-handle').node();
    const endHandle = selection.select('.slider-end-handle').node();

    let dragging = false; // 拖拽状态
    let lastPosition: any; // 保存上次位置
    let firstPosition: number[] | undefined; // 保存首次位置
    const onDragStart = (event: any) => {
      if (this.playTimer) {
        clearInterval(this.playTimer);
      }
      if (event.target === shape) {
        dragging = true;
        firstPosition = [event.x, event.y];
        lastPosition = [event.x, event.y];
      }
    };
    const onDragEnd = (event: any) => {
      if (!dragging) return;
      dragging = false;
      const offset = firstPosition ? this.ifH(event.x - firstPosition[0], event.y - firstPosition[1]) : 0;
      const moveInterval = getOffsetIntervalByOffsetDistance(offset, this.style.length!, this.style.data);
      firstPosition = undefined;
      const range = this.selection[1] - this.selection[0];
      const endIndex = clamp(this.selection[1] + moveInterval, range, this.style.data.length - 1);
      this.setSelection({ start: endIndex - range, end: endIndex });

      if (this.playTimer) {
        this.play();
      }
    };
    const onDragMove = (event: any) => {
      if (dragging) {
        const length = this.styles.length!;
        const offset = this.ifH(event.x - lastPosition[0], event.y - lastPosition[1]);
        const [cx0, cy0] = startHandle.getLocalPosition();
        const [cx1, cy1] = endHandle.getLocalPosition();
        if (this.orient === 'vertical') {
          const height = cy1 - cy0;
          startHandle.style.cy = clamp(cy0 + offset, 0, length - height);
          endHandle.style.cy = startHandle.style.cy + height;
        } else {
          const width = cx1 - cx0;
          startHandle.style.cx = clamp(cx0 + offset, 0, length);
          endHandle.style.cx = startHandle.style.cx + width;
        }
        lastPosition = [event.x, event.y];
      }
    };

    selection
      // events for drag start
      .on('mousedown', onDragStart.bind(this))
      .on('touchstart', onDragStart.bind(this))
      // events for drag end
      .on('mouseup', onDragEnd.bind(this))
      .on('mouseupoutside', onDragEnd.bind(this))
      .on('touchend', onDragEnd.bind(this))
      .on('touchendoutside', onDragEnd.bind(this))
      // events for drag move
      .on('mousemove', onDragMove.bind(this))
      .on('touchmove', onDragMove.bind(this));
  }
}

import { CustomElement, ElementEvent, Line, CustomEvent } from '@antv/g';
import type { DisplayObjectConfig } from '@antv/g';
import { clamp, deepMix } from '@antv/util';
import { Point as PointScale } from '@antv/scale';
import { AxisLabelCfg } from 'ui/axis/types';
import { applyStyle, maybeAppend, select, Selection } from '../../util';
import { Linear } from '../axis';
import { TimeData } from './types';

export type SliderAxisStyleProps = {
  x?: number;
  y?: number;
  timeData: TimeData[];
  length?: number;
  size?: number;
  orient?: string;
  selection?: [number, number] | number;
  lineStyle?: {
    lineCap?: string;
    stroke?: string;
    strokeOpacity?: number;
  };
  selectionStyle?: {
    lineCap?: string;
    stroke?: string;
    strokeOpacity?: number;
    cursor?: string;
  };
  handleStyle?: {
    r?: number;
    fill?: string;
    fillOpacity?: number;
    lineWidth?: number;
    stroke?: string;
    strokeOpacity?: number;
    cursor?: string;
  };
  label?: {
    position?: -1 | 1;
    // todo. Do not typing definition inference.
    style?: AxisLabelCfg['style'];
  } | null;
  loop?: boolean;
  playInterval?: number; // ms
};

const DEFAULT_STYLE: SliderAxisStyleProps = {
  x: 0,
  y: 0,
  timeData: [],
  length: 120,
  size: 8,
  orient: 'horizontal',
  selection: 0,
  handleStyle: {
    r: 5,
    stroke: '#8AADF3',
    lineWidth: 1,
    fill: '#fff',
    fillOpacity: 1,
    strokeOpacity: 1,
    cursor: 'ew-resize',
  },
  lineStyle: {
    lineCap: 'round',
    stroke: '#416180',
    strokeOpacity: 0.1,
  },
  selectionStyle: {
    lineCap: 'round',
    stroke: '#5B8FF9',
    strokeOpacity: 0.3,
    cursor: 'grabbing',
  },
  label: {
    position: -1,
  },
  loop: false,
  playInterval: 1000,
};

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

function normalSelection(selection: number | number[] = []) {
  const [s1 = 0, s2 = s1] = Array.of(selection).flat() as number[];
  return [s1, s2];
}

export class SliderAxis extends CustomElement<SliderAxisStyleProps> {
  private playTimer?: any;

  private selection: number[] = [0, 0];

  constructor(options: DisplayObjectConfig<SliderAxisStyleProps>) {
    super(deepMix({}, { style: DEFAULT_STYLE }, options));
    this.selection = normalSelection(this.style.selection);
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  public update(cfg: Partial<SliderAxisStyleProps> = {}) {
    if (cfg.selection) {
      this.selection = normalSelection(cfg.selection);
    }
    const playing = this.playTimer;
    this.stop();
    this.attr(deepMix({}, this.attributes, cfg));
    this.render();

    if (playing) {
      this.play();
    }
  }

  public play() {
    const { playInterval = DEFAULT_STYLE.playInterval, timeData, loop } = this.style;

    if (this.playTimer) clearInterval(this.playTimer);
    this.playTimer = setInterval(() => {
      let currentIndex = this.selection[0];
      if (this.selection[1] >= timeData.length - 1) {
        if (!loop) {
          this.stop(true);
          return;
        }
        currentIndex = 0;
      } else {
        currentIndex = (currentIndex + 1 + timeData.length) % timeData.length;
      }
      const offset = this.selection[1] - this.selection[0];
      this.setSelection({ start: currentIndex, end: currentIndex + offset });
    }, playInterval);
  }

  public stop(dispatchEvent?: boolean): void {
    clearInterval(this.playTimer);
    this.playTimer = undefined;
    if (dispatchEvent) {
      this.dispatchEvent(new CustomEvent('timelineStopped', {}));
    }
  }

  public prev() {
    const [s1, s2] = this.selection;
    if (s1 === 0) {
      const max = this.style.timeData.length - 1;
      this.setSelection({ start: max - (s2 - s1), end: max });
    } else {
      this.setSelection({ start: s1 - 1, end: s2 - 1 });
    }
  }

  public next() {
    const [s1, s2] = this.selection;
    if (s2 === this.style.timeData.length - 1) {
      this.setSelection({ start: 0, end: s2 - s1 });
    } else {
      this.setSelection({ start: s1 + 1, end: s2 + 1 });
    }
  }

  private setSelection(newSelection: { start?: number; end?: number }) {
    const { start, end } = newSelection;
    const animationOptions = {
      duration: this.style.playInterval! / 2,
      easing: 'cubic-bezier(0.250, 0.460, 0.450, 0.940)', // 缓动函数
      fill: 'both' as any,
    };
    const data = this.style.timeData || [];
    let startIndex;
    let endIndex;
    if (start !== undefined && end !== undefined) {
      const interval = this.selection[1] - this.selection[0];
      endIndex = clamp(end, interval, data.length - 1);
      startIndex = endIndex - interval;
    } else if (start !== undefined) {
      startIndex = clamp(start, 0, this.selection[1]);
    } else if (end !== undefined) {
      if (end < this.selection[0]) {
        startIndex = clamp(end, 0, data.length - 1);
        endIndex = startIndex;
      } else {
        endIndex = Math.min(end, data.length - 1);
      }
    }

    const startHandle = select(this).select('.slider-start-handle').node();
    if (startIndex !== undefined) {
      const cx = getPositionByIndex(startIndex, this.style.length!, data);
      startHandle.animate([{ cx: startHandle.style.cx }, { cx }], animationOptions);
    }
    if (endIndex !== undefined) {
      const endHandle = select(this).select('.slider-end-handle').node();
      const cx1 = getPositionByIndex(endIndex, this.style.length!, data);
      endHandle.animate([{ cx: endHandle.style.cx }, { cx: cx1 }], animationOptions);
    }
    this.selection = [startIndex ?? this.selection[0], endIndex ?? this.selection[1]];
    this.dispatchEvent(new CustomEvent('timelineChanged', { detail: { selection: this.selection } }));
  }

  private render() {
    const style: Required<SliderAxisStyleProps> = deepMix({}, DEFAULT_STYLE, this.attributes);
    const [width, height] = this.ifH([style.length, style.size], [style.size, style.length]);

    const bg = maybeAppend(this, '.slider-background', 'line')
      .attr('className', 'slider-background')
      .style('x1', 0)
      .style('y1', 0)
      .style('x2', this.ifH(width, 0))
      .style('y2', this.ifH(0, height))
      .style('lineWidth', style.size)
      .call(applyStyle, style.lineStyle)
      .node();

    const tickScale = getScale(style.timeData, [0, 1]);
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
      .style('lineWidth', style.size)
      .call(applyStyle, style.selectionStyle);

    maybeAppend(bg, '.slider-start-handle', 'circle')
      .attr('className', 'slider-start-handle')
      .style('cx', x1)
      .style('cy', y1)
      .call(applyStyle, style.handleStyle);

    maybeAppend(bg, '.slider-end-handle', 'circle')
      .attr('className', 'slider-end-handle')
      .style('cx', x2)
      .style('cy', y2)
      .call(applyStyle, style.handleStyle);

    const ticks = style.timeData.map((tick, idx) => ({ value: tickScale.map(idx), text: tick.date }));
    const { position: verticalFactor = -1, ...axisLabelCfg } = style.label || {};

    maybeAppend(
      bg,
      '.slider-axis',
      () =>
        new Linear({
          className: 'slider-axis',
          style: {
            axisLine: null,
            label: {
              autoRotate: false,
              autoHide: true,
              autoHideTickLine: false,
              autoEllipsis: true,
              minLength: 60,
              alignTick: true,
              rotate: 0,
              style: {
                fontSize: 10,
                fill: 'rgba(0,0,0,0.45)',
              },
            },
            tickLine: {
              len: 4,
              style: {
                stroke: 'rgba(0,0,0,0.25)',
                lineWidth: 1,
              },
            },
          },
        })
    ).call((selection) =>
      (selection.node() as Linear).update({
        startPos: [verticalFactor * this.ifH(0, width), verticalFactor * this.ifH(height, 0)],
        endPos: [
          this.ifH(width, 0) + verticalFactor * this.ifH(0, width),
          this.ifH(0, height) + verticalFactor * this.ifH(height, 0),
        ],
        verticalFactor,
        ticks,
        tickLine: style.label === null ? null : {},
        label: style.label === null ? null : axisLabelCfg,
      })
    );
  }

  private get orient() {
    return this.style.orient || 'horizontal';
  }

  private ifH<T>(a: T, b: T) {
    if (this.orient === 'horizontal') {
      return typeof a === 'function' ? a() : a;
    }
    return typeof b === 'function' ? b() : b;
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
      const interval = getOffsetIntervalByOffsetDistance(offset, this.style.length!, this.style.timeData);
      firstPosition = undefined;
      const oldIndex = this.selection[type === 'start' ? 0 : 1];
      this.setSelection({ [type]: oldIndex + interval });
      if (this.playTimer) {
        this.play();
      }
    };

    const onDragMove = (event: any) => {
      if (dragging) {
        const length = this.style.length || DEFAULT_STYLE.length!;
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
      .on('mousedown', onDragStart.bind(this))
      .on('touchstart', onDragStart.bind(this))
      // events for drag end
      .on('mouseup', onDragEnd)
      .on('mouseupoutside', onDragEnd)
      .on('touchend', onDragEnd)
      .on('touchendoutside', onDragEnd)
      // events for drag move
      .on('mousemove', onDragMove)
      .on('touchmove', onDragMove);
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
      const interval = getOffsetIntervalByOffsetDistance(offset, this.style.length!, this.style.timeData);
      firstPosition = undefined;
      this.setSelection({ start: this.selection[0] + interval, end: this.selection[1] + interval });

      if (this.playTimer) {
        this.play();
      }
    };
    const onDragMove = (event: any) => {
      if (dragging) {
        const length = this.style.length || DEFAULT_STYLE.length!;
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

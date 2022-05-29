import { ElementEvent, Line, CustomEvent, TextStyleProps } from '@antv/g';
import type { DisplayObjectConfig } from '@antv/g';
import { clamp, deepMix } from '@antv/util';
import { Point as PointScale, Band as BandScale } from '@antv/scale';
import { applyStyle, maybeAppend, normalPadding, select, Selection } from '../../util';
import { Linear } from '../axis';
import { Sparkline, SparklineCfg } from '../sparkline';
import { AxisBase, AxisStyleProps, DEFAULT_AXIS_CFG, normalSelection } from '../timeline/playAxis';
import { DEFAULT_TIMELINE_STYLE } from '../timeline/constants';
import { Handle } from './handle';

type HandleStyle = {
  fill?: string;
  fillOpacity?: number;
  stroke?: string;
  strokeOpacity?: number;
  lineWidth?: number;
};
type StyleProps = Omit<AxisStyleProps, 'singleMode' | 'handleStyle'> & {
  sparkline?: Partial<SparklineCfg> & {
    padding?: number | number[];
    fields?: string[];
    // todo 补充更多配置
  };
  startHandleSize?: number;
  endHandleSize?: number;
  startHandleIcon?: string | ((x: number, y: number, r: number) => string);
  endHandleIcon?: string | ((x: number, y: number, r: number) => string);
  handleStyle?: HandleStyle & {
    size?: number;
    symbol?: string | ((x: number, y: number, r: number) => string);
    active?: HandleStyle;
  };
  textStyle?: Omit<TextStyleProps, 'x' | 'y' | 'text'>;
};
type SliderOptions = DisplayObjectConfig<StyleProps> & {};

function getScale(data: any[], range: number[], type?: string) {
  const Scale = type === 'column' ? BandScale : PointScale;
  return new Scale({
    domain: data.map((_, idx) => idx),
    range,
    padding: 0,
  });
}

function getIndexByPosition(offset: number, totalLength: number, data: any[], type?: string) {
  const scale = getScale(data, [0, totalLength], type);
  const bandWidth = scale.getBandWidth?.() || 0;
  if (bandWidth) {
    return Math.floor(offset / bandWidth);
  }
  const step = scale.getStep();
  const round = offset > 0 ? Math.ceil : Math.floor;
  return step > 0 ? round(offset / step) : 0;
}

export class Slider extends AxisBase<StyleProps> {
  public static defaultOptions: SliderOptions = {
    style: deepMix({}, DEFAULT_TIMELINE_STYLE.playAxis, {
      tag: 'slider-axis',
      size: 3,
      data: [],
      selection: [0, 0],
      selectionStyle: {
        fill: '#5B8FF9',
        fillOpacity: 0.15,
        cursor: 'grabbing' as any,
      },
      handleStyle: {},
      backgroundStyle: {
        fill: '#416180',
        fillOpacity: 0.1,
      },
      sparkline: { padding: [4, 0] },
    }),
  };

  constructor(options: SliderOptions) {
    super(deepMix({}, Slider.defaultOptions, options));
    this.selection = normalSelection(this.style.selection);
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  private get styles(): Required<StyleProps> {
    return deepMix({}, Slider.defaultOptions.style, this.attributes);
  }

  protected updateSelection() {
    const originValue = this.selection;

    const length = this.styles.length!;
    const startHandle = select(this).select(`.slider-start-handle`).node();
    const endHandle = select(this).select(`.slider-end-handle`).node() || startHandle;
    const handlePosition = this.ifH([startHandle.style.x, endHandle.style.x], [startHandle.style.y, endHandle.style.y]);
    const start = getIndexByPosition(handlePosition[0], length, this.style.data, this.style.sparkline?.type);
    const end = getIndexByPosition(handlePosition[1], length!, this.style.data, this.style.sparkline?.type);
    this.selection = [start ?? originValue[0], end ?? originValue[1]];

    this.adjustLabel();
    this.emitEvent('selectionChanged', { originValue, value: this.selection });
  }

  protected render() {
    const {
      sparkline,
      length,
      size,
      backgroundStyle,
      data,
      textStyle,
      handleStyle,
      startHandleIcon,
      endHandleIcon,
      startHandleSize,
      endHandleSize,
      orient,
      ...styles
    } = this.styles;
    const [width, height] = this.ifH([length, size], [size, length]);

    const bg = maybeAppend(this, '.slider-background', 'rect')
      .attr('className', 'slider-background')
      .style('x', 0)
      .style('y', 0)
      .style('width', width)
      .style('height', height)
      .call(applyStyle, backgroundStyle)
      .node();

    const { padding, fields = [], ...sparklineCfg } = sparkline || {};
    const [top, right, bottom, left] = normalPadding(padding!);
    const sparklineData = (fields || []).map((field) => data.map((d) => d[field] ?? null));
    maybeAppend(bg, '.slider-sparkline', () => new Sparkline({}))
      .attr('className', 'slider-sparkline')
      .call((selection) => {
        (selection.node() as Sparkline).update({
          width: length - left - right,
          height: size - top - bottom,
          data: sparklineData,
          transform: this.ifH(
            `rotate(0deg) translate(${left},${top})`,
            `rotate(90deg) translate(${left},-${size - top})`
          ),
          ...sparklineCfg,
        });
      });

    const tickScale = getScale(data, [0, 1], sparklineCfg.type);
    const bandWidth = tickScale.getBandWidth?.() || 0;
    const [st = 0, et = st] = this.selection.map((d) => tickScale.map(d) + bandWidth / 2) as number[];
    const x1 = this.ifH(st * width, width / 2);
    const x2 = this.ifH(et * width, width / 2);
    const y1 = this.ifH(height / 2, st * height);
    const y2 = this.ifH(height / 2, et * height);

    maybeAppend(bg, '.slider-selection', 'line')
      .attr('className', 'slider-selection')
      .style('x1', x1)
      .style('y1', y1)
      .style('x2', x2)
      .style('y2', y2)
      .style('lineWidth', this.ifH(height, width))
      .style('stroke', styles.selectionStyle.fill)
      .style('strokeOpacity', styles.selectionStyle.fillOpacity)
      .call(applyStyle, styles.selectionStyle);

    const { size: handleSize = 10, symbol, ...handleStyles } = handleStyle;
    maybeAppend(bg, '.slider-start-handle', () => new Handle({ className: 'slider-start-handle' }))
      .style('x', this.ifH(x1, (x1 + x2) / 2))
      .style('y', this.ifH((y1 + y2) / 2, y1))
      .style('cursor', this.ifH('ew-resize', 'ns-resize'))
      .call((selection) => {
        (selection.node() as Handle).update({
          align: 'start',
          orient: orient as any,
          markerStyle: { ...handleStyles, size: startHandleSize ?? handleSize, symbol: symbol ?? startHandleIcon },
          textStyle: { ...textStyle, text: data[this.selection[0]]?.name || '' },
          max: length,
        });
      });

    maybeAppend(bg, '.slider-end-handle', () => new Handle({ className: 'slider-end-handle' }))
      .style('x', this.ifH(x2, (x1 + x2) / 2))
      .style('y', this.ifH((y1 + y2) / 2, y2))
      .style('cursor', this.ifH('ew-resize', 'ns-resize'))
      .call((selection) => {
        (selection.node() as Handle).update({
          align: 'end',
          orient: orient as any,
          markerStyle: { ...handleStyles, size: endHandleSize ?? handleSize, symbol: symbol ?? endHandleIcon },
          textStyle: { ...textStyle, text: data[this.selection[1]]?.name || '' },
          max: length,
        });
      });

    const ticks = data.map((tick, idx) => ({ value: tickScale.map(idx) + bandWidth / 2, text: tick?.name || '' }));
    const { position: verticalFactor = -1, tickLine: tickLineCfg, ...axisLabelCfg } = styles.label || {};

    maybeAppend(bg, '.slider-axis', () => new Linear({ className: 'slider-axis' })).call((selection) =>
      (selection.node() as Linear).update(
        deepMix({}, DEFAULT_AXIS_CFG, {
          startPos: [verticalFactor * this.ifH(0, width + 6), verticalFactor * this.ifH(height + 6, 0)],
          endPos: [
            this.ifH(width, 0) + verticalFactor * this.ifH(0, width + 6),
            this.ifH(0, height) + verticalFactor * this.ifH(height + 6, 0),
          ],
          ticks,
          verticalFactor,
          tickLine: styles.label === null ? null : tickLineCfg,
          label: styles.label === null ? null : axisLabelCfg,
        })
      )
    );
  }

  private bindEvents() {
    const target = select(this).select('.slider-background');

    this.dragHandle(target, 'start');
    this.dragHandle(target, 'end');
    this.dragSelection(target);

    const selection = target.select('.slider-selection').node() as Line;
    const startHandle = target.select('.slider-start-handle').node() as Handle;
    const endHandle = target.select('.slider-end-handle').node() as Handle;
    startHandle.addEventListener(ElementEvent.ATTR_MODIFIED, ({ attrName, target }: any) => {
      if (attrName === 'x' || attrName === 'y') {
        selection.style[attrName === 'x' ? 'x1' : 'y1'] = Number(startHandle.getAttribute(attrName));
      }
    });
    endHandle.addEventListener(ElementEvent.ATTR_MODIFIED, ({ attrName }: any) => {
      if (attrName === 'x' || attrName === 'y') {
        selection.style[attrName === 'x' ? 'x2' : 'y2'] = Number(endHandle.getAttribute(attrName));
      }
    });
  }

  private adjustLabel() {
    const startHandle = select(this).select('.slider-start-handle').node() as Handle;
    const endHandle = select(this).select('.slider-end-handle').node() as Handle;
    const text0 = this.styles.data[this.selection[0]]?.name || '';
    const text1 = this.styles.data[this.selection[1]]?.name || '';
    if (startHandle.style.textStyle?.text !== text0) {
      startHandle.update({ textStyle: { text: text0 } });
    }
    if (endHandle.style.textStyle?.text !== text1) {
      endHandle.update({ textStyle: { text: text1 } });
    }
  }

  private dragHandle(selection: Selection, type: 'start' | 'end') {
    const shape = selection.select(`.slider-${type}-handle`).node();
    const startHandle = selection.select(`.slider-start-handle`).node();
    const endHandle = selection.select(`.slider-end-handle`).node();

    let dragging = false; // 拖拽状态
    let lastPosition: number; // 保存上次位置
    const onDragStart = (event: any) => {
      if (this.playTimer) clearInterval(this.playTimer);
      dragging = true;
      lastPosition = this.ifH(event.x, event.y);
    };
    const onDragEnd = (event: any) => {
      if (!dragging) return;
      dragging = false;
      if (this.playTimer) this.play();
    };
    const onDragMove = (event: any) => {
      if (dragging) {
        const length = this.styles.length!;
        const offset = this.ifH(event.x, event.y) - lastPosition;
        const position = shape.getLocalPosition();
        if (this.orient === 'vertical') {
          shape.style.y = clamp(position[1] + offset, 0, length);
          if (type === 'start') {
            endHandle.style.y = Math.max(endHandle.style.y, shape.style.y);
          } else if (type === 'end') {
            startHandle.style.y = Math.min(startHandle.style.y, shape.style.y);
          }
        } else {
          shape.style.x = clamp(position[0] + offset, 0, length);
          if (type === 'start') {
            endHandle.style.x = Math.max(endHandle.style.x, shape.style.x);
          } else if (type === 'end') {
            startHandle.style.x = Math.min(startHandle.style.x, shape.style.x);
          }
        }
        this.updateSelection();
        lastPosition = this.ifH(event.x, event.y);
      }
    };

    // events for drag start
    select(shape).on('pointerdown', onDragStart.bind(this));
    selection
      // events for drag end
      .on('pointerup', onDragEnd)
      // events for drag move
      .on('pointermove', onDragMove)
      .on('mouseupoutside', onDragEnd)
      .on('touchendoutside', onDragEnd);
  }

  private dragSelection(selection: Selection) {
    const shape = selection.select('.slider-selection').node() as Line;
    const startHandle = selection.select('.slider-start-handle').node();
    const endHandle = selection.select('.slider-end-handle').node();

    let dragging = false; // 拖拽状态
    let lastPosition: any; // 保存上次位置
    const onDragStart = (event: any) => {
      if (this.playTimer) clearInterval(this.playTimer);
      if (event.target === shape) {
        dragging = true;
        lastPosition = [event.x, event.y];
      }
    };
    const onDragEnd = (event: any) => {
      if (!dragging) return;
      dragging = false;
      if (this.playTimer) this.play();
    };
    const onDragMove = (event: any) => {
      if (dragging) {
        const length = this.styles.length!;
        const offset = this.ifH(event.x - lastPosition[0], event.y - lastPosition[1]);
        const [x0, y0] = startHandle.getLocalPosition();
        const [x1, y1] = endHandle.getLocalPosition();
        if (this.orient === 'vertical') {
          const height = y1 - y0;
          startHandle.style.y = clamp(y0 + offset, 0, length - height);
          endHandle.style.y = startHandle.style.y + height;
        } else {
          const width = x1 - x0;
          startHandle.style.x = clamp(x0 + offset, 0, length - width);
          endHandle.style.x = clamp(startHandle.style.x + width, startHandle.style.x, length);
        }
        this.updateSelection();
        lastPosition = [event.x, event.y];
      }
    };

    selection
      // events for drag start
      .on('pointerdown', onDragStart.bind(this))
      // events for drag end
      .on('pointerup', onDragEnd.bind(this))
      // events for drag move
      .on('pointermove', onDragMove.bind(this))
      .on('mouseupoutside', onDragEnd.bind(this))
      .on('touchendoutside', onDragEnd.bind(this));
  }

  protected emitEvent(eventName: string, detail: any) {
    this.dispatchEvent(new CustomEvent(eventName, { detail }));
  }
}

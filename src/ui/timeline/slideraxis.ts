import { Circle, Rect, RectStyleProps } from '@antv/g';
import { deepMix } from '@antv/util';
import { GUIOption } from 'types';
import { TickDatum } from 'ui/axis/types';
import { GUI } from '../../core/gui';
import { Linear as Ticks } from '../axis/linear';
import { SliderAxisCfg, SliderAxisOptions, TimeData } from './types';

export const createTickData = (data: TimeData[], tickInterval = 1) => {
  const tickData = [];
  for (let i = 0; i < data.length; i += tickInterval) {
    const step = 1 / (data.length - 1);
    tickData.push({
      value: step * i,
      text: data[i].date,
      state: 'default',
      id: String(i),
    } as TickDatum);
  }
  return tickData;
};

export function updateShapeStyle(shape: any, style: any) {
  Object.entries(style || {}).forEach(([key, value]) => shape.setAttribute(key as any, value as any));
}

export class SliderAxis extends GUI<Required<SliderAxisCfg>> {
  public static tag = 'slideraxis';

  public static defaultOptions: GUIOption<SliderAxisCfg> = {
    type: SliderAxis.tag,
    style: {
      x: 0,
      y: 0,
      length: 0,
      timeData: [],
      single: false,
      tickCfg: {
        verticalFactor: -1,
        axisLine: false,
        label: {
          offset: [0, 8],
          alignTick: true,
          style: {
            default: {
              fontSize: 5,
              fill: 'rgba(0,0,0,0.45)',
            },
          },
        },
        tickLine: {
          len: 4,
          style: {
            default: { stroke: 'rgba(0,0,0,0.25)', lineWidth: 1 },
          },
        },
      },
      handleStyle: {
        r: 6,
        stroke: '#BFBFBF',
        lineWidth: 1,
        fill: '#f7f7f7',
      },
      backgroundStyle: {
        height: 8,
        radius: 4,
        fill: 'rgba(65, 97, 128, 0.05)',
      },
      selectionStyle: {
        height: 8,
        fill: 'rgba(52, 113, 249, 0.75)',
      },
    },
  };

  private timeIndexMap = new Map<TimeData, number>();

  private minLength: number = 0;

  constructor(options: SliderAxisOptions) {
    super(deepMix({}, SliderAxis.defaultOptions, options));
    this.init();
  }

  private initMinLength() {
    const { length, timeData } = this.attributes;
    this.minLength = length / (timeData.length - 1);
  }

  public init(): void {
    this.initMinLength();
    this.initTimeIndexMap();
    this.createTicks();
    this.createBackground();
    this.createSelection();
    this.bindEvents();
  }

  private bindEvents() {
    this.bindStartHandleEvents();
  }

  private bindStartHandleEvents() {
    const { selection, backgroundStyle, length, timeData } = this.attributes;
    const radius = backgroundStyle.radius as number;
    const actualLength = length - radius * 2; // 实际的总长度
    let dragging = false; // 拖拽状态
    let lastPosition: number; // 保存上次的位置
    let maxLength = Infinity; //  蓝轴最长长度
    const nearestTimeDataId: number = this.timeIndexMap.get(selection[0]) as number; // 最近的时间节点
    const onDragStart = (event: any) => {
      dragging = true;
      lastPosition = event.canvasX;
      maxLength =
        (this.selectionShape.getAttribute('x') as number) + (this.selectionShape.getAttribute('width') as number);
    };
    const onDragMove = (event: any) => {
      event.stopPropagation();
      if (dragging) {
        console.log('test');
        const offset = event.canvasX - lastPosition;
        const newLength = (this.selectionShape.getAttribute('width') as number) - offset;
        if (newLength > this.minLength && newLength < maxLength) {
          // TODO 拖拽性能卡顿
          this.startHandleShape.style.x = (this.startHandleShape.getAttribute('x') as number) + offset;
          // this.selectionShape.attr({
          //   x: (this.selectionShape.getAttribute('x') as number) + offset,
          //   width: newLength,
          // });
          // this.endHandleShape.attr({
          //   x: newLength,
          // });
          // const startHandleX = (this.selectionShape.getAttribute('x') as number) - radius; //相对背景的x坐标
          // nearestTimeDataId = Math.round((startHandleX / actualLength) * timeData.length);
          // nearestTimeDataId = nearestTimeDataId < 0 ? 0 : nearestTimeDataId;
          lastPosition = event.x;
        }
      }
    };
    const onDragEnd = () => {
      dragging = false;
    };
    this.startHandleShape.addEventListener('mousedown', onDragStart);
    this.startHandleShape.addEventListener('mousemove', onDragMove);
    this.startHandleShape.addEventListener('mouseup', onDragEnd);
    this.startHandleShape.addEventListener('mouseleave', onDragEnd);
  }

  private initTimeIndexMap() {
    this.timeIndexMap = new Map<TimeData, number>();
    const { timeData } = this.attributes;
    for (let i = 0; i < timeData.length; i += 1) {
      this.timeIndexMap.set(timeData[i], i);
    }
  }

  private createTicks() {
    const { x, y, timeData, tickCfg: tickStyle, length, backgroundStyle } = this.attributes;
    const radius = backgroundStyle.radius as number;
    const actualLength = length - radius * 2;
    if (actualLength > 0) {
      if (!this.ticks) {
        this.ticks = new Ticks({
          style: {
            ...tickStyle,
            startPos: [x + radius, y],
            endPos: [x + radius + actualLength, y],
            ticks: createTickData(timeData),
          },
        });
        this.appendChild(this.ticks);
      } else {
        this.ticks.update({
          ...tickStyle,
          startPos: [x + radius, y],
          endPos: [x + radius + actualLength, y],
          ticks: createTickData(timeData),
        });
      }
    }
  }

  private createSelection() {
    const { length, selectionStyle, timeData, selection, single, handleStyle, backgroundStyle } = this.attributes;
    const radius = backgroundStyle.radius as number;
    const actualLength = length - radius * 2;
    if (selection.length === 2 && !single && actualLength > 0) {
      const [start, end] = selection;
      const [startIdx, endIdx] = [this.timeIndexMap.get(start), this.timeIndexMap.get(end)];
      if (startIdx !== undefined && endIdx !== undefined && endIdx > startIdx) {
        const selectionLength = (actualLength * (endIdx - startIdx)) / (timeData.length - 1);
        const startX = radius + (actualLength * startIdx) / (timeData.length - 1);
        if (!this.selectionShape) {
          this.selectionShape = new Rect({
            style: {
              ...(selectionStyle as RectStyleProps),
              x: startX,
              width: selectionLength,
            },
          });
          this.startHandleShape = new Circle({
            style: {
              ...handleStyle,
              y: (this.selectionShape.getAttribute('height') as number) / 2,
            },
          });
          this.endHandleShape = new Circle({
            style: {
              ...handleStyle,
              x: selectionLength,
              y: (this.selectionShape.getAttribute('height') as number) / 2,
            },
          });
          this.selectionShape.appendChild(this.startHandleShape);
          this.selectionShape.appendChild(this.endHandleShape);
          this.backgroundShape.appendChild(this.selectionShape);
        } else {
          this.selectionShape.attr({ ...(selectionStyle as RectStyleProps), x: startX, width: selectionLength });
          this.startHandleShape.attr({ ...handleStyle, y: (this.selectionShape.getAttribute('height') as number) / 2 });
          this.endHandleShape.attr({
            ...handleStyle,
            x: selectionLength,
            y: (this.selectionShape.getAttribute('height') as number) / 2,
          });
        }
      }
    }
  }

  private createBackground() {
    const { x, y, length, backgroundStyle } = this.attributes;
    if (!this.backgroundShape) {
      this.backgroundShape = new Rect({
        style: {
          x,
          y,
          ...backgroundStyle,
          width: length,
        },
      });
      this.appendChild(this.backgroundShape);
    } else {
      this.backgroundShape.attr({
        x,
        y,
        ...backgroundStyle,
        width: length,
      });
    }
  }

  public update(cfg: Partial<Required<SliderAxisCfg>>): void {
    this.attr(deepMix({}, this.attributes, cfg));
    this.initTimeIndexMap();
    this.initMinLength();
    this.createTicks();
    this.createBackground();
    this.createSelection();
  }

  public clear(): void {
    throw new Error('Method not implemented.');
  }

  private backgroundShape!: Rect;

  private selectionShape!: Rect;

  private startHandleShape!: Circle;

  private endHandleShape!: Circle;

  private ticks: Ticks | undefined;
}

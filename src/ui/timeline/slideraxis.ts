import { Circle, Rect, RectStyleProps } from '@antv/g';
import { deepMix, isArray } from '@antv/util';
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

  private timeIndexMap = new Map<TimeData['date'], number>();

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

  private backgroundShape!: Rect;

  private selectionShape!: Rect;

  private startHandleShape!: Circle;

  private endHandleShape!: Circle;

  private ticks: Ticks | undefined;

  private clearEvents = () => {};

  public get sliderBackground() {
    return this.backgroundShape;
  }

  public get sliderTicks() {
    return this.ticks;
  }

  public get sliderSelection() {
    return this.selectionShape;
  }

  public get sliderStartHandle() {
    return this.startHandleShape;
  }

  public get sliderEndHandle() {
    return this.endHandleShape;
  }

  private bindEvents() {
    const { selection, backgroundStyle, length, timeData, single, onSelectionChange } = this.attributes;
    if (single && Array.isArray(selection) && selection.length === 1) {
      const radius = backgroundStyle.radius as number;
      let selectionDragging = false;
      let lastPosition: number; // 保存上次的位置
      const actualLength = length - radius * 2; // 实际的总长度
      const newSelection: [string] = selection as [string]; // 变化的选中时间
      const onSelectionDragStart = (event: any) => {
        event.stopPropagation();
        selectionDragging = true;
        lastPosition = event.canvasX;
      };
      const onDragMove = (event: any) => {
        event.stopPropagation();
        if (selectionDragging) {
          const offset = event.canvasX - lastPosition;
          this.selectionShape.attr({
            x: (this.selectionShape.getAttribute('x') as number) + offset,
          });
          const selectionX = this.selectionShape.getAttribute('x') as number; // 相对背景的x坐标
          let nearestTimeDataId = Math.round((selectionX / actualLength) * (timeData.length - 1));
          nearestTimeDataId = nearestTimeDataId < 0 ? 0 : nearestTimeDataId;
          newSelection[0] = timeData[nearestTimeDataId].date;
          lastPosition = event.x;
          this.attr({ selection: newSelection });
          onSelectionChange(newSelection);
        }
      };
      const onDragEnd = () => {
        selectionDragging = false;
        this.attr({ selection: newSelection });
      };
      this.selectionShape.addEventListener('mousedown', onSelectionDragStart);
      this.addEventListener('mousemove', onDragMove);
      document.addEventListener('mouseup', onDragEnd);
      document.addEventListener('mouseleave', onDragEnd);
      // 清理监听事件函数
      const clearListeners = () => {
        this.selectionShape.removeEventListener('mousedown', onSelectionDragStart);
        this.removeEventListener('mousemove', onDragMove);
        document.removeEventListener('mouseup', onDragEnd);
        document.removeEventListener('mouseleave', onDragEnd);
      };
      this.clearEvents = clearListeners;
    } else if (!single && Array.isArray(selection) && selection.length === 2) {
      const radius = backgroundStyle.radius as number;
      const actualLength = length - radius * 2; // 实际的总长度
      let startHandleDragging = false; // startHandle拖拽状态
      let endHandleDragging = false;
      let selectionDragging = false;
      let lastPosition: number; // 保存上次的位置
      let maxLength = Infinity; //  蓝轴最长长度
      const newSelection: [string, string] = selection as [string, string]; // 变化的时间范围
      const onStartHandleDragStart = (event: any) => {
        event.stopPropagation();
        startHandleDragging = true;
        lastPosition = event.canvasX;
        maxLength =
          (this.selectionShape.getAttribute('x') as number) + (this.selectionShape.getAttribute('width') as number);
      };
      const onEndHandleDragStart = (event: any) => {
        event.stopPropagation();
        endHandleDragging = true;
        lastPosition = event.canvasX;
        maxLength = -(this.selectionShape.getAttribute('x') as number) + length;
      };
      const onSelectionDragStart = (event: any) => {
        event.stopPropagation();
        selectionDragging = true;
        lastPosition = event.canvasX;
      };
      const onDragMove = (event: any) => {
        event.stopPropagation();
        if (startHandleDragging) {
          const offset = event.canvasX - lastPosition;
          const newLength = (this.selectionShape.getAttribute('width') as number) - offset;
          if (newLength > this.minLength && newLength < maxLength) {
            // TODO 拖拽性能卡顿
            // this.startHandleShape.attr({ x: (this.startHandleShape.getAttribute('x') as number) + offset });
            this.selectionShape.attr({
              x: (this.selectionShape.getAttribute('x') as number) + offset,
              width: newLength,
            });
            this.endHandleShape.attr({
              x: newLength,
            });
            const startHandleX = (this.selectionShape.getAttribute('x') as number) - radius; // 相对背景的x坐标
            let nearestTimeDataId = Math.round((startHandleX / actualLength) * (timeData.length - 1));
            nearestTimeDataId = nearestTimeDataId < 0 ? 0 : nearestTimeDataId;
            newSelection[0] = timeData[nearestTimeDataId].date;
            lastPosition = event.x;
          }
        } else if (endHandleDragging) {
          const offset = event.canvasX - lastPosition;
          const newLength = (this.selectionShape.getAttribute('width') as number) + offset;
          if (newLength > this.minLength && newLength < maxLength) {
            this.selectionShape.attr({
              width: newLength,
            });
            this.endHandleShape.attr({
              x: newLength,
            });
            const endHandleX = (this.selectionShape.getAttribute('x') as number) + newLength - radius;
            let nearestTimeDataId = Math.round((endHandleX / actualLength) * (timeData.length - 1));
            nearestTimeDataId = nearestTimeDataId < 0 ? 0 : nearestTimeDataId;
            newSelection[1] = timeData[nearestTimeDataId].date;
            lastPosition = event.x;
          }
        } else if (selectionDragging) {
          const offset = event.canvasX - lastPosition;
          this.selectionShape.attr({
            x: (this.selectionShape.getAttribute('x') as number) + offset,
          });
          const startHandleX = (this.selectionShape.getAttribute('x') as number) - radius; // 相对背景的x坐标
          const endHandleX = startHandleX + (this.selectionShape.getAttribute('width') as number);

          let nearestTimeDataId = Math.round((startHandleX / actualLength) * (timeData.length - 1));
          nearestTimeDataId = nearestTimeDataId < 0 ? 0 : nearestTimeDataId;
          newSelection[0] = timeData[nearestTimeDataId].date;
          nearestTimeDataId = Math.round((endHandleX / actualLength) * (timeData.length - 1));
          nearestTimeDataId = nearestTimeDataId < 0 ? 0 : nearestTimeDataId;
          newSelection[1] = timeData[nearestTimeDataId].date;

          lastPosition = event.x;
        }
        if (selectionDragging || startHandleDragging || endHandleDragging) {
          this.attr({ selection: newSelection });
          onSelectionChange(newSelection);
        }
      };
      const onDragEnd = () => {
        startHandleDragging = false;
        endHandleDragging = false;
        selectionDragging = false;
        this.attr({ selection: newSelection });
      };
      this.endHandleShape.addEventListener('mousedown', onEndHandleDragStart);
      this.startHandleShape.addEventListener('mousedown', onStartHandleDragStart);
      this.selectionShape.addEventListener('mousedown', onSelectionDragStart);
      this.addEventListener('mousemove', onDragMove);
      document.addEventListener('mouseup', onDragEnd);
      document.addEventListener('mouseleave', onDragEnd);

      // 清理监听事件函数
      const clearListeners = () => {
        this.startHandleShape.removeEventListener('mousedown', onStartHandleDragStart);
        this.startHandleShape.removeEventListener('mousedown', onStartHandleDragStart);
        this.selectionShape.removeEventListener('mousedown', onSelectionDragStart);
        this.removeEventListener('mousemove', onDragMove);
        document.removeEventListener('mouseup', onDragEnd);
        document.removeEventListener('mouseleave', onDragEnd);
      };
      this.clearEvents = clearListeners;
    }
  }

  private initTimeIndexMap() {
    this.timeIndexMap = new Map<TimeData['date'], number>();
    const { timeData } = this.attributes;
    for (let i = 0; i < timeData.length; i += 1) {
      this.timeIndexMap.set(timeData[i].date, i);
    }
  }

  private createTicks() {
    const { timeData, tickCfg: tickStyle, length, backgroundStyle } = this.attributes;
    const radius = backgroundStyle.radius as number;
    const actualLength = length - radius * 2;
    if (actualLength > 0) {
      if (!this.ticks) {
        this.ticks = new Ticks({
          style: {
            ...tickStyle,
            startPos: [radius, 0],
            endPos: [radius + actualLength, 0],
            ticks: createTickData(timeData),
          },
        });
        this.appendChild(this.ticks);
      } else {
        this.ticks.update({
          ...tickStyle,
          startPos: [radius, 0],
          endPos: [radius + actualLength, 0],
          ticks: createTickData(timeData),
        });
      }
    }
  }

  private createSelection() {
    const { length, selectionStyle, timeData, selection, single, handleStyle, backgroundStyle } = this.attributes;
    const radius = backgroundStyle.radius as number;
    const actualLength = length - radius * 2;
    if (Array.isArray(selection) && selection.length === 1 && single) {
      const idx = this.timeIndexMap.get(selection[0]);
      if (idx !== undefined) {
        const startX = (actualLength * idx) / (timeData.length - 1);
        this.selectionShape = new Rect({
          style: { ...(selectionStyle as RectStyleProps), x: startX, width: radius * 2, radius },
        });
        this.backgroundShape.appendChild(this.selectionShape);
      }
    } else if (selection.length === 2 && !single && actualLength > 0) {
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
    const { length, backgroundStyle } = this.attributes;
    if (!this.backgroundShape) {
      this.backgroundShape = new Rect({
        style: {
          ...(backgroundStyle as RectStyleProps),
          width: length,
        },
      });
      this.appendChild(this.backgroundShape);
    } else {
      this.backgroundShape.attr({
        ...backgroundStyle,
        width: length,
      });
    }
  }

  public update(cfg: Partial<Required<SliderAxisCfg>>): void {
    this.clearEvents();
    this.attr(deepMix({}, this.attributes, cfg));
    this.initTimeIndexMap();
    this.initMinLength();
    this.createTicks();
    this.createBackground();
    this.createSelection();
    this.bindEvents();
  }

  public clear(): void {
    throw new Error('Method not implemented.');
  }
}

import { Rect, RectStyleProps } from '@antv/g';
import { deepMix } from '@antv/util';
import { GUI } from '../../core/gui';
import { Linear as Ticks } from '../axis/linear';
import { BACKGROUND_STYLE, CELL_STYLE } from './constants';
import { CellAxisCfg, CellAxisOptions, TimeData } from './types';
import { createTickData } from './slideraxis';

export class CellAxis extends GUI<Required<CellAxisCfg>> {
  public static tag = 'cellaxis';

  private timeIndexMap: Map<TimeData['date'], number> = new Map<TimeData['date'], number>();

  public get background() {
    return this.backgroundShape;
  }

  public static defaultOptions = {
    style: {
      cellStyle: {
        selected: CELL_STYLE.selected,
        default: CELL_STYLE.default,
      },
      backgroundStyle: BACKGROUND_STYLE,
      padding: [2, 4, 2, 4] /* top | right | bottom | left */,
      cellGap: 2,
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
    },
  };

  private cellShapes: Rect[] = [];

  private backgroundShape!: Rect;

  public get cells() {
    return this.cellShapes;
  }

  public get cellBackground() {
    return this.backgroundShape;
  }

  private ticks: Ticks | undefined;

  private clearEvents = () => {};

  constructor(options: CellAxisOptions) {
    super(deepMix({}, CellAxis.defaultOptions, options));
    if (this.attributes.padding.length !== 4) {
      this.setAttribute('padding', CellAxis.defaultOptions.style.padding as [number, number, number, number]);
    }
    this.init();
  }

  private initTimeIndexMap() {
    this.timeIndexMap = new Map<TimeData['date'], number>();
    const { timeData } = this.attributes;
    for (let i = 0; i < timeData.length; i += 1) {
      this.timeIndexMap.set(timeData[i].date, i);
    }
  }

  public init() {
    this.initTimeIndexMap();
    this.createBackground();
    this.createCells();
    this.createSelection();
    this.createTicks();
    this.bindEvents();
  }

  private bindEvents() {
    const { selection, cellStyle, single, onSelectionChange, timeData } = this.attributes;
    const { selected: selectedStyle, default: defaultStyle } = cellStyle;
    if (single && Array.isArray(selection) && selection.length === 1) {
      // single时默认为点选
      let newSelection: [string] = selection as [string]; // 变化的时间范围

      const onClick = (event: any) => {
        const idx = this.positionXToCellIdx(event.canvasX);
        this.cellShapes[idx].attr({
          ...selectedStyle,
        });
        newSelection = [timeData[idx].date];
        this.attr({ selection: newSelection });
        onSelectionChange(newSelection);
      };

      this.backgroundShape.addEventListener('click', onClick);
      this.clearEvents = () => {
        this.backgroundShape.removeEventListener('click', onClick);
      };
    } else if (!single && Array.isArray(selection) && selection.length === 2) {
      let selectionDragging = false;
      let newSelection: [string, string] = selection as [string, string]; // 变化的时间范围
      const onDragStart = (event: any) => {
        const startIdx = this.positionXToCellIdx(event.canvasX);
        this.cellShapes.forEach((cell) => {
          cell.attr({
            ...defaultStyle,
          });
        });
        this.cellShapes[startIdx].attr({
          ...selectedStyle,
        });
        newSelection = [timeData[startIdx].date, timeData[startIdx].date];
        this.attr({ selection: newSelection });
        onSelectionChange(newSelection);
        selectionDragging = true;
      };
      const onDragMove = (event: any) => {
        if (selectionDragging) {
          // TODO 这一步应该有点浪费，有待优化
          this.cellShapes.forEach((cell) => {
            cell.attr({
              ...defaultStyle,
            });
          });
          const endIdx = this.positionXToCellIdx(event.canvasX);
          newSelection[1] = timeData[endIdx].date;
          this.attr({ selection: newSelection });
          this.createSelection();
          onSelectionChange(newSelection);
        }
      };
      const onDragEnd = () => {
        selectionDragging = false;
      };

      this.backgroundShape.addEventListener('mousedown', onDragStart);
      this.addEventListener('mousemove', onDragMove);
      document.addEventListener('mouseup', onDragEnd);
      document.addEventListener('mouseleave', onDragEnd);

      // 清理监听事件函数
      this.clearEvents = () => {
        this.backgroundShape.removeEventListener('mousedown', onDragStart);
        this.removeEventListener('mousemove', onDragMove);
        document.removeEventListener('mouseup', onDragEnd);
        document.removeEventListener('mouseleave', onDragEnd);
      };
    }
  }

  private positionXToCellIdx(positionX: number): number {
    const { padding, cellGap, x } = this.attributes;
    // 已经确保了padding长度为4
    const left = padding[3];
    const cellNums = this.cellShapes.length;
    if (cellNums === 0) return -1;
    const cellWidth = this.cellShapes[0].getAttribute('width') as number;
    console.log(positionX, x, left, cellWidth + cellGap);
    let cellIdx = Math.floor((positionX - x - left) / (cellWidth + cellGap));
    cellIdx = cellIdx >= 0 ? cellIdx : 0;
    return cellIdx;
  }

  private createSelection() {
    const { cellStyle, selection, single } = this.attributes;
    const { selected: selectedStyle } = cellStyle;
    if (single && Array.isArray(selection) && selection.length === 1) {
      const idx = this.timeIndexMap.get(selection[0]);
      idx !== undefined &&
        this.cellShapes[idx].attr({
          ...selectedStyle,
        });
    } else if (!single && Array.isArray(selection) && selection.length === 2) {
      const [startIdx, endIdx] = [this.timeIndexMap.get(selection[0]), this.timeIndexMap.get(selection[1])];
      if (startIdx !== undefined && endIdx !== undefined) {
        for (let i = startIdx; i <= endIdx; i += 1) {
          this.cellShapes[i].attr({
            ...selectedStyle,
          });
        }
      }
    }
  }

  private createBackground() {
    const { length, backgroundStyle } = this.attributes;
    this.backgroundShape = new Rect({
      style: { ...(backgroundStyle as RectStyleProps), width: length },
    });
    this.appendChild(this.backgroundShape);
  }

  private updateBackground() {
    const { length, backgroundStyle } = this.attributes;
    this.backgroundShape.attr(backgroundStyle);

    this.backgroundShape.setAttribute('width', length);
  }

  private createCells() {
    this.cellShapes = [];
    const { length, timeData, padding, cellGap, cellStyle } = this.attributes;
    const { default: defaultStyle } = cellStyle;
    const [top, right, bottom, left] = padding;
    const cellNum = timeData.length;
    if (cellNum === 0) return;
    const cellWidth = (length - right - left - cellNum * cellGap + cellGap) / cellNum;
    if (cellWidth <= 0) return;
    const cellHeight = (this.backgroundShape.getAttribute('height') as number) - top - bottom;
    if (cellHeight <= 0) return;
    for (let i = 0; i < cellNum; i += 1) {
      const style = {
        ...defaultStyle,
        x: right + i * cellWidth + i * cellGap,
        y: top,
        width: cellWidth,
        height: cellHeight,
      };
      const cell = new Rect({ style });
      this.cellShapes.push(cell);
      this.backgroundShape.appendChild(cell);
    }
  }

  // 思路，先不销毁cells，按需创建，修改，删除
  private updateCells() {
    const { length, timeData, padding, cellGap, cellStyle } = this.attributes;
    const { default: defaultStyle } = cellStyle;
    const [top, right, bottom, left] = padding;
    // 根据新的timeData计算得到cell个数
    const cellNum = timeData.length;
    if (cellNum === 0) return;
    const cellWidth = (length - right - left - cellNum * cellGap + cellGap) / cellNum;
    if (cellWidth < 0) return;
    const cellHeight = (this.backgroundShape.getAttribute('height') as number) - top - bottom;
    if (cellHeight < 0) return;
    let i;
    for (i = 0; i < cellNum; i += 1) {
      const style = {
        ...defaultStyle,
        x: right + i * cellWidth + i * cellGap,
        y: top,
        width: cellWidth,
        height: cellHeight,
      };
      if (i < this.cellShapes.length) {
        this.cellShapes[i].attr(style);
      } else {
        const cell = new Rect({ style });
        this.cellShapes.push(cell);
        this.backgroundShape.appendChild(cell);
      }
    }
    i = this.cellShapes.length - 1;
    while (i >= cellNum) {
      this.backgroundShape.removeChild(this.cellShapes[i]);
      this.cellShapes[i].destroy();
      this.cellShapes.pop();
      i -= 1;
    }
  }

  private createTicks() {
    const { timeData, tickCfg: tickStyle } = this.attributes;

    if (this.cellShapes.length <= 1) return;
    const firstCell = this.cellShapes[0];
    const lastCell = this.cellShapes[this.cellShapes.length - 1];
    const labelY = -1;
    const startX = (firstCell.getAttribute('x') as number) + 0.5 * (firstCell.getAttribute('width') as number);
    const endX = (lastCell.getAttribute('x') as number) + 0.5 * (lastCell.getAttribute('width') as number);
    this.ticks = new Ticks({
      style: { ...tickStyle, startPos: [startX, labelY], endPos: [endX, labelY], ticks: createTickData(timeData) },
    });
    this.appendChild(this.ticks);
  }

  private updateTicks() {
    this.ticks?.destroy();
    this.createTicks();
  }

  public update(cfg: Partial<Required<CellAxisCfg>>): void {
    this.attr(deepMix({}, this.attributes, cfg));
    if (this.attributes.padding.length !== 4) {
      this.setAttribute('padding', CellAxis.defaultOptions.style.padding as [number, number, number, number]);
    }
    this.clearEvents();
    this.initTimeIndexMap();
    this.updateBackground();
    this.updateCells();
    this.createSelection();
    this.updateTicks();
    this.bindEvents();
  }

  public clear(): void {}
}

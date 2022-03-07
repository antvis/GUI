import { Rect, RectStyleProps } from '@antv/g';
import { deepMix } from '@antv/util';
import { GUI } from '../../core/gui';
import { Linear as Ticks } from '../axis/linear';
import { BACKGROUND_STYLE, CELL_STYLE } from './constants';
import { CellAxisCfg, CellAxisOptions } from './types';
import { createTickData } from './slideraxis';

export class CellAxis extends GUI<Required<CellAxisCfg>> {
  public static tag = 'cellaxis';

  public get background() {
    return this.backgroundShape;
  }

  public static defaultOptions = {
    style: {
      cell: {
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

  private ticks: Ticks | undefined;

  constructor(options: CellAxisOptions) {
    super(deepMix({}, CellAxis.defaultOptions, options));
    this.init();
  }

  public init(): void {
    this.createBackground();
    this.createCells();
    this.createTicks();
  }

  private createBackground() {
    const { x, y, length, backgroundStyle } = this.attributes;
    this.backgroundShape = new Rect({
      style: { ...(backgroundStyle as RectStyleProps), x, y, width: length },
    });
    this.appendChild(this.backgroundShape);
  }

  private updateBackground() {
    const { x, y, length, backgroundStyle } = this.attributes;
    this.backgroundShape.attr(backgroundStyle);
    this.backgroundShape.setAttribute('x', x);
    this.backgroundShape.setAttribute('y', y);
    this.backgroundShape.setAttribute('width', length);
  }

  private createCells() {
    this.cellShapes = [];
    const { length, timeData, padding, cellGap, cell } = this.attributes;
    const { default: defaultStyle, selected: selectedStyle } = cell;
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
    const { length, timeData, padding, cellGap, cell } = this.attributes;
    const { default: defaultStyle, selected: selectedStyle } = cell;
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
    const { x, y, timeData, tickCfg: tickStyle } = this.attributes;

    if (this.cellShapes.length <= 1) return;
    const firstCell = this.cellShapes[0];
    const lastCell = this.cellShapes[this.cellShapes.length - 1];
    const labelY = y - 1;
    const startX = x + (firstCell.getAttribute('x') as number) + 0.5 * (firstCell.getAttribute('width') as number);
    const endX = x + (lastCell.getAttribute('x') as number) + 0.5 * (lastCell.getAttribute('width') as number);
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
    this.updateBackground();
    this.updateCells();
    this.updateTicks();
  }

  public clear(): void {}
}

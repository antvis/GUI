import { Rect } from '@antv/g';
import { deepMix } from '@antv/util';
import { TickDatum } from 'ui/axis/types';
import { GUI } from '../../core/gui';
import { Linear as Ticks } from '../axis/linear';
import { BACKGROUND_STYLE, CELL_STYLE } from './constants';
import { CellAxisCfg, CellAxisOptions, TimeData } from './types';

export class CellAxis extends GUI<Required<CellAxisCfg>> {
  public static tag = 'cellaxis';

  public static defaultOptions = {
    style: {
      cell: {
        selected: CELL_STYLE.selected,
        default: CELL_STYLE.default,
      },
      background: BACKGROUND_STYLE,
      padding: [2, 4, 2, 4] /* top | right | bottom | left */,
      cellGap: 2,
      tickOptions: {
        style: {
          verticalFactor: -1,
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
          axisLine: false,
        },
      },
    },
  };

  private cellShapes: Rect[] = [];

  private backgroundShape!: Rect;

  private ticks: Ticks | undefined;

  private timeDataCache: TimeData[] = [];

  constructor(options: CellAxisOptions) {
    super(deepMix({}, CellAxis.defaultOptions, options));
    this.init();
  }

  public init(): void {
    this.timeDataCache = this.attributes.timeData;
    this.createBackground();
    this.createCells();
    this.createTicks();
  }

  private createBackground() {
    const { x, y, length, background } = this.attributes;
    this.backgroundShape = new Rect({
      style: { x, y, width: length, height: background.height, fill: background.fill },
    });
    this.appendChild(this.backgroundShape);
  }

  private updateBackground() {
    const { x, y, length, background } = this.attributes;
    this.backgroundShape.setAttribute('x', x);
    this.backgroundShape.setAttribute('y', y);
    this.backgroundShape.setAttribute('width', length);
    this.backgroundShape.setAttribute('height', background.height);
    this.backgroundShape.setAttribute('fill', background.fill);
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

  // 由于timeData的个数很有可能发生变化，姑且全部重新创建，可能会有性能问题，不推荐在动画里使用update
  private updateCells() {
    const { length, timeData, padding, cellGap, cell } = this.attributes;
    if (timeData.length !== this.timeDataCache.length) this.createCells();
  }

  private createTicks() {
    const createTickData = (data: TimeData[], tickInterval = 1) => {
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

    const {
      x,
      y,
      timeData,
      tickOptions: { style: tickStyle },
    } = this.attributes;

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

  public update(cfg: Partial<Required<CellAxisCfg>>): void {
    this.attr(deepMix({}, this.attributes, cfg));
    this.updateBackground();
    this.update;
  }

  public clear(): void {}
}

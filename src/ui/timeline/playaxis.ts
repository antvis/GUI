import { Rect } from '@antv/g';
import { deepMix } from '@antv/util';
import { GUI } from 'core/gui';
import { GUIOption } from 'types';
import { Linear as Ticks } from 'ui';
import { Time, TimeOptions } from '@antv/scale';
import { BACKGROUND_STYLE, CELL_STYLE } from './constants';
import { CellAxisCfg, CellAxisOptions } from './types';

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
          label: {
            style: {
              default: {
                fill: 'rgba(0,0,0,0.45)',
              },
            },
          },
          tickLine: {
            len: 4,
            style: {
              default: { stroke: 'rgba(0,0,0,0.25)' },
            },
          },
          axisLine: false,
        },
      },
    },
  };

  private cellShapes: Rect[] = [];

  private backgroundShape!: Rect;

  private ticks: Ticks;

  constructor(options: CellAxisOptions) {
    super(deepMix({}, CellAxis.defaultOptions, options));
    this.init();
  }

  public init(): void {
    this.createCells();
    this.createBackground();
    this.createTicks();
  }

  private createBackground() {
    const { x, y, length, background } = this.attributes;
    this.backgroundShape = new Rect({
      style: { x, y, width: length, height: background.height, fill: background.fill },
    });
    this.appendChild(this.backgroundShape);
  }

  private createCells() {
    this.cellShapes = [];
    const { x, y, length, timeData, padding, cellGap, background } = this.attributes;
    const [top, right, bottom, left] = padding;
    const cellNum = timeData.length;
    if (cellNum === 0) return;
    const cellWidth = (length - right - left - cellNum * cellGap + cellGap) / cellNum;
    if (cellWidth <= 0) return;
    const cellHeight = background.height - top - bottom;
    if (cellHeight <= 0) return;
    for (let i = 0; i < cellNum; i += 1) {
      const style = {
        ...background,
        x: x + right + i * cellWidth + i * cellGap,
        y: y + top,
        width: cellWidth,
        height: cellHeight,
      };
      const cell = new Rect({ ...style });
      this.cellShapes.push(cell);
      this.appendChild(cell);
    }
  }

  private createTicks() {
    const { timeData, tickOptions } = this.attributes;
    if (this.cellShapes.length <= 1) return;
    const firstCell = this.cellShapes[0];
    const lastCell = this.cellShapes[this.cellShapes.length - 1];
    const y = (firstCell.getAttribute('y') as number) - 10;
    const startX = (firstCell.getAttribute('x') as number) + 0.5 * (firstCell.getAttribute('width') as number);
    const endX = (lastCell.getAttribute('x') as number) + 0.5 * (lastCell.getAttribute('width') as number);
    this.ticks = new Ticks({ ...tickOptions, style: { startPos: [startX, y], endPos: [endX, y] } });
    this.appendChild(this.ticks);
  }

  public update(cfg: Partial<Required<CellAxisCfg>>): void {}

  public clear(): void {}
}

import { DisplayObject, BaseStyleProps, Rect, Group } from '@antv/g';
import { deepMix } from '@antv/util';
import { select } from '../../util';
import type { ShapeAttrs } from '../../types';

export interface IColumnCfg extends ShapeAttrs {
  width: number;
  height: number;
}

export interface IColumnsCfg extends BaseStyleProps {
  columns: IColumnCfg[][];
}

export class Columns extends DisplayObject<IColumnsCfg> {
  constructor({ style, ...rest }: Partial<DisplayObject<IColumnsCfg>>) {
    super(deepMix({}, { type: 'column', style: { width: 0, height: 0 } }, { style, ...rest }));
  }

  connectedCallback() {
    this.render();
  }

  public update(cfg: Partial<IColumnsCfg>): void {
    this.attr(deepMix({}, this.attributes, cfg));
    this.render();
  }

  public clear(): void {
    this.removeChildren(true);
  }

  private render(): void {
    const { columns } = this.attributes;
    select(this)
      .selectAll('.column')
      .data(columns.flat(), (_: any, idx: number) => idx)
      .join(
        (enter) =>
          enter.append('rect').each(function (datum) {
            this.className = 'column';
            this.attr(datum);
          }),
        (update) =>
          update.each(function (datum) {
            this.attr(datum);
          }),
        (exit) => exit.remove()
      );
  }
}

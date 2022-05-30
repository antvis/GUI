import { DisplayObject, Group } from '@antv/g';
import { deepMix } from '@antv/util';
import type { PathStyleProps, BaseStyleProps } from '@antv/g';
import { select } from '../../util';

export interface ILinesCfg extends BaseStyleProps {
  lines: PathStyleProps[];
  areas: PathStyleProps[];
}

export class Lines extends DisplayObject<ILinesCfg> {
  private linesGroup: Group;

  private areasGroup: Group;

  constructor({ style, ...rest }: Partial<DisplayObject<ILinesCfg>>) {
    super(deepMix({}, { type: 'lines', style: { width: 0, height: 0 } }, { style, ...rest }));
    this.linesGroup = this.appendChild(new Group({ name: 'lines' }));
    this.areasGroup = this.appendChild(new Group({ name: 'areas' }));
  }

  connectedCallback() {
    this.render();
  }

  public update(cfg: Partial<ILinesCfg>): void {
    this.attr(deepMix({}, this.attributes, cfg));
    this.render();
  }

  public render(): void {
    const { lines = [], areas = [] } = this.style;
    select(this.linesGroup)
      .selectAll('.line')
      .data(lines || [], (_: any, idx: number) => idx)
      .join(
        (enter) =>
          enter.append('path').each(function (datum) {
            this.className = 'line';
            this.attr(datum);
          }),
        (update) =>
          update.each(function (datum) {
            this.attr(datum);
          }),
        (exit) => exit.remove()
      );
    select(this.areasGroup)
      .selectAll('.area')
      .data(areas || [], (_: any, idx: number) => idx)
      .join(
        (enter) =>
          enter.append('path').each(function (datum) {
            this.className = 'area';
            this.attr(datum);
          }),
        (update) =>
          update.each(function (datum) {
            this.attr(datum);
          }),
        (exit) => exit.remove()
      );
  }

  public clear(): void {
    this.linesGroup.removeChildren(true);
    this.areasGroup.removeChildren(true);
  }
}

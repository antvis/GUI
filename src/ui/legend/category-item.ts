import { Text, Rect } from '@antv/g';
import { Marker } from '../marker';
import { CustomElement, ShapeCfg } from '../../types';
import { CategoryItemsCfg } from './types';

type CategoryItemCfg = ShapeCfg & {
  attrs: CategoryItemsCfg['itemCfg'];
};

export default class CategoryItem extends CustomElement {
  // marker
  private markerShape: Marker;

  // name
  private nameShape: Text;

  // value
  private valueShape: Text;

  // background
  private backgroundShape: Rect;

  constructor({ attrs, ...rest }: CategoryItemCfg) {
    super({ type: 'categoryItem', attrs, ...rest });
    this.render(attrs);
  }

  attributeChangedCallback(name: string, value: any) {
    // 更新item
  }

  public render(itemCfg: CategoryItemsCfg['itemCfg']) {
    // render markerShape
    // render nameShape
    // render valueShape
    // render backgroundShape
  }

  /**
   * 获得缩略文本
   */
  private getEllipsisName() {}

  /**
   * 获得精简值
   */
  private getConciseValue() {}
}

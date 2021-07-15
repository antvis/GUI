import { deepMix } from '@antv/util';
import { Marker } from '../marker';
import LegendBase from './base';
import CategoryItem from './category-item';
import { CategoryCfg, CategoryOptions } from './types';
import { DisplayObject } from '../../types';

export type { CategoryOptions };

export class Category extends LegendBase<CategoryCfg> {
  public static tag = 'Category';

  private itemsContainer: DisplayObject;

  // 图例项
  private items: CategoryItem[];

  // 前进按钮
  private prevNavigation: Marker;

  // 后退按钮
  private nextNavigation: Marker;

  protected static defaultOptions = {
    ...LegendBase.defaultOptions,
    items: {
      items: [],
      itemCfg: {
        height: 16,
        width: 40,
        spacing: 10,
        marker: {
          symbol: 'circle',
          size: 16,
          style: {
            fill: '#f8be4b',
            lineWidth: 0,
            active: {
              fill: '#f3774a',
            },
          },
        },
        name: {
          spacing: 5,
          style: {
            stroke: 'gray',
            fontSize: 16,
            checked: {
              stroke: 'black',
              fontWeight: 'bold',
            },
          },
          formatter: (name: string) => name,
        },
        value: {
          spacing: 5,
          align: 'right',
          style: {
            stroke: 'gray',
            fontSize: 16,
            checked: {
              stroke: 'black',
              fontWeight: 'bold',
            },
          },
        },
        backgroundStyle: {
          fill: 'white',
          opacity: 0.5,
          active: {
            fill: '#2c2c2c',
          },
        },
      },
    },
  };

  constructor(options: CategoryOptions) {
    super(deepMix({}, Category.defaultOptions, options));
  }

  attributeChangedCallback(name: string, value: any) {}

  public init() {}

  public update(attrs: CategoryCfg) {}

  public clear() {}

  private bindEvents() {
    // 图例项hover事件
    // 图例项点击事件
  }

  /**
   * 创建图例项
   */
  private createItems() {}

  /**
   * 获得一页图例项可用空间
   */
  private getItemsSpace() {
    /**
     * 情况1 按钮在上下、左右 无页码
     *            ↑
     *    item  item  item
     *  ← item  item  item →
     *    item  item  item
     *            ↓
     *
     * 情况2 按钮在内
     *    item  item  item
     *    item  item  <- ->
     *
     *    item  item  item
     *    item  <- 1/3 ->
     *
     * 情况3 按钮在外
     *       <- 1/3 ->
     *  ↑ item  item  item  ↑
     *1/3 item  item  item 1/3
     *  ↓ item  item  item  ↓
     *       <- 1/3 ->
     */
  }

  /**
   * 计算图例布局
   */
  private calcLayout() {}

  // 创建翻页器
  private createPageNavigator() {}

  // 前翻页
  private onNavigationPrev = () => {};

  // 后翻页
  private onNavigationNext = () => {};

  // 设置图例项状态
  private setItemStatus() {}
}

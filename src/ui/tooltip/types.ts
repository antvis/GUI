// import type { MarkerCfg } from '../marker';
import type { DisplayObjectConfig, TextProps } from '../../types';

export type TooltipPosition =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export type TooltipItem = {
  name: string;
  value: string;
};

export type ItemNameCfg = {
  formatter: (text: string, item: TooltipItem, index: number) => string;
  spacing: number;
  style: TextProps;
};

export type ItemValueCfg = {
  formatter: (text: string, item: TooltipItem, index: number) => string;
  spacing: number;
  style: TextProps;
};

export type TooltipHTMLElement = string | HTMLElement;

export interface TooltipCfg {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  /** 内边距 */
  padding?: number | number[];
  /** 标题 */
  title: {
    content: string;
    style: TextProps;
  };
  /* tooltip 位置 */
  position: TooltipPosition;
  /* 在位置方向上的偏移量 */
  offset: [number, number];
  /* 是否跟随鼠标 */
  follow: boolean;
  /* 鼠标是否可进入 */
  enterable: boolean;
  /* 自动调整位置，需要设置容器属性 */
  autoLayout: boolean;
  /* 外部容器属性 */
  containerBounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  /* 项目 */
  items: TooltipItem[];
  // itemMarker: MarkerCfg | ((item: TooltipItem, index: number, items: TooltipItem[]) => MarkerCfg);
  /* name */
  itemName: ItemNameCfg | ((item: TooltipItem, index: number, items: TooltipItem[]) => ItemNameCfg);
  /* value */
  itemValue: ItemValueCfg | ((item: TooltipItem, index: number, items: TooltipItem[]) => ItemValueCfg);
  /* 模版 */
  template: {
    /* 容器模版 */
    container: TooltipHTMLElement;
    /* 项目模版 */
    item: (item: TooltipItem, index: number, items: TooltipItem[]) => TooltipHTMLElement;
  };
  /* 自定义内容 */
  customContent: TooltipHTMLElement | ((item: TooltipItem, index: number, items: TooltipItem[]) => TooltipHTMLElement);
}

export type TooltipOptions = DisplayObjectConfig<TooltipCfg>;

import { ShapeAttrs, ShapeCfg } from '../../types';

export type BreadCrumbItem = {
  /**
   * 展示的文案
   */
  name: string;

  /**
   * 样式
   */
  style?: ShapeAttrs;

  /**
   * 点击事件
   */
  onClick?: (name: string, item: BreadCrumbItem, items: BreadCrumbItem[]) => void;
};

export type BreadCrumbAttrs = ShapeAttrs & {
  /**
   * 分隔符，默认 /
   */
  separator?: string;

  /**
   * 分隔符左右间距，默认 8px
   */
  separatorPadding?: number;

  /**
   * hover 样式
   */
  hoverStyle?: ShapeAttrs;

  /**
   * 面包屑 item
   */
  items: BreadCrumbItem[];
};

export type BreadCrumbOptions = ShapeCfg & {
  attrs: BreadCrumbAttrs;
};

import type { GroupStyleProps } from '../../shapes';
import type { ComponentOptions } from '../../core';

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
  name?: string;
  value?: number | string;
  index?: number;
  color?: string;
  [key: string]: any;
};

export type TooltipStyleProps = GroupStyleProps & {
  /* 项目 */
  data?: TooltipItem[];
  /** 标题 */
  title?: string;
  /* tooltip 位置 */
  position?: TooltipPosition | 'auto';
  defaultPosition?: TooltipPosition;
  /* 在位置方向上的偏移量 */
  offset?: [number, number];
  /** 指针是否可进入 */
  enterable?: boolean;
  /** 画布的左上角坐标 */
  container: {
    x: number;
    y: number;
  };
  /** tooltip 在画布中的边界 */
  bounding: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  /* 模版 */
  template?: {
    /* 容器模版 */
    container?: string;
    title?: string;
    /* item模版 */
    item?: string;
  };
  /** 避免 content 重复渲染 */
  contentKey?: string;
  /* 自定义内容 */
  content?: string | HTMLElement;
  /**
   * 样式
   */
  style?: {
    [key: string]: {
      [key: string]: any;
    };
  };
};

export type TooltipOptions = ComponentOptions<TooltipStyleProps>;

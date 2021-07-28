import { Group } from '@antv/g';
import type { ShapeAttrs, ShapeCfg } from '../../types';

export type StatisticAttrs = {
  /**
   * 标题
   */
  title?: {
    text?: string;
    /**
     * 标题 自定义文本样式
     */
    style?: ShapeAttrs;
    /**
     * 文本格式化
     */
    formatter?: (text: string) => string | Group;
  };
  /**
   * 值 string | 数值 | 时间(毫秒)
   */
  value?: {
    text?: string;
    /**
     * 标题 自定义文本样式
     */
    style?: ShapeAttrs;
    /**
     * 文本格式化
     */
    formatter?: (text: string) => string | Group;
  };
  /**
   * 标题 值 上下间距
   */
  spacing?: number;
};

export type StatisticOptions = ShapeCfg & {
  attrs: StatisticAttrs;
};

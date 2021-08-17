import type { TextProps, DisplayObjectConfig } from '../../types';

export interface TitleOption {
  text?: string | number;
  /**
   * 标题 自定义文本样式
   */
  style?: Partial<TextProps>;
  /**
   * 文本格式化
   */
  formatter?: (text: any) => string;
}
export interface ValueOption extends TitleOption {
  /**
   * 值 前缀
   */
  prefix?: any;
  /**
   * 值 前缀
   */
  suffix?: any;
}

export type StatisticCfg = {
  x?: number;
  y?: number;
  /**
   * 标题
   */
  title?: TitleOption;
  /**
   * 值 string | 数值 | 时间(毫秒)
   */
  value?: ValueOption;
  /**
   * 标题 值 上下间距
   */
  spacing?: number;
};

export type StatisticOptions = DisplayObjectConfig<StatisticCfg>;

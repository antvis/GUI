import type { MarkerStyleProps } from '../marker';
import type { RectProps, TextProps, MixAttrs, DisplayObjectConfig } from '../../types';

export type TagCfg = {
  /** 位置 x */
  x?: number;
  /** 位置 y */
  y?: number;
  /** tag 文本 */
  text?: string;
  /** 图标类型，也可以自定义; 默认不显示 */
  marker?: MarkerStyleProps;
  /** text 和 marker 的间距，默认为 4px (只有当 marker 存在时，才生效) */
  spacing?: number;
  /** 水平对齐方式 */
  align?: 'start' | 'center' | 'end';
  /** 垂直对齐方式 */
  verticalAlign?: 'top' | 'middle' | 'bottom';
  // 样式相关
  /** 内边距 */
  padding?: number | number[];
  /** background 圆角 */
  radius?: number;
  /** 文本的样式 */
  textStyle?: MixAttrs<Partial<TextProps>>;
  /** background 背景样式 */
  backgroundStyle?: MixAttrs<Partial<RectProps>> | null;
};

export type TagOptions = DisplayObjectConfig<TagCfg>;

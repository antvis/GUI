import { ShapeAttrs, ShapeCfg } from '../../types';

export type IconOptions = ShapeCfg & {
  attrs: {
    /**
     * icon 的图标类型，iconfont 上的 unicode
     */
    type: string;
    /**
     * 图标的大小，默认为 16px
     */
    size?: number;
    /**
     * Icon 图标的颜色
     */
    fill?: string;
    /**
     * 图标的样式
     */
    iconStyle?: ShapeAttrs;
    /**
     * 间距，默认为 8px
     */
    spacing?: number;
    /**
     * 图标附属的文本，默认不显示
     */
    text?: string;
    /**
     * 文本的样式
     */
    textStyle?: ShapeAttrs;
  };
};

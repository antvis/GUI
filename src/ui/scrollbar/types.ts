import { ShapeAttrs, ShapeCfg } from '../../types';

export type Range = [number, number];

export interface ScrollStyle {
  track: ShapeAttrs;
  thumb: ShapeAttrs;
}

export type Orient = 'horizontal' | 'vertical';
export type ScrollSize = 'small' | 'medium' | 'large';
export type ThumbShape = 'rect' | 'round';

export type ScrollbarOptions = ShapeCfg & {
  attrs: {
    /**
     * 滑条朝向
     */
    orient?: Orient;

    /**
     * 轨道长度
     */
    length: number;

    /**
     * 滑块范围
     */
    range?: Range;

    /**
     * 滑块范围控制
     */
    limit?: Range;

    /**
     * 滚动条尺寸
     */
    size?: ScrollSize;

    /**
     * 滑块形状
     */
    shape?: ThumbShape;

    /**
     * 滚动条样式
     */
    scrollStyle?: ScrollStyle;

    /**
     * hover样式
     */
    hoverStyle?: ScrollStyle;
  };
};

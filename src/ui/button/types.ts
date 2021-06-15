import { ShapeAttrs, ShapeCfg } from '../../types';

export type ButtonOptions = ShapeCfg & {
  attrs: {
    /**
     * 文本
     */
    text?: string;
    /**
     * 文本样式
     */
    textStyle?: ShapeAttrs;
    /**
     * 按钮禁用
     */
    disabled?: boolean;
    /**
     * 按钮形状
     */
    shape?: 'circle' | 'round';
    /**
     * 按钮尺寸
     */
    size?: 'small' | 'middle' | 'large';
    /**
     * 省略超长文本
     */
    ellipsis: boolean;
    /**
     * 按钮类型
     */
    type?: 'primary' | 'ghost' | 'dashed' | 'link' | 'text' | 'default';
    /**
     * 点击回调函数
     */
    onClick?: Function;
    /**
     * 自定义按钮样式
     */
    buttonStyle?: ShapeAttrs;
    /**
     * 激活状态
     */
    hoverStyle?: {
      textStyle: ShapeAttrs;
      buttonStyle: ShapeAttrs;
    };
  };
};

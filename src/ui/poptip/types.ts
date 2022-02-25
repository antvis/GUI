import type { DisplayObjectConfig } from '../../types';

export type PoptipPosition =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'left-top'
  | 'left-bottom'
  | 'right-top'
  | 'right-bottom';

export interface PoptipCfg {
  /**
   * @title 位置
   * @description 控制弹框 x y 位置
   */
  container?: {
    x?: number;
    y?: number;
  };
  /**
   * @title 目标
   * @description 给 poptip 一个内部定位的目标，当有目标的时候，可以通过目标的 x,y 位置 计算得到 x,y 位置，x,y 配置 比 target 权重高。
   */
  target?: any;
  /**
   * @title 显影
   * @description 控制弹框显影
   */
  visibility?: 'visible' | 'hidden';
  /**
   * @title 气泡框位置
   * @description 可选 top left right bottom top-left top-right bottom-left bottom-right left-top left-bottom right-top right-bottom
   */
  position?: PoptipPosition;
  /**
   * @title 内容模版
   * @description 可以添加容器模版 背景模版 和 文本模版
   */
  template?: {
    container?: string | HTMLElement;
    text?: string | HTMLElement;
  };
  /**
   * @title 模版
   * @description 气泡内部配置的 当前只有 tooltip 后续添加
   */
  backgroundShape?: any;
  /**
   * @title 样式
   * @description 所有内容模版都可以通过 '.className': cssStyle 的方式，来改变 poptip 的样式
   */
  style?: {
    [key: string]: {
      [key: string]: string;
    };
  };
}

export type PoptipOptions = DisplayObjectConfig<PoptipCfg>;

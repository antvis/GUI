import { PointType } from '@antv/g';

export interface IconCfg {
  readonly position: PointType;
  // icon 类型
  readonly icon: string;
  // 文本
  readonly text?: string;
  // 文本和 icon 之间的距离
  readonly spacing?: number;
  // icon 样式
  readonly iconStyle?: object;
  // 文本样式
  readonly textStyle?: object;
  // 是否可交互
  readonly interactive?: boolean;
}

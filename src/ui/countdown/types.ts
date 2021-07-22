import { Group } from '@antv/g';
import type { ShapeAttrs } from '../../types';
import type { StatisticAttrs, StatisticOptions } from '../statistic/types';

export interface CountdownAttrs extends StatisticAttrs {
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
    /**
     * 格式化时间
     */
    format?: string;
    /**
     * 值 时间 是否动态时间 传入 value 为倒计时 不传入 为 当前时间
     */
    dynamicTime?: boolean;
  };
}

export interface CountdownOptions extends StatisticOptions {
  attrs: CountdownAttrs;
}

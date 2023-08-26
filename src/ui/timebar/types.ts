import { PrefixObject } from 'src/types';
import type { SeriesAttr } from 'src/util';
import type { ComponentOptions } from '../../core';
import type { BaseStyleProps, GroupStyleProps } from '../../shapes';

export type Functions = 'reset' | 'speed' | 'backward' | 'playPause' | 'forward' | 'selectionType' | 'chartType';
export type ControllerStyleProps = GroupStyleProps &
  PrefixObject<BaseStyleProps, 'background'> & {
    width: number;
    height: number;
    padding?: SeriesAttr;
    /** 对齐位置 */
    align?: 'left' | 'center' | 'right';
    /** 背景颜色 */
    background?: string;
    iconSize?: number;
    /** 播放速度 */
    speed?: number;
    /** 是否正在播放 */
    playing?: boolean;
    /** 选区类型：范围/值 */
    selectionType?: 'range' | 'value';
    /** 图表类型：折线图/条形图 */
    chartType?: 'line' | 'bar';
    /**
     * 启用功能，通过 [] 进行分组
     * @description reset 重置
     * @description speed 速度
     * @description backward 快退
     * @description play 播放
     * @description forward 快进
     * @description type 类型
     * @description chart 图表
     */
    functions?: Functions[][];
    onChange?: (type: Functions, value: Record<string, any>) => void;
  };

export type ControllerOptions = ComponentOptions<ControllerStyleProps>;

export type TimebarStyleProps = {
  type: 'time' | 'chart';
  onChange?(type: Functions | 'value', value: Record<string, any>): void;
};
export type TimebarOptions = ComponentOptions<TimebarStyleProps>;

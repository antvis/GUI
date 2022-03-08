import { DisplayObjectConfig } from '@antv/g';
import { CircleProps, LabelProps, MixAttrs, RectProps, TextProps } from 'types';
import { CheckboxOptions, LinearCfg, LinearOptions, TextCfg } from 'ui';
import { ButtonCfg } from 'ui/button';
import { TooltipOptions } from 'ui/tooltip';

export type TimeData = {
  date: string;
  [k: string]: any;
};
export type PlayAxisBaseCfg = {
  /**
   * @title 时间选择
   * @description 时间选择， 起始时间与结束时间/单一时间
   */
  selection?: [TimeData['date'], TimeData['date']] | [TimeData['date']];
  /**
   * @title  单一时间
   * @description 单一时间
   */
  single?: boolean;
  /**
   * @title x 坐标
   * @description x 坐标
   */
  x: number;
  /**
   * @title y 坐标
   * @description y 坐标
   */
  y: number;
  /**
   * @title 总长度
   * @description 整个轴组件的长度
   */
  length: number;
  /**
   * @title 刻度配置
   * @description 调整刻度配置,实际上刻度是一条width为0的linear型axis组件
   */
  tickCfg?: Partial<LinearCfg>;
  /**
   * @title 刻度配置
   * @description 调整刻度配置,实际上刻度是一条width为0的linear型axis组件
   */
  tickInterval?: number;
  /**
   * @title  时间数据
   * @description 时间数据，必须是均匀等间距的，在方格形的时间轴中每个数据点代表一个小方格
   */
  timeData: TimeData[];
  /**
   * @title  tooltip内容
   * @description 自定义tooltip内容
   */
  customTooltip?: (time: string | Date) => TooltipOptions;
  /**
   * @title  变化时回调函数
   * @description 监听时间范围（或单一时间）变化的回调函数
   */
  onSelectionChange?: (selection: PlayAxisBaseCfg['selection']) => void;
};

export type CellAxisCfg = PlayAxisBaseCfg & {
  /**
   * @title  cell 样式
   * @description 格子样式
   */
  cellStyle?: MixAttrs<Partial<RectProps>>;
  /**
   * @title  背景样式
   * @description 背景样式
   */
  backgroundStyle?: Partial<RectProps>;
  /**
   * @title   padding
   * @description background 的 padding
   */
  padding?: [number, number, number, number];
  /**
   * @title   格子间距
   * @description 格子间的间距
   */
  cellGap?: number;
};

export type SliderAxisCfg = PlayAxisBaseCfg & {
  /**
   * @title  手柄样式
   * @description 手柄样式
   */
  handleStyle?: CircleProps;
  /**
   * @title  背景样式
   * @description 背景样式
   */
  backgroundStyle?: Partial<Omit<RectProps, 'width' | 'x' | 'y'>>;
  /**
   * @title  selection样式
   * @description 选中时间范围样式
   */
  selectionStyle?: Partial<Omit<RectProps, 'width' | 'x' | 'y'>>;
};
export type CellAxisOptions = DisplayObjectConfig<CellAxisCfg>;
export type SliderAxisOptions = DisplayObjectConfig<SliderAxisCfg>;
type TicksOptions = LinearOptions;
type SingleModeControl = false | CheckboxOptions;
type Orient = {
  layout: 'row' | 'col';
  controlButtonAlign: 'normal' | 'left' | 'right';
};
export type SpeedControlCfg = {
  /**
   * @title 可调节的速度
   * @description 配置可调节的速度，建议配置范围在 5 个区间，如: [1.0, 2.0, 3.0, 4.0, 5.0], [0.5, 1.0, 1.5, 2.0, 2.5]
   */
  speeds?: string[];
  /**
   * @title   速度变化回调函数
   * @description 监听速度变化的回调函数
   */
  onSpeedChange?: (speed: number) => void;
  /**
   * @title   x
   * @description x坐标
   */
  x: number;
  /**
   * @title   y
   * @description y坐标
   */
  y: number;
  /**
   * @title   width
   * @description 宽度
   */
  width?: number;
  /**
   * @title   height
   * @description 高
   */
  height?: number;
  /**
   * @title   label
   * @description label配置
   */
  label?: Omit<TextCfg, 'text'>;
  /**
   * @title   spacing
   * @description label与按钮的间隔
   */
  spacing?: number;
};

export type SpeedControlOptions = DisplayObjectConfig<SpeedControlCfg>;

type Controls =
  | false
  | {
      /**
       * @title  是否显示单一时间checkbox
       * @description false 不显示，否则应传入checkbox参数
       */
      singleModeControl?: SingleModeControl;
      /**
       * @title 播放器按钮，包含：play button，prev button and next button
       * @description 播放器按钮设置。设置为 null 时，不展示播放器按钮
       */
      controlButton?: {
        /**
         * @title  停止按钮
         * @description 播放按钮设置。设置为 null 时，不展示播放按钮
         */
        stopBtn?: ButtonCfg;
        /**
         * @title 播放按钮
         * @description 播放按钮设置。设置为 null 时，不展示播放按钮
         */
        playBtn?: ButtonCfg;
        /**
         * @title 后退按钮
         * @description 后退按钮设置。设置为 null 时，不展示后退按钮
         */
        prevBtn?: ButtonCfg;
        /**
         * @title 前进按钮
         * @description 前进按钮设置。设置为 null 时，不展示前进按钮
         */
        nextBtn?: ButtonCfg;
      };
      /**
       * @title 倍速调节器
       * @description 倍速调节器设置。设置为 null 时，不展示倍速调节器
       */
      speedControl?: SpeedControlCfg;
    };

type TooltipFormatter = (time: string | Date) => TooltipOptions;

export type TimelineCfg = {
  /**
   * @title x 坐标
   * @description x 坐标
   */
  x: number;
  /**
   * @title y 坐标
   * @description y 坐标
   */
  y: number;
  /**
   * @title 总宽度
   * @description 整个组件的宽度
   */
  width: number;
  /**
   * @title 高度
   * @description 整个组件的高度
   */
  height: number;
  /**
   * @title 时间数据
   * @description 时间数据，必须是均匀等间距的，每个数据点代表一个小方格
   */
  data: TimeData[];
  /**
   * @title  布局方向
   * @description 布局方向，见设计稿
   * @default 'left'
   */
  orient?: Orient;
  /**
   * @title 播放轴类型
   * @description 播放轴为slider型还是格子刻度型
   * @default 'slider'
   */
  type: 'slider' | 'cell';
  /**
   * @title 播放轴cell类型配置
   * @description 播放轴为格子刻度型的配置，如果type不是cell则忽略
   */
  cellAxisCfg?: CellAxisCfg;
  /**
   * @title 播放轴slider类型配置
   * @description 播放轴为格子刻度型的配置，如果type不是cell则忽略
   */
  sliderOptions?: SliderAxisCfg;
  /**
   * @title 播放控制
   * @description 配置播放器、单一时间checkbox
   * @default 'slider'
   */
  controls?: Controls;
  /**
   * @title  tooltip内容
   * @description 自定义tooltip内容
   */
  tooltip?: false | TooltipFormatter;
  /**
   * @title   刻度尺
   * @description 自定义刻度尺
   */
  ticks?: false | Partial<TicksOptions>;
  /**
   * @title  变化时回调函数
   * @description 监听时间范围（或单一时间）变化的回调函数
   */
  onSelectionChange?: (selection: string[] | Date[]) => void;
};
export type TimelineOptions = DisplayObjectConfig<TimelineCfg>;

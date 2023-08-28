import { clamp } from '@antv/util';
import { GUI } from '../../core';
import { Line } from '../../shapes';
import { BBox, deepAssign } from '../../util';
import { Slider, type SliderStyleProps } from '../slider';
import { Controller } from './controller';
import { Axis } from '../axis';
import { ChartModeHandle, TimeModeHandle } from './handle';
import type { ControllerStyleProps, TimebarOptions, TimebarStyleProps } from './types';
import type { LinearAxisStyleProps } from '../axis/types';
import { labelFormatter } from './utils';

export class Timebar extends GUI<TimebarStyleProps> {
  static defaultOptions: TimebarOptions = {
    style: {
      type: 'time',
      data: [],
      values: [0, 0.5],
      interval: 'day',
      controllerAlign: 'center',
      controllerHeight: 40,
      selectionType: 'range',
      chartType: 'line',
    },
  };

  private axis = this.appendChild(
    new Axis({
      style: { type: 'linear', startPos: [0, 0], endPos: [0, 0], data: [], showArrow: false, animate: false },
    })
  );

  /** 时间线 group，用于放置 timeline 或者 chart */
  private timeline = this.appendChild(
    new Slider({
      style: {
        onChange: (values) => {
          // this.states.values = values;
          if (Array.isArray(values)) this.states.values = values;
          else this.states.values[1] = values;
          this.attributes.onChange?.(values);
        },
      },
    })
  );

  private controller = this.appendChild(new Controller({}));

  private states: Record<string, any> = {};

  /** 计算空间分配 */
  private get space() {
    const { width, height, type, controllerHeight } = this.attributes;

    const availableTimelineHeight = clamp(+height - controllerHeight, 0, +height);
    const controllerBBox = new BBox(0, +height - controllerHeight, +width, controllerHeight);

    // chart 模式下可用
    let axisBBox: BBox;
    let axisHeight = 0;
    if (type === 'chart') {
      // axis 默认分配高度为 35
      axisHeight = 35;
      axisBBox = new BBox(0, availableTimelineHeight - axisHeight, +width, axisHeight);
    } else axisBBox = new BBox();

    const timelineHeight = type === 'time' ? 10 : availableTimelineHeight;
    const timelineBBox = new BBox(
      0,
      type === 'time' ? availableTimelineHeight : availableTimelineHeight - timelineHeight,
      +width,
      timelineHeight - axisHeight
    );

    return { axisBBox, controllerBBox, timelineBBox };
  }

  private get chartHandleIconShape() {
    const { selectionType } = this.states;
    const {
      timelineBBox: { height },
    } = this.space;
    if (selectionType === 'range')
      return (type: any) => new ChartModeHandle({ style: { type, height, iconSize: height / 6 } });

    return () =>
      new Line({ style: { x1: 0, y1: -height / 2, x2: 0, y2: height / 2, lineWidth: 2, stroke: '#c8c8c8' } });
  }

  private getChartStyle(bbox: BBox): SliderStyleProps {
    const { x, y, width, height } = bbox;
    const { selectionType, chartType, values } = this.states;
    const { type, data, labelFormatter = (value) => `${value}` } = this.attributes;
    const isRange = selectionType === 'range';
    const timelineValues: [number, number] = isRange ? (values as [number, number]) : [0, values[1] as number];
    if (type === 'time') {
      return {
        handleIconShape: () => new TimeModeHandle({}),
        selectionFill: '#2e7ff8',
        selectionFillOpacity: 1,
        showLabel: false,
        showLabelOnInteraction: true,
        handleLabelDy: isRange ? -15 : 0,
        autoFitLabel: isRange,
        handleSpacing: isRange ? -15 : 0,
        trackFill: '#edeeef',
        trackLength: width,
        trackOpacity: 0.5,
        trackRadius: height / 2,
        trackSize: height / 2,
        type: selectionType,
        values: timelineValues,
        formatter: labelFormatter,
        x,
        y,
        zIndex: 1,
      };
    }
    // type === 'chart'
    const handleIconOffset = selectionType === 'range' ? 5 : 0;
    const sparklineData = data.map(({ value }) => value);
    return {
      handleIconOffset,
      handleIconShape: this.chartHandleIconShape,
      selectionFill: '#fff',
      selectionFillOpacity: 0.5,
      selectionType: 'invert',
      showLabel: false,
      sparklineSpacing: 0.1,
      sparklineColumnLineWidth: 0,
      sparklineColor: '#d4e5fd',
      sparklineAreaOpacity: 1,
      sparklineAreaLineWidth: 0,
      sparklineData,
      sparklineType: chartType,
      trackLength: width,
      trackSize: height,
      type: selectionType,
      values: timelineValues,
      x,
      y,
      zIndex: 1,
    };
  }

  private renderChart(bbox: BBox = this.space.timelineBBox) {
    this.timeline.update(this.getChartStyle(bbox));
  }

  private getAxisStyle(bbox: BBox) {
    const { data, interval, labelFormatter: userDefinedLabelFormatter } = this.attributes;
    const { x, y, width } = bbox;
    const axisData = data.map(({ time }, index) => ({ label: `${time}`, value: index / data.length, time }));
    const style: Partial<LinearAxisStyleProps> = {
      startPos: [x, y],
      endPos: [x + width, y],
      data: axisData,
      labelFormatter: ({ time }) =>
        userDefinedLabelFormatter ? userDefinedLabelFormatter(time) : labelFormatter(time, interval),
      lineLineWidth: 1,
      lineStroke: '#cacdd1',
      tickLength: 15,
      tickLineWidth: 1,
      tickStroke: '#cacdd1',
      labelTextAlign: 'left',
      labelTextBaseline: 'top',
      labelFill: '#6e6e6e',
      labelTransform: 'translate(5, -12)',
    };
    return style;
  }

  private renderAxis(bbox: BBox = this.space.axisBBox) {
    this.axis.update(this.getAxisStyle(bbox));
  }

  private renderController(bbox: BBox) {
    const {
      type,
      speed,
      playing,
      selectionType,
      chartType,
      onReset,
      onSpeedChange,
      onBackward,
      onPlay,
      onPause,
      onForward,
      onSelectionTypeChange,
      onChartTypeChange,
    } = this.attributes;
    const that = this;

    const style: ControllerStyleProps = {
      ...bbox,
      iconSize: 20,
      speed,
      playing,
      selectionType,
      chartType,
      onChange(type, { value }) {
        switch (type) {
          case 'reset':
            onReset?.();
            break;
          case 'speed':
            onSpeedChange?.(value);
            break;
          case 'backward':
            // TODO 更新 timeline values
            onBackward?.();
            break;
          case 'playPause':
            if (value === 'play') onPlay?.();
            else onPause?.();
            break;
          case 'forward':
            onForward?.();
            break;
          case 'selectionType':
            that.states.selectionType = value;
            that.renderChart();
            onSelectionTypeChange?.(value);
            break;
          case 'chartType':
            that.states.chartType = value;
            that.renderChart();
            onChartTypeChange?.(value);
            break;
          default:
            break;
        }
      },
    };

    if (type === 'time') {
      style.functions = [['reset', 'speed'], ['backward', 'playPause', 'forward'], ['selectionType']];
    }

    this.controller.update(style);
  }

  constructor(options: TimebarOptions) {
    super(deepAssign({}, Timebar.defaultOptions, options));
    this.states = {
      values: this.attributes.values,
      selectionType: this.attributes.selectionType,
      chartType: this.attributes.chartType,
    };
  }

  render() {
    const { axisBBox, controllerBBox, timelineBBox } = this.space;
    this.renderController(controllerBBox);
    this.renderAxis(axisBBox);
    this.renderChart(timelineBBox);
  }
}

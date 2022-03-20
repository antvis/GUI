import { CustomEvent, Group, Text } from '@antv/g';
import { clamp, deepMix, get, isUndefined, minBy } from '@antv/util';
import Hammer from 'hammerjs';
import { Rail } from './rail';
import { Labels } from './labels';
import { Tag } from '../tag';
import { Marker } from '../marker';
import { LegendBase } from './base';
import { getValueOffset, getStepValueByValue } from './utils';
import { CONTINUOUS_DEFAULT_OPTIONS, STEP_RATIO } from './constant';
import { toPrecision, getShapeSpace, getEventPos, deepAssign } from '../../util';
import type { Pair } from '../slider/types';
import type { IRailCfg } from './rail';
import type { ILabelsCfg } from './labels';
import type { MarkerStyleProps } from '../marker';
import type { DisplayObject, TextProps } from '../../types';
import type { ContinuousCfg, ContinuousOptions, IndicatorCfg, RailCfg, HandleCfg, SymbolCfg } from './types';

export type { ContinuousOptions };

type HandleType = 'start' | 'end';
interface IHandleCfg {
  markerCfg: MarkerStyleProps;
  textCfg: TextProps;
}

const RAIL_NAME = 'rail';
export class Continuous extends LegendBase<ContinuousCfg> {
  public static tag = 'continuous';

  protected static defaultOptions = {
    type: Continuous.tag,
    ...CONTINUOUS_DEFAULT_OPTIONS,
  };

  /**
   * 结构：
   * this
   * |- titleShape
   * |- middleGroup
   *   |- labelsShape
   *   |- railShape
   *      |- pathGroup
   *      |- backgroundGroup
   *      |- startHandle
   *      |- endHandle
   *      |- indicator
   * |-backgroundShape
   */

  public get selection() {
    const { min, max, start, end } = this.attributes;
    return [start || min, end || max] as [number, number];
  }

  /* 背景配置项 */
  protected get backgroundShapeCfg() {
    const { handle } = this.attributes;
    const { width, height } = getShapeSpace(this);
    const [, right, bottom, left] = this.getPadding();
    // 问就是调试工程
    const offsetX = handle ? -20 : 0;
    const offsetY = handle ? -10 : 0;
    return {
      width: width + left + right + offsetX,
      height: height + bottom + offsetY,
      ...this.getStyle('backgroundStyle'),
    };
  }

  /**
   * 获得滑动步长
   * 未指定时默认为range的1%;
   */
  private get step(): number {
    const { step, min, max } = this.attributes;
    if (isUndefined(step)) {
      return toPrecision((max - min) * STEP_RATIO, 0);
    }
    return step;
  }

  private get indicator() {
    return this.indicatorShape.getElementsByName('tag')[0] as Tag;
  }

  /**
   * 获得指示器配置
   */
  private get indicatorShapeCfg() {
    const { indicator } = this.attributes;
    if (!indicator) return {};
    const { size, text, backgroundStyle } = indicator as Required<IndicatorCfg>;
    const { style: textStyle } = text;
    return {
      markerCfg: {
        size,
        ...this.getOrientVal([
          { x: 0, y: size },
          { x: -size, y: 0 },
        ]),
        symbol: this.getOrientVal(['downArrow', 'leftArrow']),
        fill: backgroundStyle.fill,
      },
      tagCfg: {
        text: '',
        align: this.getOrientVal(['center', 'start']) as 'center' | 'start',
        verticalAlign: 'middle' as const,
        ...this.getOrientVal([
          { x: 0, y: -size / 2 },
          { x: -size / 2, y: 0 },
        ]),
        textStyle: {
          default: textStyle,
        },
        backgroundStyle: {
          default: backgroundStyle,
        },
      },
    };
  }

  /**
   * 获取颜色
   */
  protected get color() {
    const { color, rail } = this.attributes;
    const { ticks, chunked } = rail;
    return chunked ? color.slice(0, ticks!.length + 1) : color;
  }

  // 获取色板属性
  private get railShapeCfg(): IRailCfg {
    // 直接绘制色板，布局在adjustLayout方法中进行
    const { min, max, rail, orient } = this.attributes;
    const [start, end] = this.selection;
    const { color } = this;
    return {
      x: 0,
      y: 0,
      min,
      max,
      start,
      end,
      orient,
      color,
      // todo 鼠标样式有闪动问题
      cursor: 'grab',
      ...(rail as Required<RailCfg>),
    };
  }

  /**
   * 获取手柄属性
   */
  private get handleShapeCfg(): IHandleCfg {
    const { handle, label, slidable } = this.attributes;
    if (!handle)
      return {
        markerCfg: {
          size: 8,
          symbol: 'hiddenHandle',
          opacity: 0,
        },
        textCfg: {
          text: '',
          opacity: 0,
        },
      };

    const { size, icon } = handle as Required<Pick<HandleCfg, 'size' | 'icon'>>;
    const { marker, style: markerStyle } = icon;
    // 替换默认手柄
    const symbol =
      marker === 'default' ? this.getOrientVal(['horizontalHandle', 'verticalHandle']) : (marker as SymbolCfg);
    return {
      markerCfg: {
        symbol,
        size,
        opacity: 1,
        cursor: slidable ? this.getOrientVal(['ew-resize', 'ns-resize']) : 'not-allowed',
        ...markerStyle,
      },
      textCfg: {
        text: '',
        opacity: label ? 1 : 0,
        ...(label?.style || {}),
      },
    };
  }

  // 获取 Label 属性
  private get labelsShapeCfg(): ILabelsCfg {
    const { label } = this.attributes;
    // 不绘制label
    if (!label) {
      return {
        labels: [],
      };
    }
    const { min, max, rail } = this.attributes;
    const { style, formatter, align } = label;
    const cfg: TextProps[] = [];
    // align 为rail 时仅显示 min、max 的 label
    if (align === 'rail') {
      [min, max].forEach((value, idx) => {
        cfg.push({
          x: 0,
          y: 0,
          text: formatter!(value, idx),
          ...style,
        });
      });
    } else {
      const ticks = [min, ...rail.ticks!, max];
      ticks.forEach((value, idx) => {
        cfg.push({
          x: 0,
          y: 0,
          text: formatter!(value, idx),
          ...style,
        });
      });
    }
    return {
      labels: cfg,
    };
  }

  private labelsGroup!: Labels;

  private middleGroup!: Group;

  // 色板
  private railShape!: Rail;

  // 开始滑块
  private startHandle!: Group;

  // 结束滑块
  private endHandle!: Group;

  /**
   * 指示器
   */
  private indicatorShape!: Group;

  /**
   * 当前交互的对象
   */
  private target!: string | undefined;

  /**
   * 上次鼠标事件的位置
   */
  private prevValue!: number;

  constructor(options: ContinuousOptions) {
    super(deepMix({}, Continuous.defaultOptions, options));
    this.init();
  }

  public init() {
    super.init();
    this.appendChild((this.middleGroup = new Group()));
    // 创建labels
    this.createLabels();
    // 创建色板及其背景
    this.createRail();
    // // 创建滑动手柄
    this.createHandles();
    // 设置手柄文本
    this.setHandleText();
    // 调整布局
    this.adjustLayout();
    // 调整title
    this.adjustTitle();
    // 最后再绘制背景
    this.createBackground();
    // 指示器
    this.createIndicator();
    // // 监听事件
    this.bindEvents();
  }

  public update(cfg: Partial<ContinuousCfg>) {
    this.attr(deepAssign({}, this.attributes, cfg));
    // 更新label内容
    this.labelsGroup.update(this.labelsShapeCfg);
    // 更新rail
    this.railShape.update(this.railShapeCfg);
    // 更新选区
    this.updateSelection(...this.selection);
    // 更新title内容
    this.titleShape.attr(this.titleShapeCfg);
    // 更新handle
    this.updateHandles();
    // 更新手柄文本
    this.setHandleText();
    // 关闭指示器
    this.setIndicator(false);
    // 更新布局
    this.adjustLayout();
    // 更新背景
    this.backgroundShape.attr(this.backgroundShapeCfg);
  }

  public clear() {}

  /**
   * 设置指示器
   * @param value 设置的值，用于确定位置
   * @param text 可选；显示的文本，若无则通过value取值
   * @param useFormatter 是否使用formatter
   * @returns
   */
  public setIndicator(value: false | number, text?: string, useFormatter = true) {
    // 值校验
    const { min, max, rail, indicator } = this.attributes;

    if (value === false || !indicator) {
      this.indicatorShape?.hide();
      return;
    }
    this.indicatorShape.show();
    const safeValue = clamp(value, min, max);
    const { type, width: railWidth, height: railHeight } = rail as Required<Pick<RailCfg, 'type' | 'width' | 'height'>>;
    const { spacing } = indicator;
    const offsetX = this.getValueOffset(safeValue);
    // 设置指示器位置
    // type = color;
    // type=size时，指示器需要贴合轨道上边缘
    // handle会影响rail高度

    const offsetY =
      type === 'size' ? (1 - (safeValue - min) / (max - min)) * this.getOrientVal([railHeight, railWidth]) : 0;

    this.indicatorShape?.attr(
      this.getOrientVal([
        { x: offsetX, y: offsetY - spacing! },
        { x: railWidth - offsetY + spacing!, y: offsetX },
      ])
    );

    const formatter = get(this.attributes, ['indicator', 'text', 'formatter']);
    let showText = text || String(safeValue);
    if (useFormatter) {
      showText = formatter(showText);
    }
    // 设置文本
    this.indicator.update({ text: showText });
  }

  public setSelection(stVal: number, endVal: number) {
    // 值校验
    this.updateSelectionLayout(...this.getSafetySelections(stVal, endVal));
  }

  /**
   * 设置Handle的文本
   */
  public setHandleText(text1?: string, text2?: string, useFormatter: boolean = true) {
    const [start, end] = this.selection;
    let [startText, endText] = [text1 || String(start), text2 || String(end)];
    if (useFormatter) {
      const formatter =
        get(this.attributes, ['handle', 'text', 'formatter']) ||
        get(Continuous.defaultOptions, ['style', 'handle', 'text', 'formatter']);
      [startText, endText] = [formatter(startText), formatter(endText)];
    }
    this.getHandle('start', 'text').attr({ text: startText });
    this.getHandle('end', 'text').attr({ text: endText });
  }

  protected initShape() {
    super.initShape();
  }

  /**
   * 设置选区
   * @param stVal 开始值
   * @param endVal 结束值
   * @param isOffset stVal和endVal是否为偏移量
   */
  private updateSelection(stVal: number, endVal: number, isOffset: boolean = false) {
    const [currSt, currEnd] = this.selection;
    let [start, end] = [stVal, endVal];
    if (isOffset) {
      // 获取当前值
      start += currSt;
      end += currEnd;
    }
    // 值校验
    [start, end] = this.getSafetySelections(start, end);
    this.updateSelectionLayout(start, end);
    this.dispatchSelection();
  }

  private updateSelectionLayout(start: number, end: number) {
    this.setAttribute('start', start);
    this.setAttribute('end', end);
    this.railShape.update({ start, end });
    this.adjustLayout();
    this.setHandleText();
  }

  /**
   * 取值附近的步长刻度上的值
   */
  private getTickValue(value: number): number {
    const {
      min,
      max,
      rail: { chunked, ticks },
    } = this.attributes;
    if (chunked) {
      const range = [min, ...ticks!, max];
      for (let i = 0; i < range.length - 1; i += 1) {
        if (value >= range[i] && value <= range[i + 1]) {
          return minBy([range[i], range[i + 1]], (val) => Math.abs(value - val));
        }
      }
    }
    return getStepValueByValue(value, this.step, min);
  }

  /**
   * 取值所在的刻度范围
   */
  private getTickIntervalByValue(value: number) {
    const [start, end] = this.selection;
    const ticks = get(this.attributes, ['rail', 'ticks']);
    const temp = [start, ...ticks, end];
    for (let i = 1; i < temp.length; i += 1) {
      const st = temp[i - 1];
      const end = temp[i];
      if (value >= st && value <= end) {
        return [st, end];
      }
    }
    return false;
  }

  /**
   * 获取某个值在orient方向上的偏移量
   * reverse: 屏幕偏移量 -> 值
   */
  private getValueOffset(value: number, reverse = false): number {
    const { min, max, rail } = this.attributes;
    const { width: railWidth, height: railHeight } = rail;
    const innerLen = this.getOrientVal([railWidth!, railHeight!]);
    return getValueOffset(value, min, max, innerLen, reverse);
  }

  private getSafetySelections(start: number, end: number, precision: number = 4): [number, number] {
    const { min, max } = this.attributes;
    const [prevStart, prevEnd] = this.selection;
    let [startVal, endVal] = [start, end];
    const range = endVal - startVal;
    // 交换startVal endVal
    if (startVal > endVal) {
      [startVal, endVal] = [endVal, startVal];
    }
    // 超出范围就全选
    if (range > max - min) {
      return [min, max];
    }

    if (startVal < min) {
      if (prevStart === min && prevEnd === endVal) {
        return [min, endVal];
      }
      return [min, range + min];
    }
    if (endVal > max) {
      if (prevEnd === max && prevStart === startVal) {
        return [startVal, max];
      }
      return [max - range, max];
    }

    // 保留小数
    return [toPrecision(startVal, precision), toPrecision(endVal, precision)];
  }

  // 创建 Label
  private createLabels() {
    // 创建 label 容器
    this.labelsGroup = new Labels({
      name: 'labels',
      id: 'labels',
      style: this.labelsShapeCfg,
    });
    this.middleGroup.appendChild(this.labelsGroup);
  }

  // 创建色板
  private createRail() {
    // 确定绘制类型
    this.railShape = new Rail({
      name: RAIL_NAME,
      id: 'rail',
      style: this.railShapeCfg,
    });
    this.middleGroup.appendChild(this.railShape);
  }

  /**
   *  创建手柄
   */
  private createHandle(handleType: HandleType) {
    const { markerCfg, textCfg } = this.handleShapeCfg;
    const groupName = `${handleType}Handle`;
    const el = new Group({
      name: groupName,
      id: groupName,
    });
    // 将tag挂载到rail
    this.railShape.appendChild(el);

    const text = new Text({
      name: 'text',
      style: textCfg,
    });
    el.appendChild(text);

    const icon = new Marker({
      name: 'icon',
      style: markerCfg as MarkerStyleProps,
    });
    el.appendChild(icon);

    if (handleType === 'start') this.startHandle = el;
    else this.endHandle = el;
  }

  // 创建手柄
  private createHandles() {
    this.createHandle('start');
    this.createHandle('end');
  }

  /**
   * 更新handle
   */
  public updateHandles() {
    const { markerCfg, textCfg } = this.handleShapeCfg;
    (['start', 'end'] as HandleType[]).forEach((handleType) => {
      (this.getHandle(handleType, 'icon') as Marker).update(markerCfg);
      (this.getHandle(handleType, 'text') as Text).attr(textCfg);
    });
  }

  /**
   * 获得手柄、手柄内icon和text的对象
   */
  private getHandle(handleType: HandleType, subNode?: 'text' | 'icon') {
    let handle: Group;
    if (handleType === 'start') handle = this.startHandle;
    else handle = this.endHandle;
    if (!subNode) return handle;
    if (subNode === 'text') {
      return handle.getElementsByName('text')[0] as Text;
    }
    return handle.getElementsByName('icon')[0] as Marker;
  }

  private createIndicator() {
    const { indicator } = this.attributes;
    if (!indicator) return;
    const { markerCfg, tagCfg } = this.indicatorShapeCfg;
    const el = new Group({
      name: 'indicator',
      id: 'indicator',
    });
    // 将tag挂载到rail
    this.railShape.appendChild(el);

    // 创建 取用icon填充色
    // 位置大小在 setIndicator 中设置
    const tag = new Tag({
      name: 'tag',
      style: tagCfg,
    });

    el.appendChild(tag);
    // 指示器小箭头
    const icon = new Marker({
      name: `arrow`,
      style: markerCfg as MarkerStyleProps,
    });
    icon.toBack();
    el.appendChild(icon);
    this.indicatorShape = el;
    // 默认隐藏
    this.indicatorShape.hide();
  }

  /**
   * 调整handle结构
   */
  private adjustHandle() {
    const { rail, label } = this.attributes;
    const [start, end] = this.selection;
    const { width: railWidth, height: railHeight } = rail as Required<Pick<IRailCfg, 'width' | 'height'>>;

    // 设置Handle位置
    const { startHandle } = this;
    const { endHandle } = this;
    startHandle.attr(
      this.getOrientVal([
        {
          x: this.getValueOffset(start),
          y: railHeight / 2,
        },
        {
          x: railWidth / 2,
          y: this.getValueOffset(start),
        },
      ])
    );
    endHandle.attr(
      this.getOrientVal([
        {
          x: this.getValueOffset(end),
          y: railHeight / 2,
        },
        {
          x: railWidth / 2,
          y: this.getValueOffset(end),
        },
      ])
    );

    // handle为false时，取默认布局方式进行布局，但不会显示出来
    if (!label) return;
    const { spacing = 0 } = label;
    const align = label.align === 'rail' ? 'end' : label.align;

    // 调整文本位置
    let handleTextStyle = {};
    // rail 不做处理
    if (align === 'start') {
      handleTextStyle = this.getOrientVal([
        {
          x: 0,
          y: -railHeight / 2 - spacing,
          textAlign: 'center',
          textBaseline: 'bottom',
        },
        {
          x: -railWidth / 2 - spacing,
          y: 0,
          textAlign: 'end',
          textBaseline: 'middle',
        },
      ]);
    } else if (align === 'end') {
      handleTextStyle = this.getOrientVal([
        {
          x: 0,
          y: railHeight / 2 + spacing,
          textAlign: 'center',
          textBaseline: 'top',
        },
        {
          x: railWidth + spacing,
          y: 0,
          textAlign: 'start',
          textBaseline: 'middle',
        },
      ]);
    }

    this.getHandle('start', 'text').attr(handleTextStyle);
    this.getHandle('end', 'text').attr(handleTextStyle);
  }

  /**
   * 调整 labels 布局位置
   *
   * if labelAlign == 'inside' | 'outside'
   *    orient: horizontal
   *      ||||||||||||||||||||||
   *      0  20  40  60  80  100
   *    orient: vertical
   *      —— 0
   *      —— 20
   *      —— 40
   *      —— 60
   */
  private adjustLabels() {
    const { min, max, label, rail, orient } = this.attributes;

    if (!label) return;

    // 容器内可用空间起点
    const { x: innerX, y: innerY } = this.availableSpace;
    const {
      width: railWidth,
      height: railHeight,
      ticks: _t,
    } = rail as Required<Pick<IRailCfg, 'width' | 'height' | 'ticks'>>;

    const { align = 'rail', spacing: labelSpacing = 0, flush: labelFlush, offset = [] } = label!;
    const [offsetX = 0, offsetY = 0] = offset;

    if (align === 'rail') {
      // 此时 labelsShape 中只包含 min、max label。1. 设置 minLabel 位置
      if (orient === 'horizontal') {
        /**
         * 0  ||||||||||||||||||||||  100
         */
        this.labelsGroup.attr({
          x: innerX,
          y: innerY + railHeight / 2,
        });
        const [firstChild] = this.labelsGroup.getLabels();
        // 设置左侧文本
        if (firstChild) {
          firstChild.attr({ textAlign: 'start', x: offsetX, y: offsetY });
        }

        const [lastChild] = this.labelsGroup.getLabels().slice(-1);
        if (lastChild) {
          firstChild;
          // 设置右侧文本位置
          lastChild.attr({
            x: getShapeSpace(firstChild).width + railWidth + labelSpacing * 2 + offsetX,
            y: offsetY,
            textAlign: 'start',
          });
        }
      } else {
        this.labelsGroup.attr({
          x: innerX + railWidth / 2,
          y: innerY,
        });
        // 顶部文本高度
        const firstLabelText = this.labelsGroup.getLabels()[0];
        const { height: topTextHeight } = getShapeSpace(firstLabelText);
        firstLabelText.attr({
          x: offsetX,
          y: topTextHeight / 2 + offsetY,
          textBaseline: 'middle',
        });
        // 底部文本位置
        const lastLabelText = this.labelsGroup.getLabels().slice(-1)[0];
        lastLabelText.attr({
          x: offsetX,
          y: railHeight + topTextHeight * 1.5 + labelSpacing * 2 + offsetY,
          textBaseline: 'middle',
        });
      }

      return;
    }

    if (orient === 'horizontal') {
      // labelsShape 高度
      const { height: labelsHeight } = getShapeSpace(this.labelsGroup);

      this.labelsGroup.attr({
        x: innerX,
        y: innerY + (align === 'start' ? labelsHeight / 2 : labelSpacing + railHeight + labelsHeight / 2),
      });
      // 补上 min，max
      const ticks = [min, ..._t, max];
      // 设置labelsShape中每个文本的位置
      this.labelsGroup.getLabels().forEach((child, idx) => {
        const val = ticks[idx];
        // 通过val拿到偏移量
        child.attr({
          x: this.getValueOffset(val),
          y: 0,
          textBaseline: 'middle',
          textAlign: (() => {
            if (!labelFlush) return 'center';

            // use LabelFlush to control whether change the textAlign of labels on the edge of the axis os that they could stay inside the span of axis.
            if (idx === 0) return 'start';
            return idx < ticks.length - 1 ? 'center' : 'end';
          })(),
        });
      });
      return;
    }

    // vertical orient
    this.labelsGroup.attr({
      x: innerX + (align === 'end' ? labelSpacing + railWidth : 0),
      y: innerY,
    });

    // 补上 min，max
    const ticks = [min, ..._t, max];
    this.labelsGroup.getLabels().forEach((child, idx) => {
      const val = ticks[idx];
      // 通过 val 拿到偏移量
      child.attr({
        x: 0,
        y: this.getValueOffset(val),
        textBaseline: (() => {
          if (!labelFlush) return 'middle';

          // use LabelFlush to control whether change the textAlign of labels on the edge of the axis os that they could stay inside the span of axis.
          if (idx === 0) return 'top';
          return idx < ticks.length - 1 ? 'middle' : 'bottom';
        })(),
        textAlign: align === 'end' ? 'start' : 'end',
      });
    });
  }

  /**
   * 对图例进行布局
   *
   * 1. 存在 handle 的情况，不展示标签 labelsGroup
   * 2. label.align === 'rail' 时，需要调整 rail 位置
   */
  private adjustLayout() {
    const { handle, label, orient } = this.attributes;

    const { x: innerX, y: innerY } = this.availableSpace;
    const { width: handleW } = getShapeSpace(this.startHandle);

    let railX = innerX;
    let railY = innerY;

    let labelW = 0;
    let labelH = 0;
    if (handle) {
      this.labelsGroup?.hide();

      if (orient === 'horizontal') railX = innerX + handleW / 2;
    } else if (this.labelsGroup && label) {
      this.labelsGroup.show();
      this.adjustLabels();

      const { align: labelAlign, spacing: labelSpacing = 0 } = label;
      const [firstChild] = this.labelsGroup.getLabels();

      labelW = getShapeSpace(firstChild).width;
      labelH = getShapeSpace(firstChild).height;

      if (labelAlign === 'rail') {
        railX = innerX + labelW + labelSpacing;

        if (orient === 'vertical') {
          railX = innerX;
          railY = innerY + labelH + labelSpacing;
        }
      } else if (labelAlign === 'start' && orient === 'horizontal') {
        railY = innerY + getShapeSpace(firstChild).height + labelSpacing;
      } else if (labelAlign === 'start' && orient === 'vertical') {
        railX = innerX + labelSpacing;
      }
    }

    // 调整 rail位置
    this.railShape.attr({
      x: railX,
      y: railY,
    });

    // 调整 handle 位置
    this.adjustHandle();

    // 整体调整位置
    if (!label?.flush) {
      if (orient === 'horizontal') this.middleGroup.setLocalPosition(labelW / 2, 0);
      if (orient === 'vertical') this.middleGroup.setLocalPosition(0, labelH / 2);
    }
    if (orient === 'vertical') {
      let offsetX = 0;
      let offsetY = 0;

      if (handle && this.startHandle) offsetY = getShapeSpace(this.startHandle).height / 2;
      if (label?.align === 'start') offsetX = getShapeSpace(this.labelsGroup).width + (label?.spacing || 0);

      this.middleGroup.setLocalPosition(offsetX, offsetY);
    }
  }

  /**
   * 事件触发的位置对应的value值
   * @param limit {boolean} 我也忘了要干啥了
   */
  private getEventPosValue(e: any, limit: boolean = false) {
    const { min, max } = this.attributes;
    const startPos = this.getOrientVal(this.railShape.getPosition().slice(0, 2) as Pair<number>);
    const currValue = this.getOrientVal(getEventPos(e));
    const offset = currValue - startPos;
    const value = clamp(this.getValueOffset(offset, true) + min, min, max);
    return value;
  }

  /**
   * 绑定事件
   */
  private bindEvents() {
    // 如果！slidable，则不绑定事件或者事件响应不生效
    // 各种hover事件
    // 放置需要绑定drag事件的对象
    const dragObject = new Map<string, DisplayObject>();
    dragObject.set('rail', this.railShape);
    dragObject.set('start', this.startHandle);
    dragObject.set('end', this.endHandle);
    // 绑定 drag 开始事件
    dragObject.forEach((obj, key) => {
      obj.addEventListener('mousedown', this.onDragStart(key));
      obj.addEventListener('touchstart', this.onDragStart(key));
    });

    // indicator hover事件
    this.railShape.getRail().addEventListener('mouseenter', this.onHoverStart('rail'));
    this.addEventListener('mouseout', () => this.setIndicator(false));
  }

  /**
   * 开始拖拽
   */
  private onDragStart = (target: string) => (e: any) => {
    e.stopPropagation();
    const { slidable } = this.attributes;
    // 关闭滑动
    if (!slidable) return;
    this.onHoverEnd();
    this.target = target;
    this.prevValue = this.getTickValue(this.getEventPosValue(e));
    this.addEventListener('mousemove', this.onDragging);
    this.addEventListener('touchmove', this.onDragging);
    document.addEventListener('mouseup', this.onDragEnd);
    document.addEventListener('touchend', this.onDragEnd);
  };

  /**
   * 拖拽
   */
  private onDragging = (e: any) => {
    e.stopPropagation();
    const [start, end] = this.selection;
    const currValue = this.getTickValue(this.getEventPosValue(e));
    const diffValue = currValue - this.prevValue;
    const { target } = this;
    if (target === 'start') start !== currValue && this.updateSelection(currValue, end);
    else if (target === 'end') end !== currValue && this.updateSelection(start, currValue);
    else if (target === 'rail') {
      if (diffValue !== 0) {
        this.prevValue = currValue;
        this.updateSelection(diffValue, diffValue, true);
      }
    }
  };

  /**
   * 结束拖拽
   */
  private onDragEnd = () => {
    this.removeEventListener('mousemove', this.onDragging);
    this.removeEventListener('touchmove', this.onDragging);
    document.removeEventListener('mouseup', this.onDragEnd);
    document.removeEventListener('touchend', this.onDragEnd);

    // 抬起时修正位置
    this.target = undefined;
  };

  private onHoverStart = (target: string) => (e: any) => {
    e.stopPropagation();
    // 如果 target 不为 undefine，表明当前有其他事件被监听
    if (isUndefined(this.target)) {
      this.target = target;
      this.addEventListener('mousemove', this.onHovering);
      this.addEventListener('touchmove', this.onHovering);
    }
  };

  private onHovering = (e: any) => {
    e.stopPropagation();
    const value = this.getEventPosValue(e);
    // chunked为true时
    if (get(this.attributes, ['rail', 'chunked'])) {
      const interval = this.getTickIntervalByValue(value);
      if (!interval) return;
      const [st, end] = interval;
      this.setIndicator(toPrecision((st + end) / 2, 0), `${st}-${end}`, false);
      // 计算value并发出事件
      this.dispatchIndicated(interval);
    } else {
      const val = this.getTickValue(value);
      this.setIndicator(val);
      // TODO 节流
      this.dispatchIndicated(val);
    }
  };

  /**
   * hover结束
   */
  private onHoverEnd = () => {
    this.removeEventListener('mousemove', this.onHovering);
    this.removeEventListener('touchmove', this.onHovering);
    // 关闭指示器
    this.setIndicator(false);
    // 恢复状态
    this.target = undefined;
  };

  private dispatchIndicated(val: any) {
    const evt = new CustomEvent('onIndicated', {
      detail: {
        value: val,
      },
    });
    this.dispatchEvent(evt);
  }

  private dispatchSelection() {
    const evt = new CustomEvent('valueChanged', {
      detail: {
        value: this.selection,
      },
    });
    this.dispatchEvent(evt);
  }
}

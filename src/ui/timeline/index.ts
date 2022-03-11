import { deepMix, isFunction, isNumber } from '@antv/util';
import { GUIOption } from 'types';
import { AABB, DisplayObject, Group, Rect } from '@antv/g';
import { GUI } from '../../core/gui';
import { Checkbox, CheckboxOptions } from '../checkbox';
import type { CellAxisCfg, LayoutRowData, SliderAxisCfg, SpeedControlCfg, TimelineCfg, TimelineOptions } from './types';
import { CellAxis } from './cellaxis';
import { SliderAxis } from './slideraxis';
import { SpeedControl } from './speedcontrol';
import { Button, ButtonCfg } from '../button';
import { FunctionalSymbol } from '../marker';

export type { TimelineOptions };

const SPACING = 8;

export class Timeline extends GUI<Required<TimelineCfg>> {
  /**
   * 组件 timeline
   */
  public static tag = 'timeline';

  private singleTimeCheckbox: Checkbox | undefined;

  private cellAxis: CellAxis | undefined;

  private sliderAxis: SliderAxis | undefined;

  private playBtn: Button | undefined;

  private prevBtn: Button | undefined;

  private nextBtn: Button | undefined;

  private speedControl: SpeedControl | undefined;

  /**
   * 默认配置项
   */
  public static defaultOptions: GUIOption<TimelineCfg> = {
    type: Timeline.tag,
    style: {
      x: 0,
      y: 0,
      width: 500,
      height: 40,
      data: [],
      orient: { layout: 'row', controlButtonAlign: 'left' },
      type: 'cell',
      controls: {
        singleModeControl: {
          style: {
            label: {
              text: '单一时间',
            },
          },
        },
        controlButton: {
          playBtn: {
            buttonStyle: {
              default: {
                fill: '#F7F7F7',
                stroke: '#bfbfbf',
                radius: 10,
              },
              active: {
                fill: 'rgba(52, 113, 249, 0.1)',
                stroke: '#3471F9',
                radius: 10,
              },
            },
            markerStyle: {
              default: {
                stroke: '#bfbfbf',
              },
              active: {
                stroke: '#3471F9',
              },
            },
          },
          prevBtn: {
            markerStyle: {
              default: {
                stroke: '#bfbfbf',
              },
              active: {
                stroke: '#3471F9',
              },
            },
            buttonStyle: {
              default: {
                stroke: 'none',
              },
              selected: {
                stroke: 'none',
              },
              active: {
                stroke: 'none',
              },
            },
          },
          nextBtn: {
            markerStyle: {
              default: {
                stroke: '#bfbfbf',
              },
              active: {
                stroke: '#3471F9',
              },
            },
            buttonStyle: {
              default: {
                stroke: 'none',
              },
              selected: {
                stroke: 'none',
              },
              active: {
                stroke: 'none',
              },
            },
          },
        },
      },
    },
  };

  public played: boolean = false;

  constructor(options: TimelineOptions) {
    super(deepMix({}, Timeline.defaultOptions, options));
    this.init();
  }

  public init() {
    this.createControl();
    this.createAxis();
    this.layout();
  }

  private createAxis() {
    const { type, cellAxisCfg, sliderAxisCfg, data, onSelectionChange, width } = this.attributes;
    if (type === 'cell') {
      this.cellAxis = new CellAxis({
        style: { ...(cellAxisCfg as CellAxisCfg), length: width, timeData: data, onSelectionChange },
      });
    } else {
      this.sliderAxis = new SliderAxis({
        style: {
          ...(sliderAxisCfg as SliderAxisCfg),
          timeData: data,
          onSelectionChange,
        },
      });
    }
    this.cellAxis && this.appendChild(this.cellAxis);
    this.sliderAxis && this.appendChild(this.sliderAxis);
  }

  private createControl() {
    const { controls } = this.attributes;
    if (controls === false) return;

    const { singleModeControl, controlButton, speedControl } = controls;
    if (singleModeControl !== false) {
      this.createSingleModeControl(singleModeControl);
    }
    if (controlButton !== false) {
      controlButton?.playBtn !== false && this.createPlayBtn(controlButton?.playBtn);
      controlButton?.prevBtn !== false && this.createPrevBtn(controlButton?.prevBtn);
      controlButton?.nextBtn !== false && this.createNextBtn(controlButton?.nextBtn);
    }
    if (speedControl !== false) {
      this.createSpeedControl(speedControl || undefined);
    }
  }

  private createNextBtn(nextBtnCfg: Omit<ButtonCfg, 'onClick'> | undefined) {
    const { onForward } = this.attributes;
    const nextMarker: FunctionalSymbol = (x: number, y: number) => {
      return [
        ['M', x, y + 6],
        ['L', x + 6, y],
        ['L', x, y - 6],
        ['M', x - 6, y + 6],
        ['L', x, y],
        ['L', x - 6, y - 6],
      ];
    };
    this.nextBtn = new Button({
      style: {
        ...nextBtnCfg,
        width: 12,
        marker: nextMarker,
        onClick: onForward,
      },
    });
    this.appendChild(this.nextBtn);
  }

  private createPrevBtn(prevBtnCfg: Omit<ButtonCfg, 'onClick'> | undefined) {
    const { onBackward } = this.attributes;
    const prevMarker: FunctionalSymbol = (x: number, y: number) => {
      return [
        ['M', x + 6, y + 6],
        ['L', x, y],
        ['L', x + 6, y - 6],
        ['M', x, y + 6],
        ['L', x - 6, y],
        ['L', x, y - 6],
      ];
    };
    this.prevBtn = new Button({
      style: {
        ...prevBtnCfg,
        width: 12,
        marker: prevMarker,
        onClick: onBackward,
      },
    });
    this.appendChild(this.prevBtn);
  }

  private createPlayBtn(playBtnCfg: Omit<ButtonCfg, 'onClick'> | undefined) {
    const { onPlay } = this.attributes;
    const playMarker: FunctionalSymbol = (x: number, y: number) => {
      return [['M', x + 3, y], ['L', x - 1.5, y - 1.5 * Math.sqrt(3)], ['L', x - 1.5, y + 1.5 * Math.sqrt(3)], ['Z']];
    };
    const stopMarker: FunctionalSymbol = (x: number, y: number) => {
      return [
        ['M', x + 2, y + 3],
        ['L', x + 2, y - 3],
        ['M', x - 2, y + 3],
        ['L', x - 2, y - 3],
      ];
    };
    this.playBtn = new Button({
      style: {
        ...playBtnCfg,
        onClick: onPlay,
        width: 20,
        height: 20,
        marker: playMarker,
      },
    });
    this.playBtn.addEventListener('click', () => {
      this.played = !this.played;
      this.playBtn?.update({
        marker: this.played ? stopMarker : playMarker,
      });
      isFunction(this.attributes.onPlay) && this.attributes?.onPlay(this.played);
    });
    this.appendChild(this.playBtn);
  }

  private createSingleModeControl(options: CheckboxOptions | undefined) {
    const { onSingleTimeChange } = this.attributes;
    this.singleTimeCheckbox = new Checkbox({
      ...options,
      ...{
        style: {
          label: {
            text: '单一时间',
          },
          onChange: onSingleTimeChange,
        },
      },
    });
    this.appendChild(this.singleTimeCheckbox);
  }

  private createSpeedControl(cfg: Omit<SpeedControlCfg, 'onSpeedChange'> | undefined) {
    const { onSpeedChange } = this.attributes;
    this.speedControl = new SpeedControl({
      style: { ...cfg, speeds: ['0.5x', '1.0x', '1.5x', '2.0x', '2.5x'], width: 35, onSpeedChange },
    });
    this.appendChild(this.speedControl);
  }

  public update(cfg: Partial<Required<TimelineCfg>>): void {
    this.attr(deepMix({}, this.attributes, cfg));
    // this.updateAxis();
    // this.updateControl();
    // this.updateSingleTime();
    this.layout();
  }

  private layout() {
    if (this.attributes.orient.layout === 'row') {
      this.layoutRow(); // 横向排版
    } else {
      this.layoutCol(); // 竖向
    }
  }

  private layoutCol() {
    const { orient, height, width } = this.attributes;
    let y = 0;
    if (this.sliderAxis) {
      this.sliderAxis.update({
        length: width,
      });
      y = this.getHeight(this.sliderAxis.sliderBackground) + SPACING;
    }
    if (this.cellAxis) {
      this.cellAxis.update({
        length: width,
      });
      y = this.getHeight(this.cellAxis.cellBackground) + SPACING;
    }

    if (orient.controlButtonAlign === 'normal') {
      // 先水平从右到左排版
      const rightElements: DisplayObject[] = [];

      this.speedControl && rightElements.push(this.speedControl);
      this.singleTimeCheckbox && rightElements.push(this.singleTimeCheckbox);

      let totalWidth = 0;
      for (let i = 0; i < rightElements.length; i += 1) {
        if (i !== rightElements.length - 1) totalWidth += this.getWidth(rightElements[i]) + SPACING;
        else totalWidth += this.getWidth(rightElements[i]);
        this.verticalCenter(rightElements[i]);
      }
      if (rightElements.length === 1) {
        rightElements[0].translate(width - totalWidth, y);
      } else if (rightElements.length === 2) {
        rightElements[0].translate(width - totalWidth, y);
        rightElements[1].translate(width - totalWidth + this.getWidth(rightElements[0]) + SPACING, y);
      }

      const group: DisplayObject[] = [];
      this.prevBtn && group.push(this.prevBtn);
      this.playBtn && group.push(this.playBtn);
      this.nextBtn && group.push(this.nextBtn);
      let startX = 0;
      for (let i = 0; i < group.length; i += 1) {
        this.verticalCenter(group[i]);
        (group[i] as DisplayObject).translate(startX);
        startX += this.getWidth(group[i] as DisplayObject) + SPACING;
      }
      // 移到水平位置的中心处，并且竖直方向与axis的中心对齐 再移动到axis正下方
      const offsetX = (width - startX - this.getWidth(group[group.length - 1])) / 2;
      for (let i = 0; i < group.length; i += 1) {
        (group[i] as DisplayObject).translate(offsetX, y);
      }
    }
  }

  private getWidth(shape: DisplayObject) {
    return (shape.getBounds()?.halfExtents[0] as number) * 2;
  }

  private getHeight(shape: DisplayObject) {
    return (shape.getBounds()?.halfExtents[1] as number) * 2;
  }

  private getVerticalCenter(shape: DisplayObject) {
    return shape.getBounds()?.center[1] as number;
  }

  private verticalCenter(shape: DisplayObject) {
    const centerY = this.cellAxis
      ? this.cellAxis.backgroundVerticalCenter
      : (this.sliderAxis?.backgroundVerticalCenter as number);
    const shapeCenterY = this.getVerticalCenter(shape);
    const offset = centerY - shapeCenterY;
    shape.translate(0, offset);
  }

  private drawBB(shape: DisplayObject) {
    const bounding = shape.getBounds() as AABB;
    const { center, halfExtents } = bounding;
    const bounds = new Rect({
      style: {
        stroke: 'black',
        lineWidth: 2,
        width: halfExtents[0] * 2,
        height: halfExtents[1] * 2,
      },
    });
    this.append(bounds);
    bounds.setPosition(center[0] - halfExtents[0], center[1] - halfExtents[1]);
  }

  private layoutVertical() {
    this.prevBtn && this.verticalCenter(this.prevBtn);
    this.playBtn && this.verticalCenter(this.playBtn);
    this.nextBtn && this.verticalCenter(this.nextBtn);
    this.speedControl && this.verticalCenter(this.speedControl);
    this.singleTimeCheckbox && this.verticalCenter(this.singleTimeCheckbox);
    // this.drawAllBBs();
  }

  private layoutRow() {
    const {
      orient: { controlButtonAlign },
      width,
    } = this.attributes;

    // 存放所有存在的shape
    const existShapes: LayoutRowData[] = [];

    if (controlButtonAlign === 'left') {
      this.prevBtn && existShapes.push({ shape: this.prevBtn, width: this.getWidth(this.prevBtn) });
      this.playBtn && existShapes.push({ shape: this.playBtn, width: this.getWidth(this.playBtn) });
      this.nextBtn && existShapes.push({ shape: this.nextBtn, width: this.getWidth(this.nextBtn) });
      this.cellAxis && existShapes.push({ shape: this.cellAxis, width: 'auto' });
      this.sliderAxis && existShapes.push({ shape: this.sliderAxis, width: 'auto' });
      this.speedControl && existShapes.push({ shape: this.speedControl, width: this.getWidth(this.speedControl) });
      this.singleTimeCheckbox &&
        existShapes.push({ shape: this.singleTimeCheckbox, width: this.getWidth(this.singleTimeCheckbox) });
    } else if (controlButtonAlign === 'right') {
      this.cellAxis && existShapes.push({ shape: this.cellAxis, width: 'auto' });
      this.sliderAxis && existShapes.push({ shape: this.sliderAxis, width: 'auto' });
      this.prevBtn && existShapes.push({ shape: this.prevBtn, width: this.getWidth(this.prevBtn) });
      this.playBtn && existShapes.push({ shape: this.playBtn, width: this.getWidth(this.playBtn) });
      this.nextBtn && existShapes.push({ shape: this.nextBtn, width: this.getWidth(this.nextBtn) });
      this.speedControl && existShapes.push({ shape: this.speedControl, width: this.getWidth(this.speedControl) });
      this.singleTimeCheckbox &&
        existShapes.push({ shape: this.singleTimeCheckbox, width: this.getWidth(this.singleTimeCheckbox) });
    } else {
      this.playBtn && existShapes.push({ shape: this.playBtn, width: this.getWidth(this.playBtn) });
      this.prevBtn && existShapes.push({ shape: this.prevBtn, width: this.getWidth(this.prevBtn) });
      this.cellAxis && existShapes.push({ shape: this.cellAxis, width: 'auto' });
      this.sliderAxis && existShapes.push({ shape: this.sliderAxis, width: 'auto' });
      this.nextBtn && existShapes.push({ shape: this.nextBtn, width: this.getWidth(this.nextBtn) });
      this.speedControl && existShapes.push({ shape: this.speedControl, width: this.getWidth(this.speedControl) });
      this.singleTimeCheckbox &&
        existShapes.push({ shape: this.singleTimeCheckbox, width: this.getWidth(this.singleTimeCheckbox) });
    }

    let accumulatedWidth = 0;

    existShapes.forEach((data) => {
      data.shape.setAttribute('x', accumulatedWidth);
      accumulatedWidth += isNumber(data.width) ? data.width : 0;
      accumulatedWidth += SPACING;
    });

    const restWidth = width - accumulatedWidth;

    if ((this.cellAxis || this.sliderAxis) && restWidth > 0) {
      this.cellAxis?.update({
        length: restWidth,
      });
      this.sliderAxis?.update({
        length: restWidth,
      });
      let axisIdx = existShapes.findIndex((val) => val.shape === this.cellAxis || val.shape === this.sliderAxis);
      axisIdx += 1;
      for (; axisIdx < existShapes.length; axisIdx += 1) {
        existShapes[axisIdx].shape.translate(restWidth);
      }
    }
    this.layoutVertical();
  }

  public clear() {}

  public destroy(): void {}
}

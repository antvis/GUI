import { Rect, Path, PathCommand, PathStyleProps } from '@antv/g';
import { deepMix, get, isFunction, isNil } from '@antv/util';
import type { RectStyleProps } from '@antv/g';
import { Text, TextCfg } from '../text';
import { GUI } from '../../core/gui';
import type { GUIOption } from '../../types';
import type { CheckboxCfg, CheckboxOptions } from './types';

export type { CheckboxCfg, CheckboxOptions };

// checked填充颜色 默认
const CHECKED_FILL_COLOR = '#3471F9';
// checked边框颜色 默认
const CHECKED_STROKE_COLOR = '#3471F9';
// unchecked填充颜色 默认
const UNCHECKED_FILL_COLOR = '#ffffff';
// unchecked边框颜色 默认
const UNCHECKED_STROKE_COLOR = '#dadada';

// 默认文本样式
const LABEL_TEXT_STYLE = {
  fontColor: 'rgba(0,0,0,0.45)',
  fontSize: 10,
  lineHeight: 16,
  textAlign: 'start',
  overflow: 'clip',
} as TextCfg;

const CHECKED_SHAPE_PATH = [
  ['M', 3, 6],
  ['L', '5', '8.5'],
  ['L', '8.5', '4'],
] as PathCommand[];

const CHECKED_SHAPE_STYLE = {
  path: CHECKED_SHAPE_PATH,
  stroke: '#ffffff',
} as PathStyleProps;

const CHECKBOX_RECT_STYLE = {
  width: 12,
  height: 12,
  radius: 2,
} as RectStyleProps;

export class Checkbox extends GUI<Required<CheckboxCfg>> {
  /**
   * 组件 switch
   */
  public static tag = 'checkbox';

  /**  checkbox的背景方框组件 */
  private checkboxBackgroundShape!: Rect;

  /** checkbox checked时的✅ */
  private checkedShape!: Path;

  /** label 组件 */
  private labelShape!: Text;

  /** 值 */
  private checked!: boolean;

  /**
   * 默认配置项
   */
  public static defaultOptions: GUIOption<CheckboxCfg> = {
    type: Checkbox.tag,
    style: {
      x: 0,
      y: 0,
      labelTextSpacing: 6,
      defaultChecked: false,
      labelText: '',
      style: {
        default: {
          stroke: UNCHECKED_STROKE_COLOR,
          lineWidth: 1,
          fill: UNCHECKED_FILL_COLOR,
          cursor: 'pointer',
        },
        selected: {
          stroke: CHECKED_STROKE_COLOR,
          lineWidth: 1,
          fill: CHECKED_FILL_COLOR,
          cursor: 'pointer',
        },
      },
    },
  };

  constructor(options: CheckboxOptions) {
    super(deepMix({}, Checkbox.defaultOptions, options));
    this.init();
  }

  public init(): void {
    this.initChecked(); // 初始化checked
    this.initShape(); // 初始化组件
    this.bindEvents(); // 添加交互
  }

  /**
   * 组件的更新
   */
  public update(cfg?: Partial<CheckboxCfg>) {
    this.attr(deepMix({}, this.attributes, cfg));
    this.updateShape();
  }

  /**
   * 组件的清理
   */
  public clear() {}

  /**
   * 组件的销毁
   */
  public destroy() {
    this.checkedShape.destroy();
    this.checkboxBackgroundShape.destroy();
    this.labelShape.destroy();
    super.destroy();
  }

  public get label() {
    return this.labelShape;
  }

  /**
   * 初始化创建
   */
  private initShape() {
    // 初始化创建checkbox 背景
    this.checkboxBackgroundShape = this.createCheckboxBackgroundShape();

    this.checkedShape = this.createCheckedShape();
    this.labelShape = this.createLabelShape();

    this.checkboxBackgroundShape.appendChild(this.checkedShape);
    this.checkboxBackgroundShape.appendChild(this.labelShape);
    this.appendChild(this.checkboxBackgroundShape);
  }

  private createCheckboxBackgroundShape(): Rect {
    const { x, y, style, checked } = this.attributes;
    let rectStyle: RectStyleProps = { x, y, ...CHECKBOX_RECT_STYLE };

    if (checked) rectStyle = { ...rectStyle, ...style.selected };
    else rectStyle = { ...rectStyle, ...style.default };

    return new Rect({ style: rectStyle });
  }

  private createLabelShape(): Text {
    const { labelTextSpacing, labelText } = this.attributes;
    const { width } = this.checkboxBackgroundShape.attributes;
    return new Text({
      name: 'label',
      style: { ...LABEL_TEXT_STYLE, text: labelText, x: width + labelTextSpacing },
    });
  }

  private createCheckedShape(): Path {
    const checkedShape = new Path({ style: CHECKED_SHAPE_STYLE });
    checkedShape.setAttribute('visibility', 'hidden');
    return checkedShape;
  }

  // 初始化checked 和 defaultChecked
  private initChecked() {
    const { defaultChecked, checked } = this.attributes;
    this.checked = !!(isNil(checked) ? defaultChecked : checked);
    this.setAttribute('checked', this.checked);
  }

  // Shape 组件更新
  private updateShape() {
    this.updateCheckboxShape();
    this.updateLabelShape();
  }

  private updateLabelShape() {
    const { labelTextSpacing, labelText } = this.attributes;
    const { width } = this.checkboxBackgroundShape.attributes;
    this.labelShape.setAttribute('text', labelText);
    this.labelShape.setAttribute('x', width + labelTextSpacing);
  }

  private updateCheckboxShape() {
    const { style, checked } = this.attributes;
    this.checked = checked;
    const { selected: selectedStyle, default: defaultStyle } = style;
    if (checked) {
      // eslint-disable-next-line no-restricted-syntax
      for (const key of Object.keys(selectedStyle as object)) {
        this.checkboxBackgroundShape.setAttribute(key as keyof RectStyleProps, get(selectedStyle, key));
      }
      this.checkedShape.setAttribute('visibility', 'visible');
    } else {
      // eslint-disable-next-line no-restricted-syntax
      for (const key of Object.keys(defaultStyle as object)) {
        this.checkboxBackgroundShape.setAttribute(key as keyof RectStyleProps, get(defaultStyle, key));
      }
      this.checkedShape.setAttribute('visibility', 'hidden');
    }
  }

  private bindEvents(): void {
    this.addClick();
  }

  private addClick() {
    this.checkboxBackgroundShape.addEventListener('click', () => {
      const { onChange } = this.attributes;
      this.checked = !this.checked;
      this.setAttribute('checked', this.checked);
      this.updateShape();
      isFunction(onChange) && onChange(this.checked);
    });
  }
}

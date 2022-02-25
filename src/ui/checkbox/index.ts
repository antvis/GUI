import { Rect, Path, PathCommand, PathStyleProps, TextStyleProps, AABB } from '@antv/g';
import { deepMix, get, isFunction, isNil } from '@antv/util';
import type { RectStyleProps } from '@antv/g';
import { Text, TextCfg } from '../text';
import { GUI } from '../../core/gui';
import type { GUIOption } from '../../types';
import type { CheckboxCfg, CheckboxOptions } from './types';
import { LABEL_TEXT_STYLE, CHECKBOX_RECT_STYLE } from './constant';

export type { CheckboxCfg, CheckboxOptions };

export class Checkbox extends GUI<Required<CheckboxCfg>> {
  /**
   * 组件 switch
   */
  public static tag = 'checkbox';

  /**  checkbox 的背景方框组件 */
  private checkboxBackgroundShape!: Rect;

  /** checkbox checked 时的✅ */
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
      label: {
        text: '',
        textStyle: LABEL_TEXT_STYLE,
        spacing: 4,
      },
      defaultChecked: false,
      style: {
        default: CHECKBOX_RECT_STYLE.default,
        selected: CHECKBOX_RECT_STYLE.selected,
        active: CHECKBOX_RECT_STYLE.active,
        disabled: CHECKBOX_RECT_STYLE.disabled,
      },
      disabled: false,
    },
  };

  constructor(options: CheckboxOptions) {
    super(deepMix({}, Checkbox.defaultOptions, options));
    this.init();
  }

  public init(): void {
    this.initChecked(); // 初始化 checked
    this.initShape(); // 初始化组件
    this.bindEvents(); // 添加交互
    this.verticalCenter(); // 垂直居中
  }

  /**
   * 组件的更新
   */
  public update(cfg?: Partial<CheckboxCfg>) {
    this.attr(deepMix({}, this.attributes, cfg));
    this.updateShape();
    this.verticalCenter(); // 垂直居中
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
    // 初始化创建 checkbox 背景小方块
    this.checkboxBackgroundShape = this.createCheckboxBackgroundShape();
    this.checkedShape = this.createCheckedShape();
    this.labelShape = this.createLabelShape();

    this.checkboxBackgroundShape.appendChild(this.checkedShape);
    this.checkboxBackgroundShape.appendChild(this.labelShape);
    this.appendChild(this.checkboxBackgroundShape);
  }

  private createCheckboxBackgroundShape(): Rect {
    const { x, y, style, checked, disabled } = this.attributes;
    if (disabled)
      return new Rect({
        style: { ...(style.disabled as RectStyleProps), x, y },
      });
    if (checked)
      return new Rect({
        style: { ...(style.selected as RectStyleProps), x, y },
      });
    return new Rect({
      style: { ...(style.default as RectStyleProps), x, y },
    });
  }

  private createLabelShape(): Text {
    const {
      disabled,
      label: { text, spacing, textStyle },
    } = this.attributes;
    const { width } = this.checkboxBackgroundShape.attributes;
    return new Text({
      name: 'label',
      style: {
        ...(textStyle as TextCfg),
        text,
        x: width + (spacing as number),
        stroke: disabled ? 'rgba(0,0,0,0.25)' : textStyle?.stroke,
      },
    });
  }

  private createCheckedShape(): Path {
    const { disabled } = this.attributes;
    const CHECKED_SHAPE_PATH = [
      ['M', 3, 6],
      ['L', '5', '8.5'],
      ['L', '8.5', '4'],
    ] as PathCommand[];

    const CHECKED_SHAPE_STYLE = {
      path: CHECKED_SHAPE_PATH,
      stroke: disabled ? 'rgba(0,0,0,0.25)' : '#ffffff',
    } as PathStyleProps;

    const checkedShape = new Path({ style: CHECKED_SHAPE_STYLE });
    checkedShape.setAttribute('visibility', 'hidden');
    return checkedShape;
  }

  // 初始化 checked 和 defaultChecked
  private initChecked() {
    const { defaultChecked, checked } = this.attributes;
    this.checked = !!(isNil(checked) ? defaultChecked : checked);
    this.setAttribute('checked', this.checked);
  }

  // Shape 组件更新
  private updateShape() {
    this.updateCheckboxShape();
    this.updateCheckedShape();
    this.updateLabelShape();
    if (this.getAttribute('disabled')) {
      this.removeEvents();
    }
  }

  private updateCheckedShape() {
    const { disabled, checked } = this.attributes;
    this.checkedShape.setAttribute('stroke', disabled ? 'rgba(0,0,0,0.25)' : '#ffffff');
    this.checkedShape.setAttribute('visibility', checked ? 'visible' : 'hidden');
  }

  private updateLabelShape() {
    const {
      disabled,
      label: { text, spacing, textStyle },
    } = this.attributes;
    const { width } = this.checkboxBackgroundShape.attributes;
    this.labelShape.setAttribute('text', text as string);
    this.labelShape.setAttribute('x', width + (spacing as number));
    Object.keys(textStyle as object).forEach((key) => {
      this.labelShape.setAttribute(key as keyof TextCfg, get(textStyle, key));
    });
    if (disabled) {
      this.labelShape.update({ fontColor: 'rgba(0,0,0,0.25)' });
    }
  }

  private updateCheckboxShape() {
    const { style, checked, disabled } = this.attributes;
    this.checked = checked;
    const { selected: selectedStyle, default: defaultStyle, disabled: disabledStyle } = style;
    if (disabled) {
      Object.keys(disabledStyle as object).forEach((key) => {
        this.checkboxBackgroundShape.setAttribute(key as keyof RectStyleProps, get(disabledStyle, key));
      });
      return;
    }
    if (checked) {
      Object.keys(selectedStyle as object).forEach((key) => {
        this.checkboxBackgroundShape.setAttribute(key as keyof RectStyleProps, get(selectedStyle, key));
      });
      this.checkedShape.setAttribute('visibility', 'visible');
    } else {
      Object.keys(selectedStyle as object).forEach((key) => {
        this.checkboxBackgroundShape.setAttribute(key as keyof RectStyleProps, get(defaultStyle, key));
      });
      this.checkedShape.setAttribute('visibility', 'hidden');
    }
  }

  private bindEvents(): void {
    if (!this.attributes.disabled) {
      this.addClick();
      this.addHover();
    }
  }

  private removeEvents() {
    this.checkboxBackgroundShape.removeAllEventListeners();
  }

  private addHover() {
    this.checkboxBackgroundShape.addEventListener('mouseenter', () => {
      if (this.checked) return;
      const {
        style: { active: activeStyle },
      } = this.attributes;
      Object.keys(activeStyle as object).forEach((key) => {
        this.checkboxBackgroundShape.setAttribute(key as keyof RectStyleProps, get(activeStyle, key));
      });
    });
    this.checkboxBackgroundShape.addEventListener('mouseleave', () => {
      if (this.checked) return;
      const {
        style: { default: defaultStyle },
      } = this.attributes;
      Object.keys(defaultStyle as object).forEach((key) => {
        this.checkboxBackgroundShape.setAttribute(key as keyof RectStyleProps, get(defaultStyle, key));
      });
    });
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

  private verticalCenter() {
    const { height } = this.checkboxBackgroundShape.attributes;
    const { lineHeight: labelHeight } = this.labelShape.attributes;
    this.labelShape.setAttribute('y', (height - (labelHeight as number)) / 2);
  }

  public get labelBounds() {
    return this.labelShape.getBounds() as AABB;
  }

  public get checkboxBounds() {
    return this.checkboxBackgroundShape.getBounds() as AABB;
  }
}
import type { PathCommand } from '@antv/g';
import { Text as GText, Rect } from '@antv/g';
import { pick, isNumber } from '@antv/util';
import { Decoration } from './decoration';
import { Marker } from '../marker';
import { deepAssign, transform, getEllipsisText, getShapeSpace, measureTextWidth } from '../../util';
import { GUI } from '../../core/gui';
import type { TextCfg, TextOptions, DecorationCfg } from './types';
import type { TextProps } from '../../types';

export type { TextCfg, TextOptions };

/**
 * 渲染流程
 * 1. transform
 * 2. create text shape
 * 3. overflow
 * 4. layout
 * 5. create decoration
 * 6. create background
 * 7. set anchor
 */

export class Text extends GUI<Required<TextCfg>> {
  public static tag = 'paragraph';

  private static defaultOptions = {
    type: Text.tag,
    style: {
      text: '',

      fontFamily: 'sans-serif',
      fontSize: 12,
      fontWeight: 'normal',
      fontVariant: 'normal',
      letterSpacing: 0,
      leading: 0,
      fontStyle: 'normal',

      decoration: {
        type: 'none',
        style: {
          stroke: '#000',
        },
      },

      overflow: 'none',
      backgroundStyle: {},
      transform: 'none',
      tooltip: false,
      tooltipWait: 300,
    },
  };

  public get textWidth(): number {
    return measureTextWidth(this.renderText, this.font);
  }

  public get textHeight(): number {
    return getShapeSpace(this.textShape).height;
  }

  public get width(): number {
    const { width } = this.attributes;
    // 度量文字长度
    if (width === 'auto' || width === undefined) return this.textWidth;
    return width;
  }

  public get height(): number {
    const { lineHeight } = this.attributes;
    // 此时width一定存在
    // 若height不存在，则对文本进行测量
    if (isNumber(lineHeight)) return lineHeight;
    return getShapeSpace(this.textShape).height;
  }

  /**
   * transform 后的文本
   */
  private get text() {
    const { transform: tf, text } = this.attributes;
    // text 移除换行符 并进行转换
    return transform(text.replace(/\r\n/g, '').replace(/\n/g, ''), tf || 'none');
  }

  private get ellipsisText() {
    const { text } = this;
    const { width, overflow } = this.attributes;
    const placeholder = (overflow === 'ellipsis' ? '...' : overflow) as string;
    return text
      .split('\n')
      .map((line) => {
        return getEllipsisText(line, isNumber(width) ? width : Infinity, this.font, placeholder);
      })
      .join('\n');
  }

  /**
   * 最终渲染的文本
   */
  private get renderText() {
    const { width } = this.attributes;
    const { overflow } = this.attributes;
    if (overflow && !['none', 'clip'].includes(overflow) && isNumber(width)) return this.ellipsisText;
    return this.text;
  }

  private get textAlign(): TextProps['textAlign'] {
    const { width, textAlign } = this.attributes;
    // 未指定width，由使用
    if (!width) return 'start';
    return textAlign;
  }

  private get verticalAlign() {
    const { verticalAlign } = this.attributes;
    return verticalAlign;
  }

  private get textBaseline() {
    return this.verticalAlign as TextProps['textBaseline'];
  }

  private get font() {
    return pick(this.attributes, ['fontSize', 'fontFamily', 'fontWeight', 'fontStyle', 'fontVariant', 'letterSpacing']);
  }

  private get textCfg(): TextProps {
    const { renderText, textAlign, textBaseline } = this;
    return {
      ...this.font,
      text: renderText,
      textAlign: 'start',
      textBaseline: 'middle',
      // textAlign,
      // textBaseline,
    };
  }

  private get backgroundCfg() {
    const { width, height } = this;
    const { backgroundStyle } = this.attributes;
    return {
      x: 0,
      y: 0,
      width,
      height,
      ...backgroundStyle,
    };
  }

  private get decorationLineWidth() {
    const { fontSize } = this.attributes;
    return Math.floor(Math.log10(fontSize) * 2);
  }

  private get decorationCfg(): DecorationCfg {
    const { textWidth, textHeight, decorationLineWidth } = this;
    const { decoration } = this.attributes;
    return deepAssign(
      {},
      {
        y: -textHeight / 2,
        width: textWidth,
        height: textHeight,
        ...decoration,
      },
      {
        style: {
          lineWidth: decorationLineWidth,
        },
      }
    );
  }

  private get clipRectCfg() {
    const { height } = this;
    // 此时width一定存在
    const { width } = this.attributes;
    return { width, height } as { width: number; height: number };
  }

  private textShape!: GText;

  /** 装饰线条 */
  private decorationShape!: Decoration;

  private backgroundShape!: Rect;

  /** 裁切矩形 */
  private clipRect!: Rect;

  constructor(options: TextOptions) {
    super(deepAssign({}, Text.defaultOptions, options));
    this.init();
  }

  public init() {
    this.initShape();
    this.update({});
  }

  public update(cfg: Partial<TextCfg>) {
    this.attr(deepAssign({}, this.attr(), cfg));
    this.clear();
    this.backgroundShape.attr(this.backgroundCfg);
    this.textShape.attr(this.textCfg);
    this.layout();
    this.decorationShape.update(this.decorationCfg);
  }

  public clear() {
    // 移除clipPath
    this.backgroundShape.style.clipPath = null;
    this.clipRect?.destroy();
  }

  private initShape() {
    this.backgroundShape = new Rect({ name: 'background', style: { width: 0, height: 0 } });
    this.decorationShape = new Decoration({ name: 'decoration' });
    this.textShape = new GText({ name: 'text', style: this.textCfg });
    this.textShape.appendChild(this.decorationShape);
    this.backgroundShape.appendChild(this.textShape);
    this.appendChild(this.backgroundShape);
  }

  private overflow() {
    const { width, overflow } = this.attributes;
    // 为false\开启换行\未width数值, 则不进行操作
    if (!overflow || overflow === 'none' || !isNumber(width)) return;
    if (overflow === 'clip') {
      // 裁切
      this.clipRect = new Rect({ name: 'clip-rect', style: this.clipRectCfg });
      this.backgroundShape.style.clipPath = this.clipRect;
    }
  }

  private adjustTextAlign() {
    const { textWidth } = this;
    const { width, textAlign } = this.attributes;
    if (!isNumber(width)) return;
    let xOffset = 0;
    if (textAlign === 'start') xOffset = 0;
    else if (textAlign === 'center') xOffset = (this.width - textWidth) / 2;
    else xOffset = this.width - textWidth;
    this.textShape.attr({ x: xOffset });
  }

  private adjustVerticalAlign() {
    const { verticalAlign, textHeight } = this;
    let yOffset = 0;
    if (verticalAlign === 'top') yOffset = textHeight / 2;
    else if (verticalAlign === 'middle') yOffset = this.height / 2;
    else yOffset = this.height - textHeight / 2;
    this.textShape.attr({ y: yOffset });
  }

  private layout() {
    this.adjustTextAlign();
    this.adjustVerticalAlign();
    this.overflow();
  }
}

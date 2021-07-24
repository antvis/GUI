import { Rect, Text } from '@antv/g';
import { deepMix } from '@antv/util';
import { normalPadding } from '../../util';
import { GUI } from '../core/gui';
import { Marker } from '../marker';
import type { DisplayObject } from '../../types';
import type { TagAttrs, TagOptions } from './types';

export type { TagOptions };

/**
 * 带文本的 图标组件，支持 iconfont 组件
 */
export class Tag extends GUI<TagAttrs> {
  /**
   * 标签类型
   */
  public static tag = 'tag';

  private markerShape: GUI;

  private textShape: DisplayObject;

  private backgroundShape: DisplayObject;

  /**
   * 默认参数
   */
  private static defaultOptions = {
    type: Tag.tag,
    attrs: {
      padding: 4,
      textStyle: {
        default: {
          fontSize: 12,
          textAlign: 'left',
          textBaseline: 'middle',
          fill: '#000',
        },
        active: {},
      },
      marker: {},
      spacing: 4,
      background: {
        radius: 2,
        style: {
          default: {
            fill: 'transparent',
          },
          active: {
            fill: '#f5f5f5',
          },
        },
      },
    } as TagAttrs,
  };

  constructor(options: TagOptions) {
    super(deepMix({}, Tag.defaultOptions, options));
    this.init();
  }

  attributeChangedCallback(name: string, value: any): void {}

  /**
   * 根据 type 获取 maker shape
   */
  public init(): void {
    this.createBackground();
    this.createMarker();
    this.createText();
    this.autoFit();
    this.bindEvents();
  }

  /**
   * 组件的更新
   */
  public update(cfg: TagAttrs) {
    this.attr(deepMix({}, this.attributes, cfg));
    this.markerShape.attr(this.getMarkerAttrs());
    this.textShape.attr(this.getTextAttrs());
    this.backgroundShape.attr(this.getBackgroundAttrs());
    this.autoFit();
  }

  /**
   * 组件的清除
   */
  public clear() {
    this.markerShape.destroy();
    this.textShape.destroy();
    this.backgroundShape.destroy();
  }

  /**
   * 创建 background
   */
  private createBackground() {
    this.backgroundShape = new Rect({
      name: 'tag-background',
      attrs: this.getBackgroundAttrs(),
    });
    this.appendChild(this.backgroundShape);
    this.backgroundShape.toBack();
  }

  private getBackgroundAttrs() {
    const { background } = this.attributes;
    return {
      x: 0,
      y: 0,
      radius: background?.radius || 0,
      ...(background.style.default || {}),
    };
  }

  /**
   * 创建 marker
   */
  private createMarker() {
    this.markerShape = new Marker({
      name: 'tag-marker',
      attrs: this.getMarkerAttrs(),
    });
    this.backgroundShape.appendChild(this.markerShape);
  }

  private getMarkerAttrs() {
    const { marker } = this.attributes;
    return deepMix(
      {},
      {
        symbol: 'circle',
        size: 0,
      },
      marker
    );
  }

  /**
   * 创建 text
   */
  private createText() {
    this.textShape = new Text({
      name: 'tag-text',
      attrs: this.getTextAttrs(),
    });
    this.backgroundShape.appendChild(this.textShape);
  }

  private getTextAttrs() {
    const { text, textStyle } = this.attributes;

    return {
      ...textStyle.default,
      x: 0,
      y: 0,
      text,
    };
  }

  private autoFit() {
    const { padding, spacing } = this.attributes;

    const [p0, p1, p2, p3] = normalPadding(padding);
    let width = p1 + p3;
    let height = 0;

    if (this.markerShape?.attr('size')) {
      const markerRect = this.markerShape.getBoundingClientRect();
      width += markerRect.width + spacing;
      height = Math.max(height, markerRect.height);
    }
    if (this.textShape) {
      const textRect = this.textShape.getBoundingClientRect();
      width += textRect.width;
      height = Math.max(height, textRect.height);
    }

    height += p0 + p2;

    // background
    this.backgroundShape.attr({ width, height });
    // marker
    this.markerShape.setLocalPosition(p3 + this.markerShape.getBoundingClientRect().width / 2, height / 2);
    // text
    let textX = p3;
    if (this.markerShape?.attr('size')) {
      textX += this.markerShape.getBoundingClientRect().width + spacing;
    }
    // 设置 局部坐标系 下的位置
    this.textShape.setLocalPosition(textX, height / 2);
  }

  private bindEvents() {
    this.on('mouseenter', () => {
      const { background, textStyle } = this.attributes;
      // fixme 没有处理 fontSize 影响定位的问题
      this.textShape.attr(textStyle.active || {});
      this.backgroundShape.attr(background.style.active || {});
      this.autoFit();
      // fixme 不执行这个的话，backgroundShape 的设置不生效
      this.attr({ cursor: 'pointer' });
    });

    this.on('mouseleave', () => {
      this.textShape.attr(this.getTextAttrs());
      this.backgroundShape.attr(this.getBackgroundAttrs());
      this.autoFit();
      // fixme 不执行这个的话，backgroundShape 的设置不生效
      this.attr({ cursor: 'default' });
    });
  }
}

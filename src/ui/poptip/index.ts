import { deepMix, isString, isElement, assign } from '@antv/util';
import { createDom } from '@antv/dom-util';
import { GUI } from '../../core/gui';
import { applyStyleSheet } from '../../util';
import { CLASS_NAME, POPTIP_STYLE, TOOLTIP_STYLE } from './constant';
import { getPosition, getContainerOption, getPositionXY } from './helpers';

import type { PoptipCfg, PoptipOptions, PoptipPosition } from './types';

export type { PoptipCfg, PoptipOptions };

// 到处方法，可以外部使用
export { getContainerOption, getPositionXY } from './helpers';

/**
 * shape 直接加 html 定位问题很好解决， 但是 问题是 多个 shape 不能重复利用 html 了。
 * legend、tooltip 是创建一个然后 操纵 x,y 来实现的， 外部传导 x,y。
 * legend 挂在 色板上， 通过交互计算 x,y 定位位置 使用 Group 创建 并添加 Marker 小箭头。
 * tooltip 在 body 上，没有使用 G ， 通过 creatDom 方法创建 dom ，然后通过交互事件，来操控 x,y -> left top 来搞定位置。
 * antd   通过创建 在 body 或者其他 dom 上， 并 fiexd 固定定位 或 绝对定位的方式， 给 children 传递信息，并创建交互。 通过 offset 获取 盒子在页面中的位置来 显示。
 * poptip 现在 要正对 多个 G.text 省略 做 显示，不能创建多个 poptip ，  方法和tooltip antd 类似，  比较重要的就是 获取需要定位的目标的 相对屏幕的 xy,和自身的width,height。
 * 比较 tooltip 多处的 是 可以传入 target 目标，以及
 */
export class Poptip extends GUI<Required<PoptipCfg>> {
  public static tag = 'poptip';

  private static defaultOptions = {
    style: {
      x: 0,
      y: 0,
      target: null,
      visibility: 'hidden',
      text: '',
      position: 'top',
      backgroundShape: 'tooltip',
      offset: [0, 0],
      container: {},
      style: POPTIP_STYLE,
      template: {
        container: `<div class="${CLASS_NAME.CONTAINER}"></div>`,
        text: `<div class="${CLASS_NAME.TEXT}"></div>`,
      },
    },
  };

  // 容器 element
  private element!: HTMLElement;

  // 暂时需要 container 的类名 之后 element 可以更新后 去除
  private containerClassName!: string;

  // 目标定位元素
  private target!: any;

  // 显影控制
  private visibility: 'visible' | 'hidden' = 'visible';

  // 内部储存方向
  private position: PoptipPosition = 'top';

  // 鼠标移动方法， 方便添加和删除交互
  private mousemove!: () => void;

  // 鼠标移出方法， 方便添加和删除交互
  private mouseleave!: () => void;

  constructor(options: PoptipOptions) {
    super(deepMix({}, Poptip.defaultOptions, options));
    this.visibility = this.attributes.visibility;
    this.position = getPosition(this.attributes.position);
    this.initShape();
    this.initEvent();
    this.init();
  }

  public init() {
    this.updateEvent();
    this.updateHTMLTooltipElement();
    this.setOffsetPosition();
  }

  public update(cfg: Partial<PoptipCfg>) {
    this.attr(deepMix({}, this.attributes, cfg));
    this.visibility = this.attributes.visibility;
    this.position = getPosition(this.attributes.position);
    this.init();
  }

  /**
   * 清空容器内容
   */
  public clear() {
    this.element.innerHTML = '';
  }

  /**
   * 清除
   */
  public destroy() {
    this.element?.remove();
  }

  /**
   * 显示
   */
  public show() {
    this.visibility = 'visible';
    this.element.style.visibility = 'visible';
  }

  /**
   * 隐藏
   */
  public hide() {
    this.visibility = 'hidden';
    // 延迟关闭 默认延迟 100ms，确保鼠标可以移动到 poptip 上不会关闭 poptip
    setTimeout(() => {
      if (this.visibility === 'hidden') {
        this.element.style.visibility = 'hidden';
      }
    }, 100);
  }

  /**
   * 获取内部容器 HTMLElement
   * @returns this.element:HTMLElement;
   */
  public getHTMLTooltipElement() {
    return this.element;
  }

  /**
   * 获取保存的目标元素
   * @returns this.target
   */
  public getTarget() {
    return this.target;
  }

  /**
   * 初始化容器
   */
  private initShape() {
    const { template } = this.attributes;
    const { container } = template;
    if (!container) return;

    if (isString(container)) {
      this.element = createDom(container!) as HTMLElement;
    } else if (isElement(container)) {
      this.element = container;
    }

    document.body.appendChild(this.element);

    this.containerClassName = this.element.className;

    if (this.id || this.id !== '') {
      this.element.setAttribute('id', this.id);
    }
  }

  /**
   * 初始化容器事件，后续需要对交互进行优化
   */
  private initEvent() {
    this.mousemove = () => {
      this.show();
    };
    this.mouseleave = () => {
      this.hide();
    };

    this.element.addEventListener('mousemove', this.mousemove);
    this.element.addEventListener('mouseleave', this.mouseleave);
  }

  /**
   * 更新目标交互 目前 容器 element 不做更新处理, 对 target 的更新 做处理，删除原来元素的交互
   */
  private updateEvent() {
    if (this.attributes?.target && this.attributes?.target !== this.target) {
      // 删除旧 target 交互
      this.target?.removeEventListener?.('mousemove', this.mousemove);
      this.target?.removeEventListener?.('mouseleave', this.mouseleave);

      // 添加新 target 交互
      this.target = this.attributes?.target;
      this.target.addEventListener?.('mousemove', this.mousemove);
      this.target.addEventListener?.('mouseleave', this.mouseleave);
    }
  }

  /**
   * 更新 HTML 上的内容
   */
  private updateHTMLTooltipElement() {
    const container = this.element;

    this.clear();
    const {
      template: { text },
      style,
    } = this.attributes;
    let containerStyle = style;

    if (this.attributes.backgroundShape === 'tooltip') {
      container.className = `${this.containerClassName} ${CLASS_NAME.CONTAINER}-${this.position}-tooltip`;
      container.innerHTML = `<span class="${CLASS_NAME.CONTAINER}-span ${CLASS_NAME.CONTAINER}-${this.position}-span"></span>`;
      // 添加 tooltip 样式
      containerStyle = assign({}, TOOLTIP_STYLE, containerStyle);
    } else {
      container.className = `${this.containerClassName} ${CLASS_NAME.CONTAINER}-${this.position}`;
    }

    // 置入title
    if (isString(text)) {
      container.innerHTML += text;
    } else if (text && isElement(text)) {
      container.appendChild(text);
    }

    // 应用样式表
    applyStyleSheet(container, containerStyle as any);

    this.element.style.visibility = this.visibility;
  }

  /**
   * 将相对于指针的偏移量生效到dom元素上
   */
  private setOffsetPosition() {
    const { container } = this.attributes;

    const option = getContainerOption(this.target);
    const { x: positionX, y: positionY } = getPositionXY(option, this.position);

    const x = container.x || positionX || 0;
    const y = container.y || positionY || 0;

    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
  }
}

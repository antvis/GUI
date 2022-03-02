import { deepMix, isString, isElement, assign } from '@antv/util';
import { createDom } from '@antv/dom-util';
import { DisplayObject } from '@antv/g';
import { GUI } from '../../core/gui';
import { CLASS_NAME, POPTIP_STYLE, TOOLTIP_STYLE } from './constant';
import { getPositionXY } from './helpers';

import type { PoptipCfg, PoptipOptions } from './types';

export type { PoptipCfg, PoptipOptions };

// 到处方法，可以外部使用
export { getPositionXY } from './helpers';

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
      follow: false,
      offset: [0, 0],
      style: POPTIP_STYLE,
      template: {
        container: `<div class="${CLASS_NAME.CONTAINER}"></div>`,
        text: `<div class="${CLASS_NAME.TEXT}"></div>`,
      },
    },
  };

  /** 容器 HTML 元素节点 */
  private container!: HTMLElement;

  // 暂时需要 container 的类名 之后 element 可以更新后 去除
  private containerClassName!: string;

  /** 显影控制 */
  private visibility: 'visible' | 'hidden' = 'visible';

  /** 所有绑定的目标对象 */
  private map: Map<HTMLElement | DisplayObject, any[]> = new Map();

  constructor(options: PoptipOptions) {
    super(deepMix({}, Poptip.defaultOptions, options));
    this.init();
  }

  /**
   * poptip 组件初始化
   */
  public init() {
    this.initShape();
    this.update();
  }

  /**
   * poptip 组件更新
   */
  public update(cfg?: Partial<PoptipCfg>) {
    this.attr(deepMix({}, this.style, cfg));

    this.visibility = this.style.visibility;
    this.updatePoptipElement();
  }

  /**
   * 绑定元素
   */
  public bind(
    element: HTMLElement | DisplayObject,
    options: {
      html: (e: any) => string;
      condition: (e: any) => HTMLElement | DisplayObject | false;
    } & Pick<PoptipCfg, 'position' | 'arrowPointAtCenter' | 'follow'>
  ): void {
    // todo 增加事件监听移除
    if (!element) return;

    const { text: defaultText } = this.style;
    const { html, condition = () => element, ...restOptions } = options || {};
    const { position, arrowPointAtCenter, follow } = assign({} as any, this.style, restOptions);

    const onmousemove = (e: any) => {
      const target = condition.call(null, e);
      if (target) {
        const { clientX, clientY } = e as MouseEvent;
        const [x, y] = getPositionXY(clientX, clientY, target, position, arrowPointAtCenter, follow);
        const text = html ? html.call(null, e) : defaultText;
        this.container.setAttribute('data-position', position);
        this.showTip(x, y, text);
      }
    };
    const onmouseleave = (e: any) => {
      if (condition.call(null, e)) this.hideTip();
    };
    element.addEventListener('mousemove', onmousemove);
    element.addEventListener('mouseleave', onmouseleave);
    // 存储监听
    this.map.set(element, [onmousemove, onmouseleave]);
  }

  public unbind(element: HTMLElement | DisplayObject): void {
    if (this.map.has(element)) {
      const [listener1, listener2] = this.map.get(element) || [];
      listener1 && element.removeEventListener('mousemove', listener1);
      listener2 && element.removeEventListener('mouseleave', listener2);
      this.map.delete(element);
    }
  }

  /**
   * 清空容器内容
   */
  public clear() {
    this.container.innerHTML = '';
  }

  /**
   * 清除
   */
  public destroy() {
    [...this.map.keys()].forEach((ele) => this.unbind(ele));

    this.container?.remove();
  }

  /**
   * 显示
   */
  public showTip(x: number, y: number, text?: string) {
    this.setOffsetPosition(x, y);

    this.visibility = 'visible';
    this.container.style.visibility = 'visible';
    if (typeof text === 'string') {
      // do something
      const textElement = this.container.querySelector(`.${CLASS_NAME.TEXT}`);
      if (textElement) {
        (textElement as HTMLDivElement).innerHTML = text;
      }
    }
  }

  /**
   * 隐藏
   */
  public hideTip() {
    this.visibility = 'hidden';
    // 延迟关闭 默认延迟 100ms，确保鼠标可以移动到 poptip 上不会关闭 poptip
    setTimeout(() => {
      if (this.visibility === 'hidden') {
        this.container.style.visibility = 'hidden';
      }
    }, 100);
  }

  /**
   * 获取内部容器 HTMLElement
   * @returns this.element:HTMLElement;
   */
  public getContainer(): HTMLElement {
    return this.container;
  }

  /**
   * 初始化容器
   */
  private initShape() {
    const { template } = this.style;
    const { container } = template;
    if (!container) return;

    if (isString(container)) {
      this.container = createDom(container!) as HTMLElement;
    } else if (isElement(container)) {
      this.container = container;
    }

    document.body.appendChild(this.container);

    this.containerClassName = this.container.className;

    if (this.id || this.id !== '') {
      this.container.setAttribute('id', this.id);
    }
  }

  /**
   * 更新 HTML 上的内容
   */
  private updatePoptipElement() {
    const { container } = this;

    this.clear();
    const {
      text,
      template: { text: templateText },
      style,
    } = this.style;
    const containerStyle = style;

    container.className = this.containerClassName;
    // 增加 arrow 元素
    const arrowNode = `<span class="${CLASS_NAME.ARROW}"></span>`;
    container.innerHTML = arrowNode;

    // 置入 text 模版
    if (isString(templateText)) {
      container.innerHTML += templateText;
    } else if (templateText && isElement(templateText)) {
      container.appendChild(templateText);
    }

    // 置入 text
    if (text) {
      container.getElementsByClassName(CLASS_NAME.TEXT)[0]!.innerHTML = text;
    }

    // 应用样式表
    const styles = assign({}, TOOLTIP_STYLE, containerStyle);
    const styleStr = Object.entries(styles).reduce((r, [key, value]) => {
      const styleStr = Object.entries(value).reduce((r, [k, v]) => `${r}${k}: ${v};`, '');
      return `${r}${key} { ${styleStr} }`;
    }, '');
    let styleDOM = this.container.querySelector('style') as HTMLStyleElement;
    if (styleDOM) this.container.removeChild(styleDOM);
    styleDOM = document.createElement('style');
    styleDOM.innerHTML = styleStr;
    this.container.appendChild(styleDOM);

    this.container.style.visibility = this.visibility;
  }

  /**
   * 将相对于指针的偏移量生效到dom元素上
   */
  private setOffsetPosition(x: number, y: number): void {
    let [offsetX = 0, offsetY = 0] = this.style.offset;
    // 设置 arrow 的 offset
    if (this.container.querySelector(`.${CLASS_NAME.ARROW}`)) {
      const position = this.container.getAttribute('data-position');
      switch (position) {
        case 'top':
        case 'top-left':
        case 'top-right':
          offsetY -= 8;
          break;
        case 'bottom':
        case 'bottom-left':
        case 'bottom-right':
          offsetY += 8;
          break;
        case 'left':
        case 'left-top':
        case 'left-bottom':
          offsetX -= 8;
          break;
        case 'right':
        case 'right-top':
        case 'right-bottom':
          offsetX += 8;
          break;
        default:
          break;
      }
    }

    this.container.style.left = `${x + offsetX}px`;
    this.container.style.top = `${y + offsetY}px`;
  }
}

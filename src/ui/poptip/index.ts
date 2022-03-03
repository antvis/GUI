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
    options?: {
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
      } else {
        // 没有移动到指定的目标 关闭弹框
        this.hideTip();
      }
    };

    const onmouseleave = () => {
      this.hideTip();
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
   * 显示 + 改变位置
   * @param x 可选 改变位置 x 方向
   * @param y 可选 改变位置 y 方向
   * @param text 文本变化
   */
  public showTip(x?: number, y?: number, text?: string) {
    // 不传入 不希望改变 x y
    if (x && y) {
      this.setOffsetPosition(x, y);
    }

    if (typeof text === 'string') {
      // do something
      const textElement = this.container.querySelector(`.${CLASS_NAME.TEXT}`);
      if (textElement) {
        (textElement as HTMLDivElement).innerHTML = text;
      }
    }

    this.visibility = 'visible';
    this.container.style.visibility = 'visible';
  }

  /**
   * 隐藏 延迟 200ms
   */
  public hideTip() {
    this.visibility = 'hidden';
    // 延迟关闭 默认延迟 100ms，确保鼠标可以移动到 poptip 上不会关闭 poptip
    setTimeout(() => {
      if (this.visibility === 'hidden') {
        this.container.style.visibility = 'hidden';
      }
    }, 200);
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

    // 盒子添加交互
    this.container.addEventListener('mousemove', () => this.showTip());
    this.container.addEventListener('mouseleave', () => this.hideTip());

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
      container.getElementsByClassName(CLASS_NAME.TEXT)[0]!.textContent = text;
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
   * @param x 盒子相对于页面 x 的位置
   * @param y 盒子相对于页面 y 的位置
   */
  private setOffsetPosition(x: number, y: number) {
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

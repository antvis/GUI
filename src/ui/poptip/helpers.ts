import { DisplayObject } from '@antv/g';
import { isElement } from '@antv/util';

import type { PoptipPosition } from './types';

/**
 * @param dom Element 元素
 * @returns 返回传入的 Element 相对于 body 的距离
 */
export function getOffset(dom: Element) {
  let parent = dom;
  let left = 0;
  let top = 0;
  while (parent && parent !== document?.body) {
    // @ts-ignore
    left += parent.offsetLeft;
    // @ts-ignore
    top += parent.offsetTop;
    // @ts-ignore
    parent = parent.offsetParent;
  }
  return {
    left,
    top,
  };
}

/**
 * 计算不同方向的 poptip 在目标盒子上的位置，配置 POPTIP_STYLE 达到需要的 样式效果
 * @param position PoptipPosition
 * @returns { x: number, y: number }
 */
export function getPositionXY(
  clientX: number,
  clientY: number,
  target: HTMLElement | DisplayObject,
  position: PoptipPosition,
  arrowPointAtCenter: boolean = false,
  follow: boolean = false
): [number, number] {
  if (follow) return [clientX, clientY];

  const { x, y, width, height } = target.getBoundingClientRect();
  switch (position) {
    case 'top':
      return arrowPointAtCenter ? [x + width / 2, y] : [clientX, y];
    case 'left':
      return arrowPointAtCenter ? [x, y + height / 2] : [x, clientY];
    case 'bottom':
      return arrowPointAtCenter ? [x + width / 2, y + height] : [clientX, y + height];
    case 'right':
      return arrowPointAtCenter ? [x + width, y + height / 2] : [x + width, clientY];
    case 'top-right':
    case 'right-top':
      return [x + width, y];
    case 'left-bottom':
    case 'bottom-left':
      return [x, y + height];
    case 'right-bottom':
    case 'bottom-right':
      return [x + width, y + height];
    case 'top-left':
    case 'left-top':
    default:
      return [x, y];
  }
}

/**
 * 获取容器盒子 的 x y width height 值 G 获取 Shape 对象 则获取 对于位置 x y 和 它们局部盒子的 width height
 * @param target 目标元素
 * @returns { x: number, y: number, width: number, height: number }
 */
export function getContainerOption(target: any): { x: number; y: number; width: number; height: number } {
  let x;
  let y;
  let width;
  let height;

  const canvas = target?.ownerDocument?.defaultView;
  if (target && isElement(target)) {
    width = target.clientWidth;
    height = target.clientHeight;

    const targetPosition = getOffset(target);
    x = targetPosition.left;
    y = targetPosition.top;
  } else if (canvas) {
    const container = canvas.getContextService().$container;
    // canvas 在屏幕中的位置
    const canvasPosition = getOffset(container);
    const rectPosition = target.getPosition();

    // 获取局部坐标，  不用 attr 的 width 和 height 主要原因是 有文本、圆 等其他图形; 所以直接取它们的盒子 来算 width 和 height。
    const { min, max } = target.getLocalBounds();
    width = max[0] - min[0];
    height = max[1] - min[1];

    x = canvasPosition.left + rectPosition[0];
    y = canvasPosition.top + rectPosition[1];
  }

  return {
    x,
    y,
    width,
    height,
  };
}

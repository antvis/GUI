import { DisplayObject } from '@antv/g';
import type { PoptipPosition } from './types';

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

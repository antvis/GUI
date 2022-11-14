import type { BBox, LayoutItem } from '../types';

export function getItemsBBox(items: LayoutItem[]): BBox {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (let i = 0; i < items.length; i++) {
    const { x, y, width, height } = items[i];
    const [X, Y] = [x + width, y + height];
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (X > maxX) maxX = X;
    if (Y > maxY) maxY = Y;
  }

  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}
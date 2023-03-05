import { DisplayObject } from '../shapes';
import { degToRad } from '../util';
import { Bounds } from './bounds';

/**
 * Detect whether line-line collision.
 * From: https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
 */
function lineToLine(line1: number[], line2: number[]) {
  const [x0, y0, x1, y1] = line1;
  const [x2, y2, x3, y3] = line2;
  const s10x = x1 - x0;
  const s10y = y1 - y0;
  const s32x = x3 - x2;
  const s32y = y3 - y2;

  const denom = s10x * s32y - s32x * s10y;
  if (denom === 0) return false;
  const denomPositive = denom > 0;

  const s02x = x0 - x2;
  const s02y = y0 - y2;
  const sNum = s10x * s02y - s10y * s02x;
  if (sNum < 0 === denomPositive) return false;

  const tNum = s32x * s02y - s32y * s02x;
  if (tNum < 0 === denomPositive) return false;

  if (sNum > denom === denomPositive || tNum > denom === denomPositive) return false;

  return true;
}

function intersectBoxLine(box: number[] /** 八个顶点 */, line: number[]): boolean {
  const lines = [
    [box[0], box[1], box[2], box[3]],
    [box[2], box[3], box[4], box[5]],
    [box[4], box[5], box[6], box[7]],
    [box[6], box[7], box[0], box[1]],
  ];

  return lines.some((boxLine) => lineToLine(line, boxLine));
}

function getBounds(item: DisplayObject<any>, margin = [0, 0, 0, 0]) {
  const angle = item.getEulerAngles() || 0;
  item.setEulerAngles(0);
  // get dimensions
  const {
    min: [x, y],
    max: [right, bottom],
  } = item.getLocalBounds();
  const { width: w, height: h } = item.getBBox();

  let height = h;
  let dx = 0;
  let dy = 0;
  let anchorX = x;
  let anchorY = y;
  if (item.tagName === 'text') {
    // [to fix] 目前 G 上计算 bbox 有一点误差
    height -= 1.5;
    const a = item.style.textAlign;
    const b = item.style.textBaseline;
    dx = +item.style.dx;
    dy = +item.style.dy;

    // horizontal alignment
    if (a === 'center') {
      anchorX = (x + right) / 2;
    } else if (a === 'right' || a === 'end') {
      anchorX = right;
    } else {
      // left by default, do nothing
    }

    // vertical alignment
    if (b === 'middle') {
      anchorY = (y + bottom) / 2;
    } else if (b === 'bottom' || b === 'baseline') {
      anchorY = bottom;
    }
  }

  const [t = 0, r = 0, b = t, l = r] = margin;
  const bounds = new Bounds();
  bounds.set((dx += x) - l, (dy += y) - t, dx + w + r, dy + height + b);
  item.setEulerAngles(angle);
  return bounds.rotatedPoints(degToRad(angle), anchorX, anchorY);
}

export const IntersectUtils = { lineToLine, intersectBoxLine, getBounds };

export function intersect(a: DisplayObject<any>, b: DisplayObject<any>, margin?: number[]) {
  const p = getBounds(a, margin);
  const q = getBounds(b, margin);
  const result =
    intersectBoxLine(q, [p[0], p[1], p[2], p[3]]) ||
    intersectBoxLine(q, [p[0], p[1], p[4], p[5]]) ||
    intersectBoxLine(q, [p[4], p[5], p[6], p[7]]) ||
    intersectBoxLine(q, [p[2], p[3], p[6], p[7]]);
  return result;
}

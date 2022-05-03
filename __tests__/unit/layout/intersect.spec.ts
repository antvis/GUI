import { Rect } from '@antv/g';
import { intersect, IntersectUtils } from '../../../src/layout/intersect';
import { createCanvas } from '../../utils/render';

type Box = { x1: number; y1: number; x2: number; y2: number; rotation?: number };

const canvas = createCanvas(900, 'svg');
function drawRect(box: Box, fill = '#1890FF') {
  const rect = canvas.appendChild(
    new Rect({
      style: { x: box.x1, y: box.y1, width: box.x2 - box.x1, height: box.y2 - box.y1, fill },
    })
  );
  rect.rotate(box.rotation || 0);
  return rect;
}
function intersectBox(b1: Box, b2: Box) {
  const a = drawRect(b1, 'pink');
  const b = drawRect(b2, 'lightgreen');
  const r = intersect(a, b);
  a.remove();
  b.remove();
  return r;
}

describe('Intersect', () => {
  it('intersectBox(box1, box2) without rotation', () => {
    const a = { x1: 0, y1: 1, x2: 30, y2: 50, rotation: 0 };
    const b = { x1: 30.1, y1: 0, x2: 60, y2: 50, rotation: 0 };
    expect(intersectBox(a, b)).toBe(false);

    const a1 = { x1: 0, y1: 0, x2: 30, y2: 50, rotation: 0 };
    const b1 = { x1: 20, y1: 0, x2: 60, y2: 50, rotation: 0 };
    expect(intersectBox(a1, b1)).toBe(true);

    const a2 = { x1: 0, y1: 0, x2: 30, y2: 50, rotation: 0 };
    const b2 = { x1: 20, y1: 50.1, x2: 60, y2: 80, rotation: 0 };
    expect(intersectBox(a2, b2)).toBe(false);
    canvas.removeChildren();
  });

  it('intersectBox(box1, box2) with rotation', () => {
    const a = { x1: 0, y1: 0, x2: 30, y2: 50, rotation: 0 };
    const b = { x1: 30, y1: 0, x2: 60, y2: 50, rotation: 40 };
    drawRect(a).translate(30, 90);
    expect(intersectBox(a, b)).toBe(true);
    canvas.removeChildren();

    const a1 = { x1: 0, y1: 1, x2: 30, y2: 50, rotation: 0 };
    const b1 = { x1: 20, y1: 0, x2: 60, y2: 50, rotation: -90 };
    drawRect(a1).translate(30, 90);
    drawRect(b1, 'red').translate(30, 90);
    expect(intersectBox(a1, b1)).toBe(false);
    canvas.removeChildren();

    const a2 = { x1: 0, y1: 0, x2: 30, y2: 50, rotation: 0 };
    const b2 = { x1: 20, y1: 52, x2: 60, y2: 80, rotation: -20 };
    expect(intersectBox(a2, b2)).toBe(true);
    canvas.removeChildren();

    const a3 = { x1: 0, y1: 0, x2: 30, y2: 50, rotation: 0 };
    const b3 = { x1: 20, y1: 52, x2: 60, y2: 80, rotation: 20 };
    expect(intersectBox(a3, b3)).toBe(false);

    const a4 = { rotation: 28.000000209988553, x1: 4, y1: 52.5, x2: 88, y2: 67.5 };
    const b4 = { rotation: 28.000000209988553, x1: 44, y1: 52.5, x2: 92, y2: 67.5 };
    drawRect(a4).translate(30, 60);

    expect(intersectBox(a4, b4)).toBe(false);
    canvas.removeChildren();
  });

  it('boxes with negative rotation', () => {
    const boxes = [
      { x: 14, y: 125, width: 84, height: 15, left: 14, right: 98, top: 125, bottom: 140 },
      { x: 38.5, y: 125, width: 48, height: 15, left: 38.5, right: 86.5, top: 125, bottom: 140 },
    ];
    const [a1, b1] = boxes.map((box) => {
      return { x1: box.left, y1: box.top, x2: box.right, y2: box.bottom, rotation: -35 };
    });

    drawRect(a1, 'pink');
    drawRect(b1, 'lightgreen');
    expect(intersectBox(a1, b1)).toBe(false);
  });

  it('bugs', () => {
    const boxes = [
      { x: 724, y: 52.5, width: 48, height: 15, left: 724, right: 772, top: 52.5, bottom: 67.5 },
      { x: 764, y: 52.5, width: 84, height: 15, left: 764, right: 848, top: 52.5, bottom: 67.5 },
    ];
    const [a1, b1] = boxes.map((box) => {
      return { x1: box.left, y1: box.top, x2: box.right, y2: box.bottom, rotation: 30 };
    });

    drawRect(a1, 'red');
    drawRect(b1, 'green');
    expect(intersectBox(a1, b1)).toBe(false);
  });
});

describe('Utils for detect intersect', () => {
  it('lineToLine', () => {
    // 交叉
    expect(IntersectUtils.lineToLine(20, 20, 80, 20, 30, 0, 30, 50)).toBe(true);
    // 平行
    expect(IntersectUtils.lineToLine(20, 20, 80, 20, 0, 40, 80, 40)).toBe(false);
    // 延长线才交叉
    expect(IntersectUtils.lineToLine(20, 20, 80, 20, 0, 40, 80, 30)).toBe(false);
  });

  it('intersect box and line', () => {});
});

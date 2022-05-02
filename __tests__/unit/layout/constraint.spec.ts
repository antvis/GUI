import { Rect } from '@antv/g';
import { Constraint } from '../../../src/layout/constraint';
import { Bounds } from '../../../src/layout/bounds';
import { createCanvas } from '../../utils/render';

const canvas = createCanvas();

describe('Constraint Layout', () => {
  const bounds = new Bounds({ left: 20, top: 20, right: 100, bottom: 220 });

  const vars = {
    ax: undefined,
    ay: undefined,
    aw: 20,
    ah: bounds.height,
    bx: undefined,
    by: undefined,
    bw: undefined,
    bh: bounds.height,
  };

  const limitSize = Number.MAX_VALUE;
  const gap = 12;

  const constraint = new Constraint(vars);
  it('new Constraint(). A + B (horizontal)', () => {
    constraint.addConstraint(['bw', gap, 'aw'], '=', bounds.width);
    constraint.addConstraint(['aw'], '<=', limitSize);
    expect(constraint.get('aw')).toBe(20);
    expect(constraint.get('bw')).toBe(48);

    constraint.addConstraint(['aw'], '<=', 18);
    expect(constraint.get('aw')).toBe(18);
    expect(constraint.get('bw')).toBe(50);

    constraint.addConstraint(['bx', 'bw'], '=', bounds.right);
    constraint.addConstraint(['ax', 'aw', gap], '=', 'bx');
    constraint.addConstraint(['ay', 'ah'], '=', bounds.bottom);
    constraint.addConstraint(['by', 'bh', -bounds.bottom]);

    expect(constraint.get('ax')).toBe(20);
    expect(constraint.get('ay')).toBe(20);
    expect(constraint.get('aw')).toBe(18);
    expect(constraint.get('ah')).toBe(200);
    expect(constraint.get('bx')).toBe(50);
    expect(constraint.get('by')).toBe(20);
    expect(constraint.get('bw')).toBe(50);
    expect(constraint.get('bh')).toBe(200);

    const { ax, ay, aw, ah } = constraint.collect();
    canvas.appendChild(new Rect({ style: { x: ax, y: ay, width: aw, height: ah, fill: 'pink' } }));
    const { bx, by, bw, bh } = constraint.collect();
    canvas.appendChild(new Rect({ style: { x: bx, y: by, width: bw, height: bh, fill: 'pink' } }));
  });

  it('new Constraint(). A + B (vertical)', () => {
    const bounds = new Bounds({ left: 20 + 150, top: 20, right: 100 + 150, bottom: 220 });
    constraint.update({ ax: bounds.left, ay: bounds.top, bx: bounds.left, ah: 20, bw: bounds.width, aw: bounds.width });

    constraint.addConstraint(['bh', 'ah', gap], '=', bounds.height);
    constraint.addConstraint(['by', 'bh'], '=', bounds.bottom);
    constraint.addConstraint(['ay', 'ah', gap, 'bh'], '=', bounds.bottom);

    function drawRect() {
      canvas.removeChildren();
      const { ax, ay, aw, ah } = constraint.collect();
      canvas.appendChild(new Rect({ style: { x: ax, y: ay, width: aw, height: ah, fill: 'green' } }));
      const { bx, by, bw, bh } = constraint.collect();
      canvas.appendChild(new Rect({ style: { x: bx, y: by, width: bw, height: bh, fill: 'green' } }));
    }

    drawRect();
    let bh;
    let ah;
    expect((bh = constraint.get('bh'))).toBe(bounds.height - 20 - gap); // bh: 168
    expect(constraint.get('by')).toBe(bounds.bottom - bh);
    expect((ah = constraint.get('ay'))).toBe(bounds.bottom - ah - bh - gap);

    // Limit the maxHeight of bh.
    constraint.set('bounds.height', bounds.height);
    constraint.addConstraint(['bh'], '<=', [0.8, 'bounds.height']);
    expect(constraint.get('bh')).toBe(bounds.height * 0.8);
    drawRect();
  });
});

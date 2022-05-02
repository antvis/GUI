import { Bounds } from '../../../src/layout/bounds';

describe('Bounds', () => {
  it('new Bounds(), getter left right top bottom width and height', () => {
    const bounds = new Bounds({ left: 20, top: 20, right: 100, bottom: 220 });

    expect(bounds.left).toBe(20);
    expect(bounds.right).toBe(100);
    expect(bounds.top).toBe(20);
    expect(bounds.width).toBe(80);
    expect(bounds.height).toBe(200);
  });
});

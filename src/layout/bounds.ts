/**
 * todo Add intersect method
 */
export class Bounds {
  private x1: number;

  private y1: number;

  private x2: number;

  private y2: number;

  constructor(x1: number, y1: number, x2: number, y2: number) {
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
  }

  public get left() {
    return this.x1;
  }

  public get top() {
    return this.y1;
  }

  public get right() {
    return this.x2;
  }

  public get bottom() {
    return this.y2;
  }

  public get width() {
    return this.x2 - this.x1;
  }

  public get height() {
    return this.y2 - this.y1;
  }
}

export function createTriangleRailPath(width: number, height: number) {
  return [['M', 0, height], ['L', width, height], ['L', width, 0], ['Z']];
}

export function createRectRailPath(width: number, height: number) {
  return [['M', 0, 0], ['L', width, 0], ['L', width, height], ['L', 0, height], ['Z']];
}

export function leftArrow(x: number, y: number, r: number) {
  const diffY = r * Math.sin((1 / 3) * Math.PI);
  return [['M', x - r, y], ['L', x + r, y - diffY], ['L', x + r, y + diffY], ['Z']];
}

export function rightArrow(x: number, y: number, r: number) {
  const diffY = r * Math.sin((1 / 3) * Math.PI);
  return [['M', x + r, y], ['L', x - r, y - diffY], ['L', x - r, y + diffY], ['Z']];
}

export function upArrow(x: number, y: number, r: number) {
  const diffY = r * Math.cos((1 / 3) * Math.PI);
  return [['M', x - r, y + diffY], ['L', x, y - diffY], ['L', x + r, y + diffY], ['Z']];
}

export function downArrow(x: number, y: number, r: number) {
  const diffY = r * Math.cos((1 / 3) * Math.PI);
  return [['M', x - r, y - diffY], ['L', x + r, y - diffY], ['L', x, y + diffY], ['Z']];
}

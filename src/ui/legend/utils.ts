export function createTriangleRailPath(width: number, height: number) {
  return [['M', 0, height], ['L', width, height], ['L', width, 0], ['Z']];
}

export function createRectRailPath(width: number, height: number) {
  return [['M', 0, 0], ['L', width, 0], ['L', width, height], ['L', 0, height], ['Z']];
}

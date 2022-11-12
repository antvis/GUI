export function inRange(n: number, start: number, end: number, includeLeft: boolean = true, includeRight?: boolean) {
  if ((includeLeft && n === start) || (includeRight && n === end)) return true;
  return n > start && n < end;
}

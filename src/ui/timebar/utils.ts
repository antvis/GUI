import type { Interval } from './types';
// TODO 需要根据传入时间、当前时间轴宽度 自动计算出最佳的时间间隔
/**
 * 时间格式化，为 Date 时，按照时间解析，为数字时按照序列解析
 * @param time
 * @param interval 时间间隔
 * @returns
 */
export function labelFormatter(time: number): string;
export function labelFormatter(time: Date, interval: Interval): string;
export function labelFormatter(time: number | Date, interval?: Interval) {
  if (typeof time === 'number') {
    return parseBySeries(time);
  }
  return parseByTime(time, interval!);
}

function parseByTime(time: Date, interval: Interval) {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  switch (interval) {
    case 'half-hour':
    case 'hour':
    case 'four-hour':
      if ([0, 6, 12, 18].includes(date.getHours()) && date.getMinutes() === 0) {
        // HH:mm\nYYYY-MM-DD
        return `${hours}:${minutes}\n${year}-${month}-${day}`;
      }
      // HH:mm
      return `${hours}:${minutes}`;
    case 'half-day':
      // A\nYYYY-MM-DD
      if (date.getHours() < 12) {
        return `AM\n${year}-${month}-${day}`;
      }
      // A
      return 'PM';
    case 'day':
      if ([1, 10, 20].includes(date.getDate())) {
        // DD\nYYYY-MM
        return `${day}\n${year}-${month}`;
      }
      // DD
      return day;
    case 'week':
      if (date.getDate() <= 7) {
        // DD\nYYYY-MM
        return `${day}\n${year}-${month}`;
      }
      // DD
      return day;
    case 'month':
      if ([0, 6].includes(date.getMonth())) {
        // MM月\nYYYY
        return `${month}月\n${year}`;
      }
      // MM月
      return `${month}月`;
    case 'season':
      if ([0].includes(date.getMonth())) {
        // MM月\nYYYY
        return `${month}月\n${year}`;
      }
      // MM月
      return `${month}月`;
    case 'year':
      // YYYY
      return `${year}`;
    default:
      // YYYY-MM-DD HH:mm
      return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
}

/**
 * 按照序列数据解析，如第 1, 2, 3 秒
 * @param time
 * @param interval
 */
function parseBySeries(time: number) {
  const hours = String(Math.floor(time / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
  const seconds = String(Math.floor(time % 60)).padStart(2, '0');
  if (time < 3600) {
    // mm:ss
    return `${minutes}:${seconds}`;
  }
  return `${hours}:${minutes}:${seconds}`;
}

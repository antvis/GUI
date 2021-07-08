/**
 * 平台判断
 */
export function isPC(userAgent = undefined) {
  const userAgentInfo = userAgent || navigator.userAgent;
  const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
  let flag = true;
  Agents.forEach((item) => {
    if (userAgentInfo.indexOf(item) > 0) {
      flag = false;
    }
  });
  return flag;
}

/**
 * 保留x位小数
 */
export function toPrecision(num: number, precision: number) {
  const _ = 10 ** precision;
  return Number(Math.round(num * _).toFixed(0)) / _;
}

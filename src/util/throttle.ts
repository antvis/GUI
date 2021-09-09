/**
 * 节流修饰器
 * @param limit 节流时间
 */
export function throttle(limit: number = 0) {
  let prev = new Date().getTime();
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    let func = descriptor.value;
    if (typeof func === 'function') {
      func = (...args: any[]) => {
        const now = new Date().getTime();
        if (now - prev > limit) {
          func.apply(target, args);
          prev = new Date().getTime();
        }
      };
    }
  };
}

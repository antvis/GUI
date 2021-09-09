export function throttle(limit: number = 0) {
  let flag = true;
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    let func = descriptor.value;
    func = async (...args: any[]) => {
      if (!flag) return;
      flag = false;
      try {
        func.apply(target, ...args);
      } catch (error) {
        console.log(error);
      }
      if (!limit) {
        flag = true;
        return;
      }
      setTimeout(() => {
        flag = true;
      }, limit);
    };
  };
}

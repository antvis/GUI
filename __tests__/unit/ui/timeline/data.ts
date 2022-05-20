import { Time } from '@antv/scale';

export const TIME_DATA = (() => {
  const scale = new Time({
    tickCount: 10,
    range: [0, 10],
    domain: [new Date(2000, 0, 1), new Date(2000, 0, 2)],
  });
  const formatter = scale.getFormatter();

  return scale.getTicks().map((d: any) => ({ date: formatter(d) }));
})();

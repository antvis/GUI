export const data = (len: number = 24) =>
  new Array(len).fill(0).map((tick, idx, arr) => {
    const step = 1 / arr.length;
    return { value: idx * step, label: `Text-${String(idx)}` };
  });

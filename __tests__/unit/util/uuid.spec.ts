import { uuid } from '../../../src/util';

describe('uuid', () => {
  it('default', () => {
    const uuid1 = uuid();
    const uuid2 = uuid();
    expect(uuid1).not.toBe(uuid2);
    expect(uuid1.length).toBe(36);
    expect(uuid2.length).toBe(36);
  });
});

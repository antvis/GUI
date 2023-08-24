import { Group, GroupStyleProps } from '@antv/g';

type GroupTest = (group: Group) => void;

export function it(test: GroupTest): () => Group;
export function it(options: GroupStyleProps, test: GroupTest): () => Group;
export function it(argv1: GroupTest | GroupStyleProps, argv2?: GroupTest) {
  return () => {
    const group = new Group();

    if (typeof argv1 === 'object') {
      group.attr(argv1);
      argv2?.(group);
    } else argv1(group);

    return group;
  };
}

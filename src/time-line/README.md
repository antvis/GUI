# desc

播放轴(TimeLine)

## options

配置项

```
/** 播放轴刻度值，必传 */
ticks: string[];
/** 播放速度，通过 单个tick 所需时间，非必传，默认值为 1 */
speed: number;
/** 默认初始刻度值，非必传，默认值为 ticks[0] */
defaultCurrentTick: string;
/** 是否循环播放，非必传，默认值为 false */
loop: boolean;
```

## usage

```
import { TimeLine } from '@antv/gui';

const timeLine = new TimeLine({
  x: 0,
  y: 0,
  width: 1000,
  height: 50,
  ticks: ['1800', '1801', '1802', '1803', '1804', '1805'],
  defaultCurrentTick: '1800',
  speed: 5,
});

// 监听播放轴开始
this.timeline.on('timelinestart', () => {
});

// 监听播放轴结束
this.timeline.on('timelineend', () => {
});

// 监听播放轴变化
this.timeline.on('timelinechange', () => {
});
```

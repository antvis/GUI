# desc

滚动条(ScrollBar)

## options

配置项

```
// 滚动条的布局，横向 | 纵向, 非必传，默认为 false(纵向)
isHorizontal: boolean;
// 滑道长度，必传
trackLen: number;
// 滑块长度，必传
thumbLen: number;
// 滑道的位置，必传
trackPosition: PointObject;
// 滑块的最小长度，非必传，默认值为 20
minThumbLen: number;
// 滑块相对滑道的偏移, 非必传，默认值为 0
thumbOffset: number;
// 滚动条样式，非必传
theme: ScrollBarTheme;
```

## usage

```
import { ScrollBar } from '@antv/gui';

// horizontal scrollBar
const hScrollBar = new ScrollBar({
    isHorizontal: true,
    trackLen: 300,
    thumbLen: 30,
    trackPosition: {x: 10, y: 180}
})

// vertical scrollBar
const vScrollBar = new ScrollBar({
    isHorizontal: false,
    trackLen: 300,
    thumbLen: 30,
    trackPosition: {x: 180, y: 10}
})

// scrollbar 实例监听 scrollchange 事件
hScrollBar.on('scrollchange', (obj) => {
    const thumbOffset = obj.thumbOffset;
    // do something
});

vScrollBar.on('scrollchange', (obj) => {
    const thumbOffset = obj.thumbOffset;
    // do something
})

// 外部 view 监听自身的 wheel 事件，调用 scrollBar 实例的 updateThumbOffset() 即可更新滑块位置
view.on('wheel', (newOffsetX, newOffsetY) => {
    hScrollBar.updateThumbOffset(newOffsetX);
    vScrollBar.updateThumbOffset(newOffsetY);
})
```

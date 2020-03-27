#### vue-rtmp-player组件使用说明
##### 安装
```
npm install vue-rtmp-player -save
npm install video.js@6.6.0 --save
npm install videojs-flash@2.1.0 --save
````
#### 使用
在引入页面中输入以下代码
```
import 'vue-rtmp-player/packages/src/css/custom-theme.css'
import vueRtmpPlayer from 'vue-rtmp-player/packages/index.js'
Vue.use(vueRtmpPlayer);
```
#### 引入中文语音
在引入页面中输入以下代码
```
import videojs from 'video.js'
import 'video.js/dist/lang/zh-CN'
```
还要在vue.config.js中增加以下配置
```
configureWebpack: {
    plugins: [
        new webpack.ProvidePlugin({
            'videojs': 'video.js'
        })
    ]
}
```


##### Attributes
|参数|说明|类型|默认值|示例|
|----|---|----|------|---|
|playsinline|移动端是否全屏|Boolean|false||
|height|播放器高度|String/Number|360||
|fluid|播放器是否按比例缩放以适应其容器，为true时，height不起作用|Boolean|false||
|aspectRatio| 播放器宽高比，设置时，height不起作用|String||16:9|
|language|设置播放器语音|tring|zh-CN||
|autoplay|是否自动播放|Boolean|true||
|muted|是否静音|Boolean|false||
|controls|是否显示控制栏|Boolean|true||
|src|地址|String||rtmp://58.200.131.2:1935/livetv/hunantv|
|notSupportedMessage|无法播放媒体源时显示的默认信息|String|此视频暂无法播放，请稍后再试||
|poster| 播放器封面|String|||
##### 方法
|方法名|说明|参数|
|-----|----|----|
| play | 播放 |  |
| pause | 暂停 |  |
| setHeight | 设置播放器高德 | 例如：300 |
| setVolume | 设置音量 | 0到1的值 |
| setSrc | 设置播放地址 |  |
| reset | 重置播放器 |  |
| dispose | 销毁播放器 |回调函数callback|
##### Events
| 事件名称 | 说明 | 回调参数 |
| -------- | -------- | -------- | 
| loadeddata | 播放 | player 播放器实例 |
| play | 播放 | player 播放器实例|
| pause | 暂停 | player 播放器实例|
| waiting | 等待 | player 播放器实例|
| playing | 播放中 |  player 播放器实例|
| error | 播放出错 |  player 播放器实例|
| timeupdate | 当前时间 | time |
| ready | 播放器就绪 | player 播放器实例|
| statechanged | 播放器状态改变 |  状态 |
- 【css】小程序不支持在css中使用本地文件，包括本地的背景图和字体文件。需以base64方式方可使用。App端在v3模式以前，也有相同限制。v3编译模式起支持直接使用本地背景图和字体。

- 【css】本地背景图片的引用路径推荐使用以 ~@ 开头的绝对路径。

  ```css
   .test2 {
       background-image: url('~@/static/logo.png');
   }
  ```

- 【尺寸】rpx不支持动态横竖屏切换计算，使用rpx建议锁定屏幕方

- 【es6支持】App端Android支持不依赖Android版本号，即便是Android4.4也是上表数据。因为uni-app的js代码运行在自带的独立jscore中，没有js的浏览器兼容性问题。uni-app的vue页面在Android低端机上只有css浏览器兼容性问题，因为vue页面仍然渲染在webview中，受Android版本影响，太新的css语法在低版本不支持。

- 监听 scroll-view 组件的滚动事件时，不要实时的改变 scroll-top/scroll-left 属性，因为监听滚动时，视图层向逻辑层通讯，改变 scroll-top/scroll-left 时，逻辑层又向视图层通讯，这样就可能造成通讯卡顿。

- 微信小程序端

  - 视频做的是全屏显示的视频，使用cover-view和cover-image对视频进行覆盖，不过，cover-view也有很多限制，像文字多行省略，这个没找到方式，单行的省略就直接用普通就可以了

  ```
  使用cover-view做三角形也是行不通的，但是你在开发者工具上是没有问题，能够正常显示的，所以，在cover-iew中，要想做三角形的效果，只能用图片来代替
  ```
# technology-sharing

> a technology-sharing web

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```


环境配置:

    1. vue 2.5+
    2. axios, Qs, vue-draggable-resizable, vue2-transitions   安装
    3. es6
    4. webpack 配置  resolve.extensions: ['.vue']  proxy代理正常



导入正确路径, 通话时执行 init() 方法, 参数传递如下:

rtc.init(
  obj, // 创建房间基本信息字段
  '/web/webrtc_room/get_login_info', // 获取腾讯云信息
  '/web/webrtc_room/create_room', // 本地服务器创建房间
  '/web/webrtc_room/heartbeat', // 心跳
  '/web/webrtc_room/remove_room', // 退出本地服务器房间
  heart, // 心跳回调 根据返回值查看视频过程
  eventcb, // 腾讯云服务器 发生事件回调    可不传
  1, // 是否需要混流    可不传
  '/web/webrtc/record/mixed', // 混流接口   可不传
);

rtc.js 和 view.webRtc.vue 必须同级存在

回调中状态码:

  1. 10001    远端流新增。 拉流成功
  2. 10003    远端流断开
  3. 10004    server 超时断开
  4. 5003     对方已拒绝
  5. 5010     对方网络异常


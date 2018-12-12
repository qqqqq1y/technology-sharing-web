<template>
  <div>
    <button @click="rtc">rtc</button>
  </div>
</template>

<script>
import rtc from '../../component/rtc/rtc';

export default {
  name: 'home',
  data() {
    return {

    };
  },
  methods: {
    rtc() {
      const obj = {
        accountId: 358,
        serviceId: 2465,
        toId: 422,
        username: 'qyt'
      };

      function heart(data) {
        console.log(data);
      }

      function eventcb(rs) {
        console.log(rs);
      }

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
    }
  }
};
</script>

<style lang="scss" scoped>

</style>

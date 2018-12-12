<template>
  <div id="call-container">
    <vue-draggable-resizable
      :w="400"
      :h="514"
      v-if="dragPanelX > 0"
      :x="dragPanelX"
      :y="dragPanelY"
      :z="1"
      class="drag-panels"
      :resizable="false"
      :parent="true">
      <scale-transition origin="top center">
        <div class="call-wrap">
          <div class="call-panel text-center">
            <p class="text-right text-normal">
              <i class="healthCare hc-close" @click="closeCall"></i>
            </p>
            <p class="avatar-name text-center">
              {{ username | firstName }}
            </p>
            <p class="full-name text-large text-center">
              {{ username }}
            </p>
            <p class="text-center font-large call-info" v-if="connect == 0">
              等待对方接受邀请<br />
              您的通话信息将会被录音
            </p>
            <p class="call-time text-center font-large" v-else>
              {{ calltime }}
            </p>
            <button primary class="call-btn" @click="closeCall">
              {{connect ? "结束" : "取消"}}
            </button>
          </div>
        </div>
      </scale-transition>
    </vue-draggable-resizable>

    <!-- <audio id="localVideo" class="rtc-voice" muted autoplay playsinline></audio> -->
    <!-- 远端视频流 -->
    <audio id="remoteVideo" class="rtc-voice" autoplay playsinline></audio>
  </div>

</template>

<script>
import VueDraggableResizable from 'vue-draggable-resizable';
import { ScaleTransition } from 'vue2-transitions';
import rtc from './rtc';

export default {
  name: 'CallPanel',
  components: {
    ScaleTransition,
    VueDraggableResizable
  },
  props: ['username'],
  data() {
    return {
      dragPanelX: 0,
      dragPanelY: 0,
      timer: null,
      calltime: null,
      second: 0,
      min: 0,
      connect: 0,
    };
  },
  mounted() {
    this.$on('connection', this.connection);

    const el = document.body;
    const elRect = el.getBoundingClientRect();
    this.dragPanelX = (elRect.width / 2) - 200;
    this.dragPanelY = (elRect.height / 2) - 218;
    setTimeout(() => {
      document.querySelector('.drag-panels').style.zIndex = 1002;
    }, 100);
  },
  methods: {
    closeCall() {
      this.connect = 0;

      rtc.quitRoom();
    },
    connection(val) {
      console.log(val);

      this.connect = val;
    },
    showtiming() {
      if (!this.connect) {
        return;
      }

      this.second++;
      if (this.second === 60) {
        this.min++;
        this.second = 0;
      }

      if (this.second < 10) {
        this.second = (Array(2).join(0) + this.second).slice(-2);
      }

      if (this.min < 10) {
        this.min = (Array(2).join(0) + this.min).slice(-2);
      }

      this.calltime = `${this.min}:${this.second}`;

      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.showtiming();
      }, 1000);
    }
  },
  filters: {
    firstName(val) {
      return val.substr(0, 1);
    }
  },
  watch: {
    connect(val) {
      if (val === 1) {
        this.showtiming();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  .rtc-voice {
    position: absolute;
    left: 100000px;
    right: 100000px;
    z-index: -1;
  }

  .call-wrap {
    border-radius: 4px;
    padding: 16px;
    background: yellow;
    background-size: 100% 100%;
    cursor: move;
    box-shadow: 0 8px 24px rgba(144, 147, 153, .2);
    height: 482px;
    z-index: 10002;
  }
  .call-panel {
    height: 100%;

    .healthCare {
      cursor: pointer;
    }

    .avatar-name {
      background: #B3E4F9;
      color: #FFF;
      width: 88px;
      height: 88px;
      line-height: 88px;
      border-radius: 50%;
      font-size:36px;
      margin: 0 auto;
      margin-top: 24px;
    }

    .full-name {
      font-size:28px;
      margin-top: 16px;
      line-height: 40px;
    }

    .call-info {
      line-height: 25px;
      margin: 100px 0 40px 0;
      color: #606266;
    }

    .call-time {
      color: #606266;
      margin: 124px 0 40px 0;
    }

    .call-btn {
      width: 200px;
      height: 40px;
      border-radius: 5px;
      border-color: #F43530;
      background: #F43530;
      color: #fff;
    }
  }
</style>

/**
 *
 * 过程：1、从服务器获取rtc信息
 *      2、init腾讯的api
 *      3、在服务器上创建房间
 *      4、在腾讯云服务器上创建房间，房间信息为服务器上创建好的房间
 *      5、创建成功后每隔一分钟向服务器发送一次心跳
 */

/* eslint-disable */

import axios from 'axios';
import Qs from 'qs';
import Vue from 'vue';
import rtcContainer from './view.rtc';

const rtc = {
  r_t_c: null,
  mixUrl: '',
  mixed: null,
  userId: null,
  timer: null,
  u1: null,
  u2: null,
  u3: null,
  u4: null,
  serviceObj: {},
  instance: null,
  heart: null,
  room_id: null,
  eventcb: null,
  mixedNum: 1,
  connect: 0, // 开始通话
  addScript() {
    const rtc_s = document.getElementById('rtc_Sc');

    if (rtc_s) {
      return;
    }

    const url = 'https://sqimg.qq.com/expert_qq/webrtc/2.4/WebRTCAPI.min.js';
    var oS = document.createElement('script');
    oS.src = url;
    oS.setAttribute('id', 'rtc_Sc');
    document.body.appendChild(oS);
  },
  addEle() {
    const callP = document.getElementById('call-container');

    if (callP) {
      this.removeEle(callP);
    }

    const callPanel = Vue.extend(rtcContainer);

    this.instance = new callPanel({
      propsData: {
        username: this.serviceObj.username
      }
    }).$mount();

    document.body.appendChild(this.instance.$el);
  },
  removeEle(ele) {
    document.body.removeChild(ele);
  },
  init(obj, u1, u2, u3, u4, heart, eventcb, isMixed = 0, u5 = '') {
    let istrue = false;

    istrue = typeof obj === 'object';

    const arr = new Set([u1, u2, u3, u4]);
    for(let x of arr) {
      istrue = typeof x === 'string';

      if (!istrue) {
        console.error('参数传递错误');

        return;
      };
    }

    this.u1 = u1;
    this.u2 = u2;
    this.u3 = u3;
    this.u4 = u4;
    this.heart = heart;
    this.serviceObj = {
      ...obj
    };

    if (isMixed === 1) {
      this.mixed = isMixed;
      this.mixUrl = u5;
    }

    this.addScript();
    this.addEle();

    const that = this;

    axios.post(u1, Qs.stringify({ accountId: obj.accountId })).then((res) => {
      this.userId = res.data.userID;

      const opt = {
        userId: res.data.userID,
        userSig: res.data.userSig,
        sdkAppId: res.data.sdkAppID,
        accountType: 29378,
        useCloud: 1 // 腾讯云 0 自研环境  1 云上环境
      };

      const RTC = that.create(opt);

      Object.keys(that.events).forEach((key) => {
        if (!eventcb) {
          that.eventcb = function (rs) {
            return rs.tip;
          };
        } else {
          that.eventcb = eventcb;
        }

        RTC.on(key, that.events[key]);
      });

      this.r_t_c = RTC;
    });
  },
  create(opt) {
    const self = this;

    const RTC = new WebRTCAPI(opt, function () {
      const params = {   // 创建本地服务器房间
        userID: opt.userId,
        nickName: `${opt.userId}_${Date.now()}_${self.serviceObj.toId}`,
        roomInfo: '自己人别开枪',
        roomType: 104,
        toId: self.serviceObj.toId,
        serviceId: self.serviceObj.serviceId
      };

      axios.post(self.u2, Qs.stringify(params)).then((res) => {
        const roomInfo = res.data;
        const createOpt = {   // 创建腾讯服务器房间
          roomid: roomInfo.roomID,
          role: 'user',
          privateMapKey: roomInfo.privateMapKey,
          pureAudioPushMod: 2
        };

        self.room_id = roomInfo.roomID;

        RTC.createRoom(createOpt, function() {
          console.log('创建房间');

          self.heartbeat();
        })
      });
    });

    return RTC;
  },
  heartbeat() {
    const params = {
      userID: this.userId,
      roomID: this.room_id
    };

    axios.post(this.u3, Qs.stringify(params)).then((res) => {
      console.log('心跳');

      this.heart(res.data);
      clearTimeout(this.timer);

      if (res.data.code > 1) {
        return;
      }

      this.timer = setTimeout(() => {
        this.heartbeat();
      }, 3000);
    });
  },
  events: {
    onRemoteStreamUpdate(data) { // 远端流 新增/更新
      if (data && data.stream) {
        document.querySelector('#remoteVideo').srcObject = data.stream;
      }

      if (rtc.mixed && rtc.mixedNum === 1) {
        setTimeout(() => {
          axios.post(rtc.mixUrl, Qs.stringify({ roomID: rtc.room_id })).then((res) => {
            rtc.mixedNum++;

            rtc.eventcb(res.data.tip);
          });
        }, 5500);
      }

      if (!rtc.connect) {
        rtc.connect = 1;
        rtc.instance.$emit('connection', rtc.connect);
      }

      const rs = {
        code: 10001,
        tip: 'update'
      };

      rtc.eventcb(rs);
    },
    onRemoteStreamRemove(data) { // 远端流断开
      const rs = {
        code: 10003,
        tip: 'end'
      };

      rtc.eventcb(rs);

      rtc.quitRoom();
    },
    onRelayTimeout(data) { //  server 超时断开
      const rs = {
        code: 10004,
        tip: 'timeout'
      };

      rtc.eventcb(rs);

      rtc.quitRoom();
    }
  },
  quitRoom() {
    this.r_t_c.quit();

    const params = {
      userID: this.serviceObj.toId,
      originType: 0
    };

    axios.post(this.u4, Qs.stringify(params)).then(() => {
      this.r_t_c = null;
      this.mixUrl = '';
      this.mixed = null;
      this.userId = null;
      this.timer = null;
      this.u1 = null;
      this.u2 = null;
      this.u3 = null;
      this.u4 = null;
      this.serviceObj = {};
      this.instance = null;
      this.heart = null;
      this.room_id = null;
      this.eventcb = null;
      this.mixedNum = 1;
      this.connect = 0;
    });

    const callP = document.getElementById('call-container');

    this.removeEle(callP);
  },
  enforceQuitRoom() { // 暂时保留

  }
};

export default rtc;

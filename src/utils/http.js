import axios from 'axios';
import Qs from 'qs';

const instance = axios.create({
  baseURL: '', // 接口公共部分
  withCredentials: true,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
});

instance.interceptors.response.use(function (response) {
  // 请求回来之前做什么

  return response.data;
}, function (error) {
  return Promise.reject(error);
});

instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么

  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

export default {
  get(url, params) {
    return instance.get(
      url, { params }
    ).then(rs => (rs));
  },
  post(url, data) {
    return instance.post(
      url, Qs.stringify(data)
    ).then(rs => (rs));
  },
  put(url, data) {
    return instance.put(
      url, Qs.stringify(data)
    ).then(rs => (rs));
  },
  delete(url, params) {
    return instance.delete(
      url, { params }
    ).then(rs => (rs));
  }
};

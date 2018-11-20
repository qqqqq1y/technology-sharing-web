import Vue from 'vue';
import ElementUI from 'element-ui';
import App from './App';
import router from './router';

import './styles/index.scss';
import * as components from './component/index';

Vue.config.productionTip = false;

Vue.use(ElementUI);

Object.keys(components).forEach((key) => {
  Vue.component(key, components[key]);
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');

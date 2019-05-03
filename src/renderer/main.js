import Vue from 'vue';
import axios from 'axios';
import VueKonva from 'vue-konva';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';


import App from './App';
import store from './store';

Vue.use(VueKonva);
Vue.use(Vuetify, {
  iconfont: 'mdi',
});

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  components: { App },
  store,
  template: '<App/>',
}).$mount('#app');

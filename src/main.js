import { createApp } from 'vue'
import App from './App.vue'
import Antd from "ant-design-vue";
import vSelect from 'vue-select';
import { VueReCaptcha } from "vue-recaptcha-v3";
import VueMobileDetection from "vue-mobile-detection";
import "ant-design-vue/dist/reset.css";
import 'vue-select/dist/vue-select.css';

import router from "./js/router";


const app = createApp(App);
app.component('v-select', vSelect)
app.use(Antd);
app.use(VueMobileDetection);
app.use(VueReCaptcha, { siteKey: "6LesDnYiAAAAAGn--ho0x_GJvenWu-Nv0ls5cJYO" });
app.use(router)
app.mount('#app')

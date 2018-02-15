// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import('../node_modules/vuetify/dist/vuetify.min.css') // Ensure you are using css-loader
import VueLocalStorage from 'vue-localstorage'
import money from 'v-money'
import Vuex from 'vuex'

Vue.use(Vuex);
Vue.use(VueLocalStorage);
Vue.use(Vuetify);
Vue.use(money, {precision: 4});


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

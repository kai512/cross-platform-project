// main.js
import Vue from 'vue'
import App from './App'
import store from './store'
import lw from "linewell-api"
Vue.prototype.$store = store

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})

Vue.use(lw)

app.$mount(); //为了兼容小程序及app端必须这样写才有效果
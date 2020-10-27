import Vue from 'vue'
import Vuex from 'vuex'

// import createPersistedState from "vuex-persistedstate"
Vue.use(Vuex)

const files = require.context('./module', false, /\.js$/)
const modules = {}

files.keys().forEach(key => {
  	const item = files(key).default
  	modules[key.substring(key.indexOf("\/")+1, key.lastIndexOf("."))] = item;
})

export default new Vuex.Store({
	// plugins: [createPersistedState()],
	state: {
		//
	},
	mutations: {
		//
	},
	actions: {
		//
	},
	modules: {
		...modules
	}
})
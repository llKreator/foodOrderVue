import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

var config = {
  apiKey: 'AIzaSyBQND1ifat3N_SiGRBPYP56K4LGdTMBIfQ',
  authDomain: 'r-r-f-1cd22.firebaseapp.com',
  databaseURL: 'https://r-r-f-1cd22.firebaseio.com',
  projectId: 'r-r-f-1cd22',
  storageBucket: 'r-r-f-1cd22.appspot.com',
  messagingSenderId: '958793948311'
}
firebase.initializeApp(config)
let database = firebase.database()

export const store = new Vuex.Store({
  state: {
    shops: {},
    cart: [],
    orders: {}
  },
  mutations: {
    defaultSetShops (state, payload) {
      state.shops = payload.shops
    },
    toCart (state, payload) {
      state.cart.push(payload)
    }
  },
  actions: {
    async defaultSetShops ({commit}) {
      commit('defaultSetShops', await database.ref('/').once('value').then(snapshot => snapshot.val()))
    }
  },
  getters: {
    modalList: state => {
      return state.cart
    }
  }
})

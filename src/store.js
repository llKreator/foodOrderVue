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
    orders: {},
    client: {}
  },
  mutations: {
    defaultSetShops (state, payload) {
      state.shops = payload.shops
    },
    toCart (state, payload) {
      state.cart.push(payload)
    },
    delFromCart (state, index) {
      state.cart.splice(index, 1)
    },
    authenticate (state, client) {
      state.client = {...client}
    }
    // buy (state) {
    //   const newOrderKey = firebase.database().ref('/TESTIRUU').child('orders').push().key
    //   let addOrder = {}
    //   addOrder['/TESTIRUU/orders/' + newOrderKey] = order
    //   firebase.database().ref().update(addOrder)
    // }
  },
  actions: {
    async defaultSetShops ({ commit }) {
      commit(
        'defaultSetShops',
        await database
          .ref('/')
          .once('value')
          .then(snapshot => snapshot.val())
      )
    },
    async auth ({commit}) {
      const provider = new firebase.auth.GoogleAuthProvider()
      provider.setCustomParameters({
        'login_hint': 'user@example.com'
      })
      let temp = null
      await firebase.auth().signInWithPopup(provider).then(function (result) {
        temp = { name: result.user.displayName, email: result.user.email, admin: result.user.email === 'moj@email.com' }
      })
      commit('authenticate', temp)
    }
  },
  getters: {
    modalList: state => {
      return state.cart
    }
  }
})

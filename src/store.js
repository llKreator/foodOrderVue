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
    orders: [],
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
      state.client = { ...client }
    },
    signOut (state) {
      firebase.auth().signOut()
      state.client = {}
    },
    buy (state) {
      const newOrderKey = firebase
        .database()
        .ref('/')
        .child('orders')
        .push().key
      const addOrder = {
        ['/orders/' + newOrderKey]: {
          client: { name: state.client.name, email: state.client.email },
          products: [...state.cart]
        }
      }
      firebase
        .database()
        .ref()
        .update(addOrder)
      state.cart = []
    },
    setDefaultOrders (state, orders) {
      for (let i in orders) {
        state.orders.push({id: i, client: orders[i].client, products: orders[i].products})
      }
    },
    deleteOrder (state, id) {
      const delOrder = {['/orders/' + id]: null}
      firebase.database().ref().update(delOrder)
      state.orders.splice(state.orders.indexOf(id), 1)
    }
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

    async auth ({ dispatch, commit }) {
      const provider = new firebase.auth.GoogleAuthProvider()
      provider.setCustomParameters({
        login_hint: 'user@example.com'
      })
      let temp = null
      await firebase
        .auth()
        .signInWithPopup(provider)
        .then(function (result) {
          temp = {
            name: result.user.displayName,
            email: result.user.email,
            admin: result.user.email === 'adobrohval@gmail.com'
          }
        }).then(() => {
          if (temp.admin) {
            return dispatch('getOrdersFromDB')
          }
        })
      commit('authenticate', temp)
    },

    async getOrdersFromDB ({commit}) {
      const orders = await firebase.database().ref('/').once('value').then(snapshot => snapshot.val().orders)
      commit('setDefaultOrders', orders)
    }
  },
  getters: {
    modalList: state => {
      if (state.client.admin) {
        return state.orders
      } else if (!state.client.admin && state.client.admin !== undefined) {
        return state.cart
      }
    },
    cartIsEmpty: state => {
      return Boolean(state.cart.length)
    }
  }
})

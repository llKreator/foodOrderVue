<template>
  <div>
    <v-btn @click="sInOut()" color="primary">{{signInOut}}</v-btn>
    <div class="header">Welcome to Food Delivery{{clientName}}
      <v-btn @click="openCartOrOrders()" color="primary">{{wordOrdersOrCart}}</v-btn>
    </div>
    <div class="shops">
      <v-expansion-panel>
        <v-layout row wrap justify-around>
          <v-flex xs3 v-for="(shop, index) in shops" :key="index">
            <v-expansion-panel-content>
              <div slot="header"><img width='300' height="300" :src="shop[0]" alt="">
              </div>
              <v-card>
                <v-card-text v-for="(product, index) in shop.slice(1)" class="grey lighten-3" :key="index">
                  {{product}}
                  <v-btn v-if="isSignedIn && ! isAdmin" color="success" @click="toCart(product)">To cart</v-btn>
                </v-card-text>
              </v-card>
              <v-btn v-if="!client" color="primary">edit</v-btn>
            </v-expansion-panel-content>
          </v-flex>
        </v-layout>
      </v-expansion-panel>
    </div>
    <!-- CART -->
    <v-dialog v-model="showCart" transition="dialog-bottom-transition" max-width="500px">
      <div class="modalTitle">{{wordOrdersOrCart}}</div>
      <v-card>
        <v-card-text v-for="(product, index) in modalList" :key="index">
          {{product}}
          <v-btn @click="delFromCart(index)" color="warning">Delete</v-btn>
        </v-card-text>
      </v-card>
      <v-btn v-if="isSignedIn && !isAdmin" @click="buy()" color="primary">Buy</v-btn>
    </v-dialog>
    <!-- ORDERS -->
    <v-dialog v-model="showOrders" transition="dialog-bottom-transition" max-width="500px">
      <div class="modalTitle">{{wordOrdersOrCart}}</div>
      <div v-for="(order, index) in modalList" :key="index">
        <v-expansion-panel>
          <v-expansion-panel-content>
            <div slot="header">
              <div v-if="showOrders" class="orderClientInfo">{{`${order.client.name} (${order.client.email})`}}</div>
            </div>
            <v-card>
              <v-card-text v-for="(product, index) in order.products" :key="index">
                {{product}}
              </v-card-text>
            </v-card>
            <v-btn @click="orderConfirmDelete = true; orderToDel=order.id" color="primary">Completed</v-btn>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </div>
    </v-dialog>
    <v-dialog v-model="orderConfirmDelete">
      <v-btn @click="orderDelete()" color="primary">Confirm</v-btn>
    </v-dialog>
        <v-btn v-if="isAdmin" @click="showAddShop = true" fab dark color="indigo">
          <v-icon dark>add</v-icon>
        </v-btn>
    <v-dialog v-model="showAddShop">
      <add-and-edit-shop></add-and-edit-shop>
    </v-dialog>
  </div>
</template>

<script>
import AddAndEditShop from './addAndEditShop.vue'

export default {
  data () {
    return {
      shops: {},
      client: true,
      showCart: false,
      showOrders: false,
      orderConfirmDelete: false,
      orderToDel: null,
      showAddShop: false
    }
  },
  components: {
    AddAndEditShop
  },
  computed: {
    modalList: function () {
      return this.$store.getters.modalList
    },
    clientName: function () {
      return (
        ', ' +
        (this.$store.state.client.name
          ? this.$store.state.client.name
          : 'guest')
      )
    },
    signInOut: function () {
      return this.$store.state.client.name ? 'Sign out' : 'Sign in'
    },
    isAdmin: function () {
      return this.$store.state.client.admin
    },
    isSignedIn: function () {
      return Boolean(this.$store.state.client.name)
    },
    wordOrdersOrCart: function () {
      return this.isAdmin ? 'Orders' : 'Cart'
    }
  },
  methods: {
    toCart (product) {
      this.$store.commit('toCart', product)
    },
    delFromCart (index) {
      this.$store.commit('delFromCart', index)
    },
    buy () {
      try {
        if (!this.$store.getters.cartIsEmpty) {
          throw new Error("Can't buy with empty cart")
        }
        this.$store.commit('buy')
        this.showCart = false
      } catch (error) {
        alert(error.message)
      }
    },
    sInOut () {
      this.$store.state.client.name
        ? this.$store.commit('signOut')
        : this.$store.dispatch('auth')
    },
    openCartOrOrders () {
      if (this.isAdmin) {
        this.showOrders = true
      } else if (!this.isAdmin && this.isAdmin !== undefined) {
        this.showCart = true
      }
    },
    orderDelete () {
      this.$store.commit('deleteOrder', this.orderToDel)
    }
  },

  mounted () {
    this.$store.dispatch('defaultSetShops').then(() => {
      this.shops = this.$store.state.shops
    })
    this.$store.dispatch('auth')
  }
}
</script>

<style scoped>
.header {
  height: 100px;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
}
.modalTitle {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: white;
}
</style>
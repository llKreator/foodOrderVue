<template>
    <div>
        <div class="header">Welcome to Food Delivery{{clientName}}
            <v-btn @click="modal = !modal" color="primary">{{showOrdersOrCart}}</v-btn>
        </div>
        <div class="shops">
            <v-expansion-panel>
                <v-layout row wrap justify-around>
                    <v-flex xs3 v-for="(shop, index) in shops" :key="index">
                        <v-expansion-panel-content>
                            <div slot="header"><img width='300' height="300" :src="shop[0]" alt="">
                                <v-btn v-if="!client" color="warning">delete</v-btn>
                            </div>
                            <v-card>
                                <v-card-text v-for="(product, index) in shop.slice(1)" class="grey lighten-3" :key="index">
                                    {{product}}
                                    <v-btn v-if="client" color="success" @click="toCart(product)">To cart</v-btn>
                                </v-card-text>
                            </v-card>
                            <v-btn v-if="!client" color="primary">edit</v-btn>
                        </v-expansion-panel-content>
                    </v-flex>
                </v-layout>
            </v-expansion-panel>
        </div>
        <v-dialog v-model="modal" transition="dialog-bottom-transition" max-width="500px">
            <div class="modalTitle">{{modalTitle}}</div>
            <div v-for="(product, index) in modalList" :key="index">{{product}}
                <v-btn @click="delFromCart(index)" color="warning">Delete</v-btn>
            </div>
            <v-btn @click="buy()" color="primary"></v-btn>
        </v-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      shops: {},
      showOrdersOrCart: 'Open Cart',
      client: true,
      modal: false,
      modalTitle: 'Cart'
    }
  },
  computed: {
    modalList: function () {
      return this.$store.getters.modalList
    },
    clientName: function () {
      return ', ' + (this.$store.state.client.name ? this.$store.state.client.name : 'guest')
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
      this.$store.commit('buy')
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
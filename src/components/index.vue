<template>
    <div>
        <div class="header">Food Order
            <v-btn @click="modal = !modal" color="primary">{{showOrdersOrCart}}</v-btn>
        </div>
        <div class="shops">
            <v-expansion-panel>
                <v-layout row wrap justify-around>
                    <v-flex xs4 v-for="(shop, index) in shops" :key="index">
                        <v-expansion-panel-content>
                            <div slot="header"><img width='400' height="400" :src="shop[0]" alt="">
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
                <v-btn @click="delFromCart" color="warning">Delete</v-btn>
            </div>
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
    }
  },
  methods: {
    toCart (product) {
      this.$store.commit('toCart', product)
    }
  },
  delFromCart () {

  },
  mounted () {
    this.$store.dispatch('defaultSetShops').then(() => {
      this.shops = this.$store.state.shops
    })
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
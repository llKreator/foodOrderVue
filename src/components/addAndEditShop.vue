<template>
    <div>

        <v-card>
            <v-container>
                <v-form v-model="valid" ref="form" lazy-validation>
                    <v-text-field :rules="rule" v-model="shopName" label="Shop name" required> </v-text-field>
                    <v-text-field :rules="rule" v-model="imgLink" label="Image link" required></v-text-field>
                    <v-layout no-wrap v-for="(product, index) in products" :key="index">
                        <v-text-field :rules="rule" label="Product" v-model="product.product"></v-text-field>
                        <v-btn @click="products.splice(index,1)" dark color="orange">Delete</v-btn>
                    </v-layout>
                    <v-btn @click="products.push({input: ''})" dark color="indigo">Add product</v-btn>
                    <v-btn @click="done" :disabled="!valid" dark color="green">Done</v-btn>
                </v-form>
            </v-container>
        </v-card>

    </div>
</template>

<script>
export default {
  name: "AddAndEditShop",
  props: ['closeModal', 'shopToEdit'],
  data() {
    return {
      valid: true,
      products: [{ product: "" }],
      shopName: '',
      imgLink: '',
      rule: [
        (v) => !!v || 'required to fill'
      ],
    };
  },
  computed: {},
  methods: {
      done(){
          if(this.$refs.form.validate()){
              this.$store.commit('addShop', {name: this.shopName, products: [{product: this.imgLink}, ...this.products]})
              this.$emit('closeModal')
          }
      }
  },
//   updated(){
//       alert(this.shopToEdit)
//   } try watcher or computed
};
</script>

<style scoped>

</style>
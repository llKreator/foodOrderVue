<template>
    <div>
        <v-card>
            <v-form v-model="valid">
                <v-text-field label="Shop name" required> </v-text-field>
                <v-text-field label="Image link" required></v-text-field>
                <v-text-field label="Product" required></v-text-field>
            </v-form>
        </v-card>
    </div>
</template>

<script>
export default {
  name: 'AddAndEditShop',
  data () {
    return {
      valid: true
    }
  }
}
</script>

<style scoped>

</style>
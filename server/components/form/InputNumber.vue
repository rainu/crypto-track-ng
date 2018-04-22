<template>
  <input type="text" class="form-control" v-model="rawInput" />
</template>

<script>
  import {mapState} from 'vuex';
  import numeral from 'numeral'
  import 'numeral/locales'

  export default {
    props:{
      value: {
        default: null,
        required: true,
      }
    },
    name: "input-number",
    data() {
      return {
        rawInput: numeral(this.value).format()
      }
    },
    computed:{
      ...mapState({
        locale: state => state.i18n.locale,
      })
    },
    watch: {
      locale(){
        numeral.locale(this.locale)
      },
      rawInput(){
        let number = numeral(this.rawInput).value()
        this.$emit('input', number)
      }
    },
    mounted(){
      numeral.locale(this.locale)
    }
  }
</script>

<style scoped>

</style>

<template>
  <input type="text" class="form-control" v-model="input" />
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
      },
      numberFormat: {
        default: '0.00',
        required: false,
      }
    },
    name: "input-number",
    data() {
      return {}
    },
    computed:{
      ...mapState({
        locale: state => state.i18n.locale,
      }),
      input: {
        get(){
          numeral.locale(this.locale)
          return numeral(this.value).format(this.numberFormat)
        },
        set(rawInput){
          numeral.locale(this.locale)
          this.$emit('input', numeral(rawInput).value())
        }
      }
    },
  }
</script>

<style scoped>

</style>

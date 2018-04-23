<template>
  <span>
    {{displayAmount}} <icon-currency :currency="currency" />
  </span>
</template>

<script>
  import {mapState} from 'vuex';
  import * as currencies from '../../../common/currencies'
  import numeral from 'numeral'

  export default {
    props: {
      amount: {
        type: Number,
      },
      currency: {
        type: Object,
      },
    },
    data(){
      return {
      }
    },
    computed: {
      ...mapState({
        locale: state => state.i18n.locale,
      }),
      displayAmount(){
        if(!this.amount){
          return null;
        }

        let format = '0.00'
        if(this.currency && this.currency.name) {
          format = currencies[this.currency.type][this.currency.name].format.numeral
        }

        numeral.locale(this.locale)
        return numeral(this.amount).format(format)
      }
    }
  }
</script>

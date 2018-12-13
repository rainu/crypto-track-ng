<template>
  <span class="word-wrap">
    {{displayAmount}} <icon-currency :currency="currency" />
  </span>
</template>

<script>
  import {mapState} from 'vuex';
  import currencies from '../../../common/currencies'
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
          return "0";
        }

        let format = '0.00'
        if(this.currency && this.currency.name) {
          format = currencies[this.currency.type][this.currency.name].format.numeral
        }

        numeral.locale(this.locale)
        let dAmount = numeral(this.amount).format(format)

        if(dAmount === "NaN") {
          dAmount = "0"
        }

        return dAmount;
      }
    }
  }
</script>

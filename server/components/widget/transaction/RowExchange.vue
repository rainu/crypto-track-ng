<template>
  <tr>
    <!-- TYPE -->
    <td>
      <i class="fa fa-shopping-cart" :title="$t('transaction.exchange.title')"></i>
    </td>
    <!-- DATE -->
    <td>{{ldate(tx.date)}}</td>
    <!-- INCOME -->
    <td>
      <currency-amount :amount="tx.data.buy.amount" :currency="tx.data.buy.currency" class="pull-right"/> <br />
      <strong>{{wallet(tx.data.buy.wallet).name}}</strong>
    </td>
    <!-- OUTCOME -->
    <td>
      <currency-amount :amount="tx.data.sell.amount" :currency="tx.data.sell.currency" class="pull-right"/> <br />
      <strong>{{wallet(tx.data.sell.wallet).name}}</strong>
    </td>
    <!-- FEE -->
    <td>
      <template v-if="tx.data.fee.amount">
        <currency-amount :amount="tx.data.fee.amount" :currency="tx.data.fee.currency" class="pull-right"/> <br />
        <strong>{{wallet(tx.data.fee.wallet).name}}</strong>
      </template>
    </td>
    <!-- ACTIONS -->
    <td>
      <slot v-bind:tx="tx"></slot>
    </td>
  </tr>
</template>

<script>
  import moment from 'moment'
  import {mapGetters} from 'vuex';

  export default {
    props:{
      tx: {
        required: true,
        type: Object,
      }
    },
    data(){
      return {
      }
    },
    computed: {
      ...mapGetters({
        wallet: 'wallet/byId'
      }),
    },
    methods: {
      ldate(date){
        return moment(date).format(this.$t('common.datetime.format'))
      },
    }
  }
</script>

<style scoped>
</style>

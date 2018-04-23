<template>
  <tr>
    <!-- TYPE -->
    <td>
      <i class="fa fa-exchange" :title="$t('transaction.transfer.title')"></i>
    </td>
    <!-- DATE -->
    <td>{{ldate(tx.date)}}</td>
    <!-- INCOME -->
    <td>
      <currency-amount :amount="tx.data.amount" :currency="tx.data.currency" class="pull-right"/><br />
      <strong>{{wallet(tx.data.in.wallet).name}}</strong>
    </td>
    <!-- OUTCOME -->
    <td>
      <currency-amount :amount="tx.data.amount" :currency="tx.data.currency" class="pull-right"/><br />
      <strong>{{wallet(tx.data.out.wallet).name}}</strong>
    </td>
    <!-- FEE -->
    <td>
      <currency-amount :amount="tx.data.fee.amount" :currency="tx.data.fee.currency" class="pull-right"/><br />
      <strong>{{wallet(tx.data.fee.wallet).name}}</strong>
    </td>
    <!-- ACTIONS -->
    <td>
      <slot v-bind:tx="tx"></slot>
    </td>
  </tr>
</template>

<script>
  import {mapGetters} from 'vuex';
  import moment from 'moment'

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

<template>
  <tr>
    <!-- TYPE -->
    <td>
      <i class="fa fa-level-up" :title="$t('transaction.spent.title')"></i>
    </td>
    <!-- DATE -->
    <td>{{ldate(tx.date)}}</td>
    <!-- INCOME -->
    <td></td>
    <!-- OUTCOME -->
    <td>
      <currency-amount :amount="tx.data.out.amount" :currency="tx.data.out.currency" class="pull-right"/><br />
      <strong>{{wallet(tx.data.out.wallet).name}}</strong>
    </td>
    <!-- FEE -->
    <td>
      <template v-if="tx.data.fee.amount">
        <currency-amount :amount="tx.data.fee.amount" :currency="tx.data.fee.currency" class="pull-right"/><br />
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

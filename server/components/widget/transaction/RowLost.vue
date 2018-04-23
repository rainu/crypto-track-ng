<template>
  <tr>
    <!-- TYPE -->
    <td>
      <i class="fa fa-trash-o" :title="$t('transaction.lost.title')"></i>
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
    <td></td>
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

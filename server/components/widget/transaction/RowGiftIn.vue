<template>
  <tr>
    <!-- TYPE -->
    <td>
      <i class="fa fa-gift" :title="$t('transaction.gift.in')"></i>
    </td>
    <!-- DATE -->
    <td>{{ldate(tx.date)}}</td>
    <!-- INCOME -->
    <td>
      <cell-amount :data="tx.data.in"></cell-amount>
    </td>
    <!-- OUTCOME -->
    <td>

    </td>
    <!-- FEE -->
    <td>
      <cell-fee :fees="tx.data.fee"></cell-fee>
    </td>
    <!-- ACTIONS -->
    <td>
      <slot v-bind:tx="tx"></slot>
    </td>
  </tr>
</template>

<script>
  import moment from 'moment'
  import CellFee from "./CellFee";
  import CellAmount from "./CellAmount";

  export default {
    components: {CellAmount, CellFee},
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
    methods: {
      ldate(date){
        return moment(date).format(this.$t('common.datetime.format'))
      },
    }
  }
</script>

<style scoped>
</style>

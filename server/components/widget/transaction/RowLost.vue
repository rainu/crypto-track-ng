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
      <cell-amount :data="tx.data.out"></cell-amount>
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
  import moment from 'moment'
  import CellAmount from "./CellAmount";

  export default {
    components: {CellAmount},
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

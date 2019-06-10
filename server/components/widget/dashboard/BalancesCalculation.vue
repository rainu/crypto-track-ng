<template>
  <button class="btn btn-block btn-primary" @click="recalcHistoricalBalances">
    {{$t('widget.balance-by-day-chart.recalculation.action', {state: balanceCalcState})}}
  </button>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: "BalancesCalculation",
    props: {
      from: {
        type: Date,
        required: false,
        default: null
      },
      until: {
        type: Date,
        required: false,
        default: null
      },
    },
    data(){
      return {
        balanceCalcState: ''
      }
    },
    computed: {
      ...mapState({
        transactions: state => state.transaction.transactions
      }),
    },
    methods: {
      recalcHistoricalBalances(){
        this.balanceCalcState = this.$t('widget.balance-by-day-chart.recalculation.state.doing')
        this.$webworker.balance.calcHistoricalBalances(this.transactions, {name: "EUR", type: "fiat"}, this.from, this.until)
          .then(() => {
            this.balanceCalcState = this.$t('widget.balance-by-day-chart.recalculation.state.done')
          }, (err) => {
            console.log("Calculation of total balances failed: ", err)
            this.balanceCalcState = this.$t('widget.balance-by-day-chart.recalculation.state.error')
          })
      },
    },
  }
</script>

<style scoped>

</style>

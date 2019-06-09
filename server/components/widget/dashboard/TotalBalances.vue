<template>
  <div>
    <div>
      <button class="btn btn-primary" @click="recalcHistoricalBalances">Berechnung</button>
      <span>{{balanceCalcState}}</span>
    </div>

    <div class="row" v-for="coin in balances">
      <div class="col-xs-6">
        <currency-amount :amount="coin.amount" :currency="coin.currency" />
      </div>
      <div class="col-xs-6">
        <currency-amount :amount="coin.counterValue.amount" :currency="coin.counterValue.currency" />
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex';

  export default {
    name: "TotalBalances",
    props: {
      counterValue: {
        type: Object,
        required: false,
        default() {
          return {
            name: "EUR",
            type: "fiat"
          }
        },
      },
    },
    data(){
      return {
        balanceCalcState: '-',
        balances: []
      }
    },
    computed: {
      ...mapState({
        tickerState: state => state.course.syncStates.ticker,
        transactions: state => state.transaction.transactions
      }),
      ...mapGetters({
        totalBalances: 'wallet/totalBalances'
      }),
    },
    methods: {
      ...mapActions({
        getTotalTickerBalanceFor: 'course/getTotalTickerBalanceFor'
      }),
      recalcHistoricalBalances(){
        this.balanceCalcState = 'calculating...'
        this.$webworker.balance.calcHistoricalBalances(this.transactions, {name: "EUR", type: "fiat"}, null, null)
          .then(() => {
            this.balanceCalcState = 'done'
          }, (err) => {
            console.log("Calculation of total balances failed: ", err)
            this.balanceCalcState = 'failed'
          })
      },
    },
    watch: {
      tickerState(){
        this.getTotalTickerBalanceFor(this.counterValue)
          .then((balances) => this.balances = balances)
      },
      totalBalances(){
        this.getTotalTickerBalanceFor(this.counterValue)
          .then((balances) => this.balances = balances)
      }
    },
    mounted(){
      this.getTotalTickerBalanceFor(this.counterValue)
        .then((balances) => this.balances = balances)
    }
  }
</script>

<style scoped>

</style>

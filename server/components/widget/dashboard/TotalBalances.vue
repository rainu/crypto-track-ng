<template>
  <div>
    <div class="row">
      <div class="col-xs-12" >
        <div class="info-box">
          <span class="info-box-icon bg-aqua"><i class="fa fa-pie-chart"></i></span>
          <div class="info-box-content">
            <span>
              {{$t('widget.total-balances.crypto-value')}}:
              <currency-amount :amount="cryptoValue" :currency="counterValue" />
            </span>
            <br />
            <span>
              {{$t('widget.total-balances.account-value')}}:
              <currency-amount :amount="accountValue" :currency="counterValue" />
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-6 col-xs-12" v-for="coin in sortedBalances" >
        <div class="info-box">
          <span class="info-box-icon bg-aqua">
            <currency-icon :currency="coin.currency" />
          </span>
          <div class="info-box-content">
            <currency-amount :amount="coin.amount" :currency="coin.currency" />
            <template v-if="coin.currency.name !== coin.counterValue.currency.name || coin.currency.type !== coin.counterValue.currency.type">
              <br />
              <currency-amount :amount="coin.counterValue.amount" :currency="coin.counterValue.currency" />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex';
  import CurrencyIcon from "../CurrencyIcon";

  export default {
    name: "TotalBalances",
    components: {CurrencyIcon},
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
      sortedBalances() {
        let sorted = [...this.balances]
        sorted.sort((b1, b2) => b1.counterValue.amount > b2.counterValue.amount ? -1 : 1)

        return sorted
      },
      accountValue() {
        let counterAmounts = this.balances
          .map(b => b.counterValue.amount)

        if(!counterAmounts || counterAmounts.length <= 0) return 0
        return counterAmounts.reduce((a1, a2) => a1 + a2)
      },
      cryptoValue() {
        let cryptoAmounts = this.balances
          .filter(b => b.currency.type === 'crypto')
          .map(b => b.counterValue.amount)

        if(!cryptoAmounts || cryptoAmounts.length <= 0) return 0
        return cryptoAmounts.reduce((a1, a2) => a1 + a2)
      }
    },
    methods: {
      ...mapActions({
        getTotalTickerBalanceFor: 'course/getTotalTickerBalanceFor'
      }),
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

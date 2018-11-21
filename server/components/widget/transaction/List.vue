<template>
  <div>
    <template v-for="tx in transactionView">
      <card-donation v-if="tx.type === 'donation'" :tx="tx"><slot v-bind:tx="tx"></slot></card-donation>
      <card-exchange v-else-if="tx.type === 'exchange'" :tx="tx"><slot v-bind:tx="tx"></slot></card-exchange>
      <card-gift-in v-else-if="tx.type === 'giftIn'" :tx="tx"><slot v-bind:tx="tx"></slot></card-gift-in>
      <card-gift-out v-else-if="tx.type === 'giftOut'" :tx="tx"><slot v-bind:tx="tx"></slot></card-gift-out>
      <card-income v-else-if="tx.type === 'income'" :tx="tx"><slot v-bind:tx="tx"></slot></card-income>
      <card-lost v-else-if="tx.type === 'lost'" :tx="tx"><slot v-bind:tx="tx"></slot></card-lost>
      <card-spent v-else-if="tx.type === 'spent'" :tx="tx"><slot v-bind:tx="tx"></slot></card-spent>
      <card-stolen v-else-if="tx.type === 'stolen'" :tx="tx"><slot v-bind:tx="tx"></slot></card-stolen>
      <card-transfer v-else-if="tx.type === 'transfer'" :tx="tx"><slot v-bind:tx="tx"></slot></card-transfer>
    </template>
  </div>
</template>

<script>
  import moment from 'moment'
  import { mapState, mapGetters } from 'vuex';
  import CardExchange from "./CardExchange";
  import CardDonation from "./CardDonation";
  import CardGiftIn from "./CardGiftIn";
  import CardGiftOut from "./CardGiftOut";
  import CardIncome from "./CardIncome";
  import CardLost from "./CardLost";
  import CardSpent from "./CardSpent";
  import CardStolen from "./CardStolen";
  import CardTransfer from "./CardTransfer";

  export default {
    components: {
      CardTransfer, CardStolen, CardSpent, CardLost, CardIncome, CardGiftOut, CardGiftIn, CardDonation, CardExchange
    },
    data(){
      return {
        deleteRequest: null,
      }
    },
    computed: {
      ...mapState({
        transactions: state => state.transaction.transactions,
      }),
      ...mapGetters({
        wallet: 'wallet/byId'
      }),
      transactionView(){
        let tx = [...this.transactions]
        tx.sort((a, b) => new Date(a.date) - new Date(b.date))

        return tx
        // let a = []
        // for (let i = 0; i < 10; i++) {
        //   a.push(...this.transactions)
        // }
        //
        // return a;
      }
    },
    methods: {
      walletName(wId) {
        let wallet = this.wallet(wId);
        if (wallet) {
          return wallet.name
        }
        return ""
      },
      ldate(date){
        return moment(date).format(this.$t('common.datetime.format'))
      },
    }
  }
</script>

<style scoped>
</style>

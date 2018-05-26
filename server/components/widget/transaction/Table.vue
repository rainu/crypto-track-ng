<template>
  <table class="table table-striped table-bordered table-condensed" width="100%">
    <thead>
    <tr>
      <th width="5%"></th>
      <th width="10%">{{$t('transaction.common.date')}}</th>
      <th>{{$t('transaction.type.in')}}</th>
      <th>{{$t('transaction.type.out')}}</th>
      <th>{{$t('transaction.common.fee.title')}}</th>
      <th width="5%"></th>
    </tr>
    </thead>
    <tbody>
      <template v-for="tx in transactionView">
        <row-donation v-if="tx.type === 'donation'" :tx="tx"><slot v-bind:tx="tx"></slot></row-donation>
        <row-exchange v-else-if="tx.type === 'exchange'" :tx="tx"><slot v-bind:tx="tx"></slot></row-exchange>
        <row-gift-in v-else-if="tx.type === 'giftIn'" :tx="tx"><slot v-bind:tx="tx"></slot></row-gift-in>
        <row-gift-out v-else-if="tx.type === 'giftOut'" :tx="tx"><slot v-bind:tx="tx"></slot></row-gift-out>
        <row-income v-else-if="tx.type === 'income'" :tx="tx"><slot v-bind:tx="tx"></slot></row-income>
        <row-lost v-else-if="tx.type === 'lost'" :tx="tx"><slot v-bind:tx="tx"></slot></row-lost>
        <row-spent v-else-if="tx.type === 'spent'" :tx="tx"><slot v-bind:tx="tx"></slot></row-spent>
        <row-stolen v-else-if="tx.type === 'stolen'" :tx="tx"><slot v-bind:tx="tx"></slot></row-stolen>
        <row-transfer v-else-if="tx.type === 'transfer'" :tx="tx"><slot v-bind:tx="tx"></slot></row-transfer>
      </template>
    </tbody>
  </table>
</template>

<script>
  import RowDonation from './RowDonation'
  import RowExchange from './RowExchange'
  import RowGiftIn from './RowGiftIn'
  import RowGiftOut from './RowGiftOut'
  import RowIncome from './RowIncome'
  import RowLost from './RowLost'
  import RowSpent from './RowSpent'
  import RowStolen from './RowStolen'
  import RowTransfer from './RowTransfer'

  import { mapState, mapActions } from 'vuex';

  export default {
    components: {
      RowDonation, RowExchange, RowGiftIn, RowGiftOut, RowIncome, RowLost, RowSpent, RowStolen, RowTransfer,
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
  }
</script>

<style scoped>
</style>

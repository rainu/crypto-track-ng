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
      <ul class="todo-list">
        <li class="list-group-item">
          <strong>{{walletName(tx.data.in.wallet)}}</strong>
          <currency-amount class="pull-right" :amount="tx.data.amount" :currency="tx.data.currency" />
        </li>
      </ul>
    </td>
    <!-- OUTCOME -->
    <td>
      <ul class="todo-list">
        <li class="list-group-item">
          <strong>{{walletName(tx.data.out.wallet)}}</strong>
          <currency-amount class="pull-right" :amount="tx.data.amount" :currency="tx.data.currency" />
        </li>
      </ul>
    </td>
    <!-- FEE -->
    <td>
      <ul class="todo-list">
        <li class="list-group-item" v-for="(fee, i) in tx.data.fee" v-if="fee">
          <strong>{{walletName(tx.data.fee[i].wallet)}}</strong>
          <currency-amount class="pull-right" :amount="tx.data.fee[i].amount" :currency="tx.data.fee[i].currency" />
        </li>
      </ul>
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
      walletName(wId){
        let wallet = this.wallet(wId);
        if(wallet) {
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

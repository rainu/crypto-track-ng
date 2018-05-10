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
      <ul class="todo-list">
        <li class="list-group-item">
          <strong>{{walletName(tx.data.out.wallet)}}</strong>
          <currency-amount class="pull-right" :amount="tx.data.out.amount" :currency="tx.data.out.currency" />
        </li>
      </ul>
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

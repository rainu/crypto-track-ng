<template>
  <ul class="todo-list">
    <li class="list-group-item" v-for="(fee, i) in fees" v-if="fee.amount">
      <currency-amount class="pull-right" :amount="fees[i].amount" :currency="fees[i].currency" />
      <strong>{{walletName(fees[i].wallet)}}</strong>

      <template v-if="fee.comment">
        <br />
        <small>{{fee.comment}}</small>
      </template>
    </li>
  </ul>
</template>

<script>
  import {mapGetters} from 'vuex';

  export default {
    props: {
      fees: {
        type: Array,
        required: true
      }
    },
    data(){
      return {}
    },
    computed: {
      ...mapGetters({
        wallet: 'wallet/byId'
      }),
    },
    methods: {
      walletName(wId) {
        let wallet = this.wallet(wId);
        if (wallet) {
          return wallet.name
        }
        return ""
      },
    }
  }
</script>

<style scoped>

</style>

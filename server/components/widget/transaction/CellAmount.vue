<template>
  <ul class="todo-list">
    <li class="list-group-item">
      <strong>{{walletName(data.wallet)}}</strong>
      <currency-amount class="pull-right" :amount="data.amount" :currency="data.currency"/>
    </li>
  </ul>
</template>

<script>
  import {mapGetters} from 'vuex';

  export default {
    props: {
      data: {
        type: [Object],
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

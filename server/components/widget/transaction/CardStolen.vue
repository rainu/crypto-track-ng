<template>
  <div class="box box-default">
    <div class="box-header with-border">
      <h4 class="box-title">
        <i class="fa fa-user-secret" :title="$t('transaction.stolen.title')"></i>
        <span class="small word-wrap">{{ldate(tx.date)}}</span>
      </h4>

      <div class="box-tools pull-right">
        <div class="btn-group">
          <slot v-bind:tx="tx"></slot>
        </div>
      </div>
    </div>
    <div class="box-body">

      <!-- wallets and amount -->
      <div class="row">
        <!-- col for OUTCOME -->
        <div class="col-xs-6">
          <h4>{{walletName(tx.data.out.wallet)}}</h4>
          <currency-amount :amount="tx.data.out.amount" :currency="tx.data.out.currency"/>
        </div>

        <!-- NO INCOME -->
      </div>

      <!-- no fees -->

      <!-- comment -->
      <hr v-if="tx.data.details.comment"/>
      <div class="row">
        <div class="col-xs-12 text-center">
          <span class="small word-wrap">{{tx.data.details.comment}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import { mapGetters } from 'vuex';

  export default {
    name: "CardStolen",
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
  hr {
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>

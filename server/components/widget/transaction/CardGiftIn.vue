<template>
  <div class="box box-default">
    <div class="box-header with-border">
      <h4 class="box-title">
        <i class="fa fa-gift" :title="$t('transaction.gift.in')"></i>
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
        <!-- NO OUTCOME -->

        <!-- col for INCOME -->
        <div class="col-xs-offset-6 col-xs-6 text-right">
          <h4>{{walletName(tx.data.in.wallet)}}</h4>
          <currency-amount :amount="tx.data.in.amount" :currency="tx.data.in.currency"/>
        </div>
      </div>

      <!-- fees -->
      <hr v-if="tx.data.fee.length > 0"/>
      <div class="row" v-for="fee in tx.data.fee" v-if="fee.amount">
        <div class="col-xs-12">
          <span>{{fee.comment}}</span>
          <currency-amount class="pull-right" :amount="fee.amount" :currency="fee.currency" />
        </div>
      </div>

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
    name: "CardGiftIn",
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

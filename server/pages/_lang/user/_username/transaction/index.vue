<template>
  <div class="container">
    <transaction-list>
      <template slot-scope="{tx}">
        <button type="button" class="btn btn-danger btn-sm" @click="requestDeleteTransaction(tx.id)" :title="$t('common.delete')">
          <i class="fa fa-trash"></i>
        </button>
        <button type="button" class="btn btn-primary btn-sm" @click="editTransaction(tx.id)" :title="$t('common.edit')">
          <i class="fa fa-pencil"></i>
        </button>

        <modal-warning v-if="deleteRequest === tx.id" :payload="{ transactionId: tx.id }" @decided="handleDeleteDecision">
          <span v-html="$t('transaction.delete-question', {
            date: ldate(tx.date),
            type: dType(tx.type)
          })"></span>
        </modal-warning>
      </template>
    </transaction-list>

    <div class="row">
      <div class="col-xs-6 col-lg-2">
        <nuxt-link :to="{name: 'lang-user-username-transaction-new', params: { username: $route.params.username }}">
          <button class="btn btn-block btn-primary" type="submit">
            <i class="fa fa-plus"></i> {{$t('common.new')}}
          </button>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import { mapActions } from 'vuex'

  export default {
    data(){
      return {
        deleteRequest: null,
      }
    },
    computed: {
    },
    methods: {
      ...mapActions({
        deleteTransaction: 'transaction/deleteTransaction'
      }),
      requestDeleteTransaction(id){
        this.deleteRequest = id
      },
      editTransaction(id){
        this.$router.$goto('editTransaction', id)
      },
      handleDeleteDecision(decision) {
        this.deleteRequest = null

        if(decision.option === 'ok') {
          this.deleteTransaction(decision.payload.transactionId)
        }
      },
      ldate(date){
        return moment(date).format(this.$t('common.datetime.format'))
      },
      dType(type){
        switch(type.toLowerCase()){
          case 'giftin':
            return this.$t(`transaction.gift.in`)
          case 'giftout':
            return this.$t(`transaction.gift.out`)
          default:
            return this.$t(`transaction.${type}.title`)
        }
      }
    }
  }
</script>

<style scoped>
</style>

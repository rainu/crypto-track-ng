<template>
  <div>
    <div class="row">
      <div v-for="w in wallets" class="col-xs-12 col-md-4">
        <div class="box box-default">
          <div class="box-header with-border">
            <h3 class="box-title">{{w.name}}</h3>
          </div>

          <div class="box-body" style="">
            <div class="row">
              <div class="col-xs-12">
                  <table class="table">
                    <tbody><tr>
                      <th style="width:50%">{{$t('wallet.name')}}</th>
                      <td>{{w.name}}</td>
                    </tr>
                    <tr>
                      <th>{{$t('wallet.address')}}</th>
                      <td>{{w.address}}</td>
                    </tr>
                    <tr>
                      <th>{{$t('wallet.comment')}}</th>
                      <td>{{w.description}}</td>
                    </tr>
                    <tr>
                      <th>{{$t('wallet.currency')}}</th>
                      <td>
                        <span v-for="currency in w.currencies" class="label label-primary">{{currency.name}}</span>
                      </td>
                    </tr>
                    </tbody>
                  </table>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-6">
                <button type="button" class="btn btn-block btn-danger" @click="requestDeleteWallet(w.id)">
                  <i class="fa fa-trash"></i> {{$t('common.delete')}}
                </button>
              </div>
              <div class="col-xs-6">
                <nuxt-link :to="{name: 'lang-user-username-wallet-edit-id', params: { id: w.id }}" tag="a" role="button" class="btn btn-block btn-primary">
                  <i class="fa fa-pencil"></i> {{$t('common.edit')}}
                </nuxt-link>
              </div>
            </div>

            <modal-warning v-if="deleteRequest === w.id" :payload="{ walletId: w.id }" @decided="handleDeleteDecision">
              <span v-html="$t('wallet.delete-question', w)"></span>
            </modal-warning>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-6 col-lg-2">
        <nuxt-link :to="{name: 'lang-user-username-wallet-new', params: { username: $route.params.username }}">
          <button class="btn btn-block btn-primary" type="submit">
            <i class="fa fa-plus"></i> {{$t('common.new')}}
          </button>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';

  export default {
    data(){
      return {
        deleteRequest: null,
      }
    },
    computed: {
      ...mapState({
        wallets: state => state.wallet.wallets,
      }),
    },
    methods: {
      ...mapActions({
        deleteWallet: 'wallet/deleteWallet'
      }),
      requestDeleteWallet(id){
        this.deleteRequest = id
      },
      handleDeleteDecision(decision) {
        this.deleteRequest = null

        if(decision.option === 'ok') {
          this.deleteWallet(decision.payload.walletId)
        }
      }
    }
  }
</script>

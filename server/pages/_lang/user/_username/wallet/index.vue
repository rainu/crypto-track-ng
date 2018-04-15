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
                      <th>{{$t('wallet.type')}}</th>
                      <td>
                        <span v-for="type in w.types" class="label label-primary">{{type}}</span>
                      </td>
                    </tr>
                    </tbody>
                  </table>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-6">
                <button type="button" class="btn btn-block btn-danger">
                  <i class="fa fa-trash"></i> {{$t('common.delete')}}
                </button>
              </div>
              <div class="col-xs-6">
                <button type="button" class="btn btn-block btn-primary">
                  <i class="fa fa-pencil"></i> {{$t('common.edit')}}
                </button>
              </div>
            </div>
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
  import {mapState} from 'vuex';

  export default {
    computed: {
      ...mapState({
        wallets: state => state.wallet.wallets,
      }),
    },
  }
</script>

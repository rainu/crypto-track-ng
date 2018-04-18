<template>
  <div class="container-fluid">
    <!-- row for lost info -->
    <div class="row">
      <!-- lost info -->
      <div class="col-xs-12 col-lg-12">
        <fieldset>
          <legend>{{$t('transaction.lost.out')}}</legend>
          <div class="form-group" :class="{'has-error': $v.data.out.amount.$error}">
            <label >{{$t('common.amount')}}</label>
            <input type="text" class="form-control" v-model="data.out.amount" />
          </div>
          <div class="form-group" :class="{'has-error': $v.data.out.wallet.$error}">
            <label >{{$t('common.wallet')}}</label>
            <input-wallet v-model="data.out.wallet" :whitelist="[data.out.currency]"/>
          </div>
          <div class="form-group" :class="{'has-error': $v.data.out.currency.$error}">
            <label >{{$t('common.currency')}}</label>
            <input-currency v-model="data.out.currency" :whitelist="outCurrenciesWhitelist" />
          </div>
        </fieldset>
      </div>

    </div>

    <!-- row for countervalues -->
    <div class="row">
      <div class="col-xs-12 col-lg-12">
        <fieldset>
          <legend>{{$t('transaction.lost.countervalues.title')}}</legend>
          <div class="row">

            <!-- countervalue -->
            <div class="col-xs-12 col-lg-6">
              <div class="form-group" :class="{'has-error': $v.data.out.countervalue.amount.$error}">
                <label >{{$t('transaction.lost.countervalues.out')}}</label>
                <input type="text" class="form-control" v-model="data.out.countervalue.amount" />
              </div>
              <div class="form-group" :class="{'has-error': $v.data.out.countervalue.currency.$error}">
                <label >{{$t('common.currency')}}</label>
                <input-currency :crypto="false" v-model="data.out.countervalue.currency" />
              </div>
            </div>

          </div>
        </fieldset>
      </div>
    </div>

    <!-- row for detail info -->
    <div class="row">
      <div class="col-xs-12 col-lg-12">
        <fieldset>
          <legend>{{$t('transaction.common.details.title')}}</legend>
          <div class="form-group" :class="{'has-error': $v.data.details.exchange.$error}">
            <label >{{$t('transaction.common.details.exchange')}}</label>
            <input type="text" class="form-control" v-model="data.details.exchange" />
          </div>
          <div class="form-group" :class="{'has-error': $v.data.details.group.$error}">
            <label >{{$t('transaction.common.details.group')}}</label>
            <input type="text" class="form-control" v-model="data.details.group" />
          </div>
          <div class="form-group" :class="{'has-error': $v.data.details.comment.$error}">
            <label >{{$t('transaction.common.details.comment')}}</label>
            <input type="text" class="form-control" v-model="data.details.comment" />
          </div>
        </fieldset>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import { required, minValue, numeric, requiredIf } from 'vuelidate/lib/validators'

  export default {
    props: {
      value: {
        default: null,
        required: false
      }
    },
    data(){
      if(this.value) {
        return {
          data: this.value.data
        }
      }

      return {
        data: {
          out: {
            amount: null,
            currency: '',
            wallet: '',
            countervalue: {
              amount: null,
              currency: this.fiat
            },
          },
          details: {
            exchange: '',
            group: '',
            comment: ''
          }
        }
      }
    },
    validations: {
      data: {
        out: {
          amount: {
            required,
            numeric,
            minValue: minValue(0),
          },
          wallet: {
            required,
          },
          currency: {
            required,
          },
          countervalue: {
            amount: {
              numeric,
              required: requiredIf('currency')
            },
            currency: {
              required: requiredIf('amount')
            }
          },
        },
        details: {
          exchange: {
          },
          group: {
          },
          comment: {
          }
        }
      }
    },
    computed: {
      ...mapGetters({
        getWalletById: 'wallet/byId'
      }),
      outCurrenciesWhitelist(){
        if(this.data.out.wallet === ''){
          return []
        }
        const wallet = this.getWalletById(this.data.out.wallet)
        return wallet.types
      }
    },
    methods: {
      checkWallet(container){
        if(container.currency && container.wallet) {
          const wallet = this.getWalletById(container.wallet)

          if(wallet.types.filter(t => t === container.currency).length === 0){
            //the wallet doesn't support the currency
            container.wallet = ''
          }
        }
      },
      checkCurrency(container){
        if(container.currency && container.wallet) {
          const wallet = this.getWalletById(container.wallet)

          if(wallet.types.filter(t => t === container.currency).length === 0){
            //the wallet doesn't support the currency
            container.currency = ''
          }
        }
      },
    },
    watch: {
      'data.out.wallet'(){
        this.checkCurrency(this.data.out)
      },
      'data.out.currency'(){
        this.checkWallet(this.data.out)
      },
      data: {
        handler() {
          this.$v.$touch();

          //emit only valid data
          if(!this.$v.data.$error) {
            this.$emit('input', {
              involvedWallets: [ ...new Set([
                this.data.out.wallet,
              ].filter(i => i))],
              data: this.data,
            })
          }
        },
        deep: true,
      }
    }
  }
</script>

<style scoped>

</style>

<template>
  <div class="container-fluid">
    <!-- row for transfer info -->
    <div class="row">
      <!-- transfer info -->
      <div class="col-xs-12 col-lg-4">
        <fieldset>
          <legend>{{$t('transaction.transfer.out')}}</legend>
          <div class="form-group" :class="{'has-error': $v.data.amount.$error}">
            <label >{{$t('common.amount')}}</label>
            <input-number v-model="data.amount" ></input-number>
          </div>
          <div class="form-group" :class="{'has-error': $v.data.out.wallet.$error}">
            <label >{{$t('common.wallet')}}</label>
            <input-wallet v-model="data.out.wallet" :whitelist="[data.currency]"/>
          </div>
          <div class="form-group" :class="{'has-error': $v.data.currency.$error}">
            <label >{{$t('common.currency')}}</label>
            <input-currency v-model="data.currency" :whitelist="currenciesWhitelist" />
          </div>
        </fieldset>
      </div>

      <div class="col-xs-12 col-lg-4">
        <fieldset>
          <legend>{{$t('transaction.transfer.in')}}</legend>
          <div class="form-group" :class="{'has-error': $v.data.amount.$error}">
            <label >{{$t('common.amount')}}</label>
            <input-number v-model="data.amount" ></input-number>
          </div>
          <div class="form-group" :class="{'has-error': $v.data.in.wallet.$error}">
            <label >{{$t('common.wallet')}}</label>
            <input-wallet v-model="data.in.wallet" :whitelist="[data.currency]"/>
          </div>
          <div class="form-group" :class="{'has-error': $v.data.currency.$error}">
            <label >{{$t('common.currency')}}</label>
            <input-currency v-model="data.currency" :whitelist="currenciesWhitelist" />
          </div>
        </fieldset>
      </div>

      <!-- fee info -->
      <div class="col-xs-12 col-lg-4">
        <fieldset>
          <legend>{{$t('transaction.transfer.fee')}}</legend>
          <div class="form-group" :class="{'has-error': $v.data.fee.amount.$error}">
            <label >{{$t('common.amount')}}</label>
            <input-number v-model="data.fee.amount" ></input-number>
          </div>
          <div class="form-group" :class="{'has-error': $v.data.fee.wallet.$error}">
            <label >{{$t('common.wallet')}}</label>
            <input-wallet v-model="data.fee.wallet" :whitelist="[data.fee.currency]"/>
          </div>
          <div class="form-group" :class="{'has-error': $v.data.fee.currency.$error}">
            <label >{{$t('common.currency')}}</label>
            <input-currency v-model="data.fee.currency" :whitelist="feeCurrenciesWhitelist" />
          </div>
        </fieldset>
      </div>
    </div>

    <!-- row for countervalues -->
    <div class="row">
      <div class="col-xs-12 col-lg-12">
        <fieldset>
          <legend>{{$t('transaction.transfer.countervalues.title')}}</legend>
          <div class="row">

            <!-- countervalue -->
            <div class="col-xs-12 col-lg-12">
              <div class="form-group" :class="{'has-error': $v.data.countervalue.amount.$error}">
                <label >{{$t('transaction.transfer.countervalues.value')}}</label>
                <input-number v-model="data.countervalue.amount" ></input-number>
              </div>
              <div class="form-group" :class="{'has-error': $v.data.countervalue.currency.$error}">
                <label >{{$t('common.currency')}}</label>
                <input-currency :crypto="false" v-model="data.countervalue.currency" />
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
  import { required, minValue, requiredIf } from 'vuelidate/lib/validators'

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
          amount: null,
          currency: '',
          countervalue: {
            amount: null,
            currency: this.fiat
          },
          out: {
            wallet: '',
          },
          in: {
            wallet: '',
          },
          fee: {
            amount: null,
            currency: '',
            wallet: ''
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
        amount: {
          required,
          minValue: minValue(0),
        },
        currency: {
          required,
        },
        countervalue: {
          amount: {
            required: requiredIf('currency')
          },
          currency: {
            required: requiredIf('amount')
          }
        },
        out: {
          wallet: {
            required,
          },
        },
        in: {
          wallet: {
            required,
          },
        },
        fee: {
          amount: {
            required: requiredIf('currency')
          },
          wallet: {
            required: requiredIf('amount')
          },
          currency: {
            required: requiredIf('amount')
          }
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
      currenciesWhitelist(){
        if(this.data.out.wallet === '' && this.data.in.wallet === ''){
          return []
        }
        const outWallet = this.getWalletById(this.data.out.wallet)
        const outTypes = outWallet ? outWallet.types : []
        const inWallet = this.getWalletById(this.data.in.wallet)
        const inTypes = inWallet ? inWallet.types : []

        return [...new Set([...outTypes, ...inTypes])]
      },
      feeCurrenciesWhitelist(){
        if(this.data.fee.wallet === ''){
          return []
        }
        const wallet = this.getWalletById(this.data.fee.wallet)
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
      'data.currency'(){
        this.checkWallet(this.data.in)
        this.checkWallet(this.data.out)
      },
      'data.out.wallet'(){
        this.checkCurrency(this.data)
      },
      'data.in.wallet'(){
        this.checkCurrency(this.data)
      },
      'data.fee.wallet'(){
        this.checkCurrency(this.data.fee)
      },
      'data.fee.currency'(){
        this.checkWallet(this.data.fee)
      },
      data: {
        handler() {
          this.$v.$touch();

          //emit only valid data
          if(!this.$v.data.$error) {
            this.$emit('input', {
              involvedWallets: [ ...new Set([
                this.data.out.wallet,
                this.data.in.wallet,
                this.data.fee.wallet,
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

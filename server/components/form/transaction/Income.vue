<template>
  <div class="container-fluid">
    <!-- row for income info -->
    <div class="row">
      <!-- income info -->
      <div class="col-xs-12 col-lg-6">
        <fieldset>
          <legend>{{$t('transaction.income.in')}}</legend>
          <div class="form-group" :class="{'has-error': $v.data.in.amount.$error}">
            <label >{{$t('common.amount')}}</label>
            <input-number v-model="data.in.amount" ></input-number>
          </div>
          <div class="form-group" :class="{'has-error': $v.data.in.wallet.$error}">
            <label >{{$t('common.wallet')}}</label>
            <input-wallet v-model="data.in.wallet" :whitelist="[data.in.currency]"/>
          </div>
          <div class="form-group" :class="{'has-error': $v.data.in.currency.$error}">
            <label >{{$t('common.currency')}}</label>
            <input-currency v-model="data.in.currency" :whitelist="inCurrenciesWhitelist" />
          </div>
        </fieldset>
      </div>

      <!-- fee info -->
      <div class="col-xs-12 col-lg-6">
        <fieldset>
          <legend>{{$t('transaction.income.fee')}}</legend>
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
          <legend>{{$t('transaction.income.countervalues.title')}}</legend>
          <div class="row">

            <!-- countervalue -->
            <div class="col-xs-12 col-lg-6">
              <div class="form-group" :class="{'has-error': $v.data.in.countervalue.amount.$error}">
                <label >{{$t('transaction.income.countervalues.in')}}</label>
                <input-number v-model="data.in.countervalue.amount" ></input-number>
              </div>
              <div class="form-group" :class="{'has-error': $v.data.in.countervalue.currency.$error}">
                <label >{{$t('common.currency')}}</label>
                <input-currency :crypto="false" v-model="data.in.countervalue.currency" />
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
          in: {
            amount: null,
            currency: {
              name: null,
              type: null
            },
            wallet: '',
            countervalue: {
              amount: null,
              currency: {
                name: null,
                type: null
              }
            },
          },
          fee: {
            amount: null,
            currency: {
              name: null,
              type: null
            },
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
        in: {
          amount: {
            required,
            minValue: minValue(0),
          },
          wallet: {
            required,
          },
          currency: {
            name: {
              required
            },
            type: {
              required
            }
          },
          countervalue: {
            amount: {
              required: requiredIf('currency.name')
            },
            currency: {
              name: {
                required: requiredIf(function() {
                  return this.data.in.countervalue.amount
                })
              }
            }
          },
        },
        fee: {
          amount: {
            required: requiredIf('currency.name')
          },
          wallet: {
            required: requiredIf('amount')
          },
          currency: {
            name: {
              required: requiredIf(function() {
                return this.data.fee.amount
              })
            }
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
      inCurrenciesWhitelist(){
        if(this.data.in.wallet === ''){
          return []
        }
        const wallet = this.getWalletById(this.data.in.wallet)
        return wallet.currencies
      },
      feeCurrenciesWhitelist(){
        if(this.data.fee.wallet === ''){
          return []
        }
        const wallet = this.getWalletById(this.data.fee.wallet)
        return wallet.currencies
      }
    },
    methods: {
      checkWallet(container){
        if(container.currency.name && container.wallet) {
          const wallet = this.getWalletById(container.wallet)

          if(wallet.currencies.filter(c => c.name === container.currency.name && c.type === container.currency.type).length === 0){
            //the wallet doesn't support the currency
            container.wallet = ''
          }
        }
      },
      checkCurrency(container){
        if(container.currency.name && container.wallet) {
          const wallet = this.getWalletById(container.wallet)

          if(wallet.currencies.filter(c => c.name === container.currency.name && c.type === container.currency.type).length === 0){
            //the wallet doesn't support the currency
            container.currency = ''
          }
        }
      },
    },
    watch: {
      'data.in.wallet'(){
        this.checkCurrency(this.data.in)
      },
      'data.in.currency.name'(){
        this.checkWallet(this.data.in)
      },
      'data.fee.wallet'(){
        this.checkCurrency(this.data.fee)
      },
      'data.fee.currency.name'(){
        this.checkWallet(this.data.fee)
      },
      data: {
        handler() {
          this.$v.$touch();

          //emit only valid data
          if(!this.$v.data.$error) {
            this.$emit('input', {
              involvedWallets: [ ...new Set([
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

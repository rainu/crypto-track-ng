<template>
  <div class="container-fluid">
    <!-- row for buy/sell info -->
    <div class="row">
      <!-- buy info -->
      <div class="col-xs-12 col-lg-4">
        <fieldset>
          <legend>{{$t('transaction.exchange.buy')}}</legend>
          <div class="form-group" :class="{'has-error': $v.data.buy.amount.$error}">
            <label >{{$t('common.amount')}}</label>
            <input-number v-model="data.buy.amount" :number-format="numberFormatBuy" ></input-number>
          </div>
          <div class="form-group" :class="{'has-error': $v.data.buy.wallet.$error}">
            <label >{{$t('common.wallet')}}</label>
            <input-wallet v-model="data.buy.wallet" :whitelist="[data.buy.currency]"/>
          </div>
          <div class="form-group" :class="{'has-error': $v.data.buy.currency.$error}">
            <label >{{$t('common.currency')}}</label>
            <input-currency v-model="data.buy.currency" :whitelist="buyCurrenciesWhitelist" />
          </div>
        </fieldset>
      </div>

      <!-- sell info -->
      <div class="col-xs-12 col-lg-4">
        <fieldset>
          <legend>{{$t('transaction.exchange.sell')}}</legend>
          <div class="form-group" :class="{'has-error': $v.data.sell.amount.$error}">
            <label >{{$t('common.amount')}}</label>
            <input-number v-model="data.sell.amount" :number-format="numberFormatSell" ></input-number>
          </div>
          <div class="form-group" :class="{'has-error': $v.data.sell.wallet.$error}">
            <label >{{$t('common.wallet')}}</label>
            <input-wallet v-model="data.sell.wallet" :whitelist="[data.sell.currency]"/>
          </div>
          <div class="form-group" :class="{'has-error': $v.data.sell.currency.$error}">
            <label >{{$t('common.currency')}}</label>
            <input-currency v-model="data.sell.currency" :whitelist="sellCurrenciesWhitelist" />
          </div>
        </fieldset>
      </div>

      <!-- fee info -->
      <div class="col-xs-12 col-lg-4">
        <fieldset>
          <legend>{{$t('transaction.exchange.fee')}}</legend>
          <div class="form-group" :class="{'has-error': $v.data.fee.amount.$error}">
            <label >{{$t('common.amount')}}</label>
            <input-number v-model="data.fee.amount" :number-format="numberFormatFee" ></input-number>
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
          <legend>{{$t('transaction.exchange.countervalues.title')}}</legend>
          <div class="row">

            <!-- buy countervalue -->
            <div class="col-xs-12 col-lg-6">
              <div class="form-group" :class="{'has-error': $v.data.buy.countervalue.amount.$error}">
                <label >{{$t('transaction.exchange.countervalues.buy')}}</label>
                <input-number v-model="data.buy.countervalue.amount" :number-format="numberFormatBuyCountervalue" ></input-number>
              </div>
              <div class="form-group" :class="{'has-error': $v.data.buy.countervalue.currency.$error}">
                <label >{{$t('common.currency')}}</label>
                <input-currency :crypto="false" v-model="data.buy.countervalue.currency" />
              </div>
            </div>

            <!-- sell countervalue -->
            <div class="col-xs-12 col-lg-6">
              <div class="form-group" :class="{'has-error': $v.data.sell.countervalue.amount.$error}">
                <label >{{$t('transaction.exchange.countervalues.sell')}}</label>
                <input-number v-model="data.sell.countervalue.amount" :number-format="numberFormatSellCountervalue" ></input-number>
              </div>
              <div class="form-group" :class="{'has-error': $v.data.sell.countervalue.currency.$error}">
                <label >{{$t('common.currency')}}</label>
                <input-currency :crypto="false" v-model="data.sell.countervalue.currency" />
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
  import * as currencies from '../../../../common/currencies'
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
          buy: {
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
          sell: {
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
        buy: {
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
                  return this.data.buy.countervalue.amount
                })
              }
            }
          },
        },
        sell: {
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
                  return this.data.sell.countervalue.amount
                })
              }
            },
          }
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
      buyCurrenciesWhitelist(){
        if(this.data.buy.wallet === ''){
          return []
        }
        const wallet = this.getWalletById(this.data.buy.wallet)
        return wallet.currencies
      },
      sellCurrenciesWhitelist(){
        if(this.data.sell.wallet === ''){
          return []
        }
        const wallet = this.getWalletById(this.data.sell.wallet)
        return wallet.currencies
      },
      feeCurrenciesWhitelist(){
        if(this.data.fee.wallet === ''){
          return []
        }
        const wallet = this.getWalletById(this.data.fee.wallet)
        return wallet.currencies
      },
      numberFormatFee(){
        return this.getNumberFormat(this.data.fee)
      },
      numberFormatBuy(){
        return this.getNumberFormat(this.data.buy)
      },
      numberFormatBuyCountervalue(){
        return this.getNumberFormat(this.data.buy.countervalue)
      },
      numberFormatSell(){
        return this.getNumberFormat(this.data.sell)
      },
      numberFormatSellCountervalue(){
        return this.getNumberFormat(this.data.sell.countervalue)
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
      getNumberFormat(container){
        if(container.currency.name) {
          return currencies[container.currency.type][container.currency.name].format.numeral
        }
        return null
      }
    },
    watch: {
      'data.buy.wallet'(){
        this.checkCurrency(this.data.buy)
      },
      'data.buy.currency.name'(){
        this.checkWallet(this.data.buy)
      },
      'data.sell.wallet'(){
        this.checkCurrency(this.data.sell)
      },
      'data.sell.currency.name'(){
        this.checkWallet(this.data.sell)
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
                this.data.buy.wallet,
                this.data.sell.wallet,
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

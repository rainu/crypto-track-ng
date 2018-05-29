<template>
  <div class="container-fluid">
    <!-- row for income info -->
    <div class="row">
      <!-- income info -->
      <wallet-io class="col-xs-12 col-lg-6" v-model="data.in">{{$t('transaction.income.in')}}</wallet-io>

      <!-- fee info -->
      <fees v-model="data.fee" :title="'transaction.income.fee'" />
    </div>

    <!-- row for exchangerates -->
    <exchange-rates class="row" :currencies="involvedCurrencies" v-model="data.exchangeRates">
      {{$t('transaction.income.exchangerates.title')}}
    </exchange-rates>

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
  import { required, minValue } from 'vuelidate/lib/validators'
  import ExchangeRates from './ExchangeRates'
  import Fees from './Fees'

  export default {
    components: {
      ExchangeRates, Fees
    },
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
          },
          fee: [],
          exchangeRates:[],
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
      involvedCurrencies(){
        let currencies = []

        if(this.data.in.currency.name) {
          currencies.push(this.data.in.currency)
        }
        for(let curFee of this.data.fee) {
          if(curFee.currency && curFee.currency.name){
            currencies.push(curFee.currency)
          }
        }

        return currencies;
      }
    },
    watch: {
      data: {
        handler() {
          this.$v.$touch();

          //emit only valid data
          if(!this.$v.data.$error) {
            this.$emit('input', {
              involvedWallets: [ ...new Set([
                this.data.in.wallet,
                ...this.data.fee.map(f => f.wallet),
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

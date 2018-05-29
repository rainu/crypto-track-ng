<template>
  <div class="container-fluid">
    <!-- row for gift info -->
    <div class="row">
      <!-- gift info -->
      <wallet-io class="col-xs-12 col-lg-6" v-model="data.out">{{$t('transaction.gift.out')}}</wallet-io>

      <!-- fee info -->
      <fees v-model="data.fee" :title="'transaction.gift.fee'" />
    </div>

    <!-- row for exchangerates -->
    <exchange-rates class="row" :currencies="involvedCurrencies" v-model="data.exchangeRates">
      {{$t('transaction.gift.exchangerates.title')}}
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
          out: {
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
        out: {
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

        if(this.data.out.currency.name) {
          currencies.push(this.data.out.currency)
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
                this.data.out.wallet,
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

<template>
  <div class="container-fluid">
    <!-- row for stolen info -->
    <div class="row">
      <!-- stolen info -->
      <wallet-io class="col-xs-12 col-lg-12" v-model="data.out">{{$t('transaction.stolen.out')}}</wallet-io>
    </div>

    <!-- row for exchangerates -->
    <exchange-rates class="row" :currencies="involvedCurrencies" v-model="data.exchangeRates">
      {{$t('transaction.stolen.exchangerates.title')}}
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

  export default {
    components: {
      ExchangeRates
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
              involvedWallets: [this.data.out.wallet],
              involvedCurrencies: [this.data.out.currency],
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

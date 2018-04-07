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
            <input type="text" class="form-control" v-model="data.buy.amount" />
          </div>
          <div class="form-group" :class="{'has-error': $v.data.buy.currency.$error}">
            <label >{{$t('common.currency')}}</label>
            <input-currency v-model="data.buy.currency" />
          </div>
        </fieldset>
      </div>

      <!-- sell info -->
      <div class="col-xs-12 col-lg-4">
        <fieldset>
          <legend>{{$t('transaction.exchange.sell')}}</legend>
          <div class="form-group" :class="{'has-error': $v.data.sell.amount.$error}">
            <label >{{$t('common.amount')}}</label>
            <input type="text" class="form-control" v-model="data.sell.amount" />
          </div>
          <div class="form-group" :class="{'has-error': $v.data.sell.currency.$error}">
            <label >{{$t('common.currency')}}</label>
            <input-currency v-model="data.sell.currency" />
          </div>
        </fieldset>
      </div>

      <!-- fee info -->
      <div class="col-xs-12 col-lg-4">
        <fieldset>
          <legend>{{$t('transaction.exchange.fee')}}</legend>
          <div class="form-group" :class="{'has-error': $v.data.fee.amount.$error}">
            <label >{{$t('common.amount')}}</label>
            <input type="text" class="form-control" v-model="data.fee.amount" />
          </div>
          <div class="form-group" :class="{'has-error': $v.data.fee.currency.$error}">
            <label >{{$t('common.currency')}}</label>
            <input-currency v-model="data.fee.currency" />
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
                <input type="text" class="form-control" v-model="data.buy.countervalue.amount" />
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
                <input type="text" class="form-control" v-model="data.sell.countervalue.amount" />
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
  import { required, minValue, numeric, requiredIf } from 'vuelidate/lib/validators'

  export default {
    props: {
      value: {
        default: null,
        required: false
      },
      fiat: {
        default: "",
        require: false,
      }
    },
    data(){
      return {
        data: this.value || {
          buy: {
            amount: null,
            currency: '',
            countervalue: {
              amount: null,
              currency: this.fiat
            },
          },
          sell: {
            amount: null,
            currency: '',
            countervalue: {
              amount: null,
              currency: this.fiat
            },
          },
          fee: {
            amount: null,
            currency: ''
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
            numeric,
            minValue: minValue(0),
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
        sell: {
          amount: {
            required,
            numeric,
            minValue: minValue(0),
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
            },
          }
        },
        fee: {
          amount: {
            numeric,
            required: requiredIf('currency')
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
    watch: {
      data: {
        handler() {
          this.$v.$touch();

          //emit only valid data
          if(!this.$v.data.$error) {
            this.$emit('input', this.data)
          }
        },
        deep: true,
      }
    }
  }
</script>

<style scoped>

</style>

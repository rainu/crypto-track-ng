<template>
  <div class="container-fluid">
    <!-- row for stolen info -->
    <div class="row">
      <!-- stolen info -->
      <wallet-io class="col-xs-12 col-lg-12" v-model="data.out">{{$t('transaction.stolen.out')}}</wallet-io>
    </div>

    <!-- row for countervalues -->
    <div class="row">
      <div class="col-xs-12 col-lg-12">
        <fieldset>
          <legend>{{$t('transaction.stolen.countervalues.title')}}</legend>
          <div class="row">

            <!-- countervalue -->
            <div class="col-xs-12 col-lg-6">
              <div class="form-group" :class="{'has-error': $v.data.out.countervalue.amount.$error}">
                <label >{{$t('transaction.stolen.countervalues.out')}}</label>
                <input-number v-model="data.out.countervalue.amount" :number-format="numberFormatOutCountervalue"></input-number>
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
  import * as currencies from '../../../../common/currencies'
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
          out: {
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
          countervalue: {
            amount: {
              required: requiredIf('currency.name')
            },
            currency: {
              name: {
                required: requiredIf(function() {
                  return this.data.out.countervalue.amount
                })
              }
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
      numberFormatOutCountervalue(){
        return this.getNumberFormat(this.data.out.countervalue)
      }
    },
    methods: {
      getNumberFormat(container){
        if(container.currency.name) {
          return currencies[container.currency.type][container.currency.name].format.numeral
        }
        return null
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

<template>
  <div class="container-fluid">
    <!-- row for spent info -->
    <div class="row">
      <!-- spent info -->
      <wallet-io class="col-xs-12 col-lg-6" v-model="data.out">{{$t('transaction.spent.out')}}</wallet-io>

      <!-- fee info -->
      <wallet-io class="col-xs-12 col-lg-6" v-model="data.fee">{{$t('transaction.spent.fee')}}</wallet-io>
    </div>

    <!-- row for countervalues -->
    <div class="row">
      <div class="col-xs-12 col-lg-12">
        <fieldset>
          <legend>{{$t('transaction.spent.countervalues.title')}}</legend>
          <div class="row">

            <!-- countervalue -->
            <counter-value class="col-xs-12 col-lg-6" v-model="data.out.countervalue">{{$t('transaction.spent.countervalues.out')}}</counter-value>
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
    watch: {
      data: {
        handler() {
          this.$v.$touch();

          //emit only valid data
          if(!this.$v.data.$error) {
            this.$emit('input', {
              involvedWallets: [ ...new Set([
                this.data.out.wallet,
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

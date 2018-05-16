<template>
  <div class="container-fluid">
    <!-- row for donation info -->
    <div class="row">
      <!-- donation info -->
      <wallet-io class="col-xs-12 col-lg-6" v-model="data.out">{{$t('transaction.donation.out')}}</wallet-io>

      <!-- fee info -->
      <template v-for="(curFee, i) in data.fee">
        <wallet-io class="col-xs-12 col-lg-6" :mandatory="false" :comment="true" v-model="data.fee[i]">
          <div class="row">
            <div class="col-xs-6">{{$t('transaction.donation.fee')}}</div>
            <div class="col-xs-3">
              <button class="btn btn-danger btn-block" v-if="data.fee.length > 1" @click.prevent="removeFee(i)">
                <i class="fa fa-minus"></i>
              </button>
            </div>
            <div class="col-xs-3">
              <button class="btn btn-success btn-block" @click.prevent="addFee()">
                <i class="fa fa-plus"></i>
              </button>
            </div>
          </div>
        </wallet-io>
      </template>
    </div>

    <!-- row for exchangerates -->
    <div class="row">
      <div class="col-xs-12 col-lg-12">
        <fieldset>
          <legend>{{$t('transaction.donation.exchangerates.title')}}</legend>
          <div class="row">

            <!-- exchangerate -->
            <exchange-rate class="col-xs-12 col-lg-12" v-model="data.out.exchangerate">{{$t('transaction.donation.exchangerates.out')}}</exchange-rate>
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
            exchangerate: null,
          },
          fee: [{
            amount: null,
            currency: {
              name: null,
              type: null
            },
            wallet: ''
          }],
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
        fee: {
          $each: {
            amount: {
              required: requiredIf('currency.name')
            },
            wallet: {
              required: requiredIf('amount')
            },
            currency: {
              name: {
                required: requiredIf(function () {
                  return this.data.fee.amount
                })
              }
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
    methods: {
      addFee(){
        this.data.fee.push({
          amount: null,
          currency: {
            name: null,
            type: null
          },
          wallet: ''
        })
      },
      removeFee(index){
        this.data.fee.splice(index, 1)
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

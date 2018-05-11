<template>
  <div class="container-fluid">
    <!-- row for transfer info -->
    <div class="row">
      <!-- transfer info -->
      <wallet-io class="col-xs-12 col-lg-4" v-model="data.container.out">{{$t('transaction.transfer.out')}}</wallet-io>

      <wallet-io class="col-xs-12 col-lg-4" v-model="data.container.in">{{$t('transaction.transfer.in')}}</wallet-io>

      <!-- fee info -->
      <template v-for="(curFee, i) in data.fee">
        <wallet-io class="col-xs-12 col-lg-4" :mandatory="false" :comment="true" v-model="data.fee[i]">
          <div class="row">
            <div class="col-xs-6">{{$t('transaction.transfer.fee')}}</div>
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

    <!-- row for countervalues -->
    <div class="row">
      <div class="col-xs-12 col-lg-12">
        <fieldset>
          <legend>{{$t('transaction.transfer.countervalues.title')}}</legend>
          <div class="row">

            <!-- countervalue -->
            <counter-value class="col-xs-12 col-lg-12" v-model="data.countervalue">{{$t('transaction.transfer.countervalues.value')}}</counter-value>
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
          container: {
            in: {
              amount: null,
              currency: {
                name: null,
                type: null
              },
              wallet: ''
            },
            out: {
              amount: null,
              currency: {
                name: null,
                type: null
              },
              wallet: ''
            },
          },
          amount: null,
          currency: {
            name: null,
            type: null
          },
          countervalue: {
            amount: null,
            currency: {
              name: null,
              type: null
            }
          },
          out: {
            wallet: '',
          },
          in: {
            wallet: '',
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
        amount: {
          required,
          minValue: minValue(0),
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
                return this.data.countervalue.amount
              })
            }
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
          if(this.data.container.in.amount) {
            this.data.amount = this.data.container.in.amount
            this.data.container.out.amount = this.data.container.in.amount
          }
          if(this.data.container.out.amount) {
            this.data.amount = this.data.container.out.amount
            this.data.container.in.amount = this.data.container.out.amount
          }
          if(this.data.container.in.currency.name) {
            this.data.currency = this.data.container.in.currency
            this.data.container.out.currency = this.data.container.in.currency
          }
          if(this.data.container.out.currency.name) {
            this.data.currency = this.data.container.out.currency
            this.data.container.in.currency = this.data.container.out.currency
          }
          this.data.out.wallet = this.data.container.out.wallet
          this.data.in.wallet = this.data.container.in.wallet

          this.$v.$touch();

          //emit only valid data
          if(!this.$v.data.$error) {
            this.$emit('input', {
              involvedWallets: [ ...new Set([
                this.data.out.wallet,
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

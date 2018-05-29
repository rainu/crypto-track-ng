<template>
  <div>
    <div v-for="(curFee, i) in fees">
      <wallet-io class="col-xs-12 col-lg-6" :mandatory="false" :comment="true" v-model="fees[i]">
        <div class="row">
          <div class="col-xs-6">{{$t(title)}}</div>
          <div class="col-xs-3">
            <button class="btn btn-danger btn-block" v-if="fees.length > 1" @click.prevent="removeFee(i)">
              <i class="fa fa-minus"></i>
            </button>
          </div>
          <div class="col-xs-3">
            <button class="btn btn-success btn-block" @click.prevent="addFee()">
              <i class="fa fa-plus"></i>
            </button>
          </div>
        </div>
        <div class="input-group" slot="bottom">
          <span class="input-group-addon">
            <input type="checkbox" v-model="fees[i].included">
          </span>
          <input class="form-control" type="text" :value="$t('transaction.common.fee.included')" readonly v-if="fees[i].included">
          <input class="form-control" type="text" :value="$t('transaction.common.fee.not-included')" readonly v-else>
        </div>
      </wallet-io>
    </div>
  </div>
</template>

<script>
  import { requiredIf } from 'vuelidate/lib/validators'

  export default {
    props: {
      value: {
        type: Array,
        required: false,
      },
      title: {
        type: String,
      }
    },
    data(){
      let fees = [this.emptyFee()];
      if(this.value && this.value.length !== 0) {
        fees = this.value;
      }

      return {
        fees: fees,
      }
    },
    validations: {
      fees: {
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
                return this.fees.amount
              })
            }
          }
        }
      }
    },
    methods: {
      addFee(){
        this.fees.push(this.emptyFee())
      },
      removeFee(index){
        this.fees.splice(index, 1)
      },
      emptyFee(){
        return {
          amount: null,
          currency: {
            name: null,
            type: null
          },
          included: false,
          wallet: ''
        }
      },
      isEmpty(fee){
        if(!fee) return true;
        if(!fee.amount) return true;
        if(!fee.currency) return true;
        if(!fee.currency.name) return true;
        if(!fee.currency.type) return true;
        if(!fee.wallet) return true;

        return false;
      }
    },
    watch:{
      fees(){
        this.$v.$touch();

        //emit only valid data
        if(!this.$v.fees.$error) {
          this.$emit('input', this.fees.filter(f => !this.isEmpty(f)))
        }
      }
    }
  }
</script>

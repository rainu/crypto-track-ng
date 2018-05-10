<template>
  <div>
    <fieldset>
      <legend><slot></slot></legend>
      <div class="form-group" :class="{'has-error': $v.container.wallet.$error}">
        <label ><slot name="wallet">{{$t('common.wallet')}}</slot></label>
        <input-wallet v-model="container.wallet" :whitelist="[container.currency]"/>
      </div>
      <div class="form-group" :class="{'has-error': $v.container.currency.$error}">
        <label ><slot name="currency">{{$t('common.currency')}}</slot></label>
        <input-currency v-model="container.currency" :whitelist="currencyWhitelist" />
      </div>
      <div class="form-group" :class="{'has-error': $v.container.amount.$error}">
        <label ><slot name="amount">{{$t('common.amount')}}</slot></label>
        <div class="input-group" v-if="container.currency.name">
          <span class="input-group-addon">
            <icon-currency :currency="container.currency" ></icon-currency>
          </span>
          <input-number v-model="container.amount" :number-format="numberFormat" ></input-number>
        </div>
        <input-number
          v-else
          v-model="container.amount"
          :number-format="numberFormat" ></input-number>

      </div>
    </fieldset>
  </div>
</template>

<script>
  import * as currencies from '../../../common/currencies'
  import {mapGetters} from 'vuex';
  import { minValue, requiredIf } from 'vuelidate/lib/validators'

  export default {
    props: {
      value: {
        type: Object,
        required: false,
        default(){
          return {
            amount: null,
            currency: {
              name: null,
              type: null
            },
            wallet: '',
          }
        }
      },
      mandatory: {
        type: Boolean,
        required: false,
        default: true,
      }
    },
    validations: {
      container: {
        amount: {
          mandatory: function(value){
            if(this.mandatory && (value === null || value === 0)) {
              return false;
            }

            return true;
          },
          required1: requiredIf(function() {
            return this.container.currency.name
          }),
          required2: requiredIf(function() {
            return this.container.wallet
          }),
          minValue: minValue(0),
        },
        wallet: {
          mandatory(value){
            if(this.mandatory && (value === null || value === "")) {
              return false;
            }

            return true;
          },
          required1: requiredIf(function() {
            return this.container.currency.name
          }),
          required2: requiredIf(function() {
            return this.container.amount
          }),
        },
        currency: {
          name: {
            mandatory(value){
              if(this.mandatory && (value === null || value === "")) {
                return false;
              }

              return true;
            },
            required1: requiredIf(function() {
              return this.container.amount
            }),
            required2: requiredIf(function() {
              return this.container.wallet
            })
          },
          type: {
            mandatory(value){
              if(this.mandatory && (value === null || value === "")) {
                return false;
              }

              return true;
            },
            required1: requiredIf(function() {
              return this.container.amount
            }),
            required2: requiredIf(function() {
              return this.container.wallet
            })
          }
        },
      }
    },
    data() {
      return {
        container: {
          ...this.value
        }
      }
    },
    computed: {
      ...mapGetters({
        getWalletById: 'wallet/byId'
      }),
      numberFormat(){
        if(this.container.currency.name) {
          return currencies[this.container.currency.type][this.container.currency.name].format.numeral
        }
        return null
      },
      currencyWhitelist(){
        if(this.container.wallet === ''){
          return []
        }
        const wallet = this.getWalletById(this.container.wallet)
        return wallet.currencies
      }
    },
    watch: {
      value:{
        handler() {
          this.container = this.value
        },
        deep: true
      },
      container: {
        handler() {
          this.$v.$touch();

          //emit only valid data
          if(!this.$v.container.$error) {
            this.$emit('input', this.container)
          }
        },
        deep: true
      }
    }
  }
</script>

<style scoped>

</style>

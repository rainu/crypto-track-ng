<template>
  <div>
    <div class="form-group" :class="{'has-error': $v.container.amount.$error}">
      <label ><slot></slot></label>
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
    <div class="form-group" :class="{'has-error': $v.container.currency.$error}">
      <label ><slot name="currency">{{$t('common.currency')}}</slot></label>
      <input-currency :crypto="crypto" :fiat="fiat" v-model="container.currency" />
    </div>
  </div>
</template>

<script>
  import * as currencies from '../../../common/currencies'
  import { requiredIf } from 'vuelidate/lib/validators'

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
            }
          }
        }
      },
      fiat:{
        default: true,
        type: Boolean,
      },
      crypto:{
        default: false,
        type: Boolean,
      }
    },
    data(){
      return {
        container: {
          ...this.value
        }
      }
    },
    validations: {
      container: {
        amount: {
          required: requiredIf('currency.name')
        },
        currency: {
          name: {
            required: requiredIf('amount')
          }
        }
      }
    },
    computed: {
      numberFormat(){
        if(this.container.currency.name) {
          return currencies[this.container.currency.type][this.container.currency.name].format.numeral
        }
        return null
      }
    },
    watch: {
      value:{
        handler() {
          this.container = this.value
        },
        deep: true
      },
      container:{
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

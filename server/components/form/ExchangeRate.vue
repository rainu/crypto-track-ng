<template>
  <div>
    <div class="form-group" >
      <label ><slot></slot></label>
      <div class="input-group">
        <div class="input-group-btn">
          <button type="button" class="btn btn-default dropdown-toggle" :class="{'disabled': fixedCrypto}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i>1 </i> <icon-currency :currency="container.in" ></icon-currency> <i class="fa fa-exchange" style="margin-left: 15px;"></i>
          </button>
          <ul class="dropdown-menu">
            <template v-if="!fixedCrypto">
              <li v-for="(coin, key) in cryptoCurrencies()" v-if="container.out.name !== key">
                <a @click.prevent="setIn({type: 'crypto', name: key })">
                  <icon-currency :currency="{ type: 'crypto', name: key }" /> {{coin.label}}
                </a>
              </li>
              <li role="separator" class="divider"></li>
              <li v-for="(fiat, key) in fiatCurrencies()" v-if="container.out.name !== key">
                <a @click="setIn({type: 'fiat', name: key })">
                  <icon-currency :currency="{ type: 'fiat', name: key }" /> {{fiat.label}}
                </a>
              </li>
            </template>
          </ul>
        </div>

        <input-number v-model="container.ratio" :number-format="numberFormat" class="text-right"/>

        <div class="input-group-btn">
          <button type="button" class="btn btn-default dropdown-toggle" :class="{'disabled': fixedFiat}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <icon-currency :currency="container.out" ></icon-currency>
          </button>
          <ul class="dropdown-menu dropdown-menu-right">
            <template v-if="!fixedFiat">
              <li v-for="(fiat, key) in fiatCurrencies()" v-if="container.in.name !== key">
                <a @click="setOut({type: 'fiat', name: key })">
                  <icon-currency :currency="{ type: 'fiat', name: key }" /> {{fiat.label}}
                </a>
              </li>
              <li role="separator" class="divider"></li>
              <li v-for="(coin, key) in cryptoCurrencies()" v-if="container.in.name !== key">
                <a @click.prevent="setOut({type: 'crypto', name: key })">
                  <icon-currency :currency="{ type: 'crypto', name: key }" /> {{coin.label}}
                </a>
              </li>
            </template>
          </ul>
        </div>

        <slot name="input-group"></slot>
      </div>
    </div>
  </div>
</template>

<script>
  import * as currencies from '../../../common/currencies'

  export default {
    props: {
      value: {
        type: Object,
        required: false,
        default(){
          return null;
        }
      },
      selectedIn: {
        type: Object,
        required: false,
        default(){
          return {
            name: 'BTC',
            type: 'crypto'
          }
        }
      },
      selectedOut: {
        type: Object,
        required: false,
        default(){
          return {
            name: 'EUR',
            type: 'fiat'
          }
        }
      },
      numberFormat: {
        type: String,
        required: false,
        default: '0,0.[00000000]'
      },
      fixedCrypto: {
        type: Boolean,
        required: false,
        default: false,
      },
      fixedFiat: {
        type: Boolean,
        required: false,
        default: false,
      }
    },
    data(){
      let content = this.value;
      if (this.value === null || this.value.in === null || this.value.out === null) {
        content = {
          in: this.selectedIn,
          out: this.selectedOut,
          ratio: 0
        }
      }

      return {
        container: {
          ...content
        }
      }
    },
    methods: {
      cryptoCurrencies(){
        return currencies.crypto;
      },
      fiatCurrencies(){
        return currencies.fiat;
      },
      setIn(currency) {
        this.container.in = currency;
      },
      setOut(currency) {
        this.container.out = currency;
      }
    },
    watch: {
      container:{
        handler() {
          if(this.container.ratio !== 0) {
            this.$emit('input', this.container)
          }else{
            this.$emit('input', null)
          }
        },
        deep: true
      }
    }
  }
</script>

<style scoped>
  .cc {
    font-size:  13px;
  }
</style>

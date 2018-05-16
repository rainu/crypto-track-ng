<template>
  <div>
    <div class="form-group" >
      <label ><slot></slot></label>
      <div class="input-group">
        <div class="input-group-btn">
          <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i>1 </i> <icon-currency :currency="choosedCrypto" ></icon-currency> <i class="fa fa-exchange" style="margin-left: 15px;"></i>
          </button>
          <ul class="dropdown-menu">
            <li v-for="(coin, key) in cryptoCurrencies()">
              <a @click.prevent="setCrypto(key)">
                <icon-currency :currency="{ type: 'crypto', name: key }" /> {{coin.label}}
              </a>
            </li>
          </ul>
        </div>

        <input-number v-model="container.ratio" :number-format="numberFormat" class="text-right"/>

        <div class="input-group-btn">
          <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <icon-currency :currency="choosedFiat" ></icon-currency>
          </button>
          <ul class="dropdown-menu dropdown-menu-right">
            <li v-for="(fiat, key) in fiatCurrencies()">
              <a @click="setFiat(key)">
                <icon-currency :currency="{ type: 'fiat', name: key }" /> {{fiat.label}}
              </a>
            </li>
          </ul>
        </div>
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
          return {
            crypto: 'BTC',
            fiat: 'EUR',
            ratio: 0
          }
        }
      },
      numberFormat: {
        type: String,
        required: false,
        default: '0,0.[00000000]'
      },
      fixedCrypto: {
        type: String,
        required: false,
        default: ''
      }
    },
    data(){
      let content = this.value;
      if (this.value === null || this.value.crypto === null || this.value.fiat === null) {
        content = {
          crypto: 'BTC',
          fiat: 'EUR',
          ratio: 0
        }
      }

      if(this.fixedCrypto !== ''){
        content.crypto = this.fixedCrypto
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
      setCrypto(symbol) {
        this.container.crypto = symbol;
      },
      setFiat(symbol) {
        this.container.fiat = symbol;
      }
    },
    computed: {
      choosedCrypto(){
        return { type: 'crypto', name: this.container.crypto }
      },
      choosedFiat(){
        return { type: 'fiat', name: this.container.fiat }
      },
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

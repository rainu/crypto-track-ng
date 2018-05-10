<template>
  <v-select v-model="selectedValue" :options="options()">
    <template slot="option" slot-scope="option">
      <span :class="option.icon"></span>
      {{ option.label }}
    </template>
    <template slot="spinner">
      <i class="icon icon-spinner"></i>
    </template>
    <template slot="no-options">
      <span>{{$t('select.no-result')}}</span>
    </template>
  </v-select>
</template>

<script>
  import * as currencies from '../../../common/currencies'

  export default {
    props: {
      value: {
        default: {},
        required: true,
        type: Object
      },
      fiat: {
        default: true,
        required: false,
      },
      crypto: {
        default: true,
        required: false,
      },
      whitelist: {
        default(){
          return []
        },
        required: false,
        type: Array,
      }
    },
    name: "input-currency",
    data() {
      let option = ''
      if(this.value) {
        for (let curOpt of this.options()) {
          if (curOpt.value === this.value.name && curOpt.type === this.value.type) {
            option = curOpt;
            break;
          }
        }
      }

      return {
        selectedValue: option,
      }
    },
    methods: {
      options(){
        let cleanedWhitelists = {
          fiat: [],
          crypto: []
        }
        if(this.whitelist){
          //filter out invalid values:
          // empty object
          // object within no name
          // object within no typ
          cleanedWhitelists = {
            fiat: this.whitelist.filter(i => i).filter(i => i.name).filter(i => i.type)
                    .filter(i => i.type === 'fiat')
                    .map(i => i.name),
            crypto: this.whitelist.filter(i => i).filter(i => i.name).filter(i => i.type)
                    .filter(i => i.type === 'crypto')
                    .map(i => i.name),
          }
        }

        let options = []
        const fiat = currencies.fiat;
        const crypto = currencies.crypto;

        if(this.fiat) {
          for (let symbol of Object.keys(fiat)) {
            if(cleanedWhitelists.fiat.length === 0 || cleanedWhitelists.fiat.includes(symbol)) {
              options.push({
                label: `${fiat[symbol].label} -> ${symbol}`,
                value: symbol,
                icon: fiat[symbol].icon,
                type: 'fiat'
              })
            }
          }
        }
        if(this.crypto) {
          for (let symbol of Object.keys(crypto)) {
            if(cleanedWhitelists.crypto.length === 0 || cleanedWhitelists.crypto.includes(symbol)) {
              options.push({
                label: `${crypto[symbol].label} -> ${symbol}`,
                value: symbol,
                icon: crypto[symbol].icon,
                type: 'crypto'
              })
            }
          }
        }
        return options;
      }
    },
    watch: {
      value(){
        if(this.value.name === '') {
          this.selectedValue = ''
        }else if (
          !this.selectedValue || (
            this.selectedValue &&
            this.selectedValue.name !== this.value.name &&
            this.selectedValue.type !== this.value.type)
        ){
          for(let curOpt of this.options()) {
            if(curOpt.value === this.value.name){
              this.selectedValue = curOpt;
              break;
            }
          }
        }
      },
      selectedValue(){
        let value = {
          name: null,
          type: null
        }
        if(this.selectedValue) {
          value = {
            name: this.selectedValue.value,
            type: this.selectedValue.type
          }
        }
        this.$emit('input', value)
      }
    }
  }
</script>

<style scoped>

</style>

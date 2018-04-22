<template>
  <v-select v-model="selected" :options="options()" multiple>
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
  import locales from '@/locales'

  export default {
    props: {
      value: {
        default(){
          return [];
        },
        required: true,
        type: Array
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
    name: "select-currency",
    data() {
      let options = this.options().filter(option => {
        for(let so of this.value) {
          if(option.value === so.name && option.type === so.type){
            return true;
          }
        }
        return false;
      });

      return {
        selected: options,
      }
    },
    methods: {
      options() {
        let cleanedWhitelist = []
        if (this.whitelist) {
          //filter out null values or empty strings
          cleanedWhitelist = this.whitelist.filter(i => i)
        }

        let options = []
        const fiat = locales.localeMappings[this.$store.state.i18n.locale].currencies.fiat;
        const crypto = locales.localeMappings[this.$store.state.i18n.locale].currencies.crypto;

        if (this.fiat) {
          for (let symbol of Object.keys(fiat)) {
            if (cleanedWhitelist.length === 0 || cleanedWhitelist.includes(symbol)) {
              options.push({
                label: `${fiat[symbol].label} -> ${symbol}`,
                value: symbol,
                icon: fiat[symbol].icon,
                type: 'fiat'
              })
            }
          }
        }
        if (this.crypto) {
          for (let symbol of Object.keys(crypto)) {
            if (cleanedWhitelist.length === 0 || cleanedWhitelist.includes(symbol)) {
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
      selected(){
        let value = []
        if(this.selected) {
          value = this.selected.map(v => {
            return {
              name: v.value,
              type: v.type
            }
          })
        }
        this.$emit('input', value)
      }
    }
  }
</script>

<style scoped>

</style>

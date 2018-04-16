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
  import locales from '@/locales'

  export default {
    props: {
      value: {
        default: '',
        required: true,
        type: String
      },
      fiat: {
        default: true,
        required: false,
      },
      crypto: {
        default: true,
        required: false,
      }
    },
    name: "input-currency",
    data() {
      let option = ''
      for(let curOpt of this.options()) {
        if(curOpt.value === this.value){
          option = curOpt.value;
          break;
        }
      }

      return {
        selectedValue: option,
      }
    },
    methods: {
      options(){
        let options = []
        const fiat = locales.localeMappings[this.$store.state.i18n.locale].currencies.fiat;
        const crypto = locales.localeMappings[this.$store.state.i18n.locale].currencies.crypto;

        if(this.fiat) {
          for (let symbol of Object.keys(fiat)) {
            options.push({
              label: `${fiat[symbol].label} -> ${symbol}`,
              value: symbol,
              icon: fiat[symbol].icon
            })
          }
        }
        if(this.crypto) {
          for (let symbol of Object.keys(crypto)) {
            options.push({
              label: `${crypto[symbol].label} -> ${symbol}`,
              value: symbol,
              icon: crypto[symbol].icon
            })
          }
        }
        return options;
      }
    },
    watch: {
      selectedValue(){
        this.$emit('input', this.selectedValue.value)
      }
    }
  }
</script>

<style scoped>

</style>

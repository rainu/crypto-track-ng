<template>
  <form-suggestion-select v-model="selectedValues" :css="css" :options="options">
    <optgroup v-if="fiat" :label="$t('common.fiat-currency')">
      <option v-for="currency, name in fiatCurrencies()" :value="name">{{name}} -> {{currency}}</option>
    </optgroup>
    <optgroup v-if="crypto" :label="$t('common.crypto-currency')">
      <option v-for="currency, name in cryptoCurrencies()" :value="name">{{name}} -> {{currency}}</option>
    </optgroup>
  </form-suggestion-select>
</template>

<script>
  import locales from '@/locales'

  export default {
    props: {
      value: {
        default: null,
        required: true,
        type: Array
      },
      css: {
        required: false,
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
    name: "select-currency",
    data() {
      return {
        options: {
          multiple: true,
        },
        selectedValues: this.value,
      }
    },
    methods: {
      fiatCurrencies() {
        return locales.localeMappings[this.$store.state.i18n.locale].currencies.fiat;
      },
      cryptoCurrencies() {
        return locales.localeMappings[this.$store.state.i18n.locale].currencies.crypto;
      }
    },
    watch: {
      selectedValues(){
        this.$emit('input', this.selectedValues)
      }
    }
  }
</script>

<style scoped>

</style>

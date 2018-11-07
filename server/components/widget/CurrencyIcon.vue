<template>
  <i :class="iconClass">
    <template v-if="!iconClass">{{symbol}}</template>
    <slot></slot>
  </i>
</template>

<script>
  import currencies from '../../../common/currencies'

  export default {
    props: {
      currency: {
        type: Object,
      }
    },
    data(){
      return {
      }
    },
    computed: {
      symbol(){
        if(!this.currency || !this.currency.name) {
          return ''
        }

        return this.currency.name
      },
      iconClass(){
        if(!this.currency || !this.currency.name) {
          return ''
        }

        return currencies[this.currency.type][this.currency.name].icon
      }
    }
  }
</script>

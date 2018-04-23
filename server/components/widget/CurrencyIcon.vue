<template>
  <i :class="iconClass">
    <slot></slot>
  </i>
</template>

<script>
  import * as currencies from '../../../common/currencies'

  export default {
    props: {
      currency: {
        type: Object,
      }
    },
    data(){
      if(!this.currency || !this.currency.name) {
        return {
          iconClass: ''
        }
      }

      return {
        iconClass: currencies[this.currency.type][this.currency.name].icon
      }
    }
  }
</script>

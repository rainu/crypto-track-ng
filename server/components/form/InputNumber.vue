<template>
  <input type="text" class="form-control" v-model="rawInput" @change="changeRawInput"/>
</template>

<script>
  import {mapState} from 'vuex';
  import numeral from 'numeral'
  import 'numeral/locales'

  export default {
    props:{
      value: {
        default: null,
        required: true,
      },
      numberFormat: {
        default: '0.00',
        required: false,
      }
    },
    name: "input-number",
    data() {
      return {
        rawInput: numeral(this.value).format(this.format)
      }
    },
    computed:{
      ...mapState({
        locale: state => state.i18n.locale,
      }),
      format(){
        if(this.numberFormat) {
          return this.numberFormat;
        }
        return '0.00';
      }
    },
    methods:{
      changeRawInput(){
        let number = numeral(this.rawInput).value()
        this.$emit('input', number)
      }
    },
    watch: {
      value(){
        this.rawInput = numeral(this.value).format(this.format)
      },
      locale(){
        numeral.locale(this.locale)
      },
    },
    mounted(){
      numeral.locale(this.locale)
    }
  }
</script>

<style scoped>

</style>

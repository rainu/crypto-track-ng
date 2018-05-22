<template>
  <div class="row">
    <div class="col-xs-12 col-lg-12">
      <fieldset>
        <legend><slot></slot></legend>
        <div class="row" v-for="(curRate, i) in rates">

          <!-- exchangerate -->
          <exchange-rate class="col-xs-12 col-lg-12" v-model="rates[i]"></exchange-rate>
        </div>
        <div class="row">
          <div class="col-xs-12 col-lg-12">
            <button class="btn btn-success btn-block" @click.prevent="addRate"><i class="fa fa-plus"></i></button>
          </div>
        </div>
      </fieldset>
    </div>
  </div>
</template>

<script>
  export default {
    props:{
      value: {
        type: Array,
      },
      currencies: {
        type: Array,
        required: false,
        default(){
          return []
        }
      }
    },
    data(){
      let rates = []
      if(this.value) {
        rates = [...this.value]
      }

      let defaults = this.defaultRates()
      for(let curDef of defaults) {
        let shouldAdd = true
        for(let curRate of rates) {
          if(curRate.in.type === curDef.in.type && curRate.in.name === curDef.in.name) {
            shouldAdd = false;
            break;
          }
        }

        if(shouldAdd){
          rates.push(curDef)
        }
      }

      return {
        rates: rates
      }
    },
    methods: {
      defaultRates(){
        let rates = [];

        let fiats = this.currencies.filter(c => c.type === 'fiat')
        if(fiats.length === 0) {
          fiats.push({
            type: 'fiat',
            name: 'EUR'
          })
        }

        for(let currency of this.currencies) {
          if(currency.type === 'crypto') {
            for(let fiat of fiats) {
              rates.push({
                in: currency,
                out: fiat,
                ratio: 0
              })
            }
          }
        }

        return rates;
      },
      addRate(){
        this.rates.push({
          in: null,
          out: null,
          ratio: 0
        })
      }
    },
    watch: {
      rates(newRates) {
        //only emit valid rates
        this.$emit('input', newRates.filter(r => r).filter(r => r.ratio !== 0))
      },
      currencies(){
        let newDefaults = this.defaultRates()
        let oldRates = this.rates.filter(r => r).filter(r => r.ratio !== 0)
        let newRates = [...oldRates]

        for(let curDef of newDefaults) {
          let shouldAdd = true
          for(let curRate of newRates) {
            if(curRate.in.type === curDef.in.type && curRate.in.name === curDef.in.name) {
              shouldAdd = false;
              break;
            }
          }

          if(shouldAdd){
            newRates.push(curDef)
          }
        }

        this.rates = newRates
      }
    }
  }
</script>

<style scoped>

</style>

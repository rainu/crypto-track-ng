<template>
  <v-select v-model="selectedWallet" :options="options()">
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
  export default {
    props: {
      value: {
        default: '',
        required: true,
        type: String
      },
      whitelist: {
        default(){
          return []
        },
        required: false,
        type: Array,
      }
    },
    name: "input-wallet",
    data() {
      let option = ''
      for(let curOpt of this.options()) {
        if(curOpt.value === this.value){
          option = curOpt;
          break;
        }
      }
      return {
        selectedWallet: option,
      }
    },
    methods: {
      shortWalletAddress(wallet){
        if(!wallet.address) return "";
        if(wallet.address.length < 15) return wallet.address;

        let firstPart = wallet.address.substr(0, 8);  //first 8
        let lastPart = wallet.address.substr(wallet.address.length - 4, wallet.address.length); //last 4
        return `${firstPart}...${lastPart}`;
      },
      options(){
        let cleanedWhitelist = []
        if(this.whitelist){
          //filter out invalid values:
          // empty object
          // object within no name
          // object within no typ
          cleanedWhitelist = this.whitelist.filter(i => i).filter(i => i.name).filter(i => i.type)
        }

        return this.$store.state.wallet.wallets.filter(wallet => {
          //we have to filter out potential whitelisted wallets
          //the whitelist contains currencies which the wallet must support
          if(cleanedWhitelist.length > 0){
            for(let wli of cleanedWhitelist){
              for(let currency of wallet.currencies) {
                if(wli.type === currency.type && wli.name === currency.name) {
                  return true;
                }
              }
            }

            //the wallet doesn't support the currency
            return false;
          }else{
            //no whitelist -> all wallets are supported
            return true;
          }
        }).map(wallet => {
          return {
            label: `${wallet.name} (${this.shortWalletAddress(wallet)})`,
            value: wallet.id,
          }
        })
      }
    },
    watch: {
      value(){
        if(this.value === '') {
          this.selectedWallet = ''
        }
      },
      selectedWallet(){
        let value = this.selectedWallet ? this.selectedWallet.value : ''
        this.$emit('input', value)
      }
    }
  }
</script>

<style scoped>

</style>

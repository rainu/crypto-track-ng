<template>
  <form role="form" @submit.prevent="submit">
    <message-error v-if="saveError">{{$t('wallet.save-error')}}</message-error>

    <div class="form-body">
      <div class="row">
        <!-- address info -->
        <div class="col-xs-12 col-lg-12">
          <fieldset>
            <legend>{{$t('wallet.title')}}</legend>
            <div class="form-group" :class="{'has-error': $v.displayName.$error}">
              <label >{{$t('wallet.name')}}</label>
              <input type="text" class="form-control" v-model="displayName" @input="$v.displayName.$touch()" />
            </div>
            <div class="form-group" :class="{'has-error': $v.address.$error}">
              <label >{{$t('wallet.address')}}</label>
              <input type="text" class="form-control" v-model="address" @input="$v.address.$touch()" />
            </div>
            <div class="form-group" :class="{'has-error': $v.types.$error}">
              <label >{{$t('wallet.type')}}</label>
              <select-currency v-model="types" @input="$v.types.$touch()"/>
            </div>
            <div class="form-group" :class="{'has-error': $v.comment.$error}">
              <label >{{$t('wallet.comment')}}</label>
              <textarea class="form-control" rows="3" v-model="comment" @input="$v.comment.$touch()" ></textarea>
            </div>
          </fieldset>
        </div>
      </div>
    </div>
    <div class="form-footer">
      <button class="btn btn-primary pull-right" :class="{'disabled': $v.$invalid}"
              :disabled="$v.$invalid"
              type="submit">{{$t('common.save')}}</button>
    </div>
  </form>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import { required, minLength } from 'vuelidate/lib/validators'

  export default {
    data(){
      return {
        address: '',
        types: [],
        displayName: '',
        comment: '',
        saveError: false
      }
    },
    validations: {
      address: {
        required,
        uniqueAddress(address) {
          for(let curWallet of this.wallets) {
            if(curWallet.address === address) {
              //there is a wallet with the same address!
              return false;
            }
          }
          return true
        }
      },
      types: {
        required,
        minLength: minLength(1)
      },
      displayName: {
        required,
        uniqueName(name) {
          for(let curWallet of this.wallets) {
            if(curWallet.name === name) {
              //there is a wallet with the same name!
              return false;
            }
          }
          return true
        }
      },
      comment: {
      }
    },
    computed: {
      ...mapState({
        wallets: state => state.wallet.wallets,
      })
    },
    methods: {
      ...mapActions({
        storeNewWallet: 'wallet/addWallet'
      }),
      submit(){
        let wallet = {
          address: this.address,
          name: this.displayName,
          types: this.types,
          description: this.comment
        };
        this.storeNewWallet(wallet).then(() => {
          //storing was successful
          this.$router.$goto('wallets')
        }).catch(err => {
          this.saveError = true
        })
      }
    },
    mounted(){
      this.$v.$touch();
    }
  }
</script>

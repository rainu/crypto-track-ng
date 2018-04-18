<template>
  <form role="form" @submit.prevent="submit">
    <message-error v-if="saveError">{{$t('transaction.save-error')}}</message-error>

    <div class="form-body">
      <div class="row">
        <div class="col-xs-12">
          <fieldset>
            <legend>{{$t('transaction.common.head')}}</legend>
            <div class="form-group">
              <label >{{$t('transaction.common.type')}}</label>
              <select v-model="type" class="form-control">
                <option value="exchange"  >{{$t('transaction.exchange.title')}}</option>
                <optgroup :label="$t('transaction.type.in')">
                  <option value="income" >{{$t('transaction.income.title')}}</option>
                  <option value="gift" >{{$t('transaction.gift.title')}}</option>
                </optgroup>
                <optgroup :label="$t('transaction.type.out')">
                  <option value="donation" >{{$t('transaction.donation.title')}}</option>
                  <option value="spent" >Ausgabe</option>
                </optgroup>
                <option value="transfer" >Transfer</option>
              </select>
            </div>

            <div class="form-group" :class="{'has-error': $v.date.$error}">
              <label >{{$t('transaction.common.date')}}</label>
              <date-picker v-model="date" @input="$v.date.$touch()"></date-picker>
            </div>
          </fieldset>
        </div>
      </div>
      <div class="row">
        <Donation v-if="type === 'donation'" v-model="container.donation"></Donation>
        <Gift v-if="type === 'gift'" v-model="container.gift"></Gift>
        <Income v-if="type === 'income'" v-model="container.income"></Income>
        <Spent v-if="type === 'spent'" v-model="container.spent"></Spent>
        <Exchange v-if="type === 'exchange'" v-model="container.exchange"></Exchange>
        <Transfer v-if="type === 'transfer'" v-model="container.transfer"></Transfer>
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
  import { mapActions } from 'vuex'
  import { required, minValue } from 'vuelidate/lib/validators'
  import Donation from '@/components/form/transaction/Donation'
  import Gift from '@/components/form/transaction/Gift'
  import Income from '@/components/form/transaction/Income'
  import Spent from '@/components/form/transaction/Spent'
  import Exchange from '@/components/form/transaction/Exchange'
  import Transfer from '@/components/form/transaction/Transfer'

  export default {
    components: {
      Donation, Gift, Income, Spent, Exchange, Transfer
    },
    data(){
      return {
        date: null,
        type: 'exchange',
        container: {
          donation: null,
          gift: null,
          income: null,
          spent: null,
          exchange: null,
          transfer: null,
        },
        saveError: false
      }
    },
    validations: {
      date: {
        //bitcoin birthday :) (before that date - there was no cryptocurrency)
        minValue: minValue(new Date('2009-01-03T12:00:00Z')),
        required
      },
      container: {
        required
      }
    },
    methods: {
      ...mapActions({
        storeNewTransaction: 'transaction/addTransaction'
      }),
      submit(){
        //we have to inline the container fields
        let date = this.date;
        let type = this.type;
        let container = this.container[type];

        let payload = {
          date,
          type,
          involvedWallets: container.involvedWallets,
          data: container.data
        }
        delete payload.data.involvedWallets

        this.storeNewTransaction(payload).then(() => {
          //storing was successful
          this.$router.$goto('transactions')
        }).catch(err => {
          this.saveError = true
        })
      }
    },
    mounted(){
      this.$v.container.$touch()
    },
    watch: {
      container: {
        handler() {
          this.$v.date.$touch()
        },
        deep: true,
      }
    }
  }
</script>

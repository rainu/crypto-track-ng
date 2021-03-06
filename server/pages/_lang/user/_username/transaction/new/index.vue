<template>
  <form role="form" @submit.prevent="submit">
    <message-error v-if="saveError">{{$t('transaction.common.save-error')}}</message-error>

    <div class="form-body">
      <div class="row">
        <div class="col-xs-12">
          <fieldset>
            <legend>{{$t('transaction.common.head')}}</legend>
            <div class="form-group">
              <label >{{$t('transaction.common.type')}}</label>
              <select v-model="type" class="form-control">
                <option value="exchange" >[&lt;-&gt;] {{$t('transaction.exchange.title')}}</option>
                <optgroup :label="$t('transaction.type.in')">
                  <option value="income" >[-&gt;] {{$t('transaction.income.title')}}</option>
                  <option value="giftIn" >[-&gt;] {{$t('transaction.gift.title')}}</option>
                </optgroup>
                <optgroup :label="$t('transaction.type.out')">
                  <option value="spent" >[&lt;-] {{$t('transaction.spent.title')}}</option>
                  <option value="giftOut" >[&lt;-] {{$t('transaction.gift.title')}}</option>
                  <option value="donation" >[&lt;-] {{$t('transaction.donation.title')}}</option>
                  <option value="lost" >[&lt;-] {{$t('transaction.lost.title')}}</option>
                  <option value="stolen" >[&lt;-] {{$t('transaction.stolen.title')}}</option>
                </optgroup>
                <option value="transfer" >[&lt;-&gt;] {{$t('transaction.transfer.title')}}</option>
              </select>
            </div>

            <div class="form-group" :class="{'has-error': $v.date.$error}">
              <label >{{$t('transaction.common.date')}}</label>
              <date-time-picker v-model="date" @input="$v.date.$touch()"></date-time-picker>
            </div>
          </fieldset>
        </div>
      </div>
      <div class="row">
        <Donation v-if="type === 'donation'" v-model="container.donation"></Donation>
        <GiftIn v-if="type === 'giftIn'" v-model="container.giftIn"></GiftIn>
        <GiftOut v-if="type === 'giftOut'" v-model="container.giftOut"></GiftOut>
        <Income v-if="type === 'income'" v-model="container.income"></Income>
        <Spent v-if="type === 'spent'" v-model="container.spent"></Spent>
        <Exchange v-if="type === 'exchange'" v-model="container.exchange"></Exchange>
        <Transfer v-if="type === 'transfer'" v-model="container.transfer"></Transfer>
        <Lost v-if="type === 'lost'" v-model="container.lost"></Lost>
        <Stolen v-if="type === 'stolen'" v-model="container.stolen"></Stolen>
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
  import GiftIn from '@/components/form/transaction/GiftIn'
  import GiftOut from '@/components/form/transaction/GiftOut'
  import Income from '@/components/form/transaction/Income'
  import Spent from '@/components/form/transaction/Spent'
  import Lost from '@/components/form/transaction/Lost'
  import Stolen from '@/components/form/transaction/Stolen'
  import Exchange from '@/components/form/transaction/Exchange'
  import Transfer from '@/components/form/transaction/Transfer'

  export default {
    components: {
      Donation, GiftIn, GiftOut, Income, Spent, Exchange, Transfer, Lost, Stolen
    },
    data(){
      return {
        date: new Date(),
        type: 'exchange',
        container: {
          donation: null,
          giftIn: null,
          giftOut: null,
          income: null,
          spent: null,
          lost: null,
          stolen: null,
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
          involvedCurrencies: container.involvedCurrencies,
          data: container.data
        }
        delete payload.data.involvedWallets
        delete payload.data.involvedCurrencies

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

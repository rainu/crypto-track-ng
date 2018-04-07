<template>
  <form role="form" @submit.prevent="submit">
    <div class="form-body">
      <div class="row">
        <div class="col-xs-12">
          <fieldset>
            <legend>{{$t('transaction.common.head')}}</legend>
            <div class="form-group">
              <label >{{$t('transaction.common.type')}}</label>
              <select v-model="type" class="form-control">
                <option value="exchange"  >{{$t('transaction.exchange.title')}}</option>
                <option value="income" >Einzahlung</option>
                <option value="gift" >Geschenk</option>
                <option value="spent" >Ausgabe</option>
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
        <Gift v-if="type === 'gift'"></Gift>
        <Income v-if="type === 'income'"></Income>
        <Spent v-if="type === 'spent'"></Spent>
        <Exchange v-if="type === 'exchange'" v-model="container"></Exchange>
        <Transfer v-if="type === 'transfer'"></Transfer>
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
  import { required, minValue } from 'vuelidate/lib/validators'
  import Gift from '@/components/form/transaction/Gift'
  import Income from '@/components/form/transaction/Income'
  import Spent from '@/components/form/transaction/Spent'
  import Exchange from '@/components/form/transaction/Exchange'
  import Transfer from '@/components/form/transaction/Transfer'

  export default {
    components: {
      Gift, Income, Spent, Exchange, Transfer
    },
    data(){
      return {
        date: null,
        type: 'exchange',
        container: null,
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
      submit(){
        //we have to inline the container fields
        let date = this.date;
        let type = this.type;
        let container = this.container;

        let payload = {
          date, type,
          ...container
        }

        console.log(payload)
      }
    },
    mounted(){
      this.$v.container.$touch()
    },
    watch: {
      container() {
        this.$v.date.$touch()
      }
    }
  }
</script>
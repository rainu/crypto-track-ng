<template>
  <div class="container">

    <div class="row">
      <div class="col-lg-8 col-xs-12">
        <TotalBalances />
      </div>
      <div class="col-lg-4 col-xs-12">
        <balance-chart />
      </div>
    </div>

    <hr />

    <div class="row">
      <div v-for="days in balanceSettings.shortRanges" :class="rangeCssClass" >
        <button class="btn btn-block btn-primary" @click.prevent="changeRange(days)">{{$t('widget.balance-by-day-chart.settings.short-range', {days})}}</button>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-3 col-xs-6 ">
        <date-picker v-model="balanceSettings.from" :max-date="balanceSettings.until" ></date-picker>
      </div>
      <div class="col-lg-3 col-xs-6">
        <date-picker v-model="balanceSettings.until" :min-date="balanceSettings.from" ></date-picker>
      </div>
      <div class="col-lg-6 col-xs-12">
        <BalancesCalculation :from="balanceSettings.from" :until="balanceSettings.until" />
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12">
        <balance-by-day-chart :from="balanceSettings.from" :until="balanceSettings.until" />
      </div>
    </div>
  </div>
</template>

<script>

import TotalBalances from "../../../../../components/widget/dashboard/TotalBalances";
import BalanceByDayChart from "../../../../../components/widget/dashboard/BalanceByDayChart";
import BalancesCalculation from "../../../../../components/widget/dashboard/BalancesCalculation";

export default {
  components: {BalanceByDayChart, TotalBalances, BalancesCalculation},
  data() {
    let from = new Date()
    from.setDate(from.getDate() - 60)

    return {
      balanceSettings: {
        shortRanges: [30, 60, 90, 365],
        from: from,
        until: new Date()
      }
    }
  },
  methods: {
    changeRange(range){
      this.balanceSettings.until = new Date()

      let from = new Date()
      from.setDate(from.getDate() - range)

      this.balanceSettings.from = from

      return true
    }
  },
  computed: {
    rangeCssClass() {
      return `col-lg-${12 / this.balanceSettings.shortRanges.length} col-xs-12`
    }
  }
}
</script>

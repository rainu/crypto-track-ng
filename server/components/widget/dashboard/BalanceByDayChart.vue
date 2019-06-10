<template>
  <div class="small">
    <chart-line :chart-data="chartData" :options="options"></chart-line>
  </div>
</template>

<script>
  import moment from 'moment';
  import currencies from '../../../../common/currencies'
  import numeral from 'numeral'
  import {mapState, mapActions} from 'vuex';

  export default {
    props: {
      title: {
        type: String,
        required: false,
        default(){
          return this.$t('widget.balance-by-day-chart.title')
        }
      },
      from: {
        type: Date,
        required: false,
        default() {
          let from = new Date()
          from.setDate(from.getDate() - 60);

          return from
        }
      },
      until: {
        type: Date,
        required: false,
        default() {
          return new Date()
        }
      },
      counterValue: {
        type: Object,
        required: false,
        default() {
          return {
            name: "EUR",
            type: "fiat"
          }
        },
      },
      options: {
        required: false,
        default() {
          const $t = this.$t
          let currencyLabel = this.counterValue.name
          let format = '0.00'
          if(this.counterValue && this.counterValue.name) {
            format = currencies[this.counterValue.type][this.counterValue.name].format.numeral
            currencyLabel = currencies[this.counterValue.type][this.counterValue.name].label
          }
          numeral.locale(this.locale)

          return {
            maintainAspectRatio: false,
            spanGaps: true,
            animation: {
              duration: 0, // general animation time
            },
            responsiveAnimationDuration: 0, // animation duration after a resize
            tooltips: {
              displayColors: false,
              callbacks: {
                title(tpItem, data) {
                  return moment(tpItem[0].xLabel, 'MMM DD, YYYY').format($t('widget.balance-by-day-chart.tooltip.title-date-format'))
                },
                beforeLabel(tpItem, data) {
                  const i = tpItem.index;
                  const account = numeral(data.datasets[2].data[i]).format(format);
                  const accountTitle = data.datasets[2].label;
                  return `${accountTitle}: ${account} ${currencyLabel}`;
                },
                label(tpItem, data) {
                  const i = tpItem.index;
                  const currency = numeral(data.datasets[1].data[i]).format(format);
                  const currencyTitle = data.datasets[1].label;
                  return `${currencyTitle}: ${currency} ${currencyLabel}`;
                },
                afterLabel(tpItem, data) {
                  const i = tpItem.index;
                  const coin = numeral(data.datasets[0].data[i]).format(format);
                  const coinTitle = data.datasets[0].label;
                  return `${coinTitle}: ${coin} ${currencyLabel}`;
                },
              },
              intersect: false,
            },
            scales: {
              xAxes: [{
                type: 'time',
                time: {
                  displayFormats: {
                    'millisecond': this.$t('common.date.format'),
                    'second': this.$t('common.date.format'),
                    'minute': this.$t('common.date.format'),
                    'hour': this.$t('common.date.format'),
                    'day': this.$t('common.date.format'),
                    'week': this.$t('common.date.format'),
                    'month': this.$t('common.date.format'),
                    'quarter': this.$t('common.date.format'),
                    'year': this.$t('common.date.format'),
                  }
                }
              }],
            },
            elements: {
              line: {
                tension: 0, // disables bezier curves
              },
              point: {
                hoverRadius: 10,
                pointHitRadius: 50,
              }
            },
            plugins: {
              datalabels: {
                display: false
              }
            }
          }
        }
      }
    },
    data() {
      return {
        chartData: {},
      }
    },
    computed: {
      ...mapState({
        historicalState: state => state.course.syncStates.historical,
        transactions: state => state.transaction.transactions
      }),
    },
    methods: {
      ...mapActions({
        getHistoricalTotalAmountFor: 'course/getHistoricalTotalAmountFor',
        getHistoricalBalancesFor: 'course/getHistoricalBalancesFor'
      }),
      calcChartData(balances, totalAmounts) {
        let data = {
          labels: [],
        };

        let totalCryptoDS = {
          label: this.$t('widget.balance-by-day-chart.label.total-crypto'),
          backgroundColor: 'rgba(0, 128, 0, 0.5)',
          borderColor: '#008000',
          fill: true,
          data: [],
        };
        let totalFiatDS = {
          label: this.$t('widget.balance-by-day-chart.label.total-fiat'),
          backgroundColor: 'rgba(0, 128, 128, 0.5)',
          borderColor: '#008080',
          fill: true,
          data: [],
        };
        let accountValueDS = {
          label: this.$t('widget.balance-by-day-chart.label.total-account'),
          backgroundColor: 'rgba(128, 0, 0, 0.5)',
          borderColor: '#800000',
          fill: true,
          data: [],
        };

        data.datasets = [];
        data.datasets.push(totalCryptoDS, totalFiatDS, accountValueDS);

        for (let i = 0; i < balances.length; i++) {
          const curBalances = balances[i]
          const curTotalAmounts = totalAmounts[i]
          const curDate = moment(curTotalAmounts.date)

          let fiatAmount = 0
          for(let curBalance of curBalances) {
            if(curBalance.currency.type === curTotalAmounts.currency.type && curBalance.currency.name === curTotalAmounts.currency.name){
              fiatAmount = curBalance.amount
              break
            }
          }

          totalCryptoDS.data.push(curTotalAmounts.amount)
          totalFiatDS.data.push(fiatAmount)
          accountValueDS.data.push(curTotalAmounts.amount + fiatAmount)

          data.labels.push(curDate.toDate());
        }

        this.chartData = data;
      },
      applyChartSettings(from, until) {
        Promise.all([
          this.getHistoricalBalancesFor({from, until}),
          this.getHistoricalTotalAmountFor({counterCurrency: this.counterValue, from, until}),
        ]).then(results => {
          this.calcChartData(results[0], results[1])
        })
      }
    },
    watch: {
      historicalState(state){
        if(state) {
          this.applyChartSettings(this.from, this.until)
        }
      },
      from(newVal){
        this.applyChartSettings(newVal, this.until)
      },
      until(newVal){
        this.applyChartSettings(this.from, newVal)
      }
    },
    mounted() {
      this.applyChartSettings(this.from, this.until)
    }
  }
</script>

<style scoped>

</style>

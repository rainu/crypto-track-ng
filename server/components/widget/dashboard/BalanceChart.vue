<template>
  <div class="small">
    <pie-chart :chart-data="chartData" :options="options"></pie-chart>
  </div>
</template>

<script>
  import PieChart from '../../chart/ReactivePie'
  import {mapState, mapActions} from 'vuex';
  import currencies from '../../../../common/currencies'
  import numeral from 'numeral'
  import randomColor from 'randomcolor'

  export default {
    components: {
      PieChart
    },
    props: {
      title: {
        type: String,
        required: false,
        default(){
          return this.$t('widget.balance-chart.title')
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
      colors: {
        required: false,
        default() {
          return [
            '#C0C0C0',
            '#008080',
            '#00FFFF',
            '#808000',
            '#000080',
            '#800000',
            '#0000FF',
            '#008000',
            '#808080',
            '#00FF00',
            '#FFFF00',
            '#FF00FF',
            '#FF0000',
            '#800080',
          ]
        }
      },
      options: {
        required: false,
        default() {
          return {
            animation: {
              duration: 0, // general animation time
            },
            responsiveAnimationDuration: 0, // animation duration after a resize
            tooltips: {
              callbacks: {
                label(tpItem, data){
                  return data.datasets[0].labels[tpItem.index];
                },
                afterLabel(tpItem, data){
                  return data.datasets[0].footers[tpItem.index];
                }
              }
            },
            legend: {
              position: 'bottom'
            },
            plugins: {
              datalabels: {
                anchor: 'center',
                  align: 'top',
                  backgroundColor: '#FFFFFF',
                  borderColor: '#909090',
                  borderWidth: 2,
                  borderRadius: 90,
                  // offset: 100,
                  font: {
                  weight: 'bold',
                },
                formatter(value, ctx) {
                  return ctx.dataset.datalabels[ctx.dataIndex];
                }
              }
            }
          }
        }
      }
    },
    data() {
      return {
        chartData: {}
      }
    },
    computed: {
      ...mapState({
        locale: state => state.i18n.locale,
        courseTickerStatus: s => s.course.syncStates.ticker,
      }),
    },
    methods: {
      ...mapActions({
        getTotalTickerBalanceFor: 'course/getTotalTickerBalanceFor'
      }),
      calcChartData(balances) {
        let data = {
          labels: []
        }
        let datasetData = [];
        let dataLabels = [];
        let dataDataLabels = [];
        let dataFooters = [];
        let total = 0;

        balances.sort((a, b) => (a.counterValue.amount - b.counterValue.amount) * -1)
        for(let balance of balances){
          if(balance.amount <= 0) continue

          let format = '0.00'
          if(this.currency && this.currency.name) {
            format = currencies[this.currency.type][this.currency.name].format.numeral
          }

          numeral.locale(this.locale)
          let dAmount = numeral(balance.counterValue.amount).format(format)

          total += parseFloat(balance.counterValue.amount);

          datasetData.push(balance.counterValue.amount);
          dataLabels.push(`${balance.currency.name}: ${dAmount} ${balance.counterValue.currency.name}`);
          data.labels.push(balance.currency.name)
        }
        for(let i in datasetData){
          let percent = datasetData[i] * 100 / total;
          percent = percent.toFixed(2);

          dataDataLabels.push(`${percent}%`);
          dataFooters.push(this.$t('widget.balance-chart.data-footer', {
            percent: percent
          }));
        }
        let colors = []; colors.push(...this.colors);
        if(data.labels.length > colors.length) {
          //we dont have enough colors: so generate some one
          colors.push(...randomColor({
            count: data.labels.length - colors.length,
          }))
        }
        data.datasets = [{
          label: this.title,
          backgroundColor: colors.slice(0, data.labels.length),
          data: datasetData,
          labels: dataLabels,
          footers: dataFooters,
          datalabels: dataDataLabels,
        }];

        this.chartData = data
      }
    },
    watch: {
      courseTickerStatus(status){
        if(status) {
          this.getTotalTickerBalanceFor(this.counterValue)
            .then(balances => {
              this.calcChartData(balances)
            })
        }
      }
    },
    mounted() {
      this.getTotalTickerBalanceFor(this.counterValue)
        .then(balances => {
          this.calcChartData(balances)
        })
    }
  }
</script>

<style scoped>

</style>

<template>
  <div class="input-group input-group-sm date">
    <date-picker v-model="date" :config="config" :wrap="true"></date-picker>
    <span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span>
  </div>
</template>

<script>
  import datePicker from 'vue-bootstrap-datetimepicker';
  import moment from 'moment'

  export default {
    props:{
      value: {
        default: null,
        required: true,
        validator(value) {
          return value === null || value instanceof Date || typeof value === 'string' || value instanceof String || value instanceof moment
        }
      },
      minDate: {
        type: Date,
        required: false,
        default: null,
      },
      maxDate: {
        type: Date,
        required: false,
        default: null,
      }
    },
    components: {
      datePicker
    },
    name: "form-datepicker",
    data() {
      return {
        ignoreNext: false,
        date: new Date(this.value),
        config: {
          format: this.$t('common.date.format'),
          useCurrent: true,
          locale: this.$store.state.i18n.locale,
          keyBinds: null,
          sideBySide: true,
          toolbarPlacement: 'top',
          showTodayButton: true,
          showClear: true,
          showClose: true,
          minDate: this.minDate ? this.minDate : false,
          maxDate: this.maxDate ? this.maxDate : false,
          widgetPositioning: {
            horizontal: 'auto',
            vertical: 'bottom'
          },
        }
      }
    },
    watch: {
      date(){
        if(this.ignoreNext){
          this.ignoreNext = false
          return
        }

        //here we want to return a "true" date instead of the date as string
        this.$emit('input', moment(this.date, this.$t('common.date.format')).toDate());
      },
      minDate(newVal){
        this.config.minDate = newVal
      },
      maxDate(newVal){
        this.config.maxDate = newVal
      },
      value(newVal){
        this.ignoreNext = true  //prevent endless loop
        this.date = new Date(newVal)
      }
    }
  }
</script>

<style scoped>

</style>

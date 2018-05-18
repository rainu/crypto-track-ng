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
      }
    },
    components: {
      datePicker
    },
    name: "form-datepicker",
    data() {
      return {
        date: new Date(this.value),
        config: {
          format: this.$t('common.datetime.format'),
          useCurrent: true,
          locale: this.$store.state.i18n.locale,
          keyBinds: null,
          sideBySide: true,
          toolbarPlacement: 'top',
          showTodayButton: true,
          showClear: true,
          showClose: true,
          widgetPositioning: {
            horizontal: 'auto',
            vertical: 'bottom'
          },
        }
      }
    },
    watch: {
      date(){
        //here we want to return a "true" date instead of the date as string
        this.$emit('input', moment(this.date, this.$t('common.datetime.format')).toDate());
      }
    }
  }
</script>

<style scoped>

</style>

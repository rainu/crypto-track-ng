<template>
  <span>{{date()}}</span>
</template>

<script>
  import moment from 'moment'
  import info from '../../../common/project-info'

  export default {
    methods: {
      date() {
        return moment(new Date(info.build.date)).format(this.$t('common.datetime.format'));
      }
    }
  }
</script>

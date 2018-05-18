<template>
  <a @click.prevent="refresh()">
    <span class="time">{{time}} <i class="fa fa-refresh"></i></span>
  </a>
</template>

<script>
  import moment from 'moment'
  import {mapState, mapActions} from 'vuex';

  export default {
    data(){
      return {
        time: ''
      }
    },
    computed: {
      ...mapState({
        expiresAt: state => new Date(state.auth.expiresAt),
      }),
    },
    methods: {
      ...mapActions({
        refresh: 'auth/refresh'
      }),
      calcTime(){
        let now = moment(new Date());
        let end = moment(this.expiresAt); // another date
        let diff = end.diff(now);
        let diffDate = moment.utc(diff);
        let format = "HH:mm:ss";

        if(diffDate.hour() <= 0) {
          format = "mm:ss"
        }

        this.time = diffDate.format(format)
      }
    },
    mounted(){
      setInterval(this.calcTime, 1000)
    }
  }
</script>

<style scoped>
  a:not(:hover) span i {
    display: none;
  }
  a {
    cursor: pointer;
  }

</style>

<template>
  <a href="javascript:void(0);"
     data-toggle="tooltip"
     :title="$t('login.logout')"
     aria-expanded="true" @click="logout">
    <i class="fa fa-power-off"></i>
  </a>
</template>

<script>

  export default {
    methods: {
      logout(){
        this.$store.dispatch('auth/logout')
        this.$router.$goto('startpage')
      }
    },
  }
</script>

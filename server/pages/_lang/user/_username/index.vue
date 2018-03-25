<template>
  <section class="container">
    <button class="btn btn-primary" @click="logout">{{$t('login.logout')}}</button>
  </section>
</template>

<script>
import LoginMask from "@/components/LoginMask";
import {mapGetters} from 'vuex';

export default {
  components: {
    LoginMask
  },
  methods: {
    logout(){
      this.$store.dispatch('auth/logout')
      this.$router.$goto('startpage')
    }
  },
  computed: {
    ...mapGetters({
      isAuthenticated: 'auth/isAuthenticated'
    })
  }
}
</script>

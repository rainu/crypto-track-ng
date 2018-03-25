<template>
  <section class="container">
    <login-mask v-if="!isAuthenticated"></login-mask>
  </section>
</template>

<script>
import LoginMask from "@/components/LoginMask";
import {mapGetters} from 'vuex';

export default {
  layout: 'login',
  components: {
    LoginMask
  },
  computed: {
    ...mapGetters({
      isAuthenticated: 'auth/isAuthenticated'
    })
  },
  watch: {
    isAuthenticated(authenticated){
      if(authenticated) {
        //go to user home after login was successfully
        this.$router.$goto('userhome')
      }
    }
  },
  created() {
    if(this.$store.getters['auth/isAuthenticated']) {
      //go to user home after login was successfully
      this.$router.$goto('userhome')
    }
  }
}
</script>

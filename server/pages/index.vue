<template>
  <section class="container">
    <login-mask v-if="!isAuthenticated"></login-mask>
    <button v-else class="btn btn-primary" @click="logout">Logout</button>
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
    }
  },
  computed: {
    ...mapGetters({
      isAuthenticated: 'auth/isAuthenticated'
    })
  }
}
</script>

<template>
  <div class="login-box">
    <div class="login-logo">
      <b>CoinTrack</b>
    </div>
    <div class="login-box-body">
      <message-error v-if="loginFails">{{$t('login.failed')}}</message-error>

      <form @submit.prevent="login">
        <div class="form-group has-feedback" :class="{'has-error': loginFails}">
          <input class="form-control" :placeholder="$t('login.username')" type="text" v-model="username">
          <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
        </div>
        <div class="form-group has-feedback" :class="{'has-error': loginFails}">
          <input class="form-control" :placeholder="$t('login.password')" type="password" v-model="password">
          <span class="glyphicon glyphicon-lock form-control-feedback"></span>
        </div>
        <div class="row">
          <!-- /.col -->
          <div class="col-lg-offset-4 col-lg-8 col-xs-12">
            <button type="submit" class="btn btn-primary btn-block btn-flat">{{$t('login.login')}}</button>
          </div>
          <!-- /.col -->
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        username: '',
        password: '',
        status: ''
      }
    },
    computed: {
      loginFails() {
        return this.status === "invalid";
      }
    },
    methods: {
      login() {
        this.$store.dispatch('auth/login', {
          username: this.username,
          password: this.password,
        }).then(status => {
          this.status = status

          //logged in
          if(this.status) {
            //do cool stuff here after the user was successfully logged in...

            this.$store.dispatch('wallet/refreshWallets')
            this.$store.dispatch('transaction/refreshTransactions')
          }
        })
      }
    }
  }
</script>

<template>
  <footer class="main-footer navbar-fixed-bottom">
    <div class="col-xs-1 border-top"></div>
    <nuxt-link :to="{name: 'lang-user-username-dashboard', params: { username: $route.params.username }}" tag="div" class="col-xs-2 text-center nuxt-link border border-right border-top" active-class="active" exact>
      <i class="fa fa-dashboard"></i>
    </nuxt-link>
    <nuxt-link :to="{name: 'lang-user-username-wallet', params: { username: $route.params.username }}" tag="div" class="col-xs-2 text-center nuxt-link border border-right border-top" active-class="active">
      <i class="fa fa-briefcase"></i>
    </nuxt-link>
    <nuxt-link :to="{name: 'lang-user-username-transaction', params: { username: $route.params.username }}" tag="div" class="col-xs-2 text-center nuxt-link border-right border-top" active-class="active">
      <i class="fa fa-exchange"></i>
    </nuxt-link>
    <nuxt-link :to="{name: 'lang-user-username-tax-report', params: { username: $route.params.username }}" tag="div" class="col-xs-2 text-center nuxt-link border-right border-top" active-class="active" exact>
      <i class="fa fa-line-chart"></i>
    </nuxt-link>
    <nuxt-link :to="{name: 'lang-user-username-backup', params: { username: $route.params.username }}" tag="div" class="col-xs-2 text-center nuxt-link border-top" active-class="active" exact>
      <i class="fa fa-database"></i>
    </nuxt-link>
    <div class="col-xs-1 border-top"></div>
  </footer>
</template>

<script>
  export default {
    name: "MainFooter"
  }
</script>

<style scoped>
  .main-footer {
    padding: 0px;
    border: 0;
  }

  .nuxt-link {
    padding-top: 1em;
    padding-bottom: 1em;
    cursor: pointer;
  }

  .border-top {
    border-top: 1px solid #d2d6de;
  }

  .border-right {
    border-right: 1px solid #f4f4f4;
  }

  .nuxt-link:hover {
    background-color: rgb(236, 240, 245);
  }

  .active {
    background-color: #d2d6de !important;
  }

   .border-top:hover {
    border-top: 0;
  }

</style>

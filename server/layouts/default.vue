<template>
  <div class="wrapper">
    <header class="main-header">
      <a href="" class="logo">
        <span class="logo-mini">CT</span>
        <span class="logo-lg">CoinTrack</span>
      </a>
      <nav class="navbar navbar-static-top">
        <a href="javascript:void(0);" class="sidebar-toggle" data-toggle="push-menu" role="button">
          <span class="sr-only">Toggle navigation</span>
        </a>

        <!-- Navbar Right Menu -->
        <div class="navbar-custom-menu">
          <ul class="nav navbar-nav">

            <!-- session -->
            <li>
              <auth-session-time/>
            </li>

            <!-- user -->
            <li class="">
              <auth-logout />
            </li>

          </ul>
        </div>
      </nav>
    </header>
    <aside class="main-sidebar">
      <section class="sidebar">
        <ul class="sidebar-menu tree" data-widget="tree">
          <nuxt-link :to="{name: 'lang-user-username-dashboard', params: { username: $route.params.username }}" tag="li" active-class="active" exact>
            <a>
              <i class="fa fa-dashboard"></i>
              <span>Dashboard</span>
            </a>
          </nuxt-link>
          <nuxt-link :to="{name: 'lang-user-username-wallet', params: { username: $route.params.username }}" tag="li" active-class="active">
            <a>
              <i class="fa fa-briefcase"></i>
              <span>Wallets</span>
            </a>
          </nuxt-link>
          <nuxt-link :to="{name: 'lang-user-username-transaction', params: { username: $route.params.username }}" tag="li" active-class="active">
            <a>
              <i class="fa fa-exchange"></i>
              <span>Transaktionen</span>
            </a>
          </nuxt-link>
          <nuxt-link :to="{name: 'lang-user-username-tax-report', params: { username: $route.params.username }}" tag="li" active-class="active" exact>
            <a>
              <i class="fa fa-line-chart"></i>
              <span>Steuer-Report</span>
            </a>
          </nuxt-link>
          <nuxt-link :to="{name: 'lang-user-username-backup', params: { username: $route.params.username }}" tag="li" active-class="active" exact>
            <a>
              <i class="fa fa-database"></i>
              <span>Backup</span>
            </a>
          </nuxt-link>
        </ul>
      </section>
    </aside>
    <div class="content-wrapper">
      <section class="content-header"></section>
      <section class="content container-fluid">
        <nuxt/>
      </section>
    </div>

    <footer class="main-footer">
      <div class="row">
        <div class="col-xs-12 col-lg-6">
          <strong class="well-sm">Version</strong>
          <project-version />
        </div>
        <div class="col-xs-12 col-lg-6 text-right">
          <strong class="well-sm">© Rainu</strong>
          <project-build-date />
        </div>
      </div>
    </footer>
    <!-- Add the sidebar's background. This div must be placed immediately after the control sidebar -->
    <div class="control-sidebar-bg"></div>
  </div>
</template>

<style>

</style>

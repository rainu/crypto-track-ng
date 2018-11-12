<template>
  <div class="wrapper" :class="{ mobile: $device.isMobileOrTablet, desktop: $device.isDesktop}">
    <header class="main-header">
      <a href="" class="logo">
        <span class="logo-mini">
          <img src="/app-icon-128x128.png" alt="CT" style="width:80%" />
        </span>
        <span class="logo-lg">CoinTrack</span>
      </a>
      <nav class="navbar navbar-static-top">
        <a href="javascript:void(0);" class="sidebar-toggle" data-toggle="push-menu" role="button">
          <span class="sr-only">Toggle navigation</span>
        </a>

        <!-- Navbar Right Menu -->
        <div class="navbar-custom-menu">
          <ul class="nav navbar-nav">

            <!-- info -->
            <nuxt-link :to="{name: 'lang-legal'}" tag="li" active-class="active" exact>
              <a>
                <i class="fa fa-question-circle"></i>
              </a>
            </nuxt-link>

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

    <!-- Add the sidebar's background. This div must be placed immediately after the control sidebar -->
    <div class="control-sidebar-bg"></div>
  </div>
</template>

<style>

</style>

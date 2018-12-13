<template>
  <header class="main-header">
    <nav class="navbar navbar-static-top">

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
            <auth-session-time />
          </li>

          <!-- user -->
          <li class="">
            <auth-logout />
          </li>

        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
  export default {
    name: "MainHeader"
  }
</script>

<style scoped>

</style>

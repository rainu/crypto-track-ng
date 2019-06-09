<template>
  <div class="wrapper" :class="{ mobile: $device.isMobileOrTablet, desktop: $device.isDesktop}">
    <main-header/>

    <div class="content-wrapper">
      <section class="content-header"></section>
      <section class="content">
        <nuxt/>
      </section>
    </div>

    <main-footer/>

    <!-- Add the sidebar's background. This div must be placed immediately after the control sidebar -->
    <div class="control-sidebar-bg"></div>
  </div>
</template>

<script>
  import MainHeader from "../components/MainHeader";
  import MainFooter from "../components/MainFooter";

  export default {
    components: {MainFooter, MainHeader}
  }
</script>

<style scoped>
  .content {
    padding-bottom: 4em;
  }
  .content-wrapper {
    padding-top: 50px;
  }
</style>

<style>
  .word-wrap {
    word-wrap: break-word
  }
</style>

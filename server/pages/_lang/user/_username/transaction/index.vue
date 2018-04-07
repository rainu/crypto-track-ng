<template>
  <div>
    <div class="row">
      <div class="col-xs-6 col-lg-2">
          <nuxt-link :to="{name: 'lang-user-username-transaction-new', params: { username: $route.params.username }}">
            <button class="btn btn-block btn-primary" type="submit">
              <i class="fa fa-plus"></i> {{$t('common.new')}}
            </button>
          </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

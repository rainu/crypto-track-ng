<template>
  <div>
    <transaction-table>
      <template slot-scope="{tx}">
        <button type="button" class="btn btn-block btn-danger" @click="requestDeleteTransaction(tx.id)" :title="$t('common.delete')">
          <i class="fa fa-trash"></i>
        </button>
        <nuxt-link :to="{name: 'lang-user-username-transaction-edit-id', params: { id: tx.id }}" tag="a" role="button" class="btn btn-block btn-primary" :title="$t('common.edit')">
          <i class="fa fa-pencil"></i>
        </nuxt-link>
      </template>
    </transaction-table>
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
    data(){
      return {
        deleteRequest: null,
      }
    },
    computed: {
    },
  }
</script>

<style scoped>
</style>

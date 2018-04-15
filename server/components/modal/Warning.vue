<template>
  <modal-general
    :title="title"
    :modal-class="modalClass"
    :options="options"
    :close-option="closeOption"
    :payload="payload"
    @decided="decided"
  >

    <slot></slot>
  </modal-general>
</template>

<script>
  export default {
    name: "modal-warning",
    props:{
      title: {
        type: String,
        default: "common.alert"
      },
      modalClass: {
        type: String,
        default: ''
      },
      options: {
        type: Array,
        default() {
          return [{
            "name": "cancel",
            "label": 'common.abort',
            "btnClass": "btn-primary"
          }, {
            "name": "ok",
            "label": 'common.ok',
            "btnClass": "btn-primary"
          }]
        }
      },
      closeOption: {
        type: String,
        default: 'cancel',
      },
      payload: {
        required: false
      }
    },
    methods: {
      decided(answer){
        this.$emit('decided', answer);
      }
    }
  }
</script>

<style scoped>

</style>

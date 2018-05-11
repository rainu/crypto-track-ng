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
    name: "modal-read-only",
    props:{
      title: {
        type: String,
        default: "common.info"
      },
      modalClass: {
        type: String,
        default: ''
      },
      options: {
        type: Array,
        default() {
          return [{
            "name": "ok",
            "label": 'common.ok',
            "btnClass": "btn-primary"
          }]
        }
      },
      closeOption: {
        type: String,
        default: 'ok',
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

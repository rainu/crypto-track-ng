<template>
  <select class="form-control">
    <slot></slot>
  </select>
</template>

<script>
  export default {
    props: {
      options: {
        required: false,
        default: () => {
          return {}
        }
      },
      value: {
        required: false
      },
      css: {
        required: false,
        default: () => { return {} }
      }
    },
    name: 'form-suggestion-select',
    mounted: function () {
      let opt = this.options;
      opt.containerCssClass = this.css;

      let vm = this
      $(this.$el)
      // init select2
      .select2({ data: opt })
      .val(this.value)
      .trigger('change')
      // emit event on change.
      .on('change', function () {
        vm.$emit('input', this.value)
      })
    },
    watch: {
      value: function (value) {
        // update value
        $(this.$el).val(value)
      },
      options: function (options) {
        // update options
        $(this.$el).empty().select2({ data: options })
      }
    },
    destroyed: function () {
      $(this.$el).off().select2('destroy')
    }
  }
</script>

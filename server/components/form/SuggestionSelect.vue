<template>
  <select class="form-control" :multiple="options.multiple">
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
        vm.$emit('input', $(this).val())
      })
    },
    watch: {
      value: function (value) {
        if ([...value].sort().join(",") !== [...$(this.$el).val()].sort().join(",")) {
          $(this.$el).val(value).trigger('change');
        }
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

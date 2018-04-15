<template>
  <div class="modal fade in" :class="modalClass" style="display: block; padding-right: 12px;" :style="style">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" aria-label="Close" @click="close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title">{{$t(title)}}</h4>
        </div>
        <div class="modal-body">
          <p><slot></slot></p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary"
                  v-for="option in options"
                  :class="option.btnClass"
                  @click="decided(option.name)">{{$t(option.label)}}</button>
        </div>
      </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
  </div>
</template>

<script>
  export default {
    name: "modal-general",
    props:{
      title: {
        type: String,
      },
      modalClass: {
        type: String,
        default: ''
      },
      options: {
        type: Array,
        required: true,
      },
      closeOption: {
        type: String,
        required: true,
      },
      payload: {
        required: false
      }
    },
    data(){
      return {
        style: ''
      }
    },
    methods: {
      close(){
        this.decided(this.closeOption)
      },
      decided(option){
        //hide the modal
        this.style = "display: none;"

        this.$emit('decided', {
          option: option,
          payload: this.payload
        });
      }
    }
  }
</script>

<style scoped>

</style>

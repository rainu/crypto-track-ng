<template>
  <div class="row">
    <message-error v-show="downloadError">{{$t('backup.download-error', { err: downloadError })}}</message-error>
    <message-error v-show="uploadError">{{$t('backup.upload-error', { err: uploadError })}}</message-error>
    <message-success v-show="uploadSuccess">{{$t('backup.upload-success')}}</message-success>

    <div class="col-xs-12 col-lg-6">
      <div class="info-box">
        <span class="info-box-icon bg-aqua"><i class="fa fa-cloud-upload"></i></span>

        <div class="info-box-content">
          <button class="btn btn-lg btn-primary btn-block" @click="$refs.fileInput.click()">{{$t('backup.action.upload')}}</button>
          <form role="form" class="form" onsubmit="return false;">
            <div class="form-group">
              <input ref="fileInput" style="display: none;" type="file" @change="onFileChange" />
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="col-xs-12 col-lg-6">
      <div class="info-box">
        <span class="info-box-icon bg-aqua"><i class="fa fa-download"></i></span>

        <div class="info-box-content">
          <button class="btn btn-lg btn-primary btn-block" @click="download">{{$t('backup.action.download')}}</button>
        </div>
      </div>
    </div>

    <a class="download-link"></a>
  </div>
</template>

<script>
  import HttpStatus from 'http-status-codes';
  import { mapState } from 'vuex';

  export default {
    name: "backup",
    data(){
      return {
        files: [],
        downloadError: '',
        uploadError: '',
        uploadSuccess: null,
      }
    },
    computed: {
      ...mapState({
        account: state => state.auth,
      }),
    },
    methods:{
      onFileChange(e) {
        this.files = e.target.files || e.dataTransfer.files;
        this.upload();
      },
      upload(){
        if (!this.files.length) return;
        this.uploadError = '';
        this.uploadSuccess = '';

        let data = new FormData();
        data.append('file', this.files[0]);

        this.$axios.put(`/api/backup`, data).then((response) => {
          if(response && response.status === HttpStatus.CREATED) {
            this.uploadSuccess = true;
          } else {
            this.uploadError = this.$t('backup.upload-error-file-corrupted');
          }
        }).catch(err => {
          this.uploadError = err.message;
        });
      },
      download(){
        this.downloadError = null;

        this.$axios.get(`/api/backup/`).then((response) => {
          let blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'text/json' } );
          let link = this.$el.querySelector('a.download-link');
          link.href = window.URL.createObjectURL(blob);
          link.download = `cryptotrack_backup_${this.account.username}.json`;
          link.click();
        }).catch(err => {
          this.downloadError = err.message;
        });
      }
    }
  }
</script>

<style scoped>
  a.download-link {
    display:none;
  }
</style>

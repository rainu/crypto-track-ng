<template>
  <span>{{version()}}</span>
</template>

<script>
  import info from '../../../common/project-info'

  export default {
    methods: {
      version() {
        return info.build.version;
      }
    }
  }
</script>

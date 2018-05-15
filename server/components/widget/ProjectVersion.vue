<template>
  <span :title="fullVersion()">{{shortVersion()}}</span>
</template>

<script>
  import info from '../../../common/project-info'

  export default {
    methods: {
      fullVersion() {
        return info.build.version;
      },
      shortVersion() {
        return info.build.version.substring(0, 8)
      }
    }
  }
</script>

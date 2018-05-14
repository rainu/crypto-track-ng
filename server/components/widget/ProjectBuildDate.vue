<template>
  <span>{{date()}}</span>
</template>

<script>
  import info from '../../../common/project-info'

  export default {
    methods: {
      date() {
        return info.build.date;
      }
    }
  }
</script>

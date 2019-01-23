<template>
  <div>
    <loading v-show="isLoading"></loading>
  </div>
</template>

<script>
import Loading from 'base/loading/loading'
export default {
  props: {
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Loading
  }
}
</script>

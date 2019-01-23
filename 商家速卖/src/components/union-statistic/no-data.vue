<template>
  <div class="no-data" v-show="!listData.length">
    <img src="./data_empty.png">
  </div>
</template>

<script>
export default {
  props: {
    listData: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.no-data
  width 34%
  margin 0 auto
  padding 0
  img
    width 100%
    height auto
</style>




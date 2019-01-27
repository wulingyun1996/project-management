<template>
  <div class="image">
    <img :src="src" :width="width" :height="height" alt="">
    <!-- <img v-if="src" :src="src" :width="width" :height="height" alt="">
    <div v-else>
      <i class="el-icon-loading"></i>
    </div> -->
  </div>
</template>

<script>
export default {
  props: {
    row: {
      type: Object,
      default: () => {}
    },
    col: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    width () {
      return this.row.width || 100
    },
    height () {
      return this.row.height || this.col.height || 'auto'
    },
    src () {
      return this.row.src || false
    }
  }
}

</script>
<style lang="stylus" scoped>
.image
  display: inline-flex
  justify-content space-between
  align-items center
i
  font-size 50px
</style>

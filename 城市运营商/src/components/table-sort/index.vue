<template>
  <div class="sort">
    <div @click="up" class="up" v-if="isFirst">
      <i class="el-icon-back"></i>
    </div>
    <div @click="down" class="down" v-if="isLast" >
      <i class="el-icon-back"></i>
    </div>
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
    },
    index: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    up () {
      this.$emit('up', this.row)
    },
    down () {
      this.$emit('down', this.row)
    }
  },
  computed: {
    isFirst () {
      return this.row.sort > this.col.sortMin
    },
    isLast () {
      return this.row.sort < this.col.sortMax
    }
  }
}

</script>
<style lang="stylus" scoped>
@import '~@/assets/css/mixins'
  .sort
    display flex
    justify-content center
    div
      cursor pointer
      i
        font-size 20px
      margin 0 10px
      &.up
        transform rotate(90deg)
      &.down
        transform rotate(-90deg)
</style>

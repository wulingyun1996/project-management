<template>
  <div class="table-sort-container">
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
    }
  },
  data () {
    return {
      isFirst: true,
      isLast: true,
      showArrow: this.row.showArrow
    }
  },
  methods: {
    up () {
      this.row.sortBy = 'up'
      this.$emit('clickCurrentButton', this.row)
    },
    down () {
      this.row.sortBy = 'down'
      this.$emit('clickCurrentButton', this.row)
    }
  },
  watch: {
    showArrow: {
      handler (val) {
        switch (val) {
          case 0:
            this.isFirst = false
            this.isLast = false
            break
          case 1:
            this.isFirst = false
            break
          case 2:
            this.isLast = false
            break
          case 3:
            this.isFirst = true
            this.isLast = true
            break
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/css/mixins'
.table-sort-container
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

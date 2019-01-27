<template>
  <div class="market-notice-container">
    <span>{{ text }}</span>
    <i
      v-show="isShowIcon"
      @click="viewReason"
      class="el-icon-question">
    </i>
  </div>
</template>

<script>
export default {
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      isDelete: this.row.is_delete
    }
  },
  computed: {
    text () {
      return this.isDelete ? '已上架' : '已下架'
    },
    isShowIcon () {
      return !this.isDelete
    }
  },
  methods: {
    viewReason () {
      this.$emit('clickCurrentButton', this.row)
    }
  },
  watch: {
    row: {
      handler (newVal) {
        this.isDelete = newVal.is_delete
      },
      deep: true
    }
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/mixins'
.market-notice-container
  flex-f-align()
  justify-content center
  f14()
  span
    margin-right 10px
  i
    cursor pointer
</style>

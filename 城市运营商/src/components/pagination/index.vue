<template>
  <div class="pagination-container">
    <el-pagination
      background
      layout="total, prev, pager, next, jumper"
      prev-text="上一页"
      next-text="下一页"
      :page-size="pageSize"
      :total="total"
      @current-change="changePage">
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },
  methods: {
    changePage (page) {
      this.$emit('changePage', page)
    }
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/mixins'
.pagination-container
  padding 20px
  flex-f-align()
  justify-content center
</style>

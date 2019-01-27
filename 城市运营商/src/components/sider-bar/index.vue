<template>
  <div class="sider-bar-container" :class="{ active: shouldFoldSiderBar }">
    <el-menu
      mode="vertical"
      unique-opened
      :default-active="$route.path"
      :collapse="shouldFoldSiderBar"
      background-color="#393d40"
      text-color="#fff"
      active-text-color="#fd7922">
      <base-sider-bar-item :siderBarData="siderBarData"></base-sider-bar-item>
    </el-menu>
  </div>
</template>

<script>
import BaseSiderBarItem from './sider-bar-item'
export default {
  props: {
    shouldFoldSiderBar: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      siderBarData: this.$router.options.routes
    }
  },
  components: {
    BaseSiderBarItem
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.sider-bar-container
  transition width .4s
  width 180px!important
  height 100%
  background #393d40
  overflow hidden
  overflow-y scroll
  &.active
    // overflow hidden
    width 36px!important
    .el-menu-item
      padding-left 10px!important
      position relative
      span
        height 0
        width 0
        overflow hidden
        visibility hidden
        transition opacity .3s cubic-bezier(.55, 0, .1, 1)
        opacity 0
        display inline-block
      &:hover
        span
          display block
          border-radius 3px
          z-index 1002
          width 140px
          height 56px
          visibility visible
          position absolute
          right -145px
          text-align left
          text-indent 20px
          top 0px
          background-color #2f3235!important
          opacity 1
    .sider-bar-item-container
      .el-submenu
        div.el-submenu__title
          padding-left 10px!important
          span,
          .el-submenu__icon-arrow
            display none
        .nest-menu
          .el-submenu__icon-arrow
            display block!important
          span
            display inline-block!important
  a
    display inline-block
    width 100%
  .svg-icon
    margin-right 4px
  >ul
    width 100%
    border none
</style>

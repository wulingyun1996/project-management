<template>
  <div class="tabs-container">
    <el-tabs v-model="currentTab" type="card" @tab-click="handleClick">
      <el-tab-pane
        v-for="(item, index) in tabItemList"
        :key="index"
        :label="item.label"
        :name="item.name" >
        {{ item.text }}
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
/**
 * tabItems 模板
 * const tabItems = [
 *  {
 *    label: '未通过',      ----> tab 页面标题
 *    text: '未通过页面',    ----> 文本内容，非必须
 *    name: 1               ----> 当前 tab 被选中时，绑定的 value 值
 *  }
 * ]
 */
export default {
  props: {
    tabItems: {
      type: Array,
      default: () => []
    },
    defaultTab: {
      type: String
    }
  },
  data () {
    return {
      currentTab: this.defaultTab,
      tabItemList: this.tabItems
    }
  },
  methods: {
    handleClick () {
      this.$emit('clickCurrentTab', this.currentTab)
    }
  }
}
</script>

<style lang="stylus">
.tabs-container
  .el-tabs
    .el-tabs__nav
      .el-tabs__item
        &:hover
          color #ff8a00!important
        &.is-active
          color #ff8a00!important
</style>

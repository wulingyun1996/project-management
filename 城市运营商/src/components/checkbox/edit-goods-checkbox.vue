<template>
  <div class="check-box-container">
    <div
      class="goods-check-box-item"
      v-for="(checkItem, index) of checkList"
      :key="index">
      <el-checkbox
        :disabled="checkItem.disabled"
        :size="checkItem.size || boxSize"
        v-model="checkItem.checked"
        @change="checkCurrentBox(checkItem)">
        {{ checkItem.name }}
      </el-checkbox>
      <i class="icon-close el-icon-circle-close" v-if="checkItem.is_custom" @click.stop="removeCustomSkuItem(checkItem)"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: Number,
      default: 2
    },
    data: {
      type: Array,
      default: () => [] 
    }
  },
  data () {
    return {
      boxSize: 'small',
      checkList: this.data
    }
  },
  created () {
    this.setCheckboxSize()
  },
  methods: {
    setCheckboxSize () {
      let { size } = this
      switch (size) {
        case 1:
          this.boxSize = 'mini'
          break
        case 2:
          this.boxSize = 'small'
          break
        case 3:
          this.boxSize = 'medium'
          break
      }
    },
    checkCurrentBox (item) {
      this.$emit('checkCurrentBox', item)
    },
    removeCustomSkuItem (item) {
      this.$emit('removeCustomSkuItem', item)
    }
  },
  watch: {
    data (val) {
      this.checkList = val
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.check-box-container
  width 100%
  flex-f-align()
  flex-wrap wrap
  .goods-check-box-item
    position relative
    margin-bottom 15px
    width 150px
    margin-left 0
    margin-right 30px
</style>

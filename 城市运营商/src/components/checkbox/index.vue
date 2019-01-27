<template>
  <div class="check-box-container">
    <el-checkbox
      v-for="(checkItem, index) of checkList"
      :key="index"
      :disabled="checkItem.disabled"
      :size="checkItem.size || boxSize"
      v-model="checkItem.checked"
      @change="checkCurrentBox(checkItem)">
      {{ checkItem.name }}
      <i class="icon-close el-icon-circle-close" @click.stop="removeCustomSkuItem(checkItem.level, index)"></i>
    </el-checkbox>
    <el-checkbox
      v-if="isShowCheckbox"
      :disabled="checkboxItem.disabled"
      :size="checkboxItem.size || boxSize"
      v-model="checkboxItem.checked"
      @change="checkCurrentBoxItem(checkboxItem)">
      {{ checkboxItem.name }}
    </el-checkbox>
  </div>
</template>

<script>
import { isEmptyObj } from 'utils'
export default {
  props: {
    size: {
      type: Number,
      default: 2
    },
    data: {
      type: Array,
      default: () => [] 
    },
    dataItem: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      boxSize: 'small',
      checkList: this.data,
      checkboxItem: this.dataItem,
      isShowCheckbox: false
    }
  },
  created () {
    this.setCheckboxSize()
    this.isShowCheckbox = !!isEmptyObj(this.dataItem)
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
    removeCustomSkuItem (parentIndex, itemIndex) {
      let obj = {
        parentIndex,
        itemIndex
      }
      this.$emit('removeCustomSkuItem', obj)
    },
    checkCurrentBoxItem (item) {
      this.$emit('checkCurrentBoxItem', item)
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
  > label
    margin-bottom 15px
    width 150px!important
    margin-left 0!important
    margin-right 30px!important
</style>

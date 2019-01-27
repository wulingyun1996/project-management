<template>
  <div class="table-radio-container">
    <el-radio v-model="radio" :label="true" :disabled="disabled"></el-radio>
  </div>
</template>

<script>
// 使用该组件的时候需要为当前行添加上一个 customRadio 属性
export default {
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      radio: this.row.customRadio || false,
      disabled: this.row.disabled || false
    }
  },
  watch: {
    radio (val) {
      if (!val) return
      this.row.customRadio = true
      this.$emit('clickCurrentButton', this.row)
    },
    row: {
      handler (newVal) {
        this.disabled = !!newVal.disabled
        if (newVal.customRadio) return
        this.radio = false
      },
      deep: true
    }
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.table-radio-container
  label
    .el-radio__input
      &.is-checked
        span.el-radio__inner
          border-color $color-orange
          background $color-orange
      & + .el-radio__label
        display none
</style>

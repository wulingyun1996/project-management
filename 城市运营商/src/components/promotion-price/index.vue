<template>
  <div class="input-container">
    <el-input
      v-model="currentVal"
      :type="type"
      :maxlength="maxlength"
      :placeholder="placeholder"
      @change="changeInputValue"
      @clear="clearInputValue"
      size="small"
      clearable>
    </el-input>
  </div>
</template>

<script>
export default {
  props: {
    inputValue: {
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入内容'
    },
    type: {
      type: String,
      default: 'text'
    },
    maxlength: {
      type: Number,
      default: Infinity
    },
    row: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      currentVal: this.row.inputPriceVale || this.inputValue
    }
  },
  methods: {
    changeInputValue (value) {
      let obj = {
        value,
        type: 'price',
        row: this.row
      }
      this.$emit('clickCurrentButton', obj)
    },
    clearInputValue () {
      this.$emit('clickCurrentButton', '')
    }
  },
  watch: {
    inputValue (val) {
      this.currentVal = val
    },
    row: {
      handler (val) {
        this.currentVal = this.row.inputPriceVale || this.inputValue
      },
      deep: true
    }
  }
}
</script>

<style lang="stylus">
.input-container
  div.el-input
    width 100%!important
    margin-left 0!important
</style>

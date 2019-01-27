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
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      currentVal: this.row.inputValue || this.inputValue
    }
  },
  methods: {
    changeInputValue (value) {
      this.$emit('changeInputValue', value)
      this.$emit('clickCurrentButton', value)
    },
    clearInputValue () {
      this.$emit('changeInputValue', '')
      this.$emit('clickCurrentButton', '')
    }
  },
  watch: {
    inputValue (val) {
      this.currentVal = val
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

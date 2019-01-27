<template>
  <div class="select-container">
    <el-select
      :placeholder="placeholder"
      v-model="currentOption"
      @change="changeCurrentOption"
      @clear="clearCurrentOption"
      size="small"
      clearable>
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      currentOption: ''
    }
  },
  methods: {
    // 清空当前值
    clearCurrentOption () {
      this.$emit('changeCurrentOption', '')
    },
    changeCurrentOption (value) {
      this.$emit('changeCurrentOption', value)
    }
  }
}
</script>

<style lang="stylus">
.select-container
  .el-select
    div.el-input
      width 100%!important
      margin-left 0!important
</style>

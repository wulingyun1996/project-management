<template>
  <div class="time-picker-container">
    <div class="time-description">{{ timeText }}</div>
    <el-date-picker
      size="small"
      v-model="time"
      :type="dataType"
      :value-format="valueFormat"
      :placeholder="placeholder"
      @change="pickerTime">
    </el-date-picker>
  </div>
</template>

<script>
export default {
  props: {
    // 时间数据
    dataTime: {
      Type: String,
      default: ''
    },
    timeText: {
      type: String,
      default: '开始时间'
    },
    placeholder: {
      type: String,
      default: '选择日期时间'
    },
    dataType: {
      type: String,
      default: 'daterange'
    },
    // 时间格式
    valueFormat: {
      type: String,
      default: 'yyyy-MM-dd'
    }
  },
  data () {
    return {
      time: this.dataTime
    }
  },
  methods: {
    // 若点击清空按钮，需要注意此刻 time 为 null
    pickerTime (time) {
      this.$emit('pickerTime', time)
    }
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/mixins'
.time-picker-container
  flex-align-item()
  .time-description
    margin-right 10px
  div.el-date-editor
    margin-left 0!important
  .el-range-editor--small
    &.el-input__inner
      width 220px!important
    .el-range-separator
      padding-right 10px
</style>

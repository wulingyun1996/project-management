<template>
  <div class="table-custom-item">
    <div class="item" v-if="!buttonList.show">
      <span>{{ buttonList.staffNum }}</span>
      <el-button
        :type="buttonList.type"
        :size="buttonList.size"
        @click="clickCurrentButton(buttonList.buttonType)">
        {{ buttonList.text }}
      </el-button>
    </div>
    <div class="item" v-else>
      /
    </div>
  </div>
</template>

<script>
export default {
  props: {
    row: {
      type: Object,
      default: () => {}
    },
    col: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      buttonList: this.row.customButtonList
    }
  },
  watch: {
    row: {
      handler (newVal) {
        this.buttonList = newVal.customButtonList
      },
      deep: true
    }
  },
  methods: {
    clickCurrentButton (type) {
      this.$emit('clickCurrentButton', this.row, type)
    }
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/mixins'
.table-custom-item
  .item
    flex-col()
    align-items center
    justify-content center
    padding 0 10px
</style>

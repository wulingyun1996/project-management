<template>
  <div class="table-button-item">
    <el-button
      v-for="(item, index) in buttonList"
      :key="index"
      :type="item.type"
      :size="item.size"
      @click="clickCurrentButton(item.buttonType, item.operatorType)">
      {{ item.text }}
    </el-button>
    <span v-show="row.customText">{{ row.customText }}</span>
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
      buttonList: this.row.buttonList ? this.row.buttonList : this.col.buttonList
    }
  },
  created () {
    this.handlerBttonList()
  },
  methods: {
    clickCurrentButton (type, operatorType = '') {
      this.$emit('clickCurrentButton', this.row, type, operatorType)
    },
    handlerBttonList () {
      this.buttonList.forEach(item => {
        switch (item.buttonType) {
          case 1:
            item.type = 'primary'
            break
          case 2:
            item.type = 'success'
            break
          case 3:
            item.type = 'warning'
            break
          case 4:
            item.type = 'danger'
            break
          // eslint-disable-next-line
          default: 'primary'
        }
        if (item.size) {
          switch (item.size) {
            case 1:
              item.size = 'medium'
              break
            case 2:
              item.size = 'small'
              break
            case 3:
              item.size = 'mini'
              break
          }
        } else {
          item.size = 'small'
        }
      })
    }
  },
  watch: {
    row: {
      handler (newVal) {
        if (!newVal.buttonList) return
        this.buttonList = newVal.buttonList
      },
      deep: true
    }
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/mixins'
.table-button-item
  flex-align-item()
  justify-content center
  padding 0 10px
</style>

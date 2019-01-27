<template>
  <div class="base-button-item">
    <el-button :type="types" :size="sizes" @click="clickCurrentButton">{{ text }}</el-button>
  </div>
</template>

<script>
export default {
  name: 'Button',
  props: {
    text: {
      type: String,
      default: '编辑'
    },
    type: {
      type: [Number, String],
      default: 0
    },
    size: {
      type: [Number, String],
      default: 2
    }
  },
  computed: {
    types () {
      let type = this.type
      if (typeof type === 'number') {
        switch (type) {
          case 1:
            type = 'primary'
            break
          case 2:
            type = 'success'
            break
          case 3:
            type = 'warning'
            break
          case 4:
            type = 'danger'
            break
          default:
            type = ''
        }
      }
      return type
    },
    sizes () {
      let size = this.size
      if (typeof size === 'number') {
        switch (size) {
          case 1:
            size = 'medium'
            break
          case 2:
            size = 'small'
            break
          case 3:
            size = 'mini'
            break
        }
      }
      return size
    }
  },
  methods: {
    clickCurrentButton () {
      this.$emit('clickCurrentButton')
    }
  }
}
</script>

<style lang='stylus' scoped>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.base-button-item
  .el-button
    margin-left 0!important
</style>

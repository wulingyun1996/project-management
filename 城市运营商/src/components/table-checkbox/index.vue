<template>
  <div>
    <el-checkbox v-model="value" :disabled="isDisable" >{{label}}</el-checkbox>
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
  methods: {
    change () {
      this.row.checked = this.childChecked
      this.$emit('change', this.row)
    }
  },
  computed: {
    label () {
      return this.row.label
    },
    isDisable () {
      return this.row.isDisable
    },
    value () {
      return this.row.checked
    }
  },
  watch: {
    value: {
      row () {
        return this.value
      },
      set (val) {
        this.value = value
      }
    }
  }
}

</script>
<style  scoped>
</style>

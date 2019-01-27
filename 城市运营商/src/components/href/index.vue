<template>
  <div class="table-href">
    <a href="javascript:" @click="clickCurrentButton">{{ title }}</a>
  </div>
</template>

<script>
export default {
  name: 'TableHref',
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      title: this.row.title
    }
  },
  methods: {
    clickCurrentButton () {
      this.$emit('clickCurrentButton', this.row)
    }
  },
  watch: {
    row (newVal) {
      this.title = this.row.title
    }
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/mixins'
.table-href
  wh(100%)
  a
    display block
    wh(100%)
    tc()
    color #409EFF
    text-decoration underline
</style>

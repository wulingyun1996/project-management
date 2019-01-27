<template>
  <div class="canclick">
    <a href="javaScript:" @click="sixTable">{{ text }}</a>
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
      text: this.row.sixTextT
    }
  },
  methods: {
    sixTable () {
      this.$emit('clickCurrentButton', this.row)
    }
  }
}
</script>
<style lang="stylus">
.canclick
  a
    text-direction none 
    color #0000CC;
</style>

<template>
  <div class="canclick">
    <a href="javaScript:" @click="dialogVisible">{{ text }}</a>
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
      text: this.row.topicText
    }
  },
  methods: {
    dialogVisible () {
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
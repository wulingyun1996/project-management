<template>
  <div class="special-authen-manage-container">
    <base-header>
      <div class="special-authen-help" @click="goAuthenHelp">使用帮助</div>
    </base-header>
    <div class="manage-wrapper">
      <img src="./images/authen-guide.png" alt="">
      <div class="manage-set-authen" @click="goAuthenSet">
        <i></i>
        <span>点我立即设置</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SpecialAuthenManage',
  data () {
    return {
      ratio: '',
      text: '',
      id: ''
    }
  },
  created () {
    this.getAuthenDetail()
  },
  methods: {
    getAuthenDetail () {
      let url = 'card/getCradDetails'
      this.$http(url).then(res => {
        if (res.code === this.$ok) {
          if (res.data) {
            let ratio = res.data.one_discount
            if (ratio.indexOf('.') !== -1) {
              if (parseInt(ratio.split('.')[1]) === 0) {
                this.ratio = ratio.split('.')[0]
              }
            }
            this.ratio = ratio
            this.text = res.data.explain
            this.id = res.data.id
          }
        }
      })
    },
    goAuthenHelp () {
      this.$router.push('/authen-guide')
    },
    goAuthenSet () {
      if (this.id === '') {
        this.$router.push({ name: 'SpecialAuthenSet' })
        return
      }
      let { ratio, text, id } = this
      this.$router.push({ name: 'SpecialAuthenSet', query: { ratio, text, id } })
    }
  }
}
</script>

<style lang="stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.special-authen-manage-container
  flex-col()
  height 100%
  overflow hidden
  .special-authen-help
    color #4A90E2
  .manage-wrapper
    flex 1
    bg('bg-authen.png')
    img
      display block
      width 696px
      margin 52px auto 130px
    .manage-set-authen
      width 508px
      height 92px
      border-radius(8px)
      flex-center()
      background $color-orange
      color $color-white
      f16()
      margin 0 auto
      i
        wh(30px)
        bg('icon-plus.png')
        margin-right 16px
</style>

<template>
  <div class="report">
    <div class="tips">请选择举报该求购主题的理由</div>
    <div class="reasons">
      <div class="item" v-for="(item, index) in list" :key="index" @click="selectIndex = index">
        <span>{{item.title}}</span>
        <img :src="selectIndex === index ? require('./images/check_on.png') : require('./images/check_off.png')" alt="">
      </div>
    </div>
    <footer @click="submit" v-if="selectIndex !== -1">
      提交
    </footer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: [
      ],
      selectIndex: -1
    }
  },
  mounted () {
    this.$http('asktobuy/getReportList').then(res => {
      if (res.code === 200) {
        this.list = res.data.reportList
      }
      console.log(res)
    })
  },
  methods: {
    submit () {
      this.$http('asktobuy/reportOn', {
        ask_id: this.$route.query.id,
        reason_id: this.list[this.selectIndex].id
      }).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.$router.replace({'path': '/report-success'})
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.tips
  height 64px
  line-height 64px
  padding-left 35px
  background #F8F8F8
  font-size 24px
  color #333
.item
  height 88px
  display flex
  justify-content space-between
  align-items center
  padding 0 24px 0 40px
  font-size 24px
  color #666
  border-bottom 1px solid #DEDEDE
  img
    width 40px
    height 40px
  span
    line-height 34px
footer
  position fixed
  height 98px
  color #FFF
  font-size 32px
  width 100%
  left 0
  bottom 0
  text-align center
  line-height 98px
  background #FF8A00
</style>

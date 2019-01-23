<template>
  <div class="cgs-manage-container">
    <div class="cgs-manage-wrapper" v-show="!isUnsetManage && flag">
      <base-header>
        <div class="header-right" @click="goMarketNotice">
          <i></i>
          <span>营销公告</span>
          <div class="market-notice-popup" v-show="showMarket">给特约采购师发公告的快速入口</div>
        </div>
      </base-header>
      <div class="manage-header">
        <div class="cgs-number">
          <i></i>
          <span class="cgs-description">特约采购师</span>
          <span class="cgs-num">{{ manageInfo.all_buyer }}</span>
        </div>
        <span class="seperate"></span>
        <div class="cgs-yesteday-add">
          <i></i>
          <span class="cgs-description">昨日新增</span>
          <span class="cgs-num">{{ manageInfo.last_buyer }}</span>
        </div>
        <span class="seperate"></span>
        <div class="cgs-today-add">
          <i></i>
          <span class="cgs-description">今日新增</span>
          <span class="cgs-num">{{ manageInfo.today_buyer }}</span>
        </div>
      </div>
      <div class="seperate"></div>
      <div class="manage-item">
        <ul>
          <li @click="goManageList(1)">
            <i class="auditing"></i>
            <p>
              待审核<span>{{ manageInfo.audit_buyer }}</span>人
            </p>
          </li>
          <li @click="goManageList(2)">
            <i class="passed"></i>
            <p>
              已通过<span>{{ manageInfo.pass_buyer }}</span>人
            </p>
          </li>
          <li @click="goManageList(3)">
            <i class="unpass"></i>
            <p>
              未通过<span>{{ manageInfo.nopass_buyer }}</span>人
            </p>
          </li>
        </ul>
        <div class="cgs-manage-introduce">
          <div class="introduce" @click="showHelpPopup">
            <i></i>
            <span>什么是特约采购师？</span>
          </div>
        </div>
      </div>
    </div>
    <div class="unset-manage" v-show="isUnsetManage && flag">
      <base-header></base-header>
      <img src="./images/no-data.png" alt="">
      <p>您还没有开通店铺特约认证，赶紧去开通再回来找我哦~</p>
      <div class="set-manage-botton" @click="goAuthenManage">马上开通</div>
    </div>
  <base-senior-popup height="auto" ref="helpPopup" class="cgs-help-wrapper">
    <img src="./images/ask.png" alt="">
    <p>当您的店铺已开通了特约认证优惠活动，店铺采购师认证您的店铺后即为您店铺的特约采购师，特约采购师可享受您店铺的特约认证活动商品返佣优惠</p>
    <div class="help-close" @click="hideHelpPopup"></div>
  </base-senior-popup>
  </div>
</template>

<script>
export default {
  name: 'CgsManage',
  data () {
    return {
      manageInfo: {},
      flag: false,
      showMarket: true,
      isUnsetManage: false
    }
  },
  created () {
    this.getManageInfo()
  },
  mounted () {
    setTimeout(() => {
      this.showMarket = false
    }, 3000)
  },
  methods: {
    getManageInfo () {
      let url = 'purchaser/shopBuyerDetail'
      this.$http(url).then(res => {
        if (res.code === this.$ok) {
          this.manageInfo = res.data
          if (!res.data.one_discount) {
            this.isUnsetManage = true
          }
          this.flag = true
          return
        }
        this.$t(res.message)
      })
    },
    goManageList (i) {
      if (i === 1) {
        this.$router.push({ path: '/cgs-check', query: { audit_buyer: this.manageInfo.audit_buyer } })
        return
      }
      if (i === 2) {
        this.$router.push({ path: '/cgs-pass', query: { scan_buyer: this.manageInfo.scan_buyer, check_buyer: this.manageInfo.check_buyer } })
        return
      }
      this.$router.push({ path: '/cgs-unpass', query: { nopass_buyer: this.manageInfo.nopass_buyer } })
    },
    goMarketNotice () {
      this.$router.push({ name: 'EditAnnouncement' })
    },
    goAuthenManage () {
      this.$router.push({ name: 'SepcialAuthenManage', query: { fromNative: 1 } })
    },
    showHelpPopup () {
      this.$refs.helpPopup.show()
    },
    hideHelpPopup () {
      this.$refs.helpPopup.hide()
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'CgsCheck') {
      this.$del(to, from, next, this, true)
    }
    next()
  }
}
</script>

<style lang="stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.cgs-manage-container
  height 100%
  overflow hidden
  .cgs-manage-wrapper
    .cgs-header-container
      overflow unset
      .header-right
        flex-f-align()
        position relative
        i
          wh(20px)
          margin-right 8px
          bg('icon-add.png')
        color #4A90E2
        .market-notice-popup
          position absolute
          width 420px
          height 72px
          bg('icon-popup.png')
          line-height 98px
          tc()
          left -330px
          top 60px
          f12()
          color #fff
    .manage-header
      background #FFF9F2
      height 200px
      padding-top 30px
      flex-center()
      >div
        flex-col()
        align-items center
        i
          width 40px
          height 46px
        .cgs-description
          f14()
          color $color-6
          margin-top 6px
          margin-bottom 8px
        .cgs-num
          f16()
          color $color-0
          &.active
            color #D0021B
      .cgs-number
        i
          bg('icon-person.png')
      .cgs-yesteday-add
        i
          bg('icon-yesteday.png')
      .cgs-today-add
        i
          bg('icon-today.png')
      .seperate
        height 104px
        margin 0 60px
        border-right 2px dashed #ccc;/*no*/
    .seperate
      height 12px
      background #F2F2F2
    .manage-item
      padding 0 36px
      ul
        margin-bottom 16px
      li
        height 130px
        padding-left 24px
        flex-f-align()
        // border-bottom 2px dashed #EDEDED;/*no*/
        border-bottom 2px dashed #c1c1c1;/*no*/
        background url('./images/arrow.png') no-repeat right center
        background-size 16px auto
        i
          wh(54px)
          margin-right 24px
          &.auditing
            bg('icon-auditing.png')
          &.passed
            bg('icon-pass.png')
          &.unpass
            bg('icon-unpass.png')
        p
          f14()
          color $color-3
          span
            color $color-orange
      .cgs-manage-introduce
        flex-f()
        justify-content flex-end
        f13()
        color $color-orange
        .introduce
          flex-f-align()
          i
            wh(30px)
            bg('icon-ask.png')
            margin-right 6px
  .unset-manage
    tc()
    img
      margin-top 120px
      margin-bottom 44px
      width 270px
      height 198px
    p
      f16()
      padding 0 165px
      color $color-c
      line-height 48px
      margin-bottom 60px
    .set-manage-botton
      width 300px
      height 80px
      margin 0 auto
      border-radius(100px)
      color $color-white
      background $color-orange
      f16()
      line-height 80px
  .cgs-help-wrapper
    >div
      width 540px!important
      bd(#979797)
      border-radius(20px)
      overflow unset
      padding 0 30px
      img
        width 156px
        height 138px
        display block
        margin 0 auto
        margin-top 36px
        margin-bottom 26px
      p
        f14()
        color #DF8B48
        line-height 44px
        margin-bottom 52px
      .help-close
        position absolute
        wh(60px)
        left 50%
        transform translateX(-50%)
        bottom -90px
        border-radius(50%)
        bg('icon-close.png')
</style>

<template>
  <div class="honey-edit-container">
    <base-header :title="headerTitle"></base-header>
    <base-scroll :has-more="true" class="honey-edit-wrapper">
      <div class="honey-add-banner">
        <div class="add-banner" v-show="!honeyImg" @click="setHoneyBanner">
          <img src="./images/add-goods.png" alt="">
          <p>添加商品图片</p>
        </div>
        <img :src="honeyImg" alt="" class="selected-img" v-show="honeyImg">
        <div class="modify-banner" v-show="honeyImg" @click="setHoneyBanner">
          <img src="./images/modify-banner.png" alt="">
        </div>
      </div>
      <div class="honey-item-wrapper">
        <div class="honey-item">
          <h1>
            <i></i>
            <span>商品标题</span>
          </h1>
          <textarea
            placeholder="请输入商品名称，不超过48字"
            v-model="honeyTitle"
            @focus="justifyBodyHeight"
            @blur="restoreBodyHeight"
            maxlength="48">
          </textarea>
          <p class="title-statics">
            <span :class="{ active: honeyTitleLength !== 0 }">{{ honeyTitleLength }}</span>/<span>48</span>
          </p>
        </div>
        <div class="honey-item">
          <h1>
            <i></i>
            <span>兑换所需蜂蜜数</span>
          </h1>
          <input
            type="number"
            placeholder="请输入此商品兑换所需蜂蜜数"
            @focus="justifyBodyHeight"
            @blur="restoreBodyHeight"
            v-model.number="honeyNum">
        </div>
        <div class="seperate"></div>
        <div class="honey-desc" @click="setHoneyDescription">
          <h1>
            <i></i>
            <span>商品描述</span>
          </h1>
          <span v-show="honeyDescription">已编辑</span>
        </div>
        <!-- <div class="seperate-bottom"></div> -->
      </div>
    </base-scroll>
    <base-footer
      ref="button"
      background="linear-gradient(90deg, #FFBF00 0%, #FF8A00 100%)"
      :text="footerTitle"
      @footerSubmit="footerSubmit">
    </base-footer>
  </div>
</template>

<script>
import { getPic } from 'common/js/dev'
export default {
  data () {
    return {
      honeyImg: '',
      honeyTitle: '',
      honeyNum: '',
      honeyDescription: ''
    }
  },
  computed: {
    honeyId () {
      return this.$route.query.id
    },
    headerTitle () {
      // eslint-disable-next-line
      return !!this.honeyId ? '编辑蜂蜜兑换商品' : '添加蜂蜜兑换商品'
    },
    footerTitle () {
      // eslint-disable-next-line
      return !!this.honeyId ? '完成' : '立即发布'
    },
    honeyTitleLength () {
      return this.honeyTitle.replace(/\n|\r/g, '  ').length
    }
  },
  created () {
    this.getHoneyData()
    window.album = this.getHoneyBanner
    window.returnGoodsDetail = this.getHoneyDescription
  },
  methods: {
    getHoneyData () {
      if (!this.honeyId) return
      let url = 'integral/getGoodsDetails'
      let obj = {
        id: this.honeyId
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.honeyImg = res.data.image
          this.honeyTitle = res.data.title
          this.honeyNum = res.data.integral_sum
          this.honeyDescription = res.data.describe
        }
      })
    },
    getHoneyBanner (imgUrl) {
      this.honeyImg = imgUrl
    },
    setHoneyBanner () {
      let dev = this.$dev
      if (dev === 1) {
        window.android.selectPic(400, 400)
        return
      }
      if (dev === 2) {
        let obj = {
          width: 400,
          height: 400
        }
        getPic('selectPic', obj).then(val => {
          let [imgUrl] = val
          this.honeyImg = imgUrl
        })
      }
    },
    getHoneyDescription (content) {
      this.honeyDescription = content
    },
    setHoneyDescription () {
      let dev = this.$dev
      try {
        if (dev === 1) {
          window.android.goodsDetail(this.honeyDescription)
        } else if (dev === 2) {
          window.webkit.messageHandlers.goodsDetail.postMessage({
            content: this.honeyDescription,
            type: 1
          })
        }
      } catch (e) {
        //
      }
    },
    checkedFiled () {
      if (!this.honeyImg) {
        this.$t('请上传商品图片')
        return false
      }
      if (!this.honeyTitle) {
        this.$t('请填写商品标题')
        return false
      }
      if (!this.honeyNum) {
        this.$t('请填写蜂蜜兑换数')
        return false
      }
      let regNum = /^[1-9][0-9]{0,}$/
      if (!regNum.test(this.honeyNum)) {
        this.$t('请填写大于零的整数')
        return false
      }
      if (!this.honeyDescription) {
        this.$t('请添加商品描述')
        return false
      }
      return true
    },
    footerSubmit () {
      if (!this.checkedFiled()) return
      let url = 'integral/setGoods'
      let obj = {
        image: this.honeyImg,
        title: this.honeyTitle,
        integral_sum: this.honeyNum,
        describe: this.honeyDescription,
        id: this.honeyId
      }
      if (!this.honeyId) delete obj.id
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.$t('发布成功')
          this.$router.push({ path: '/honey-manage', query: { path: '/honey-management?fromNative=1' } })
        }
      })
    },
    justifyBodyHeight () {
      let height = this.$refs.button.$el.clientHeight
      document.body.style.height = (window.screen.availHeight - height) + 'px'
    },
    restoreBodyHeight () {
      document.body.style.height = '100%'
    }
  }
}
</script>

<style lang="stylus">
@import "~common/stylus/mixin"
.honey-edit-container
  flex-col()
  height 100%
  overflow hidden
  background #fff
  .honey-edit-wrapper
    flex 1
    overflow hidden
    > div
      padding 0 30px
    .honey-add-banner
      wh(688px)
      padding 16px 0
      position relative
      .add-banner
        wh(100%)
        overflow hidden
        background #F4F4F4
        flex-center()
        flex-col()
        img
          wh(128px)
        p
          f14()
          margin-top -16px
          color #FF8A00
          line-height 40px
      .selected-img
        wh(100%)
      .modify-banner
        wh(80px)
        position absolute
        right 24px
        bottom 24px
        img
          wh(100%)
    .honey-item-wrapper
      .honey-item,
      .honey-desc
        h1
          flex-f-align()
          line-height 40px
          f14()
          color #151515
          margin-bottom 20px
          i
            wh(14px)
            bg('icon-star.png')
        textarea,
        input
          width 100%
          padding 16px 24px
          bd(#CCC)
          f14()
          color #BCBCBC
          border-radius(8px)
          margin-bottom 8px
        textarea
          width 100%
          height 160px
          padding 16px 24px
          bd(#CCC)
          f14()
          color #BCBCBC
          border-radius(8px)
          margin-bottom 8px
        input
          height 70px
          margin-bottom 40px
        .title-statics
          tr()
          f12()
          color #BCBCBC
          line-height 34px
          margin-bottom 16px
          .active
            color #FF8A00
      .seperate
        height 20px
        background #f4f4f4
        margin 0 -30px
      .honey-desc
        height 100px
        flex-align-item()
        background url('./images/icon-arrow.png') right center no-repeat
        background-size 16px auto
        h1
          margin-bottom 0
        span
          margin-right 26px
      .seperate-bottom
        margin 0 -30px
        background #f4f4f4
        height 66px
</style>

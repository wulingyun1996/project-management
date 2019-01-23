<template>
  <div class="honey-goods-list-container">
    <base-header></base-header>
    <div class="goods-list-content">
        <!-- 有商品 -->
      <base-scroll
        v-if="m_dataList.length && flag"
        :data="m_dataList"
        :pullup="m_pullup"
        @scrollToEnd="getData"
        @pulldown="pullDownRefresh"
        :hasLoading="m_loading"
        :hasMore="m_hasMore"
        :hasRefresh="m_refresh"
        >
        <section  class="goods-list"  v-for="(value, index) in m_dataList" :key="index">
          <div class="each-all">
            <div class="goods-list-each">
              <div><img :src="value.image" alt=""></div>
              <div>
                <p>{{ value.title }}</p>
                <ul>
                  <li><img src="./goods-icon.png" alt=""><span>{{ value.integral_sum }}</span><b>蜂蜜</b></li>
                  <li>已兑换<span>{{ value.number }}</span></li>
                </ul>
              </div>
            </div>
            <div class="goods-btn">
              <ul class="clearfix">
                <li @click="editGoods(value.id)"><img src="./goods-edit.png" alt=""><span>编辑</span></li>
                <li @click="deleteGoods(value.id, index)"><img src="./goods-delete.png" alt=""><span>删除</span></li>
              </ul>
            </div>
          </div>
        </section>
      </base-scroll>
      <!-- 无商品 -->
      <section class="goods-list-none" v-if="!m_dataList.length && flag">
        <div class="goods-list-bg"></div>
        <div class="goods-list-des">您还没有添加蜂蜜兑换商品赶紧去添加吧~ </div>
      </section>
    </div>
    <base-footer @footerSubmit="addGoods" background="linear-gradient(90deg, #FFBF00 0%, #FF8A00 100%)">
      <img src="./goods-add.png" alt="">
      <span>蜂蜜商品</span>
    </base-footer>
    <base-senior-popup ref="confirmPop" height="auto" class="confirmPop">
      <div class="popdes">
        <p>确定要删除吗？</p>
      </div>
      <div class="popbtn">
        <a href="javascript:" @click="cancel">取消</a>
        <a href="javascript:" @click="confirm">确定</a>
      </div>
    </base-senior-popup>
  </div>
</template>

<script>
import { mixins } from 'mixins'
export default {
  name: 'HoneyGoodsManage',
  mixins: [mixins],
  data () {
    return {
      currentId: '',
      currentIndex: '',
      flag: false
    }
  },
  created () {
    this.getData()
  },
  methods: {
    addGoods () {
      this.$router.push({ path: 'honey-edit' })
    },
    // 商品列表
    async getData () {
      if (!this.m_hasMore) return
      let url = 'integral/goodsList'
      let params = {
        page: ++this.m_page
      }
      await this.$http(url, params).then(res => {
        if (res.code === this.$ok) {
          this.m_dataList = [...this.m_dataList, ...res.data.data]
          this._checkMore(res.data)
          this.flag = true
        }
      })
      return Promise.resolve()
    },
    // 编辑商品
    editGoods (id) {
      this.$router.push({ path: 'honey-edit', query: { id } })
    },
    // 删除商品
    deleteGoods (id, index) {
      this.currentId = id
      this.currentIndex = index
      this.$refs.confirmPop.show()
    },
    cancel () {
      this.$refs.confirmPop.hide()
    },
    confirm () {
      let { currentId, currentIndex } = this
      let url = 'integral/delGoods'
      let params = {
        id: currentId
      }
      this.$http(url, params).then(res => {
        if (res.code === this.$ok) {
          this.m_dataList.splice(currentIndex, 1)
          this.loadMoreData()
          this.cancel()
        }
      })
    },
    pullDownRefresh () {
      this.statusInit()
      this.flag = false
      this.getData().then(() => {
        this.m_refresh = false
      })
    }
  }
}
</script>

<style lang='stylus'>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.honey-goods-list-container
  height 100%
  flex-col()
  background $color-f4
  overflow hidden
  .goods-list-content
    flex 1
    flex-col()
    width 100%
    height 100%
    background #F4F4F4
    overflow hidden
    .goods-list-none
      position absolute
      top 300px
      left 50%
      transform translateX(-50%)
      .goods-list-bg
        background url('./goods-none.png') no-repeat center
        width 360px
        height 290px
        background-size 100% 100%
      .goods-list-des
        text-align center
        font-family PingFangSC-Regular
        f14()
        color #999999
        margin-top 48px
    .goods-list
      width 100%
      .each-all
        background-color #fff
        margin-bottom 20px
      .goods-list-each
        height 236px
        border-bottom 1px solid #F4F4F4
        flex-center()
        >div:nth-child(1)
          width 30%
          margin 0 25px
          img
            width 162px
            height 152px
            border 1px solid #F4F4F4
            border-radius 8px
        >div:nth-child(2)
          margin 0 25px 0 0
          width 100%
          p
            font-family PingFangSC-Regular
            f14()
            color #333333
            padding 0 0 38px 0
            overflow hidden
            display -webkit-box
            -webkit-line-clamp 2
            -webkit-box-orient vertical
            height 80px
            line-height 40px
          ul
            padding 33px 0
            li:nth-child(1)
              float left
              f12()
              margin-left 35.2px
              position relative
              color #D70110
              img
                width 24px
                height 40px
                position absolute
                left -35.2px
                top -8px
              span
                f18()
              b
                margin-left 10px
            li:nth-child(2)
              float right
              font-family PingFangSC-RegulaR
              f12()
              color #999999
      .goods-btn
        ul
          margin 16px 0
          li
            float left
            width 200px
            height 60px
            line-height 60px
            bd(#FF8A00, width = 1px)
            border-radius 0.1rem
            text-align center
            font-family PingFangSC-Regular
            f12()
            color #FF8A00
            position relative
          li:nth-child(1)
            float left
            margin-left 292px
            img
              width 28px
              height 30px
              position absolute
              top 50%
              transform translateY(-50%)
            span
              margin-left 45px
          li:nth-child(2)
            float right
            color #FF304A
            bd(#FF304A, width = 1px)
            margin-left 28px
            img
              position absolute
              width 28px
              height 30px
              top 50%
              transform translateY(-50%)
            span
              margin-left 45px
  .cgs-footer-container
    img
      width 32px
      height 32px
    span
      margin-left 12px
  // 弹窗
  .confirmPop
    >div
      width 540px!important
      bd(#979797)
      border-radius(20px)
      overflow unset
      text-align center
      .popdes
        padding 40px 0
        bd-b(#ccc, width = 1px)
        p:nth-child(1)
          font-weight bold
          f16()
        p:nth-child(2)
          margin-top 10px
      .popbtn
        width 100%
        a
          width 50%
          text-align center
          display inline-block
          float left
          bd-r(#ccc, width = 1px)
          padding 30px 0
</style>


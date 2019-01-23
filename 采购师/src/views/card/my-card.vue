<template>
  <div class='card-container'>
    <base-scroll
     :hasMore="true">
      <div class='scroll-wrapper' :class="{ 'ipone-x': isIponeX, 'ipone': isPone }">
        <img src="./images/close.png" alt="" class='close' :class="{ hide: inWx }" @click='goBack'>
        <div class='identify' :class="{ active: inWx }">
          <div class='border'>
            <img :src="cardList.avatar" alt="" v-if='cardList.avatar'>
            <img src="./images/pic.png" alt="" v-else>
          </div>
          <div class='info'>
            <div class='name'>
              <span class='icon'></span>
              <span v-if='cardList.nickname'>{{ cardList.nickname | sliceChar(8) }}   </span>
              <span v-else>{{ cardList.mobile }}</span>
            </div>
            <div class='tel'>
              <span class='icon'></span>
              <span v-if='cardList.phone'>{{ cardList.phone }}</span>
              <span v-else>{{ cardList.mobile }}</span>
            </div>
          </div>
        </div>
        <div class='brife' v-show='cardList.introduction'>
          <div class='title'>
            <i class='left'></i>
            <span>简介</span>
            <i class='right'></i>
          </div>
          <div class='content'>
            <p>{{ cardList.introduction }}</p>
          </div>
        </div>
        <div class='case' v-show="cardList.case_info.length">
          <div class='title'>
            <i class='left'></i>
            <span>案例</span>
            <i class='right'></i>
          </div>
          <div class='content' v-for='item in cardList.case_info' :key='item.id'>
            <img :src="item.case_img" alt="" >
            <div class='dec'>
              <i class='arrow'></i>
              <p>{{ item.title }}</p>
            </div>
          </div>
        </div>
      </div>
    </base-scroll>
  </div>
</template>

<script>
import { sliceChar } from 'common'
import { mixins } from 'mixins'
import { closeWebview } from 'native'
export default {
  mixins: [mixins],
  data () {
    return {
      cardList: {
        case_info: []
      },
      isIponeX: this.$isX
    }
  },
  created () {
    this.getData()
  },
  computed: {
    id () {
      return this.$route.query.id
    }
  },
  methods: {
    getData () {
      let url = 'card/cardDetailCode'
      let obj = {
        buyer_id: this.id
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.cardList = res.data
        }
      })
    },
    goBack () {
      closeWebview()
    }
  },
  filters: {
    sliceChar
  }
}
</script>

<style lang='stylus' scope>
  @import '~@/assets/css/variable'
  @import '~@/assets/css/mixins'
  .card-container
    height 100%
    overflow hidden
    flex-col()
    .scroll-container
      flex 1
      .scroll-wrapper
        background url('./images/header_bg.png') no-repeat
        background-size 100% 400px
        overflow hidden
        &.ipone-x
          margin-top 88px
        &.ipone
          margin-top 40px
        .close
          width 56px;
          height 56px;
          display block
          margin 20px auto
          &.hide
            opacity 0
        .identify
          display flex
          width 100%
          height 152px
          align-items center
          margin-top 90px
          padding-left 104px
          position relative
          &.active
            margin-top 150px
          img
            width 150px;
            height 150px;
          .border
            padding 10px
            width 150px;
            height 150px;
            background url('./images/border.png') no-repeat
            background-size 100% 100%
            img
              width 100%
              height 100%
              border-radius 50%
          .info
            margin-top 20px
            margin-left  36px
            .name
              margin-bottom 34px
              display flex
              .icon
                margin-right 11px
                display block
                width 36px
                height 36px
                background url('./images/name.png')
                background-size 36px 36px
              span
                font-size 36px
                color #7E6100
            .tel
              display flex
              .icon
                margin-right 11px
                display block
                width 36px
                height 36px
                background url('./images/tel.png')
                background-size 36px 36px
              span
                font-size 36px
                color #7E6100
        .brife
          width 660px
          margin 0 auto
          margin-top 120px
          .title
            display flex
            justify-content center
            align-items  center
            font-family PingFangSC-Semibold
            font-size 40px
            color #24232A
            margin-bottom 32px
            .left
              margin-right 18px
              display block
              width 40px
              height 28px
              background url('./images/left.png')
              background-size 100% 100%
            .right
              margin-left 18px
              display block
              width 40px
              height 28px
              background url('./images/right.png')
              background-size 100% 100%
          .content
            width 100%
            border 2px solid #cccccc
            border-radius 16px
            margin-top 32px
            padding 32px 30px
            img
              width 100%
              height 100%
            p
              font-family PingFangSC-Regular
              width 100%
              color #7E6100
              font-size 28px
              line-height 1.5
        .case
          width 660px
          margin 0 auto
          margin-top 48px
          .title
            display flex
            justify-content center
            font-family PingFangSC-Semibold
            font-size 40px
            color #24232A
            margin-bottom 32px
            align-items  center
            .left
              margin-right 18px
              display block
              width 40px
              height 28px
              background url('./images/left.png')
              background-size 100% 100%
            .right
              margin-left 18px
              display block
              width 40px
              height 28px
              background url('./images/right.png')
              background-size 100% 100%
          .content
            width 100%
            border 2px solid #cccccc
            border-radius 16px
            margin-top 32px
            padding 32px 30px
            img
              margin-bottom 28px
            .dec
              padding 0 12px
              display flex
              .arrow
                margin-top 5px
                display block
                width 28px
                height 28px
                background url('./images/arrowUp.png')
                background-size 100% 100%
                margin-right 20px
              p
                width 100%
                color #7E6100
                font-size 28px
                line-height 1.5
</style>

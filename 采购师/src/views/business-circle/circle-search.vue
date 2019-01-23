<template>
  <div class="shop-search-container">
    <!-- <div class="search-header" :class="{ 'ipone-x': isIponeX, 'ipone': isPone }">
      <div class="header-left" @click="goBack">
        <img src="./images/icon-left.png" alt="">
      </div>
      <div class="header-center">
        <div class="search">
          <img src="./images/icon-search.png" alt="">
        </div>
        <input type="text" v-model="shopName" placeholder="搜索店铺名称">
        <div class="close" @click="getClose">
          <img src="./images/icon-close.png" alt="">
        </div>
      </div>
      <div class="header-right">
        <span @click="getSearch">搜索</span>
      </div>
    </div> -->
    <base-header :is-show-title="false">
      <div class="header-center" slot="center">
        <div class="search">
          <img src="./images/icon-search.png" alt="">
        </div>
        <!-- <input type="text" v-model="shopName" placeholder="搜索店铺名称"> -->
        <input
        id="phone"
        type="text"
        placeholder="搜索店铺名称 "
        v-model="shopName"
        @focus="justifyBodyHeight"
        @blur="restoreBodyHeight">
        <div class="close" @click="getClose">
          <img src="./images/icon-close.png" alt="">
        </div>
      </div>
      <div class="right" @click="getSearch">
        <span>搜索</span>
      </div>
    </base-header>
    <div class="search-content">
      <p>最近搜索</p>
      <div class="search-list">
        <ul>
          <li v-for="(item, index) in shopList" :key="index" @click="goSearList(item)">{{ item }}</li>
        </ul>
      </div>
    </div>
    <base-senior-popup ref="infoPopup" :opacity="0" height="auto" class="info-popup">
      <p>抱歉！</p>
      <p>未搜索到相关信息，换个关键词试一试。</p>
    </base-senior-popup>
  </div>
</template>

<script>
import { dev, invokeNativeMethod } from 'native'
import { setTimeout } from 'timers'
export default {
  name: 'Search',
  data () {
    return {
      shopName: '',
      shopList: [],
      noData: []
    }
  },
  directives: {
    focus: {
      // 指令的定义
      inserted: function (el) {
        el.focus()
      }
    }
  },
  created () {
    let currentDev = dev()
    if (currentDev === 'Android') {
      // alert('11')
      let hintInfo = window.android.getNativeLocalCache('infoCode')
      if (hintInfo === '' || !hintInfo) return
      this.shopList = hintInfo.split(',')
    }
    if (currentDev === 'iOS') {
      invokeNativeMethod('getNativeLocalCache', 'SearchHistory')
    }
    window.callbackNativeLocalCache = this.callbackNativeLocalCache
  },
  methods: {
    getSearch () {
      if (!this.shopName) return
      this.shopName = this.shopName.trim()
      this.$http('union/groupSeller', { key_word: this.shopName, page: 1 }).then(res => {
        this.noData = res.data.data
        if (!this.noData.length) {
          this.$refs.infoPopup.show()
          setTimeout(() => {
            this.$refs.infoPopup.hide()
          }, 3000)
        } else {
          if (this.shopList.length > 0) {
            if (!this.noData.length) return
            if (this.shopList.indexOf(this.shopName) !== -1) {
              this.shopList.splice(this.shopList.indexOf(this.shopName), 1)
              this.shopList.unshift(this.shopName)
            } else {
              this.shopList.unshift(this.shopName)
            }
          } else {
            if (!this.noData.length) return
            this.shopList.unshift(this.shopName)
          }
          if (this.shopList.length > 10) {
            this.shopList.pop()
          }
          let currentDev = dev()
          if (currentDev === 'Android') {
            let list = this.shopList.join()
            invokeNativeMethod('setNativeLocalCache', JSON.stringify({ infoCode: list }))
          }
          if (currentDev === 'iOS') {
            let list = this.shopList.join()
            invokeNativeMethod('setNativeLocalCache', { 'SearchHistory': list })
          }
          this.$router.push({ path: '/circle-search-list', query: { shopName: this.shopName } })
        }
      })
    },
    getClose () {
      if (!this.shopName) return
      this.shopName = ''
    },
    goBack () {
      this.$router.push('/shop-list')
    },
    goSearList (item) {
      this.$router.push({ path: '/circle-search-list', query: { shopName: item } })
    },
    // 原生回调
    callbackNativeLocalCache (data) {
      if (data === '' || !data) return
      this.shopList = data.split(',')
    }
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.shop-search-container
  height 100%
  flex-col-btw()
  .info-popup
    >div
      width 600px!important
      padding 44px 48px
      background: rgba(0,0,0,0.50)
      border-radius: 32px
      text-align center
      p:first-child
        font-family: PingFangSC-Medium
        font-size: 32px
        color: #FFFFFF
        letter-spacing: 0
      p:last-child
        font-family: PingFangSC-Regular
        font-size: 28px
        color: #FFFFFF
        margin-top 32px
        letter-spacing: 0
  .header-center
    width 520px
    height 60px
    display flex
    align-items center
    justify-content space-around
    background: #E5E5E5
    border-radius: 30px
    input
      height 100%
      width 400px
      font-family: PingFangSC-Regular
      font-size: 28px
      // padding-left 70px
      color: #666
    .search
      width 32px
      height 32px
      img
        width 100%
        height 100%
    .close
      width 32px
      height 32px
      img
        width 100%
        height 100%
  .right
    span
      font-family: PingFangSC-Regular
      font-size: 28px
      color: #333333
      letter-spacing: 0
  .search-content
    flex 1
    background-color #f4f4f4
    padding 40px 30px 0 30px
    p
      font-family: PingFangSC-Regular
      font-size: 32px
      color: #999999
      letter-spacing: 0
    .search-list
      margin-top 32px
      ul
        display flex
        flex-wrap wrap
        li
          // width 140px
          padding 0 20px
          height 60px
          background: #E5E5E5
          border-radius: 30px
          text-align center
          line-height 60px
          font-family: PingFangSC-Regular
          font-size: 28px
          margin-right 20px
          margin-top 10px
          color: #666666
</style>

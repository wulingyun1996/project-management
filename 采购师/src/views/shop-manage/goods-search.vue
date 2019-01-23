<template>
  <div class="goods-search-container animation_slide_to_left" ref="searchWrapper">
    <div class="goods-search-header">
      <div
        class="search-header"
        :class="{ 'ipone-x': $isX && !inWx, 'ipone': isPone && !inWx }">
        <a href="javascript:" class="arrow-back" @click="goBack">
          <i class="icon-back"></i>
        </a>
        <div class="search-input">
          <input type="text" placeholder="请输入关键字" v-model="searchKeyWords">
          <i class="icon-clear" v-show="searchKeyWords" @click="clearSearchKeyWords"></i>
        </div>
        <a href="javascript:" class="search-button" @click="searchGoods">搜索</a>
      </div>
    </div>
    <div class="goods-search-content-wrapper">
      <!-- 待开发 -->
    </div>
    <router-view
      :id="id"
      :authen-status="authenStatus"
      :key-words="searchKeyWords">
    </router-view>
  </div>
</template>

<script>
export default {
  name: 'ShopGoodsSearch',
  props: {
    id: {
      type: Number
    },
    authenStatus: {
      default: 2
    }
  },
  data () {
    return {
      searchKeyWords: ''
    }
  },
  methods: {
    goBack () {
      this.$refs.searchWrapper.classList.add('goods-search-container', 'animation_slide_to_right')
      setTimeout(() => {
        this.$back()
      }, 500)
    },
    clearSearchKeyWords () {
      this.searchKeyWords = ''
    },
    searchGoods () {
      this.$push({ name: 'ShopGoodsSearchResult' })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.goods-search-container
  pf(100%)
  top 0
  bottom 0
  z-index 9999
  flex-col()
  .goods-search-header
    overflow hidden
    background $color-orange
    .search-header
      height 90px
      padding-left 48px
      padding-right 40px
      flex-align-item()
      &.ipone-x
        margin-top 88px
      &.ipone
        margin-top 40px
    .arrow-back
      height 100%
      padding 0 20px
      margin-left -20px
      margin-right 20px
      flex-f-align()
      .icon-back
        width 24px
        height 44px
        bg('icon-arrow-left.png')
    .search-button
      f14()
      height 100%
      line-height 90px
      color $color-white
      padding 0 20px
      margin-right -20px
    .search-input
      height 60px
      flex 1
      position relative
      &:before
        content ''
        position absolute
        wh(28px)
        left 20px
        top 50%
        transform translateY(-50%)
        bg('icon-search.png')
      .icon-clear
        position absolute
        width 32px
        height 34px
        right 20px
        top 50%
        transform translateY(-50%)
        bg('icon-clear.png')
      input
        wh(100%)
        border-radius(100px)
        background #F8F8F8
        padding-left 72px
        padding-right 55px
        f14()
        color $color-6
        &:placeholder
          color $color-c
  .goods-search-content-wrapper
    flex 1
    flex-col()
    background $color-white
</style>

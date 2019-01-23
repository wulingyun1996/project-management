<template>
  <base-senior-popup width="100%" height="100%" ref="brands" class="goods-brands-container">
    <base-header :title="title"></base-header>
    <div class="brands-list-wrapper">
      <base-scroll :has-more="true" ref="scroll">
        <div
          class="issue-brand"
          v-for="(brandItem, index) in brandList"
          :key="index">
          <p
            class="brand-title"
            :class="{'no-border1': brandItem.shopBrand === 1}"
            :ref="brandItem.categoryLevel">
            {{ brandItem.categoryLevel }}
          </p>
          <p
            v-for="(item, itemIndex) in brandItem.list"
            :key="itemIndex"
            :class="{ active: item.custom === 1 && item.shopBrand === 1, 'no-border2': brandItem.shopBrand === 1 && itemIndex === brandItem.list.length - 1 }"
            @click="selectBrand(item)">
            {{ item.val }}
          </p>
          <h5 v-show="brandItem.shopBrand === 1"></h5>
        </div>
      </base-scroll>
      <div class="brand-category-list">
        <p class="brand-setted" @click="goCurrentBrand('店铺品牌')">店铺品牌</p>
        <p
          v-for="(item, sortIndex) in brandCategoryList"
          :key="sortIndex"
          @click="goCurrentBrand(item)">
          {{ item }}
        </p>
      </div>
    </div>
  </base-senior-popup>
</template>

<script>
export default {
  data() {
    return {
      brand: '',
      brandCategoryList: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'
    }
  },
  props: {
    brandList: {
      type: Array
    },
    title () {
      // eslint-disable-next-line
      return !!this.$route.query.isEditNormalGoods ? '编辑品牌' : '品牌'
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.brands.show()
    })
  },
  methods: {
    selectBrand(value) {
      this.$emit('getSelectedBrand', value)
      this.$router.back()
    },
    cancelBrand() {
      this.$emit('getSelectedBrand', {})
      this.$router.back()
    },
    goCurrentBrand (currentBrand) {
      if (!this.$refs[currentBrand]) return
      let currentDom = this.$refs[currentBrand][0]
      this.$refs.scroll.scrollToElement(currentDom, 0, 0)
    }
  }
}
</script>

<style lang="stylus">
@import "~common/stylus/mixin"
@import "~common/stylus/variable"
.goods-brands-container
  z-index 2000!important
  > div
    flex-col()
  .brands-list-wrapper
    flex 1
    padding-left 25px
    padding-right 50px
    overflow hidden
  .scroll-container
    flex 1
    overflow hidden
  .brand-category-list
    position absolute
    right 0
    top 50%
    transform translateY(-50%)
    f10()
    color #5d7388
    width 40px
    margin-right 8px
    .brand-setted
      margin-bottom 5px;/*no*/
      padding 0
    p
      line-height 26px
      padding 2px 0;/*no*/
      tc()
  .issue-brand
    .brand-title
      color #9b9b9b
    p
      height: 90px;/*px*/
      line-height: 90px;/*px*/
      font-size: 28px;/*px*/
      color: $color-3
      border-btm()
      padding-left: 8px
      &.active
        color $color-orange
      &.no-border1
        height 60px
        line-height 80px
        &:after
          content unset
      &.no-border2
        &:after
          content unset
    h5
      height 12px
      margin 0 -100px
      background $color-body
</style>
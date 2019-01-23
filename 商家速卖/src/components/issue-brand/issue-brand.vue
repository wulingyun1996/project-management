<template>
  <div id="issue-box" class="issue-box">
    <scroll ref="scroll" class="issue-scroll">
      <div>
        <div class="issue-brand" v-for="(brandItem, index) in brandList">
        <p :class="{'no-border1': brandItem.shopBrand === 1}" class="brand-title" :ref="brandItem.categoryLevel">{{ brandItem.categoryLevel }}</p>
         <p
          v-for="(item, itemIndex) in brandItem.list"
          :class="{active: item.custom === 1 && item.shopBrand === 1, 'no-border2': brandItem.shopBrand === 1 && itemIndex === brandItem.list.length - 1}"
          @click="selectBrand(item)">
          {{ item.val }}
        </p>
        <h5 v-show="brandItem.shopBrand === 1"></h5>
        </div>
      </div>
      <input type="button" class="btn_cancel_brand" value="取消选择" v-if="brandList[0].require!=='isRequire'" @click="cancelBrand">
    </scroll>
    <div class="brand-category-list">
      <p class="brand-setted" @click="goCurrentBrand('店铺品牌')">店铺品牌</p>
      <p v-for="item in brandCategoryList" @click="goCurrentBrand(item)">{{ item }}</p>
    </div>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
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
    }
  },
  methods: {
    selectBrand(value) {
      this.$emit('emitChooseBrand', value)
      this.$router.back()
    },
    cancelBrand() {
      this.$emit('emitChooseBrand', {})
      this.$router.back()
    },
    goCurrentBrand (currentBrand) {
      if (!this.$refs[currentBrand]) return
      let currentDom = this.$refs[currentBrand][0]
      this.$refs.scroll.scrollToElement(currentDom, 0, 0)
    }
  },
  components: {
    Scroll
  }
}
</script>

<style scoped lang="stylus">
@import "~common/stylus/mixin"
@import "~common/stylus/variable"
body
  background: $color-white
.pop
  bottom: 700px
#issue-box
  position: fixed
  z-index: 200
  top: 0
  left: 0
  width: 100%
  height: 100%
  background: $color-white
  .issue-scroll
    height 100%
    >div
      width: 100%
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
#issue-box
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
.issue-box
  padding-left 25px
  padding-right 50px
.btn_cancel_brand
  line-height: 42px;/*px*/
  flex: 1
  text-align: center
  padding: 8px 12px
  color: $color-white
  font-size: 28px;/*px*/
  background: #feb054
  margin-top: 10px;
  float right
</style>  

<template>
  <div class="create-category-container animation_slide_to_left" ref="addNewCategory">
    <base-header
      :intercept-back="true"
      @headerBack="backToCategoryList">
    </base-header>
    <div class="scroll-container">
      <ul class="add-list">
        <li class="add-item">
          <h2 class="necessary"><b>*</b> 一级类目名称</h2>
          <div class="form-input">
            <input type="text" v-model="firstLevelCategory" maxlength="10">
          </div>
        </li>
        <li class="add-item">
          <h2 class="necessary"><b>*</b> 二级类目名称</h2>
          <div class="form-input">
            <input type="text" v-model="secondLevelCategory" maxlength="10">
          </div>
        </li>
        <li class="add-item">
          <h2>三级类目名称</h2>
          <div class="form-input">
            <input type="text" v-model="threeLevelCategory" maxlength="10">
          </div>
        </li>
        <li class="add-item">
          <h2>四级类目名称</h2>
          <div class="form-input">
            <input type="text" v-model="fourLevelCategory" maxlength="10">
          </div>
        </li>
      </ul>
      <div class="add-category-button" :class="{ active: isPaddingFullContent }" @click="submitNewCategory">确定提报</div>
      <p>您提报的类目信息平台运营评估后，该类目信息会添加到类目列表中</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateCategory',
  data () {
    return {
      firstLevelCategory: '',
      secondLevelCategory: '',
      threeLevelCategory: '',
      fourLevelCategory: ''
    }
  },
  computed: {
    isPaddingFullContent () {
      let { firstLevelCategory, secondLevelCategory } = this
      return !!firstLevelCategory.trim() && !!secondLevelCategory.trim()
    }
  },
  methods: {
    backToCategoryList () {
      this.$refs.addNewCategory.classList.add('goods-search-result-container', 'animation_slide_to_right')
      setTimeout(() => {
        this.$back()
      }, 500)
    },
    validateFields () {
      let { firstLevelCategory, secondLevelCategory, threeLevelCategory, fourLevelCategory } = this
      let first = firstLevelCategory.trim()
      let second = secondLevelCategory.trim()
      let three = threeLevelCategory.trim()
      let four = fourLevelCategory.trim()
      let name = ''
      name += `${first},${second}`
      if (three) {
        name += `,${three}`
      }
      if (four) {
        name += `,${four}`
      }
      return name
    },
    submitNewCategory () {
      const name = this.validateFields()
      const { $http, $t, $ok } = this
      const url = 'goods/pushClass'
      const obj = { name }
      $http(url, obj).then(res => {
        const { code, message } = res
        if (code === $ok) {
          $t('提报成功！平台客服会在1-3个工作日给您回复。')
          setTimeout(() => {
            this.backToCategoryList()
          }, 1000)
          return
        }
        $t(message)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.create-category-container
  pf(100%)
  left 0
  top 0
  right 0
  bottom 0
  z-index 3000
  background-color $color-white
  flex-col()
  .scroll-container
    flex 1
    overflow hidden
    padding 0 30px
    overflow-y auto
    &::-webkit-scrollbar
      width 0
  .add-item
    h2
      f14()
      color $color-6
      padding-top 48px
      padding-bottom 28px
      &.necessary
        color $color-3
        font-weight 700
        b
          color $color-orange
    .form-input
      height 80px
      bd(#D1D1D1)
      border-radius(4px)
      input
        wh(100%)
        padding-left 16px
        f14()
        color $color-3
        &:placeholder
          color $color-c
  .add-category-button
    height 88px
    line-height 88px
    margin-top 100px
    margin-bottom 48px
    border-radius(8px)
    tc()
    background $color-c
    color $color-white
    f14()
    pointer-events none
    &.active
      background-color $color-orange
      pointer-events auto
  p
    f12()
    color $color-9
    padding 0 50px
    line-height 1.4
</style>

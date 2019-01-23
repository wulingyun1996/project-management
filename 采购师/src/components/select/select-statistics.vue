<template>
  <div class="drop-down-container" v-if="length">
    <div class="drop-down-wrapper" @click="showDropDown">
      <div class="drop-down-body">
        {{ title }}
      </div>
    </div>
    <div
      class="drop-down-list"
       :class="{ 'select-ipone-x-top': $isX, 'select-ipone-top': isPone }"
      v-show="isShowDropDown"
      @click="isShowDropDown = !isShowDropDown">
      <div class="seperate"></div>
      <div class="select-item">
        <div
          class="option"
          :class="{ active: currentIndex === index }"
          v-for="(item, index) in data"
          :key="index"
          @click.stop="selectCurrentItem(index, item)">
          <span>{{ item.title }}</span>
          <span class="icon-choiced" v-show="currentIndex === index"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      currentIndex: this.index,
      isShowDropDown: false
    }
  },
  computed: {
    length () {
      return !!this.data.length
    },
    title () {
      let length = this.data.length
      if (length) {
        return this.data[this.currentIndex].title
      }
      return ''
    }
  },
  methods: {
    showDropDown () {
      this.isShowDropDown = !this.isShowDropDown
    },
    selectCurrentItem (index, item) {
      this.currentIndex = index
      this.isShowDropDown = false
      this.$emit('change', item)
    }
  }
}
</script>

<style lang="stylus">
@import "~@/assets/css/variable"
@import '~@/assets/css/mixins'
.drop-down-container
  position relative
  .drop-down-wrapper
    position relative
    .drop-down-body
      height 80px
      line-height 80px
      bd($color-orange)
      border-radius(12px)
      // flex-f-align()
      text-over(1)
      f14()
      color $color-orange
      padding 0 24px
      background url('./images/icon-arrow.png') no-repeat right 24px center
      background-size 24px 14px
  .drop-down-list
    background rgba(0, 0, 0, .5)
    position fixed
    left 0
    top 230px
    right 0
    bottom 0
    z-index 1000
    &.select-ipone-x-top
      top 320px
    &.select-ipone-top
      top 300px
    .seperate
      height 4px;/*no*/
      background #F4F4F4
    .select-item
      max-height 712px
      overflow-y auto
      background $color-white
      &::-webkit-scrollbar
        width 2px;/*no*/
        height 5px;/*no*/
      .option
        bd-b(#F4F4F4)
        height 100px
        line-height 100px
        padding-left 54px
        text-over(1)
        f14()
        color $color-3
        flex-f-align()
        .icon-choiced
          width 24px
          height 16px
          bg('icon-selected.png')
          margin-left 12px
        &.active
          color: $color-orange
</style>

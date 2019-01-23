<template>
  <div class="drop-down-container" v-if="options.length > 0">
    <div class="drop-down-input-wrapper">
      <input
        type="text"
        class="drop-down-input drop-down-arrow"
        :class="{'up-arrow':this.state === true}"
        v-model="options[currentIndex].title"
        @click="openOption"
        readonly>
    </div>
    <div class="drop-down-list" v-if="state">
      <div class="seperate"></div>
      <div class="select-item">
        <div
          class="option"
          :class="{active: currentIndex === index}"
          v-for="(item, index) in options"
          :key="index"
          @click="change(index, item)">
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
    options: {
      type: Array,
      default() {
        return []
      }
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.path === '/home') {
        this.currentIndex = 0
        this.state = false
      }
    }
  },
  data() {
    return {
      currentIndex: 0,
      state: false
    }
  },
  methods: {
    openOption () {
      this.state = !this.state
    },
    change (index, item) {
      this.currentIndex = index
      this.state = false
      this.$emit('change', item)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.drop-down-container
  position relative
  .drop-down-input-wrapper
    padding 20px 30px
    background #fff
    .drop-down-input
      width 100%
      height 76px
      padding-left 40px
      border-radius(8px)
      fz(15px)
    .drop-down-arrow
      background url('./images/arrow-down.png') no-repeat right 30px center #EDEDED
      background-size 32px 16px
      &.arrow-up
        background-image url('./images/arrow-up.png')
  .drop-down-list
    background rgba(0, 0, 0, .5)
    position fixed
    left 0
    top 115px
    right 0
    bottom 0
    z-index 1000
    .seperate
      height 8px;/*no*/
      background #F4F4F4
  .select-item
    max-height 712px
    overflow-y auto
    background $color-white
    .option
      bd-b(#F4F4F4, 2px)
      height 100px
      line-height 100px
      padding-left 48px
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

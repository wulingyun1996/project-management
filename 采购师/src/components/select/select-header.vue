<template>
  <div class="header-drop-down-container" v-if="title">
    <div class="header-drop-down-wrapper">
      <div
        class="drop-down-selected select-item active"
        :class="{ 'no-bottom-border': isShowDropDown }"
        @click="showDropDown">
        {{ title }}
      </div>
      <ul
        class="drop-down-list"
        :class="{ 'no-top-border': isShowDropDown }"
        v-show="isShowDropDown">
        <li
          class="select-item"
          :class="{ active: selectedId === item.id }"
          v-for="item in allianceStatisticsDataList"
          :key="item.id"
          @click="selectCurrentItem(item.id)"
          >
          {{ item.name }}
        </li>
      </ul>
    </div>
    <div class="header-drop-down-mask" v-show="isShowDropDown" @click="showDropDown"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    id: {
      type: Number,
      default: 3
    }
  },
  data () {
    return {
      isShowDropDown: false,
      selectedId: this.id
    }
  },
  computed: {
    ...mapState(['allianceStatisticsDataList']),
    title () {
      let { selectedId, allianceStatisticsDataList } = this
      let title = ''
      allianceStatisticsDataList.some(item => {
        let { id, name } = item
        if (id === selectedId) {
          title = name
          return true
        }
      })
      return title
    }
  },
  methods: {
    selectCurrentItem (id) {
      let { allianceStatisticsDataList } = this
      allianceStatisticsDataList.forEach(item => {
        if (item.id === id) {
          item.choosed = true
          this.selectedId = id
        } else {
          item.choosed = false
        }
      })
      this.$emit('select', id)
      this.showDropDown()
    },
    showDropDown () {
      this.isShowDropDown = !this.isShowDropDown
      if (this.isShowDropDown) {
        this.$emit('showDropDown')
      }
    }
  }
}
</script>

<style lang="stylus">
@import "~@/assets/css/variable"
@import '~@/assets/css/mixins'
.header-drop-down-container
  .header-drop-down-wrapper
    width 320px
    tc()
    position relative
    .drop-down-selected
      fz(17px)
      bd(#d8d8d8)
      background url('./images/icon-arrow.png') no-repeat right 22px center $color-white
      background-size 24px auto
      border-radius(5px)
      &.no-bottom-border
        border-bottom none
    .drop-down-list
      position absolute
      background #fff
      bd(#d8d8d8)
      z-index 999
      width 100%
      left 0
      right 0
      padding-top 17px
      padding-bottom 1px;/*no*/
      border-bottom-right-radius 5px
      border-bottom-left-radius 5px
      &.no-top-border
        border-top none
        top 62px
      li
        fz(17px)
        &.active
          background #f8f8f8
          padding 0 2px
          background-origin content-box
          background-clip content-box
    .select-item
      height 64px
      line-height 64px
      color $color-c
      &.active
        color $color-orange
  .header-drop-down-mask
    position fixed
    width 10000%
    height 10000%
    left -100%
    top 0
    right 0
    bottom 0
    background rgba(0, 0, 0, 0)
    opacity 0
</style>

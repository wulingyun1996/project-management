<template>
  <base-popup-transition class="service-city-container" ref="popup" @hide="hidePopup">
    <div class="service-city-wrapper">
      <div class="service-city-title">请选择地址</div>
      <div class="service-city-header">
        <div class="province-title" :class="{active: currentTab === 1}" @click="toggleCityItem(1)">
          <span class="placeholder" v-show="cityArrLength === 0">请选择</span>
          <span class="placeholder" v-show="cityArrLength >= 1">{{ provinceid2Name }}</span>
        </div>
        <div class="city-title" v-show="cityArrLength >= 1" :class="{active: currentTab === 2}" @click="toggleCityItem(2)">
          <span class="placeholder" v-show="cityArrLength === 1">请选择</span>
          <span class="placeholder" v-show="cityArrLength >= 2">{{ cityid2Name }}</span>
        </div>
        <div class="area-title" v-show="cityArrLength >= 2" :class="{active: currentTab === 3}" @click="toggleCityItem(3)">
          <span class="placeholder" v-show="cityArrLength === 2">请选择</span>
          <span class="placeholder" v-show="cityArrLength === 3">{{ areaid2Name }}</span>
        </div>
      </div>
      <div class="service-city-body">
        <div class="province-body" v-show="showProvinceList">
          <base-senior-scroll :hasMore="true" :data="provinceList" :beforeScroll="true" @beforeScroll="beforeScroll">
            <div class="province-item" :id="provinceitem.name" v-for="(provinceitem, index) in provinceList" @click="getCityChildren(provinceitem.value)">{{ provinceitem.name }}</div>
          </base-senior-scroll>
        </div>
        <div class="city-body" v-show="isChoosedProvince">
          <base-senior-scroll :hasMore="true" :data="cityList">
            <div class="city-item" v-for="cityItem in cityList" @click="getAreaChildren(cityItem.value)">{{ cityItem.name }}</div>
          </base-senior-scroll>
        </div>
        <div class="area-body" v-show="isChoosedCity">
          <base-senior-scroll :hasMore="true" :data="areaList">
            <div class="area-item" v-for="areaItem in areaList" @click="getAreaItem(areaItem.value)">{{ areaItem.name }}</div>
          </base-senior-scroll>
        </div>
      </div>
    </div>
  </base-popup-transition>
</template>

<script>
import BasePopupTransition from 'base/pop/popup-transition'
import BaseSeniorScroll from 'base/scroll/senior-scroll'
import areaAddress from 'data/areaAddress'
import { id2Name, getChildren } from './service'
export default {
  props: {},
  data () {
    return {
      currentTab: 0,
      provinceList: [],
      cityList: [],
      areaList: [],
      cityArr: [],
      // 最近一次点击的省份
      latesdProvince: '',
      // 默认显示省份列表
      showProvinceList: true,
      // 是否点击过省份项
      isChoosedProvince: false,
      // 是否点击过城市项
      isChoosedCity: false,
      isBeforeScroll: true
    }
  },
  computed: {
    cityArrLength () {
      return this.cityArr.length
    },
    provinceid2Name () {
      return id2Name(this.cityArr.slice(0, 1), areaAddress)
    },
    cityid2Name () {
      if (this.cityArrLength >= 2) {
        return id2Name(this.cityArr.slice(1, 2), areaAddress)
      }
      return ''
    },
    areaid2Name () {
      if (this.cityArrLength >= 3) {
        return id2Name(this.cityArr.slice(2), areaAddress)
      }
      return ''
    }
  },
  created () {
    this.provinceList = getChildren('0', areaAddress)
  },
  methods: {
    // 强制重排
    beforeScroll () {
      if (!this.isBeforeScroll) return
      let dom = document.querySelector('#北京')
      dom.style.height = dom.offsetHeight + 1 + 'px'
      this.isBeforeScroll = false
    },
    toggleCityItem (t) {
      // 如果没有点击省份，点击也不选中
      if (this.cityArrLength) {
        if (t === 1) {
          this.initStatusPro()
        }
        if (t === 2) {
          this.initStatusCity()
        }
        if (t === 3) {
          this.initStatusArea()
        }
        this.currentTab = t
      }
    },
    // 获取下一级市区列表
    getCityChildren (value) {
      // 如果点击同一个省份的时候，不做修改
      if (this.latesdProvince === value) return
      this.initStatusCity()
      this.cityArr.splice(0)
      this.latesdProvince = value
      this.cityArr.splice(0, 1, value)
      this.cityList = getChildren(value, areaAddress)
    },
    // 获取下一级区县列表
    getAreaChildren (value) {
      this.cityArr.splice(1, 2, value)
      this.areaList = getChildren(value, areaAddress)
      this.initStatusArea()
    },
    // 获取当前区县, 选中任意一项， 隐藏弹窗
    getAreaItem (value) {
      this.cityArr.splice(2, 1, value)
      this.$refs.popup.hide()
    },
    // 拉起弹窗
    showPopup () {
      this.$refs.popup.show()
    },
    // 隐藏弹窗，并 commit $emit
    hidePopup () {
      let cityArr = id2Name(this.cityArr, areaAddress)
      this.$emit('choosedCity', this.cityArr, cityArr)
    },
    // 初始化点击省份，来隐藏城市和地区
    initStatusPro () {
      this.showProvinceList = true
      this.isChoosedProvince = false
      this.isChoosedCity = false
    },
    // 初始化点击城市，来隐藏省份和地区
    initStatusCity () {
      this.showProvinceList = false
      this.isChoosedProvince = true
      this.isChoosedCity = false
    },
    // 初始化点击区，来隐藏省份和城市
    initStatusArea () {
      this.showProvinceList = false
      this.isChoosedProvince = false
      this.isChoosedCity = true
    }
  },
  watch: {
    cityList (currentArr) {
      // 监听 市区 级别数据的改变，取第一个数据，查找区县
      let value = currentArr[0].value
      this.areaList = getChildren(value, areaAddress)
    },
    cityArr (val) {
      let length = val.length
      if (length === 1) {
        this.currentTab = length + 1
      }
      if (length === 2) {
        this.currentTab = length + 1
      }
    }
  },
  components: {
    BasePopupTransition,
    BaseSeniorScroll
  }
}
</script>

<style lang="stylus">
@import "~common/stylus/variable.styl"
@import "~common/stylus/mixin.styl"
.service-city-container
  .service-city-wrapper
    position absolute
    height 60%
    bottom 0
    left 0
    right 0
    background $color-white
    flex-col()
  .service-city-title
    tc()
    f16()
    height 80px
    line-height 80px
    bd-b($color-de)
  .service-city-header
    height 90px
    bd-b($color-de)
    tc()
    flex-f()
    >div
      f14()
      line-height 90px
      width 33.33%
      bd-b(transparent, 2px)
      &.active
        color $color-orange
        bd-b($color-orange, 2px)
    .province-title
      //
    .city-title
      //
    .area-title
      //
  .service-city-body
    flex 1
    overflow hidden
    >div
      f14()
      padding-left 80px
      height 90px
      line-height 90px
      height 100%
    .province-body
      .province-item
        //
    .city-body
      //
    .area-body
      //
</style>

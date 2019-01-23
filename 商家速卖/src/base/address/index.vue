<template>
  <div class="address-select" v-show="isShow">
    <div class="address-city">
      <h1 class="address-title">
        <span @click="hide"></span>
      </h1>
      <div class="city-list">
        <ul class="city-province">
          <li class="province"  v-for="(province, index) in addressList" :key="province.value" :class="{'special-province': index < 4}">
            <label :for="province.name" :class="{'forbiden-select': cityStorage[province.value] && cityStorage[province.value].length}">
              <span :class="{active: selectedCity.includes(province.value)}"></span>
              <input :id="province.name" :value="province.value" type="checkbox" @change="addCity(province.value)">{{ province.name }}
            </label>
            <i :class="{plus: currentIndex !== index, minus: currentIndex === index}" v-show="index > 3" @click="queryCity(index)"></i>
            <ul class="city-city" v-show="currentIndex === index">
              <li class="city" :class="{'long-name': city.name.length > 5}" v-for="city in province.city" :key="city.value">
                <label :for="city.name">
                  <span :class="{active: selectedCity.includes(city.value)}"></span>
                  <input :id="city.name" :value="city.value" type="checkbox" @change="addCity(city.value, city.parent)">{{ city.name }}
                </label>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="confirm-btn" @click="comfirm">
        完成
      </div>
    </div>
  </div>
</template>

<script>
import addressList from './address'
export default {
  props: {
    serviceCity: {
      type: Array,
      default () {
        return []
      }
    },
    StoragedCity: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      addressList,
      isShow: false,
      cityList: [],
      currentIndex: -1,
      selectedCity: [],
      cityStorage: {}
    }
  },
  created() {
    this.selectedCity = JSON.parse(JSON.stringify(this.serviceCity))
    this.cityStorage = JSON.parse(JSON.stringify(this.StoragedCity))
  },
  methods: {
    show () {
      this.isShow = true
    },
    hide () {
      this.isShow = false
    },
    comfirm () {
      let cityStorage = JSON.parse(JSON.stringify(this.cityStorage))
      this.$emit('comfirm', [...this.selectedCity], cityStorage)
    },
    queryCity (index) {
      if (this.currentIndex === index) {
        this.currentIndex = -1
        return
      }
      this.currentIndex = index
    },
    addCity (val, cityParent) {
      // 选中市则省不选中
      if (cityParent) {
        let cityVal = this.selectedCity.find(item => {
          return item === cityParent
        })
        if (cityVal) {
          this.selectedCity.splice(this.selectedCity.indexOf(cityParent), 1)
        }
        this.storageCity(val, cityParent)
      }
      // 移除已选城市
      let cityVal = this.selectedCity.find(item => {
        return item === val
      })
      if (cityVal) {
        this.selectedCity.splice(this.selectedCity.indexOf(val), 1)
        this.removeCity(val, cityParent)
        return
      }
      if (this.selectedCity.length >= 5) {
        this.$vux.toast.text('最多可添加五个城市', 'middle')
        return
      }
      this.selectedCity.unshift(val)
    },
    // 存储城市
    storageCity (val, cityParent) {
      if (this.selectedCity.length >= 5) return
      if (!this.cityStorage[cityParent]) this.cityStorage[cityParent] = []
      if (!this.cityStorage[cityParent].includes(val)) {
        this.cityStorage[cityParent].unshift(val)
      }
    },
    // 移除存储的城市
    removeCity (val, cityParent) {
      if (this.cityStorage[cityParent] && this.cityStorage[cityParent].length) {
        let isInclude = this.cityStorage[cityParent].includes(val)
        let index = this.cityStorage[cityParent].indexOf(val)
        if (isInclude) {
          this.cityStorage[cityParent].splice(index, 1)
        }
      }
    }
  }
}
</script>

<style lang='stylus'>
@import "~common/stylus/variable.styl"
@import "~common/stylus/mixin.styl"
::-webkit-scrollbar-track-piece
  background none
.address-select
  width 100%
  height 100%
  // background rgba(0, 0, 0, .2)
  background rgba(17, 17, 17, 0.5)
  position fixed
  left 0
  right 0
  top 0
  bottom 0
  .address-city
    width 77%
    height 55%
    background $color-white
    border-radius 28px
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
    display flex
    flex-direction column
    .address-title
      flex-box-center()
      justify-content flex-end
      margin 32px 0
      span
        width 30px
        height 30px
        margin-right 28px
        background url('./close.png') no-repeat center
        background-size 100% 100%
    .city-list
      padding-left 90px
      font-size 28px;/*px*/
      flex 1
      overflow auto
      .city-province,
      .city-city
        display flex
        flex-wrap wrap
        .province
          width 100%
          label
            font-weight 700
            width auto
          &.special-province
            width 50%
            label
              width 100%
          .city-city
            padding 0 50px 0 54px
            font-size 24px;/*px*/
            justify-content space-between
            .city
              width 50%
              &.long-name
                width 100%
              label
                font-weight 400
                padding 18px 0
                width 100%
                span
                  margin-right 12px
        label
          box-sizing content-box
          padding 20px 0
          line-height 32px
          display inline-block
          &.forbiden-select
            pointer-events none
          span
            display inline-block
            vertical-align bottom
            width 32px
            height 32px
            border 1px solid $color-9;/*no*/
            border-radius 50%
            margin-right 16px
            &.active
              background url('./choiced.png') no-repeat center
              background-size 100% 100%
              border none
        .plus,
        .minus
          display inline-block
          width 20px
          height 20px
          margin-left 12px
          background url('./plus.png') no-repeat center
          background-size 100% 100%
        .minus
          background url('./minus.png') no-repeat center
          background-size 100% 100%
    .confirm-btn
      width 200px
      height 72px
      text-align center
      line-height 72px
      color $color-white
      background $color-orange
      font-size 32px;/*px*/
      margin 20px auto 40px
      border-radius 10px
</style>

<template>
  <div class="enginee-cooperation-wrapper">
    <base-scroll :hasMore="true" class="want-to-bue-wrapper">
      <div class="seperate"></div>
      <div class="form-group">
        <div class="item-icon wtb-name"></div>
        <div class="item-content bd-b">
          <label for="">
            <group>
              <x-textarea
                :height="25"
                @on-focus="justifyBodyHeight"
                @on-blur="restoreBodyHeight"
                title=""
                v-model="goodsName"
                placeholder="填写工程合作主题（30字）"
                :max="30">
              </x-textarea>
            </group>
          </label>
        </div>
      </div>
      <div class="form-group">
        <div class="item-icon wtb-area"></div>
        <div class="item-content">
          <div class="address">
            <group>
              <x-address
                value-text-align="left"
                title=""
                :list='cityList'
                v-model="city"
                :hide-district="true"
                placeholder='合作首选区域'>
              </x-address>
            </group>
          </div>
          <span class="arrow-right"></span>
        </div>
      </div>
      <div class="form-group">
        <div class="item-icon wtb-clock"></div>
        <div class="item-content">
          <div class="date-time">
            <group>
              <datetime
                v-model="dateTime"
                title=""
                :start-date='startDate'
                placeholder="默认为长期合作">
              </datetime>
            </group>
          </div>
          <span class="arrow-right"></span>
        </div>
      </div>
      <div class="seperate"></div>
      <div class="form-textarea">
        <group>
          <x-textarea
            title=""
            v-model="goodsMessage"
            @on-focus="justifyBodyHeight"
            @on-blur="restoreBodyHeight"
            placeholder="请填写工程合作信息，详细介绍可以得到更多相关合作信息推荐哦"
            :max="100">
          </x-textarea>
        </group>
      </div>
      <div class="form-picture">
        <div class="item-pic" v-for="(item, index) in imgList" :key="index">
          <img :src="item" alt="">
          <span @click="removePic(index)"></span>
        </div>
        <div class="pic-placeholder" @click="uploadPic" v-show="imgListLength !== 2"></div>
        <p>最多可上传2张和工程合作相关的图片~</p>
      </div>
    </base-scroll>
    <div class="enginee-cooperation-footer" ref="button">
      <router-link to="/enginee-cooperation/role-explain" tag="h5">《求购规则说明》</router-link>
      <base-footer @footerSubmit="submitWantToBuy">发布</base-footer>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { Group, XAddress, Datetime, XTextarea } from 'vux'
import cityList from 'data/areaAddress'
import { dev, _postMessage, authenAnswerAlert } from 'native'
import { formatDateOne } from 'common'
export default {
  data () {
    return {
      goodsName: '',
      cityList,
      city: [],
      dateTime: '',
      startDate: formatDateOne(),
      goodsMessage: '',
      imgList: []
    }
  },
  computed: {
    imgListLength () {
      return this.imgList.length
    }
  },
  created () {
    window.album = this.getAndoriadPic
    authenAnswerAlert('您确定放弃编辑吗？')
  },
  methods: {
    getAndoriadPic (imgUrl) {
      this.imgList.push(imgUrl)
    },
    uploadPic () {
      let currentDev = dev()
      if (currentDev === 'Android') {
        window.android.selectPic()
        return false
      }
      if (currentDev === 'iOS') {
        _postMessage('', 'selectPic').then((val) => {
          let [imgUrl] = val
          this.imgList.push(imgUrl)
        })
      }
    },
    removePic (index) {
      this.imgList.splice(index)
    },
    submitWantToBuy () {
      if (!this.checkFieldValidity()) return
      /* eslint-disable */
      let [province_id, city_id] = this.city
      let [imagePath, imagePathTwo] = this.imgList
      let url = 'asktobuy/addItemAskToBuy'
      let obj = {
        type: 2,
        title: this.goodsName,
        province_id,
        city_id,
        deadline: this.dateTime,
        content: this.goodsMessage,
        image_path: imagePath ? imagePath : '',
        image_path_two: imagePathTwo ? imagePathTwo : ''
      }
      /* eslint-enable */
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.$t('发布求购成功', 'middle')
          this.$root.listInfo = null
          this.$router.push('/want-to-buy')
          return
        }
        this.$t(res.message, 'middle')
      })
    },
    checkFieldValidity () {
      if (!this.goodsName.trim()) {
        this.$t('请填写主题', 'middle')
        return false
      }
      if (!this.city.length) {
        this.$t('请选择地址', 'middle')
        return false
      }
      // if (!this.dateTime) {
      //   this.$t('请选择截止时间', 'middle')
      //   return false
      // }
      // if (this.dateTime && initTime(this.dateTime) < initTime()) {
      //   this.$t('截止时间不可小于当前时间', 'middle')
      //   return false
      // }
      if (!this.goodsMessage.trim()) {
        this.$t('请填写求购信息', 'middle')
        return false
      }
      // if (!this.imgList.length) {
      //   this.$t('请上传求购相关的图片', 'middle')
      //   return false
      // }
      return true
    }
  },
  components: {
    Group,
    XAddress,
    Datetime,
    XTextarea
  }
}
</script>

<style lang="stylus">
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
@import '~@/assets/css/vux'
.enginee-cooperation-wrapper
  height 100%
  flex-col-btw()
  overflow hidden
  .want-to-bue-wrapper
    flex 1
    padding 0 30px
    overflow unset
    // .scroll-container
    //   overflow unset
    .seperate
      height 24px
      background $color-body
      margin 0 -30px
    .form-group
      flex-align-item()
      height 104px
      .item-icon
        wh(36px)
        margin-right 24px
        &.wtb-name
          bg('wtb-name.png')
        &.wtb-area
          bg('wtb-area.png')
        &.wtb-clock
          bg('wtb-clock.png')
      .item-content
        flex 1
        height 100%
        flex-align-item()
        position relative
        label,
        input
          width 100%
        .arrow-right
          wh(26px)
          position absolute
          right 0
          top 50%
          transform translateY(-50%)
          bg('arrow-right.png')
        .address,
        .date-time
          position relative
          flex 1
          padding-right 30px
          height 100%
          >div
            height 100%
          .weui-cells
            height 100%
            margin-top 0
            flex-f()
            align-items center
            f14()
            color: $color-c
            &:before,
            &:after
              content unset
            span.vux-popup-picker-value,
            span.vux-cell-placeholder,
            span.vux-cell-value
              f12()
              color $color-3
          .weui-cell
            width 100%
          .vux-cell-box
            width 100%
            height 100%
            flex-f()
            align-items center
            >div
              width 100%
          .weui-cell__ft
            text-align left
            &:after
             content unset
    .form-textarea
      bd($color-e3)
      margin 30px 0 40px
      textarea
        height 200px
    .form-picture
      flex-align-item()
      justify-content flex-start
      .item-pic,
      .pic-placeholder
        margin-right 24px
        wh(140px)
      .item-pic
        position relative
        img
          wh(100%)
        span
          wh(32px)
          bg('wtb-close.png')
          position absolute
          right -16px
          top -16px
      .pic-placeholder
        bg('wtb-pic.png')
      p
        f12()
        color $color-a6
        line-height 40px
  h5
    tc()
    f12()
    color $color-9
    margin-bottom 10px
  .bd-b
    bd-b($color-e3)
.weui-cells
  f12()
  &:before,
  &:after
    content unset!important
</style>

<template>
  <div class="base-info-container">
    <base-header></base-header>
    <!-- 2018/10月份优化移除 -->
    <!-- <div class="form-group">
      <label for="name">商圈名称:</label>
      <input id="name" type="text" placeholder="请输入联盟圈名字 2-15个文字" v-model="allianceName" maxlength="15">
    </div>
    <div class="form-group">
      <label for="person">联系人:</label>
      <input id="person" type="text" placeholder="请输入姓名 2-15个文字" v-model="contactName" maxlength="15">
    </div>
    <div class="form-group">
      <label for="city">服务城市:</label>
      <input id="city" type="text" v-model="serviceCity" disabled>
    </div> -->
    <!-- 2018/10月份优化新增 -->
    <div class="base-info-wrapper">
      <div class="info-item logo arrow" @click="setShopLogo">
        <div class="item-left">
          <span class="icon-star"></span>
          <span>商圈LOGO</span>
        </div>
        <div class="item-right">
          <img :src="shopLogo" alt="" v-if="shopLogo && flag">
          <img src="./images/logo.png" alt="" v-if="!shopLogo && flag">
        </div>
      </div>
      <div class="info-item arrow" @click="editName(allianceName)">
        <div class="item-left">
          <span class="icon-star"></span>
          <span>商圈名称</span>
        </div>
        <div class="item-right">
          <span>{{ allianceName }}</span>
        </div>
      </div>
      <div class="info-item">
        <div class="item-left">
          <span class="icon-star"></span>
          <span>服务城市</span>
        </div>
        <div class="item-right">
          <span>{{ serviceCity }}</span>
        </div>
      </div>
    </div>
    <div class="base-info-button" @click="submitInfo" :class="{active: isActive}">
      <span>提交</span>
    </div>
    <!-- 删除弹出框 -->
    <!-- <base-confirm-text
      ref="text"
      :max="15"
      @confirm="modifyAllianceName"
      text="商圈名称"
      :input-value="allianceName"
      placeholder="请输入商圈名称（2-15个文字）">
    </base-confirm-text> -->
  </div>
</template>
<script>
import BaseConfirmText from 'base/confirm/confirm-text'
import cityList from 'data/areaAddress.json'
import { mapMutations } from 'vuex'
import { id2Name } from 'base/address/service'
import { getPic } from 'common/js/dev'
export default {
  data () {
    return {
      allianceName: '',
      contactName: '',
      serviceCity: '',
      city: [],
      shopLogo: '',
      flag: false
    }
  },
  computed: {
    isActive () {
      return this.allianceName
    }
  },
  created() {
    this.viewApply()
    window.album = this.getAndoriadLogo
  },
  methods: {
    ...mapMutations(['ADDALLIANCENAME']),
    // 店铺logo
    getAndoriadLogo (imgUrl) {
      this.shopLogo = imgUrl
      this.uploadShopLogo(imgUrl)
    },
    setShopLogo () {
      let dev = this.$dev
      if (dev === 1) {
        window.android.selectPic(72, 72)
        return
      }
      if (dev === 2) {
        let obj = {
          width: 72,
          height: 72
        }
        getPic('selectPic', obj).then(val => {
          let [imgUrl] = val
          this.shopLogo = imgUrl
          this.uploadShopLogo(imgUrl)
        })
      }
    },
    uploadShopLogo (logo) {
      let url = 'unionAvatar'
      let obj = {
        path: logo
      }
      this.$http(url, obj)
    },
    viewApply () {
      let url = 'apply/viewApplyUnion'
      this.$http(url).then(res => {
        if (res.code === this.$ok) {
          this.allianceName = res.data.union_name
          this.contactName = res.data.contact
          this.shopLogo = res.data.avatar
          this.city = [String(res.data.op_province), String(res.data.op_city), String(res.data.op_area)]
          this.serviceCity = id2Name(this.city, cityList).replace(/ /g, '-')
          this.flag = true
        }
      })
    },
    submitInfo () {
      if (!this.isActive) return
      let regName = /^[0-9-A-z\u4e00-\u9fa5]{2,15}$/
      let regAlliRes = regName.test(this.allianceName)
      // let regContRes = regName.test(this.contactName)
      if (!this.allianceName.trim()) {
        this.$vux.toast.text('商圈名称不能为空', 'middle')
        return false
      }
      if (!regAlliRes) {
        this.$vux.toast.text('请输入正确的商圈名称格式', 'middle')
        return false
      }
      // if (!this.contactName.trim()) {
      //   this.$vux.toast.text('联系人不能为空', 'middle')
      //   return false
      // }
      // if (!regContRes) {
      //   this.$vux.toast.text('请输入正确的联系人格式', 'middle')
      //   return false
      // }
      this.editBaseInfo()
    },
    editBaseInfo () {
      let url = 'apply/editUnionInfo'
      let obj = {
        unionName: this.allianceName,
        avatar: this.shopLogo ? this.shopLogo : ''
      }
      this.$http(url, obj).then((res) => {
        if (res.code === this.$ok) {
          this.$vux.toast.text(res.data, 'middle')
          this.ADDALLIANCENAME(this.allianceName)
          this.$root.allianceName = this.allianceName
          this.goHome()
          return
        }
        this.$vux.toast.text(res.message, 'middle')
      })
    },
    editName(allianceName) {
      // 跳转到下一页
      this.$router.push(`/alliance-name/${allianceName}`)
    },
    // modifyAllianceName (t) {
    //   this.allianceName = t
    // },
    goHome () {
      let dev = this.$dev
      if (dev === 1) {
        window.android.finish()
        return false
      }
      if (dev === 2) {
        window.webkit.messageHandlers.nativeClose.postMessage('')
      }
    }
  },
  components: {
    BaseConfirmText
  }
}
</script>

<style lang='stylus'>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.base-info-container
  position relative
  height 100%
  background #fff
  // padding 44px 30px 0 24px
  #city
    color $color-3
  .base-info-wrapper
    padding 0 30px
    .info-item
      height 100px
      padding-right 40px
      flex-align-item()
      border-b()
      &.arrow
        background url('./images/arrow.png') no-repeat right center
        background-size 16px auto
      &.logo
        height 120px
      .item-left
        flex-f-align()
        f14()
        color #151515
        .icon-star
          wh(14px)
          bg('icon-star.png')
          margin-right 5px
      .item-right
        color #7C7C7C
        img
          wh(68px);
          border:1px solid #E4E2E2;
          border-radius: 4px;
          background-color: #F4F4F4;
          margin-right 10px
          // border-radius(50%)
  // .form-group
  //   display flex
  //   align-items center
  //   margin-bottom 60px
  //   height 70px;
  //   font-size 28px;/*px*/
  //   &.txt
  //     align-items flex-start
  //     margin-bottom 20px
  //   &.street
  //     height auto
  //   label
  //     width 200px;
  //     height inherit
  //     line-height 70px
  //     margin-right 22px
  //     text-align right
  //     color $color-3
  //   input,
  //   textarea
  //     display block
  //     width 520px
  //     height inherit
  //     border 1px solid $color-c;/*no*/
  //     padding-left 18px
  //     border-radius 4px;/*px*/
  //     font-size 24px;/*px*/
  //     color $color-3
  //   #street
  //     height 200px
  //     line-height 34px
  //     background #f8f8f8
  .base-info-button
    width 100%
    height 100px;
    line-height 100px;
    position fixed
    left 0
    right 0
    bottom 0
    background $color-bc
    color #fff
    f16()
    tc()
    &.active
      background $color-orange
</style>

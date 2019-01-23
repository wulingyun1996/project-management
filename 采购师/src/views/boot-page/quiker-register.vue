<template>
  <div class="content iphone-x-bottom">
    <div class="content-container">
      <base-scroll class="content-scroll" :hasMore='true'>
        <div class="top-banner">
          建材行业商户的共同选择
        </div>
        <section>
          <div class="item">
            <div class="left">
              <div><strong>门店</strong><span>经营更简单</span></div>
              <p>全方位经营动态</p>
              <p>随时随地掌控</p>
            </div>
            <div class="right">
              <img src="./images/simple.png" alt="">
            </div>
          </div>
          <div class="item">
            <div class="right">
              <img src="./images/efficiency.png" alt="">
            </div>
            <div class="left">
              <div><strong>管理</strong><span>订单更高效</span></div>
              <p>订单实时推送</p>
              <p>接单出来更方便</p>
            </div>
          </div>
          <div class="item">
            <div class="left">
              <div><strong>资金</strong><span>使用更便捷</span></div>
              <p>急用钱？</p>
              <p>随借随还，快速放贷</p>
            </div>
            <div class="right">
              <img src="./images/nimble.png" alt="">
            </div>
          </div>
        </section>
        <div class="info">
          <div class="info-item">
            <div class="label">
              姓名
            </div>
            <div class="input">
              <input
                type="text"
                v-model="form.name"
                placeholder="请输入2-10个字"
                maxlength="10"
                minlength="2"
                @focus="justifyBodyHeight"
                @blur="checkName">
            </div>
          </div>
          <div class="info-item">
            <div class="label">
              手机号
            </div>
            <div class="input">
              <input
                type="text"
                v-model="form.phone"
                placeholder="用于客服人员与您联系"
                @focus="justifyBodyHeight"
                @blur="checkPhone"
                maxlength="11">
            </div>
          </div>
          <div class="info-item">
            <div class="label">
              行业类别
            </div>
            <div class="input" @click="showKinds = true">
              <input
                type="text"
                placeholder="请选择"
                :value="selectedKinds"
                onfocus="this.blur()">
              <img src="./images/arrow_bottom.png" alt="">
            </div>
          </div>
          <div class="info-item">
            <div class="label">
              公司名称
            </div>
            <div class="input">
              <input
                type="text"
                placeholder="请输入公司/店铺名称"
                v-model="form.cname"
                @focus="justifyBodyHeight"
                @blur="checkCname">
            </div>
          </div>
          <div class="info-item">
            <div class="label">
              所属区域
            </div>
            <div class="input" @click="showAddress = true">
              <input
                type="text"
                placeholder="请选择"
                :value="selectedAddress"
                onfocus="this.blur()">
              <img src="./images/arrow_bottom.png" alt="">
            </div>
          </div>
        </div>
      </base-scroll>
      <div class="foot-area">
        <div class="tips">
          <span>
          请勿重复提交申请，我们将会在一个工作日内联系您，请您注意接听！
          </span>
        </div>
        <div class="btn" ref="button" @click="submit" :class="valid ? 'valid' : ''">
          提交
        </div>
      </div>
    </div>
    <PopupPicker style="display: none" :data="addressList" ref="address" :columns="3" :show.sync="showAddress" @on-hide="selectAddress"></PopupPicker>
    <popup-picker style="display: none" :data="kindsList" ref="kinds" :show.sync="showKinds" @on-hide="selectKinds"></popup-picker>
  </div>
</template>

<script>
import BaseScroll from 'components/scroll/scroll'
import { PopupPicker } from 'vux'
import cityJson from './city.json'
let newArr = []
function result (arr) {
  for (let i = 0; i < arr.length; i++) {
    newArr.push({name: arr[i].name, value: arr[i].value + '', parent: arr[i].parent + ''})
    if (arr[i].areaList) {
      result(arr[i].areaList)
    }
  }
  return newArr
}
export default {
  data () {
    return {
      form: {
        name: '',
        phone: '',
        kindId: '',
        cname: '',
        address: []
      },
      addressList: [],
      kindsList: [],
      selectedAddress: '',
      selectedKinds: '',
      showAddress: false,
      showKinds: false
    }
  },
  mounted () {
    this.addressList = result(cityJson.citylist)
    this.$http('basic/industry').then(res => {
      if (res.code === 200) {
        for (let i = 0; i < res.data.length; i++) {
          this.kindsList.push({name: res.data[i].title, value: res.data[i].id + ''})
        }
        this.kindsList = [this.kindsList]
      }
    })
  },
  methods: {
    selectAddress (confirm) {
      if (confirm) {
        this.selectedAddress = this.$refs.address.getNameValues()
        const arr = this.selectedAddress.split(/\s/)
        this.form.address = []
        for (let i = 0; i < arr.length; i++) {
          for (let j = 0; j < this.addressList.length; j++) {
            if (arr[i] === this.addressList[j].name) {
              this.form.address.push(Number(this.addressList[j].value))
              break
            }
          }
        }
      }
    },
    selectKinds (confirm) {
      if (confirm) {
        this.selectedKinds = this.$refs.kinds.getNameValues()
        for (let i = 0; i < this.kindsList[0].length; i++) {
          if (this.selectedKinds === this.kindsList[0][i].name) {
            this.form.kindId = Number(this.kindsList[0][i].value)
            break
          }
        }
      }
    },
    checkName () {
      this.restoreBodyHeight()
      if (!this.form.name.trim()) {
        this.$t('请输入姓名', 'middle')
        return false
      }
      return true
    },
    checkPhone () {
      this.restoreBodyHeight()
      if (!this.form.phone.trim()) {
        this.$t('请输入手机号', 'middle')
        return false
      }
      if (!(/^1[3-9][0-9]{9}$/).test(this.form.phone)) {
        this.$t('手机号格式错误', 'middle')
        return false
      }
      return true
    },
    checkAddress () {
      if (!this.form.address.join()) {
        return false
      }
      return true
    },
    checkCname () {
      this.restoreBodyHeight()
      if (!this.form.cname.trim()) {
        this.$t('请输入公司或店铺名称', 'middle')
        return false
      }
      return true
    },
    checkKinds () {
      if (this.form.kinds === '') {
        return false
      }
      return true
    },
    submit () {
      if (!this.preventMoreClick) return
      if (!this.checkName()) return
      if (!this.checkPhone()) return
      if (!this.checkKinds()) {
        this.$t('请选择行业', 'middle')
        return
      }
      if (!this.checkCname()) return
      if (!this.checkAddress()) {
        this.$t('请选择地址', 'middle')
        return
      }
      this.preventMoreClick = false
      setTimeout(() => {
        this.preventMoreClick = true
      }, 1000)
      this.$http('applyForShop', {
        fullName: this.form.name,
        mobile: this.form.phone,
        industryId: this.form.kindId,
        corpName: this.form.cname,
        provinceId: this.form.address[0],
        cityId: this.form.address[1],
        areaId: this.form.address[2]
      }).then(res => {
        if (res.code === 200) {
          this.$t('提交成功', 'middle')
          this.$router.back()
        } else {
          this.$t(res.message, 'middle')
        }
      })
    }
  },
  computed: {
    valid () {
      if (this.form.name.trim() && this.form.phone.trim() && (/^1[3-9][0-9]{9}$/).test(this.form.phone) && this.checkKinds() && this.form.cname.trim() && this.checkAddress()) {
        return true
      }
      return false
    }
  },
  components: {
    PopupPicker,
    BaseScroll
  },
  beforeRouteLeave (to, from, next) {
    newArr = []
    next()
  }
}
</script>

<style lang="stylus">
.vux-popup-picker-container
  .vux-popup-header
    height 80px!important
    line-height 80px!important
    font-size 32px
  .vux-popup-header-right
    color #FF8A00
</style>

<style lang="stylus" scoped>
@import '~@/assets/css/mixins'
.content
  height 100%
  overflow-y auto
  overflow-x hidden
  .content-container
    height 100%
    flex-col()
    .content-scroll
      flex 1
.top-banner
  height 160px
  padding 64px 0 0 160px
  background url('./images/top_bg.png') no-repeat
  background-size 100% 100%
  text-align center
  font-size 32px
  color #FFF
section
  padding 0 40px
  border-bottom 20px solid rgb(244, 244, 244)
  .item
    display flex
    padding 50px 36px
    border-bottom 1px solid #DFDFDF;/*no*/
    color #999999
    font-size 28px
    .left
      strong
        color #FF8A00
        font-size 30px
      span
        color #333
        font-size 30px
      p:nth-of-type(1)
        margin 24px 0 16px
      div
        margin-top 10px
    .right
      text-align right
  .item:nth-of-type(1)
    .left
      flex 1
    img
      width 241px
      height 221px
  .item:nth-of-type(2)
    .right
      flex 1
    img
      width 290px
      height 228px
    .right
      text-align left
  .item:nth-of-type(3)
    border-bottom none
    .left
      flex 1
    img
      width 299px
      height 293px
.info
  padding 0 40px 10px
  .info-item
    margin-top 38px
    display flex
    align-items center
    justify-content center
    .label
      font-size 28px
      color #333
      width 160px
    .input
      position relative
      flex 1
      input
        text-indent 24px
        color #333
        height 80px
        line-height 80px
        border-radius 2px;/*no*/
        outline none
        border 1px solid #CCCCCC;/*no*/
        width 100%
      img
        position absolute
        width 36px
        height 36px
        top 50%
        transform translateY(-50%)
        right 24px
.foot-area
  // position fixed
  // bottom 0
  width 100%
  height 188px
  .tips
    height 88px
    font-size 24px
    color #FF8A00
    padding 0 120px
    background rgb(255, 239, 219)
    display flex
    align-items center
    justify-content center
    line-height 1.4
  .btn
    height 100px
    text-align center
    line-height 100px
    background rgb(188, 188, 188)
    font-size 32px
    color #FFF
  .valid
    background #FF8A00
</style>

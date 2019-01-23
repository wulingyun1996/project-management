<template>
  <div>
    <div class="card-mana">
      <div class="card-ms">
        <scroll ref="scroll" class="main-content" v-show="hasMore">
          <div class="card-container">
            <div class="card-state">
              <i></i>
              <p>特约卡领取成功后，满足以下的不同等级条件即可享受相应等级的采购师折扣</p>
            </div>
            <div class="card-success" v-if="this.numTotal.total">
              <div class="header">  
                <i class="shape"></i>
                <span>特约采购师</span> 
              </div>
              <div class="mount">
                <div>
                  <span class="gray">特约总数</span>
                  <span class="orange">{{this.numTotal.total}}</span>
                </div>
                <div>
                  <span class="gray">昨日新增</span>
                  <span class="orange">{{this.numTotal.yesterday_total}}</span>
                </div>        
              </div>
            </div>
            <div class="card-box">
              <div class="title">
                <div class="title-left">
                {{this.sellName}}</div>
                <div class="title-right" @click="proName"><i></i><span>编辑</span></div>
              </div>
              <div @click="goThree" class="card-base card-gradethree">
                <div class="card-top">
                  <div class="pic">
                    <img src="./gradethree.png" />
                  </div>
                  <h4>三级特约卡</h4>
                  <div class="icon"  :class="{'active':this.cardMess.three_discount}"></div>
                  <p>{{this.cardMess.three_discount?this.cardMess.three_discount:'XX'}}<span>折</span></p>
                  <i class="gou" v-if="this.cardMess.three_discount"></i>
                </div>
                <div class="card-bottom">
                  <div class="card-left">条件</div>
                  <div class="card-right">
                    <p>特约采购师审核通过</p></div>
                </div>
              </div>
              <div @click="goTwo" class="card-base card-gradetwo">
                <div class="card-top">
                  <div class="pic">
                    <img src="./gradetwo.png" />
                  </div>
                  <h4>二级特约卡</h4>
                  <div class="icon" :class="{'active':this.cardMess.two_discount}" ></div>
                  <p>{{this.cardMess.two_discount?this.cardMess.two_discount:'XX'}}<span>折</span></p>
                  <i class="gou" v-if="this.cardMess.two_discount"></i>
                </div>
                <div class="card-bottom">
                  <div class="card-left">条件</div>
                  <div class="card-right">
                    <p>特约采购师审核通过</p>
                    <p class="last">交易额 {{this.cardMess.two_amount?this.cardMess.two_amount:'XX'}} 元<span>|</span>交易数 {{this.cardMess.two_count?this.cardMess.two_count:'XX'}} 次</p>
                  </div>
                </div>
              </div>
              <div @click="goOne"  class="card-base card-gradeone">
                <div class="card-top">
                  <div class="pic">
                    <img src="./gradeone.png" />
                  </div>
                  <h4>一级特约卡</h4>
                  <div class="icon" :class="{'active':this.cardMess.one_discount}"></div>
                  <p>{{this.cardMess.one_discount?this.cardMess.one_discount:'XX'}}<span>折</span></p>
                  <i class="gou" v-if="this.cardMess.one_discount"></i>
                </div>
                <div class="card-bottom">
                  <div class="card-left">条件</div>
                  <div class="num">
                    <p>特约采购师审核通过</p>
                    <p class="last">交易额 {{this.cardMess.one_amount?this.cardMess.one_amount:'XX'}} 元<span>|</span>交易数 {{this.cardMess.one_count?this.cardMess.one_count:'XX'}} 次</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="column"></div>
            <div class="pro" @click="goList" v-if="this.cardMess.one_count">
              <p>特约卡活动商品:</p>
              <span v-show="this.setNum>0">{{setNum}}</span>
              <span v-if="!this.setNum">请设置</span>
              <i></i>
            </div>
          </div>
        </scroll>
      </div>
      <div class="open-card" v-show="noSet">
        <div class="box">
          <div class="pic">
            <img src="./VIP.png">
          </div>
          <p class="card">特约卡</p>
          <p class="member">让无数采购师们成为您的会员</p>
          <p>让您的每一位会员</p>
          <p>都是<span>回头客！</span></p>
        </div>
        <div class="card-fixed">
          <div class="set">
            <div class="txt">
              <p>设置您店铺的特约卡等级条件及相关折扣优惠信息设置</p>
              <p>完成后即可成功开启特约采购师活动</p>
            </div>
          </div>
          <div class="btn" @click="degree">开通特约卡</div>
        </div>
      </div>
      <modal ref="Modal"></modal>
      <pop ref="mess" :title="title"></pop>
      <confirm-textarea ref="textArea" @confirm="sellNameConfirm" text="特约卡名称" placeholder="最多可输入25个字哦~" :max="25"></confirm-textarea>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import Scroll from 'base/scroll/scroll'
import {dev} from 'common/js/dev'
import {nativeBackBase, navBack} from 'api/init'
import Modal from 'base/modal/modal'
import Confirm from 'base/confirm/confirm'
import ConfirmTextarea from 'base/confirm/confirm-textarea'
import Pop from 'base/pop/pop'
import {mapGetters} from 'vuex'
import {loadDataPost, STATUS_OK} from 'api/common'
import { ConfirmPlugin } from 'vux'
Vue.use(ConfirmPlugin)
import Vue from 'vue'
export default {
  data() {
    return {
      noSet: false,
      numTotal: {},
      setNum: 0,
      cardMess: {},
      isMiss: false,
      sellName: '',
      title: '',
      hasMore: false
    }
  },
  created() {
    // this.getRoute()
    window.nav_alert_back = this.nav_alert_back
    window.close_btn = this.close_btn
    this.nav()
  },
  computed: {
    ...mapGetters(['commodity'])
  },
  methods: {
    close_btn() {
      let currentDev = dev()
      try {
        if (currentDev === 'Android') {
          window.android.nativeClose()
        } else if (currentDev === 'iOS') {
          window.webkit.messageHandlers.nativeClose.postMessage('')
        } else {
          // alert('PC')
        }
      } catch (e) {
        console.warn(e)
      }
    },
    nav() {
      let param = {
        'left': [{
          'title': 'back',
          'function': 'nav_alert_back()' // 默认
        }]
      }
      nativeBackBase(param)
    },
    nav_alert_back () {
      if (this.cardMess.three_discount && (!this.cardMess.two_discount || !this.cardMess.one_discount)) {
        let params = {
          'title': '提示',
          'message': '您确认放弃特约卡设置吗?',
          'confirm': 'close_btn()',
          'cancel': ''
        }
        let currentDev = dev()
        try {
          if (currentDev === 'Android') {
            window.android.nativeAlterBack(JSON.stringify(params))
          } else if (currentDev === 'iOS') {
            window.webkit.messageHandlers.nativeAlertBack.postMessage(params)
          } else {
            // alert('PC')
            navBack()
          }
        } catch (e) {
          console.warn(e)
        }
      } else {
        navBack()
      }
    },
    degree() {
      if (this.isMiss === true) {
        this.$refs.Modal.show()
        return false
      }
      this.noSet = false
      this.hasMore = true
    },
    getRoute() {
      let URL = 'SpecialCardHome'
      loadDataPost(URL).then((res) => {
        if (res.code === STATUS_OK) {
          if (res.data.is_done !== undefined) {
            this.noSet = true
            if (res.data.is_done === false) {
              // false 未完善店铺信息 显示完善信息弹窗
              this.isMiss = true
            } else {
              this.sellName = res.data.card_name
              window.sessionStorage.setItem('sellName')
            }
          } else {
            this.hasMore = true
            let datas = res.data
            this.numTotal = datas.data_report ? datas.data_report : []
            this.setNum = datas.special_goods_total ? datas.special_goods_total : []
            this.cardMess = datas.card_info ? datas.card_info : []
            this.sellName = datas.card_info.card_name
          }
        }
      })
    },
    proName() {
      this.$refs.textArea.show()
    },
    sellNameConfirm() {
      let URL = 'setSpecialCard'
      let obj = {
        card_name: this.commodity
      }
      loadDataPost(URL, obj).then((res) => {
        if (res.code === STATUS_OK) {
          this.sellName = this.commodity
        }
      })
    },
    goList() {
      this.$router.push('/activity-product')
    },
    popShow(string) {
      this.title = string
      this.$refs.mess.show()
      this.$refs.mess.hide()
    },
    goThree() {
      this.$router.push({
        path: '/cardthree-condition',
        query: {
          num: this.cardMess.three_discount ? this.cardMess.three_discount : '0',
          twoNum: this.cardMess.two_discount ? this.cardMess.two_discount : '0'
        }
      })
    },
    goTwo() {
      if (this.cardMess.three_discount === null) {
        this.popShow('请先设置三级特约卡')
        return false
      } else {
        this.$router.push({
          path: '/cardtwo-condition',
          query: {
            num: this.cardMess.three_discount,
            discount: this.cardMess.two_discount ? this.cardMess.two_discount : '0',
            money: this.cardMess.two_amount ? this.cardMess.two_amount : '0',
            count: this.cardMess.two_count ? this.cardMess.two_count : '0',
            twoNum: this.cardMess.one_discount,
            twoMoney: this.cardMess.one_amount,
            twoCount: this.cardMess.one_count
          }
        })
      }
    },
    goOne() {
      if (this.cardMess.two_discount === null) {
        if (this.cardMess.three_discount === null) {
          this.popShow('请先设置三级特约卡')
          return false
        }
        this.popShow('请先设置二级特约卡')
      } else {
        this.$router.push({
          path: '/cardone-condition',
          query: {
            twonum: this.cardMess.two_discount,
            twoMoney: this.cardMess.two_amount,
            twoCount: this.cardMess.two_count,
            discount: this.cardMess.one_discount ? this.cardMess.one_discount : '0',
            money: this.cardMess.one_amount ? this.cardMess.one_amount : '0',
            count: this.cardMess.one_count ? this.cardMess.one_count : '0'
          }
        })
      }
    }
  },
  components: {
    Scroll,
    ConfirmTextarea,
    Confirm,
    Modal,
    Pop
  }
}
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
body
  width: 100%
  height: 100%
  overflow: hidden
.card-mana
  background: $color-f4
  position: static
  width: 100%
  height: 100%
  left: 0
  top: 0
  right: 0
  bottom: 0
  overflow: hidden
  .card-ms
    position: absolute
    width: 100%
    height: 100%
    left: 0
    bottom: 0
  .main-content
    height: 100%
    overflow: hidden
  .card-state
    background: $color-orange8
    padding: 15px 48px 20px 32px
    flex-box-center()
    font-size: 24px;/*px*/
    i
      background: url('attention.png') no-repeat
      background-size: 100% auto
      display: block
      background-size: 100% auto
      width: 36px;/*px*/
      height: 34px;/*px*/
    p
      font-size: 24px;/*px*/
      color: $color-9
      padding-left: 18px
      line-height: 1.3
  .card-success
    padding: 32px 25px 0
    background: $color-white
  .header
    position: relative
    padding-left: 16px
    .shape
      display: block
      width: 4px;/*px*/
      height: 25px;/*px*/
      position: absolute
      left: 0
      top: 50%
      transform: translateY(-50%)
      background-image: url('shape.png')
    span
      font-size: 28px;/*px*/
      color: $color-orange
  .mount
    padding: 76px 90px 0 90px
    display: flex
    >div
      text-align: center
      flex: 1
    span
      display: block
    .gray
      font-size: 28px;/*px*/
      color: $color-3
    .orange
      font-size: 46px;/*px*/
      color: $color-orange
      margin-top: 28px
  .card-box
    padding: 0 25px 34px
    background: $color-white
  .title
    font-size: 30px;/*px*/
    padding: 50px 0
    flex-between()
    .title-left
      flex: 1
      position: relative
      line-height: 1.3
      padding-left: 26px
      &:after
        content: ''
        width: 6px
        height: 26px
        position: absolute
        left: 0
        top: 5px
        background: $color-orange
    .title-right
      white-space: nowrap
      width: 28%
      display: flex
      justify-content: flex-end
      padding-top: 8px
      i
        background-image: url('editone.png')
        background-size: 100% auto
        display: block
        width: 27px;/*px*/
        height: 28px;/*px*/
        margin: 0 10px 0 0
      span
        font-size: 26px;/*px*/
        color: $color-orange
        display: block
  .card-base
    width: 100%
    border-radius: 10px
    .card-top
      position: relative
      .pic
        padding: 44px 0 46px 20px
        img
          width: 106px;/*px*/
          height: 96px;/*px*/
      h4
        font-size: 36px;/*px*/
        color: $color-white
        position: absolute
        top: 73px
        left: 253px
        font-weight: bold
      .icon
        background-image: url('set.png')
        background-size: 28px 28px;/*px*/
        background-position: center center
        background-repeat: no-repeat
        display: block
        width: 68px;/*px*/
        height: 68px;/*px*/
        position: absolute
        top: 0
        right: 0
        cursor: pointer
        &.active
          background-image: url('edit.png')
      p
        font-size: 36px;/*px*/
        position: absolute
        right: 18px
        bottom: 20px
      span
        font-size: 24px;/*px*/
      .gou
        background: url('gou.png') no-repeat
        background-size: 100% auto
        position: absolute
        top: -1px;/*no*/
        left: -1px;/*no*/
        width: 93px;/*px*/
        height: 93px;/*px*/
        display: block
        border-top-left-radius: 5px
    .card-bottom
      border-radius: 0 0 10px 10px
      display: flex
      padding: 24px 20px
      .card-left
        font-size: 24px;/*px*/
        padding-right: 20px
        font-weight: bold
      .last
        margin-top: 10px
        span
          margin: 0 20px
  .card-gradethree
    background: $color-blue2
    border: 2px solid $color-blue2;/*px*/
    .card-top
      p
        color: $color-blue3
    .card-bottom
      border-top: 5px dotted $color-blue2
      background-color: $color-gray2
      color: $color-blue4
  .card-gradetwo
    background: $color-pink
    margin-top: 30px
    border: 2px solid $color-pink;/*px*/
    .card-top
      p
        color: $color-pink1
    .card-bottom
      border-top: 5px dotted $color-pink
      background-color: $color-pink3
      color: $color-pink2
  .card-gradeone
    background: $color-orange4
    margin-top: 30px
    border: 2px solid $color-orange4;/*px*/
    .card-top
      p
        color: $color-orange5
    .card-bottom
      border-top: 5px dotted $color-orange4
      background-color: $color-orange7
      color: $color-orange6
.column
  height: 20px;/*px*/
  background: $color-f4
.pro
  width: 100%
  padding: 0 25px
  display: flex
  align-items: center
  font-size: 30px;/*px*/
  line-height: 94px;/*px*/
  background: $color-white
  position: relative
  i
    display: block
    width: 13px;/*px*/
    height: 24px;/*px*/
    position: absolute
    transform: translateY(-50%)
    top: 50%
    right: 25px
    background-image: url('arrow.png')
    background-size: 100% auto
  span
    position: absolute
    right: 60px
.open-card
  background: $color-white
  position: fixed
  width: 100%
  left: 0
  top: 0
  right: 0
  bottom: 0
  z-index: 200
.box
  .pic
    padding-top: 90px
    img
      width: 87%
      display: block
      margin: 0 auto
  p
    text-align: center
    color: $color-blue6
    font-size: 28px;/*px*/
    padding-top: 14px
    span
      font-weight: 700
  .card
    font-size: 45px;/*px*/
    color: $color-blue5
    padding-top: 60px
  .member
    padding-top: 45px
.card-fixed
  position :fixed
  bottom :0
  left :0
  right: 0
  .set
    background: $color-f4
    width: 100%
    margin-top: 150px
    overflow: hidden
    .txt
      padding: 25px 0 25px 40px
      p
        font-size: 24px;/*px*/
        color: $color-gray1
        &:last-child
          padding-top: 18px
  .btn
    width: 100%
    height: 88px;/*px*/
    line-height: 88px;/*px*/
    text-align: center
    background: $color-orange
    font-size: 36px;/*px*/
    color: $color-white
</style>

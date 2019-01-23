<template>
  <div class="detail">
    <div class="approve-detail" v-if="List" v-for="item in List">
      <div class="pic">
        <i class="bg"></i>
        <div class="level" v-if="item.privilege">
          <img src="./gradeone.png" v-if="item.privilege.level === 1" />
          <img src="./gradetwo.png" v-else-if="item.privilege.level === 2" />
          <img src="./gradethree.png" v-else />
          {{item.privilege.name}}
        </div>
        <span class="address">{{item.idInfo.province_name}} {{item.idInfo.city_name}} {{item.idInfo.area_name}}</span>
        <div class="mess-box">
          <div class="person">
            <div v-if="item.idInfo.buyerInfo.avatar">
              <img :src="item.idInfo.buyerInfo.avatar"/>
            </div>
            <div v-else>
              <img src="./default.png"/>
            </div>
            <div class="person-right">
              <span>{{item.idInfo.name}}</span>
              <div class="design">
                <i></i>
                <div class="teacher">{{item.idInfo.procure_identity_name}}</div>
              </div>
            </div>
          </div>
          <div class="num" v-if="item.idInfo.team_size"><span>团队人数</span><span>:</span><span>{{item.idInfo.team_size}}</span></div>
          <div class="sale" v-if="item.idInfo.monthly_sales"><span>月销售额</span><span>:</span><span>{{item.idInfo.monthly_sales}}</span></div>
        </div>
        <h5>采购偏好：
          <span class="hobby" v-for="types in item.idInfo.expect_category_name">{{types.name}}</span>
        </h5>
        <p class="platform">平台已认证</p>
      </div>
      <div class="info">
        <i class="shape"></i>
        <span>商家认证信息</span>
      </div>
      <div class="product" v-if="item.purchase_goods || item.purchase_scale || item.auth_condition">
        <div class="pro" v-if="item.purchase_goods"><span>采购商品：</span><span class="addition">{{item.purchase_goods}}</span></div>
        <div class="scale" v-if="item.purchase_scale"><span>采购规模：</span><span class="addition">{{item.purchase_scale}}</span></div>
        <div class="explain" v-if="item.auth_condition"><span>其他说明：</span><span class="addition">{{item.auth_condition}}</span></div>
      </div>
      <div class="time"><span>提交日期：</span><span class="date">{{item.created_at}}</span></div>
      <div class="time prod" v-if="item.audit_status === 2"><span>审核通过日期：</span><span class="tit">{{item.audited_at}}</span></div>  <div class="time prod" v-if="item.audit_status === 3"><span>审核未通过日期：</span><span class="tit">{{item.updated_at}}</span></div>
      <div class="reason" v-if="item.audit_status === 3"><span>未通过原因：</span><span>{{item.reject_reason}}</span></div>
      <div class="btn" v-if="item.audit_status === 1">
        <span class="edit" @click="Pass">通过</span>
        <span class="del" @click="Nopass">不通过</span>
      </div>
    </div>
    <modal ref="Modal" :modal="modal"></modal>
  </div>
</template>
<script type="text/ecmascript-6">
  import {nativeBackBase} from 'api/init'
  import Modal from 'base/modal/modalfour'
  import { loadData, STATUS_OK } from 'api/common'
  export default {
    data() {
      return {
        List: [],
        modal: ''
      }
    },
    created() {
      nativeBackBase()
      nativeBackBase()
      this.editDetail()
      document.title = this.$route.query.name
    },
    methods: {
      Pass() {
        let URL = '/shopAuthAudit'
        let obj = {
          status: 1,
          shopauth_id: this.List[0].id
        }
        loadData(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            this.$vux.toast.text('审核通过')
            this.$router.push('/special-card')
          } else {
            console.log('lose')
          }
        })
      },
      editDetail() {
        let URL = 'shopAuthDetail'
        let obj = {
          shopauth_id: this.$route.params.id
        }
        loadData(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            let arr = []
            arr.push(res.data)
            this.List = arr
            this.ID = res.data.id
          } else {
            console.log('lose')
          }
        })
      },
      Nopass() {
        this.$refs.Modal.show()
        this.modal = this.ID
      }
    },
    components: {
      Modal
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variable.styl"
  .detail
    position: fixed
    top: 0
    right: 0
    bottom: 0
    left: 0
    background: $color-f4
    z-index: 200
  .approve-detail
    padding: 30px
    .level
      position: absolute
      font-size: 28px;/*px*/
      color: $color-yellow1
      right: 36px
      top: 30px
      img
        width: 27px;/*px*/
        height: 26px;/*px*/
    .pic
      background: $color-yellow5
      border-radius: 20px
      position: relative
      .bg
        background: url("bg.png") no-repeat
        background-size: 100% auto
        width: 717px;/*px*/
        height: 198px;/*px*/
        display: inline-block
        position: absolute
        bottom: 0
      .address
        color: $color-yellow1
        font-size: 24px;/*px*/
        display: block
        padding: 33px 0 0 35px
    .mess-box
      padding: 26px  26px 0 32px
      .person
        flex-box-center()
        .person-right
          margin-left: 24px
        img
          width: 90px;/*px*/
          height: 90px;/*px*/
          border-radius: 50%
        span
          color: $color-white
          font-size: 32px;/*px*/
        .design
          flex-box-center()
          margin-top: 15px
          i
            width: 27px;/*px*/
            height: 28px;/*px*/
            display: block
            background: url('icon1.png') no-repeat
            background-size: 100% auto
          .teacher
            font-size: 20px;/*px*/
            color: $color-yellow2
            height: 28px;/*px*/
            border: 1px solid $color-yellow2;/*no*/
            text-align: center
            padding: 4px 3px 0
            background: $color-white
      .num, .sale
        color: $color-white
        font-size: 26px;/*px*/
        span:nth-child(3)
          padding-left: 15px
        .txt
          padding-left: 15px
      .num
        margin-top: 20px
      .sale
        margin-top: 10px
    h5
      padding-left: 35px
      color: $color-white
      font-size: 28px;/*px*/
      padding-top: 96px
      .hobby
        padding-left: 25px
        line-height: 20px
    .platform
      padding: 20px 0 17px 35px
      color: $color-yellow3
      font-size: 22px;/*px*/
    .info
      padding-top: 42px
      padding-bottom: 20px
      border-bottom 1px solid $color-df;/*no*/
      position: relative
      padding-left: 4px
      .shape
        display: inline-block
        width: 4px;/*px*/
        height: 26px;/*px*/
        position: absolute
        top: 42px
        background-image: url('shape.png')
      span
        font-size: 30px;/*px*/
        color: $color-3
        padding-left: 20px
    .product
      padding-top: 30px
      padding-left: 4px
      padding-bottom: 30px
      border-bottom 1px solid $color-df;/*no*/
      .pro,.scale,.explain
        line-height: 45px
        span
          font-size: 28px;/*px*/
          color: $color-3
        span:nth-child(2)
          color: $color-9
          padding-left: 38px
        span:nth-child(3)
          padding-left: 20px
          color: $color-9
    .time
      padding-top: 30px
      padding-left: 4px
      span
        font-size: 28px;/*px*/
        color: $color-3
      .date
        padding-left: 74px
        color: $color-9
      .tit
        padding-left: 20px
        color: $color-9
    .prod
      padding-bottom: 32px
    .reason
      border-top: 1px solid $color-df;/*no*/
      padding-left: 4px
      padding-top: 30px
      span
        font-size: 28px;/*px*/
        color: $color-orange
        line-height: 40px
      span:nth-child(2)
        color: $color-9
    .btn
      border-top: 1px solid $color-df/*px*/
      position :fixed
      bottom :0
      left :0
      right: 0
      width: 100%
      font-size :36px
      display: flex
      .edit
        display: inline-block
        width:50%
        background: $color-orange
        line-height: 94px
        height: 94px;/*px*/
        text-align: center
        color: $color-white
      .del
        display: inline-block
        width: 50%
        background: $color-white
        line-height: 94px
        height: 94px;/*px*/
        text-align: center
        color: $color-orange
    .weui-toast
      top: 50%
      .weui-toast__content
        font-size: 32px/*px*/;
        padding: 20px!important
</style>

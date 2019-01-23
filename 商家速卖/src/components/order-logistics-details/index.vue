<template>
  <div class="logistics-details-wrap">
    <scrollloadcontent class="scroll">
      <div>
        <div class="order-info">
      <div class="info-left">
        <img src="./car@2x.png"/>
      </div>
      <div class="info-right">
        <p class="status"><span>物流状态：</span><span class="green">{{ logisticsStatus }}</span></p>
        <p class="company"><span>物流公司：</span><span>{{ logisticsDetail.ShipperName }}</span></p>
        <p class="num"><span>订单编号：</span><span>{{ orderCode }}</span></p>
      </div>
    </div>
    <div class="logistics-detail">
      <div class="logistics-detail-title">物流跟踪</div>
      <div class="logistics-detail-lists">
        <div class="logistics-detail-item" v-for="item in logisticsDetail.Traces">
          <p class="text">{{ item.AcceptStation }}</p>
          <p class="date">{{ item.AcceptTime }}</p>
        </div>
      </div>
    </div>
      </div>
    </scrollloadcontent>
  </div>
</template>

<script>
import scrollloadcontent from 'base/scroll/scrollloadcontent'
export default {
  data() {
    return {
      logisticsDetail: {},
      logisticsStatus: ''
    }
  },
  created() {
    this.getLogisticsDetail()
  },
  computed: {
    orderId () {
      return this.$route.params.id
    },
    orderCode () {
      return this.$route.query.orderCode
    }
  },
  methods: {
    getLogisticsDetail () {
      let url = 'order/logisticsTrace'
      let obj = {
        orderId: this.$route.params.id
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          if (res.data.Status === '3') {
            this.logisticsStatus = '已签收'
          } else {
            this.logisticsStatus = '运输中'
          }
          this.logisticsDetail = res.data
        }
      })
    }
  },
  components: {
    scrollloadcontent
  }
}
</script>

<style lang="stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.scroll
  height:100%;
  overflow:hidden;
.logistics-details-wrap
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background $color-white
  .order-info
    display :flex
    align-items :center
    padding: 28px
    margin-bottom: 20px
    border-bottom :1px solid $color-border;/*no*/
    background :$color-white
    .info-left
      flex :0 0 124px;/*px*/
      width: 124px;/*px*/
      height: 124px;/*px*/
      border:1px solid $color-border;/*no*/
      padding:7px
      margin-right: 17px
      img
        width: 100%
        height: 100%
    .info-right
      flex: 1
      p
        font-size :28px;/*px*/
        line-height: 1.3
        color :$color-light-grey-s
        &.status
          color: $color-highlight-background
          .green
            color : #52b17a
  .logistics-detail
    padding: 27px 25px
    background :$color-white
    .logistics-detail-title
      margin-bottom: 36px
      font-size: 28px;/*px*/
      color :$color-highlight-background
    .logistics-detail-lists
      border-left :1px solid $color-border;/*no*/
      padding-left :64px;/*px*/
      .logistics-detail-item
        position relative
        padding:27px 0
        font-size :28px;/*px*/
        line-height: 1.3
        border-top :1px solid $color-border;/*no*/
        color :$color-light-grey-s
        .text
          font-size: 26px;/*px*/
        .call
          color :#3399ff
        .date
          font-size :22px;/*px*/
          line-height: 36px;/*px*/
        &:before
          content :''
          position :absolute
          left :-72px;/*px*/
          top :-8px;/*px*/
          display :inline-block
          height: 16px;/*px*/
          width: 16px;/*px*/
          bg-image('node')
        &:first-child
          color :#52b17a
          border: none
          &:before
            bg-image('node-f')
            transform :scale(1.5)
</style>

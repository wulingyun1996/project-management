<template>
  <div class="circle-activity" :class="{iphoneX: $isNeedFit}">
    <cgs-header @back="back" title="商圈活动"></cgs-header>
    <div class="ca-item" v-for="(item, index) in listIng" :key="index" @click="goUnionDetail(item.id)">
      <div class="ca-pic">
        <img :src="item.image_path" alt="">
      </div>
      <p class="ca-t">{{item.title}}</p>
      <div class="ca-de time">
        <i></i>
        <p>{{item.act_time}}</p>
      </div>
      <div class="ca-de address">
        <i></i>
        <p>{{(item.op_province || '') + (item.op_city || '') + (item.op_area || '') + (item.address || '')}}</p>
      </div>
    </div>
    <div class="past-acti">
      <div class="pa-tit">往期活动</div>
      <div class="pa-list">
        <div class="pa-item" v-for="(item, index) in listEnd" :key="index" @click="goUnionDetail(item.id)">
          <div class="pa-pic">
            <img :src="item.image_path" alt="">
          </div>
          <div class="pa-info">
            <p>{{item.title}}</p>
            <p>{{item.act_time}}</p>
            <p>{{(item.op_province || '') + (item.op_city || '') + (item.op_area || '') + (item.address || '')}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CgsHeader from 'components/circle-header/index.vue'
export default {
  data () {
    return {
      id: this.$route.query.id,
      listIng: [],
      listEnd: []
    }
  },
  created () {
    this.getCircleAct()
  },
  methods: {
    getCircleAct () {
      let url = 'union/unionAct'
      let id = this.id
      this.$http(url, {id})
        .then(res => {
          if (res.code === this.$ok) {
            let data = res.data
            this.listIng = data.act_ing
            this.listEnd = data.act_end
          }
        })
    },
    back () {
      this.$router.back()
    },
    goUnionDetail (id) {
      this.$router.push({
        path: '/unionDetail',
        query: {
          id
        }
      })
    }
  },
  components: {CgsHeader}
}

</script>
<style lang="stylus"  scoped>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.circle-activity
  background #E8E8E8
  padding 130px 30px 0 30px
  // min-height 100%
  // position absolute
  // top 0
  // left 0
  // right 0
  // bottom 0
  &.iphoneX
    padding-top 196px
    padding-bottom 34px
  .ca-item
    background #fff
    padding 20px 20px
    border-radius(10px)
    margin-bottom 30px
    .ca-pic
      width 100%
      height 308px
      overflow hidden
      img
        width 100%
    .ca-t
      color #000
      fz(18px)
      margin 20px 0 16px 0
    .ca-de
      display flex
      justify-content flex-start
      line-height 1.6
      align-items center
      p
        f14()
        color #333
        padding 0 14px
      &.time
        i
          bg('icon-time.png')
          width 36px
          height 36px
      &.address
        i
          bg('icon-address.png')
          width 36px
          height 32px
  .past-acti
    padding 20px 0 30px 0
    .pa-tit
      margin 0 0 50px
      text-align center
      fz(16px)
      color #000
      position relative
      &:before
        border-top: 1px dashed #F5A623;/*no*/
        content ''
        position absolute
        left 0
        top 50%
        width 36%
        // height 1px;/*no*/
      &:after
        border-top: 1px dashed #F5A623;/*no*/
        content ''
        position absolute
        right 0
        top 50%
        width 36%
        // height 1px;/*no*/
    .pa-list
      .pa-item
        background #fff
        border-radius(10px)
        display flex
        justify-content flex-start
        align-items center
        padding 20px 0 20px 20px
        margin-bottom 20px
        &:last-child
          margin-bottom 0
        .pa-pic
          width 192px
          height 176px
          overflow hidden
          margin-right 30px
          img
            width 100%
            height 100%
        .pa-info
          flex 1
          p
            text-over(1)
            fz(13px)
            color #666
            line-height 1.6
            &:first-child
              f14()
              color #000
              line-height 2
</style>

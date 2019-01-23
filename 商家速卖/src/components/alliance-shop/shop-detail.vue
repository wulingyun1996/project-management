<template>
  <div class="container">
    <scroll class="alliance-list-wrapper" :scrolling='true' :pulldown="true">
      <div class="srcoll-container">
        <div class="group">
          <span class="label">商圈名称：</span> <span>{{ detail.union_name }}</span>
        </div>
        <div class="group">
          <span class="label">圈内商家：</span> <span>{{ detail.sellerCount }} <input type="button" class="btn_look" value="查看" @click="goShopList"></span>
        </div>
        <div class="group pic">
          <span class="label">商圈LOGO：</span>
          <span class="logo">
            <img :src="detail.image" alt="" v-if="detail.image">
            <img src="../../../static/images/seller-sale/logo-small.png" alt="" v-else>
          </span>
        </div>
        <div class="group">
          <span class="label">服务城市：</span>
          <span>{{ addr.province }}</span>&nbsp;&nbsp;
          <span>{{ addr.city }}</span>&nbsp;&nbsp;
          <span>{{ addr.area }}</span>
        </div>
        <div class="group">
          <span class="label">状态：</span> <span :class="[{ 'disable': detail.status === 3 }, 'use']">{{ detail.status_str }}</span>
        </div>
        <div class="group">
          <span class="label">创建时间：</span> <span>{{ detail.created_at }}</span>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import { loadData, STATUS_OK } from 'api/common'
export default {
  name: 'allianceShopDetail',
  components: {
    Scroll
  },
  data() {
    return {
      detail: {},
      addr: {}
    }
  },
  computed: {
    id () {
      return this.$route.params.id
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    goShopList() {
      this.$router.push(`/shop-to-alliance-list/${this.id}`)
    },
    getDetail() {
      let URL = 'group/getGroupDetail'
      let obj = {
        group_id: this.id
      }
      loadData(URL, obj).then((res) => {
        if (res.code === STATUS_OK) {
          this.detail = res.data
          this.addr = res.data.addr
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.container
  .alliance-list-wrapper
    height 100%
    height 100%
    font-size 28px;/*px*/
    background $color-white
    overflow hidden
    padding-top 48px
    padding-left 64px
    color $color-3
  .group
    margin-bottom 30px
    display flex
    align-items center
    &.pic
      align-items flex-start
    .label
      width 200px
      height 40px
      line-height 40px
      text-align right
    .logo
      wh(184px)
      border-radius 20px
      overflow hidden
      img
        wh(100%)
.btn_look
  height 52px
  line-height 52px
  margin-left 32px
  font-size 24px;/*px*/
  background $color-orange
  padding 0 32px
  border-radius 10px
  color $color-white
.use
  color #46B308
.disable
  color $color-red
</style>

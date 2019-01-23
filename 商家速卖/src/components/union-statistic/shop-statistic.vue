<template>
  <div class="container">
    <div>
      <select-base :options="actList" v-model="chooseAct" @change="reloadData"></select-base>
    </div>
    <div class="count_box" v-if="statisticData.length>0">
      <div class="item">
        <p>转发量</p>
        <p class="count_num">{{statisticData[1].count}}</p>
      </div>
      <div class="item">
        <p>浏览量</p>
        <p class="count_num">{{statisticData[0].count}}</p>
      </div>
    </div>
    <div class="menu_box" v-if="statisticData.length>0">
      <div class="item" @click="goDataList('data')">
        <img src="./icon_menu01.png" class="icon" alt="">
        <p>提交资料数</p>
        <p>{{statisticData[2].count}}</p>
      </div>
      <div class="item" @click="goDataList('pay')">
        <img src="./icon_menu02.png" class="icon" alt="">
        <p>活动支付数</p>
        <p>{{statisticData[3].count}}</p>
      </div>
      <div class="item" @click="goDataList('line')">
        <img src="./icon_menu03.png" class="icon" alt="">
        <p>线下录入</p>
        <p>{{statisticData[4].count}}</p>
      </div>
      <div class="item" @click="goDataList('sign')">
        <img src="./icon_menu04.png" class="icon" alt="">
        <p>签到成功</p>
        <p>{{statisticData[5].count}}</p>
      </div>
      <div class="item" @click="goDataList('sale')">
        <img src="./icon_menu05.png" class="icon" alt="">
        <p>销售金额</p>
        <p>{{statisticData[6].count}}</p>
      </div>
      <div class="item" @click="goDataList('sale2')">
        <img src="./icon_menu06.png" class="icon" alt="">
        <p>定金金额</p>
        <p>{{statisticData[7].count}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import SelectBase from 'base/select/select-base'
  import {loadData, STATUS_OK} from 'api/common'
  export default {
    data() {
      return {
        actList: [],
        statisticData: [],
        chooseAct: 0,
        shopid: this.$route.query.shopid === undefined ? '' : this.$route.query.shopid
      }
    },
    created() {
      this.chooseAct = this.$store.state.whichActivity
      this.init()
    },
    methods: {
      init() {
        // 获取活动列表
        loadData('analytics/getActList').then((data) => {
          if (data.code === STATUS_OK) {
            this.actList = data.data.map((item) => {
              let obj = {}
              obj.name = item.title
              obj.value = item.id
              return obj
            })
            this.actList.unshift({
              name: '全部活动',
              value: 0
            })
          }
        })
        this.getHomeData()
      },
      getHomeData() {
        // 获取首页数据
        loadData('analytics/getHome', {
          actId: this.chooseAct,
          distributor: this.shopid
        }).then((data) => {
          if (data.code === STATUS_OK) {
            this.statisticData = data.data
          }
        })
      },
      goDataList(type) {
        let shopid = this.shopid
        if (type === 'data') {
          this.$router.push(`/all-statistic/data-count/${this.chooseAct}?shopid=${shopid}`)
        }
        if (type === 'pay') {
          this.$router.push(`/all-statistic/pay-count/${this.chooseAct}?shopid=${shopid}`)
        }
        if (type === 'line') {
          this.$router.push(`/all-statistic/line-submit/${this.chooseAct}?shopid=${shopid}`)
        }
        if (type === 'sign') {
          this.$router.push(`/all-statistic/sign/${this.chooseAct}?shopid=${shopid}`)
        }
        if (type === 'sale') {
          this.$router.push(`/all-statistic/sale-count/${this.chooseAct}?shopid=${shopid}`)
        }
        if (type === 'sale2') {
          this.$router.push(`/all-statistic/sale-count2/${this.chooseAct}?shopid=${shopid}`)
        }
      },
      reloadData(data) {
        this.$store.commit('SetUnionWhichAct', data)
        this.getHomeData()
      }
    },
    components: {
      SelectBase
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
@import "~common/stylus/variable.styl"
@import "~common/stylus/mixin.styl"
.container
  min-height 100%
  padding 62px
  background #ff8a00 url('./bg_bo.jpg') no-repeat center top
  background-size 100% auto;/*no*/
.inp_select_act
  width 100%
  height 70px
  padding-left 25px
  border-radius 5px
.mess-arrow
  background: #ffffff url('./bottom_arrow.png') no-repeat right 20px center
  background-size: 12px auto;/*px*/
.count_box
  display flex
  padding 44px 0px
  font-size 28px/*px*/
  color $color-white
  .item
    width 0
    flex 1 0 auto
    text-align center
    .count_num
      font-size 66px/*px*/
      margin-top 40px
.menu_box
  width 100%
  display flex
  flex-flow row wrap
  // box-shadow: 0px 0px 10px 1px #ccc;/*no*/
  .item
    width 0
    flex 0 0 50%
    height 260px
    font-size 24px/*px*/
    text-align center
    color $color-3
    background $color-white
    display flex
    flex-direction column
    justify-content center
    align-items center
    // border #dfdfdf 1px solid;/*no*/
    p:nth-of-type(2)
      margin-top 40px
      font-size 30px/*px*/
    .icon
      margin-bottom 40px
      max-width 18% !important;/*px*/
  .item:nth-of-type(even)
    border-lp()
  .item:nth-of-type(1),.item:nth-of-type(2),.item:nth-of-type(3),.item:nth-of-type(4)
    border-btm()
</style>


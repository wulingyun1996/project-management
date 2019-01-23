<template>
  <div class="container">
    <div class="salesman_info">
      <span class="name"><img src="./icon_photo.png" alt="">{{statisticData.salesman_name}}</span>
      <span class="phone">{{statisticData.salesman_mobile}}</span>
    </div>
    <div>
      <select-base :options="actList" v-model="chooseAct" @change="reloadData"></select-base>
    </div>
    <div class="count_box" v-if="statisticData.data.length>0">
      <div class="item">
        <p>转发量</p>
        <p class="count_num">{{statisticData.data[1].count}}</p>
      </div>
      <div class="item">
        <p>浏览量</p>
        <p class="count_num">{{statisticData.data[0].count}}</p>
      </div>
    </div>
    <div class="menu_box" v-if="statisticData.data.length>0">
      <div class="item" @click="goDataList('data')">
        <img src="./icon_menu01.png" class="icon" alt="">
        <p>提交资料数</p>
        <p>{{statisticData.data[2].count}}</p>
      </div>
      <div class="item" @click="goDataList('pay')">
        <img src="./icon_menu02.png" class="icon" alt="">
        <p>活动支付数</p>
        <p>{{statisticData.data[3].count}}</p>
      </div>
      <div class="item" @click="goDataList('line')">
        <img src="./icon_menu03.png" class="icon" alt="">
        <p>线下录入</p>
        <p>{{statisticData.data[4].count}}</p>
      </div>
      <div class="item" @click="goDataList('sign')">
        <img src="./icon_menu04.png" class="icon" alt="">
        <p>签到成功</p>
        <p>{{statisticData.data[5].count}}</p>
      </div>
      <div class="item" @click="goDataList('sale')">
        <img src="./icon_menu05.png" class="icon" alt="">
        <p>销售金额</p>
        <p>{{statisticData.data[6].count}}</p>
      </div>
      <div class="item" @click="goDataList('sale2')">
        <img src="./icon_menu06.png" class="icon" alt="">
        <p>定金金额</p>
        <p>{{statisticData.data[7].count}}</p>
      </div>
    </div>
  </div>
</template>
<script>
  import SelectBase from 'base/select/select-base'
  import {nativeBackBase, navBack} from 'api/init'
  import {loadData, STATUS_OK} from 'api/common'
  export default {
    data() {
      return {
        actList: [],
        statisticData: {data: []},
        chooseAct: 0,
        salesmanid: this.$route.query.salesmanid === undefined ? '' : this.$route.query.salesmanid,
        shopid: this.$route.query.shopid === undefined ? '' : this.$route.query.shopid
      }
    },
    created() {
      this.chooseAct = this.$store.state.whichActivity
      this.init()
      this.nav()
    },
    methods: {
      nav_back() {
        navBack()
      },
      nav() {
        let param = {
          'left': [{
            'title': 'back',
            'function': 'nav_back()' // 默认
          }],
          'right': [{
            'title': '',
            'icon_url': '',
            'function': ''
          }]
        }
        nativeBackBase(param)
      },
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
        loadData('analytics/getSalesmanHomme', {
          actId: this.chooseAct,
          salesman: this.salesmanid,
          distributor: this.shopid
        }).then((data) => {
          if (data.code === STATUS_OK) {
            this.statisticData = data.data
          }
        })
      },
      goDataList(type) {
        let salesmanid = this.salesmanid
        let shopid = this.shopid
        if (type === 'data') {
          this.$router.push(`/all-statistic/data-count/${this.chooseAct}?salesmanid=${salesmanid}&shopid=${shopid}`)
        }
        if (type === 'pay') {
          this.$router.push(`/all-statistic/pay-count/${this.chooseAct}?salesmanid=${salesmanid}&shopid=${shopid}`)
        }
        if (type === 'line') {
          this.$router.push(`/all-statistic/line-submit/${this.chooseAct}?salesmanid=${salesmanid}&shopid=${shopid}`)
        }
        if (type === 'sign') {
          this.$router.push(`/all-statistic/sign/${this.chooseAct}?salesmanid=${salesmanid}&shopid=${shopid}`)
        }
        if (type === 'sale') {
          this.$router.push(`/all-statistic/sale-count/${this.chooseAct}?salesmanid=${salesmanid}&shopid=${shopid}`)
        }
        if (type === 'sale2') {
          this.$router.push(`/all-statistic/sale-count2/${this.chooseAct}?salesmanid=${salesmanid}&shopid=${shopid}`)
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
  padding 40px 62px
  background #ff8a00 url('./bg_bo.jpg') no-repeat center top
  background-size 100% auto;/*no*/
  .salesman_info
    display flex
    justify-content space-between
    align-items center
    color $color-white
    font-size 30px;/*px*/
    margin-bottom 32px
    .name
      img
        width 30px
        margin-right 20px
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


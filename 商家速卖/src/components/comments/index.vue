<template>
  <div id="comments">
    <page>
      <div slot="content" v-show="loading">
        <div ref="test" v-if="selectShow" class="select-wraps">
          <!--<selector v-model="type" :options="list" @on-change="selectType"></selector>-->
          <popup-picker :popup-style="popupStyle" value-text-align="left" :columns='1' :data="list" v-model="type" @on-show="onShow" @on-hide="onHide" @on-change="selectType" placeholder='累计' show-name></popup-picker>
        </div>
        <div class="star-wrap" v-show="commodityList.length >0">
          <div class="star-items" v-for="(item, index) in starList"><span class="text">{{item.text}}</span><star :size="48" :score="item.star"></star><span class="count">{{item.count}}</span></div>
        </div>
        <div class="comm-wrapper" v-show="commodityList.length >0">
          <commodity-full :commodity="commodityList" @reply="reply"></commodity-full>
        </div>
        <no-data v-show="commodityList.length === 0 && loading" :img="img" text="暂无数据，继续努力~"></no-data>
      </div>
    </page>
    <confirm ref="reply" :max="max" @confirm="replyComfirm" placeholder="请输入回复评价内容300字内" @cancel="cancel" text="回复评价" confirmBtnText="确定"></confirm>
  </div>
</template>
<script type="text/ecmascript-6">
  import { Selector, PopupPicker } from 'vux'
  import Page from './page-two.vue'
  import star from 'base/star/star'
  import noData from 'base/no-data'
  import { mapGetters } from 'vuex'
  import CommodityFull from './commodity-full'
  import Confirm from 'base/confirm/confirm-textarea'
  import { loadData, STATUS_OK } from 'api/common'
  export default {
    name: 'comment',
    data() {
      return {
        selectShow: false,
        loading: false,
        max: 300,
        type: ['0'],
        currentIndex: 0,
        img: require('./no-data@2x.png'),
        list: [
          {value: '0', name: '累计'},
          {value: '1', name: '最近一个月'},
          {value: '2', name: '最近六个月'},
          {value: '3', name: '六个月前'}
        ],
        count: {},
        starList: [
          {text: '非常好', star: 5},
          {text: '好', star: 4},
          {text: '一般', star: 3},
          {text: '差', star: 2},
          {text: '很差', star: 1}
        ],
        imgSrc: '../../assets/images/img-small.jpg',
        commodityList: [],
        replyText: '',
        item: {},
        popupStyle: {
        }
      }
    },
    computed: {
      ...mapGetters(['commodity'])
    },
    created() {
      this.loadData().then(() => {
        this.loading = true
      })
    },
    watch: {
      '$route' (to, from) {
        if (to.path === '/home') {
          this.commodityList.splice(0)
          this.currentIndex = 0
          this.selectShow = true
          this.type = ['0']
          this.count = {}
          this.replyText = ''
          this.item = {}
          this.popupStyle = {}
        }
        if (from.path === '/home') {
          this.commodityList.splice(0)
          this.loadData().then(() => {
            this.loading = true
          })
        }
      }
    },
    methods: {
      onShow () {
//        console.log('on show')
      },
      onHide (type) {
//        console.log('on hide', type)
      },
      onChange (val, i) {
//        console.log('val change', val, this.value1)
      },
      reply(item, val) {
        this.item = item
        this.$refs.reply.show()
      },
      replyComfirm() {
        this.replyText = this.commodity
        let URL = 'order/distributor/evaluateReply'
        let obj = {
          id: this.item.id,
          title: this.replyText
        }
        loadData(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            this.$vux.toast.text('回复成功', 'middle')
            this.loadData()
          }
        })
      },
      cancel() {},
      selectType() {
        // 多次选择同一个下拉框的时候，不再请求数据
        if (this.currentIndex === this.type[0]) return
        this.currentIndex = this.type[0]
        this.loadData()
      },
      loadData() {
        let URL = 'order/distributor/evaluate'
        let obj = {
          type: this.type
        }
        return loadData(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            this.commodityList = res.data.data
            if (this.type[0] === '0' && this.commodityList.length === 0) {
              this.selectShow = false
            } else {
              this.selectShow = true
            }
            this.count = res.data.statistic[this.type]
            for (let i = 5, j = 1; i !== 0; i--, j++) {
              this.starList[i - 1].count = this.count[j]
            }
          }
        })
      }
    },
    components: {
      Page,
      Selector,
      star,
      CommodityFull,
      noData,
      Confirm,
      PopupPicker
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variable.styl"
  @import "~common/stylus/vux.styl"
  #app .wrapper
    background  #f8f8f8
    .weui-cell
      padding: 0!important
  #comments
    height 100%
  #comments .select-wraps
    border-bottom: 1px solid #dfdfdf;/*no*/
    padding-left: 25px;
    height: 86px; /*px*/
    line-height: 86px; /*px*/
    background #fff
    position: relative
    arrow-down()
    &:after
      background #fff
      left: auto
    .vux-popup-picker-value
      font-size 28px;/*px*/
    .weui-cell__ft
      &:after
        display: none
  .star-wrap
    background #fff
    border-top: 1px solid #dfdfdf;/*no*/
    padding: 20px 25px
    .star-items
      display flex
      align-items center
      font-size 28px;/*px*/
      /*margin-bottom: 21px*/
      height: 60px
      .text
        flex: 0 0 130px;/*px*/
        color $color-3
      .count
        margin-left: 35px
        color $color-orange
  .comm-wrapper
    padding-top: 18px
    background: $color-body
    clearfix()
popPicker()
</style>

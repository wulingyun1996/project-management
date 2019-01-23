<template>
  <div>
    <div class="special-content">
      <div class="special-main">
        <tab :line-width="4" active-color='orange' bar-active-color="orange" custom-bar-width="58px" v-model="index">
          <tab-item @on-item-click="handler(index)" :selected="currentIndex === 0">待审核</tab-item>
          <tab-item @on-item-click="handler(index)" :selected="currentIndex === 1">已领取</tab-item>
          <tab-item @on-item-click="handler(index)" :selected="currentIndex === 2">未通过</tab-item>
        </tab>
      </div>
      <div class="text-box">
        <!--待审核状态 -->
        <div class="tabOne" v-if="currentIndex === 0">
          <scroll class="scroll" ref="scroll" :pullup="pullup" :beforeScroll="beforeScroll" @scrollToEnd="searchMore(1)" @beforeScroll="listScroll" :data="CheckList">
            <div>
              <div class="search-box" v-show="isSearch">
                <input type="text" placeholder="请输入姓名检索" v-model="keyword"/>
                <label @click="Search">搜索</label>
                <i v-if="this.keyword" @click="cancel"></i>
              </div>
              <!--有数据 -->
              <div>
                <div class="card" v-for="item in CheckList" @click="Approvedetail(item)">
                  <div class="card-content" v-if="item.idInfo">
                    <div class="pic" v-if="item.idInfo.buyerInfo.avatar">
                      <img :src="item.idInfo.buyerInfo.avatar"/>
                    </div>
                    <div class="pic" v-else>
                      <img src="./person.png"/>
                    </div>
                    <span>{{item.idInfo.name}}</span>
                    <div class="design">
                      <i></i>
                      <div class="teacher">{{item.idInfo.procure_identity_name}}</div>
                    </div>
                    <div class="check" @click.stop="check(item)">审核</div>
                  </div>
                  <div class="buy-goods"><i></i><span>采购商品</span><span>{{item.purchase_goods}}</span></div>
                  <div class="buy-scale"><i></i><span>采购规模</span><span>{{item.purchase_scale}}</span></div>
                </div>
              </div>
              <loading v-show="hasMore" title=""></loading>
              <no-more v-show="!hasMore && CheckList.length" message="已加载完"></no-more>
              <!--无数据 -->
              <div class="image" v-if="!noSet && !CheckList.length">
                <div class="pic">
                  <img src="./no-more.png"/>
                  <p>您还没有待审核的特约采购师哟~</p>
                </div>
              </div>
              <div class="no-more" v-if="isShow">
                <img src="./open.png">
                <p>您还没有开通特约卡活动哦~</p>
                <router-link to="/card-manage" tag="div" class="open">去开通</router-link>
              </div>
              <div class="no-data" v-show="isMore && !CheckList.length">
                <img src="./no-search.png"/>
                <p>未找到符合条件的采购师~</p>
              </div>
            </div>
          </scroll>
        </div>
        <!--已领取状态 -->
        <div v-else-if="currentIndex === 1">
          <div class="pull-list" v-show="isSelect">
            <group>
              <selector v-model="type" :options="list" @on-change="onChange" ></selector>
            </group>
            <group>
              <selector title="" :options="listone" v-model="grade" @on-change="onChangetwo"></selector>
            </group>
            <div>
              <p v-if="ALL.total">共{{totalNum}}个</p>
              <p v-else>共0个</p>
            </div>
          </div>
          <div class="li-box">
            <scroll ref="scroll" :pullup="pullup" :beforeScroll="beforeScroll" @scrollToEnd="searchMore(2)" @beforeScroll="listScroll" :data="AllList" class="scroll">
              <div>
                <div class="get-card" v-for="item in AllList" @click="Approvedetail(item)">
                  <div class="get-content">
                    <div class="pic" v-if="item.idInfo.buyerInfo.avatar">
                      <img :src="item.idInfo.buyerInfo.avatar"/>
                    </div>
                    <div class="pic" v-else>
                      <img src="./person.png">
                    </div>
                    <span>{{item.idInfo.name}}</span>
                    <div class="css-new">
                      <i v-if="item.type === 1" class="person"></i>
                      <i v-else class="company"></i>
                      <div class="teacher">{{item.idInfo.procure_identity_name}}</div>
                    </div>
                    <div class="grade">{{item.privilege.name}}</div>
                  </div>
                  <div v-if="item.type === 2">
                    <div class="buy-goods"><i class="buy"></i><span>采购偏好</span><span class="hobby" v-for="k in item.idInfo.expect_category_name">{{k.name}}</span></div>
                    <div class="buy-scale"><i class="manage"></i><span>经营地址</span><span>{{item.idInfo.province_name}}{{item.idInfo.city_name}}{{item.idInfo.area_name}}</span></div>
                  </div>
                  <div v-else>
                    <div class="buy-goods"><i class="goods"></i><span>采购商品</span><span>{{item.purchase_goods}}</span></div>
                    <div class="buy-scale"><i class="scale"></i><span>采购规模</span><span>{{item.purchase_scale}}</span></div>
                  </div>
                </div>
                <loading v-show="hasMore" title=""></loading>
                <no-more v-show="!hasMore && AllList.length" message="已加载完"></no-more>
                <div class="image" v-if="!AllList.length && !isType">
                  <div class="pic">
                    <img src="./no-more.png"/>
                    <p>您的店铺还没有特约采购师哦~</p>
                  </div>
                </div>
                <div class="image" v-show="isType">
                  <div class="pic">
                    <img src="./no-more.png"/>
                    <p>没有符合条件的特约采购师哦~~</p>
                  </div>
                </div>
              </div>
            </scroll>
          </div>
        </div>
        <!--未通过状态-->
        <div class="no-box"  v-else>
          <scroll ref="scroll" :pullup="pullup" :beforeScroll="beforeScroll" @scrollToEnd="searchMore(3)" @beforeScroll="listScroll" :data="NopassList" class="scroll">
            <div>
              <div>
                <div class="get-card" v-for="item in NopassList" @click="Approvedetail(item)">
                  <div class="get-content">
                    <div class="pic" v-if="item.idInfo.buyerInfo.avatar">
                      <img :src="item.idInfo.buyerInfo.avatar"/>
                    </div>
                    <div class="pic" v-else>
                      <img src="./person.png">
                    </div>
                    <span>{{item.idInfo.name}}</span>
                    <div class="design">
                      <i></i>
                      <div class="teacher">{{item.idInfo.procure_identity_name}}</div>
                    </div>
                    <div class="grade"></div>
                  </div>
                  <div class="buy-goods"><i></i><span>采购商品</span><span>{{item.purchase_goods}}</span></div>
                  <div class="buy-scale"><i></i><span>采购规模</span><span>{{item.purchase_scale}}</span></div>
                </div>
                <loading v-show="hasMore" title=""></loading>
                <no-more v-show="!hasMore && NopassList.length" message="已加载完"></no-more>
              </div>
              <div class="image picture" v-if="NopassList.length === 0">
                <div class="pic">
                  <img src="./no-more.png"/>
                </div>
                <p>暂无未通过的特约采购师哟~</p>
              </div>
            </div>
          </scroll>
        </div>
      </div>
      <modal ref="Modal" :modal="modal" @confirm="waitAudit"></modal>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import Loading from 'base/loading/loading'
  import Scroll from 'base/scroll/scroll'
  import Modal from 'base/modal/modalthree'
  import NoMore from 'base/no-more/no-more'
  // import {dev} from 'common/js/dev'
  import { Selector, Group, Tab, TabItem, Confirm } from 'vux'
  import { loadData, STATUS_OK } from 'api/common'
  import { navCertification } from 'api/navtive'
  const perpage = 20
  export default {
    name: 'specialCard',
    data() {
      return {
        noSet: false,
        currentIndex: 0,
        index: 0,
        isMore: false,
        pullup: true,
        beforeScroll: true,
        isSearch: true,
        isSelect: true,
        page: 1,
        pageSize: 20,  // 一次加载条数
        hasMore: true,
        list: [
          {key: 0, value: '全部类型'},
          {key: 1, value: '个人'},
          {key: 2, value: '公司'}
        ],
        listone: [
          {key: 0, value: '全部等级'},
          {key: 1, value: '一级特约'},
          {key: 2, value: '二级特约'},
          {key: 3, value: '三级特约'}
        ],
        totalNum: 0,
        type: 0,
        grade: 0,
        isActive: false,
        selectIndex: 0,
        keyword: '',
        nocard: 0,
        noApply: false,
        PassList: [],
        AllList: [],
        select: 0,
        NopassList: [],
        modal: '',
        CheckList: [],
        isShow: false,
        isAddition: false,
        isType: false,
        ALL: {},
        checkIndex: null,
        flag: false
      }
    },
    created() {
      // this.getRoute(0, 0)
      // this.Nopass()
      this.waitAudit()
      this.urlGo()
      // 原生认证选项结合路由跳转
      navCertification(this.$router)
    },
    watch: {
      '$route' (to, from) {
        if (to.path === '/home') {
          this.currentIndex = 0
          this.index = 0
          this.CheckList = []
          this.AllList = []
          this.PassList = []
          this.NopassList = []
          this.ALL = {}
        }
        if (from.path === '/home') {
          this.waitAudit()
          this.urlGo()
        }
        if (to.path !== '/approve-condition') {
          navCertification(this.$router)
        }
      }
    },
    methods: {
      urlGo() {
        let locationHref = window.location.hash
        if (locationHref.indexOf('#') !== -1) {
          this.currentIndex = parseInt(locationHref.slice(1, 2))
        }
      },
      // 清空输入框
      cancel() {
        this.keyword = null
      },
      // 进入详情
      Approvedetail(item) {
        let nameText = ''
        if (item.audit_status === 1) {
          nameText = '认证详情'
        } else {
          nameText = '特约采购师详情'
        }
        this.$router.push({
          path: `/special-card/${item.id}`,
          query: {
            name: nameText
          }
        })
      },
      // 审核
      check(item) {
        this.$refs.Modal.show()
        this.modal = item
      },
      // 搜索列表页
      Search () {
        if (!this.keyword) return
        this.noSet = true
        this.CheckList = []
        let URL = '/shopAuth'
        let obj = {
          audit_status: 1,
          keyword: this.keyword
        }
        loadData(URL, obj).then((res) => {
          if (res.data === null || res.data.data.length === 0) {
            this.isMore = true
          } else if (res.code === STATUS_OK) {
            if (res.data.data) {
              this.CheckList = res.data.data
              this._checkMore(res.data)
            } else {
              this.flag = true
            }
          }
        })
      },
      searchMore(index) {
        if (!this.hasMore) {
          return
        }
        this.page++
        let URL = 'shopAuth'
        let obj = {
          audit_status: index,
          page: this.page,
          procure_prop: this.type,
          level: this.grade
        }
        loadData(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            if (res.data.data) {
              if (index === 1) {
                this.CheckList = this.CheckList.concat(res.data.data)
              } else if (index === 2) {
                this.AllList = this.AllList.concat(res.data.data)
                // this.totalNum = this.AllList.length
              } else {
                this.NopassList = this.NopassList.concat(res.data.data)
              }
            }
          }
          this._checkMore(res.data)
        })
      },
      _checkMore(data) {
        const dataList = data
        if (!dataList.data.length || (dataList.current_page * perpage) > dataList.total) {
          this.hasMore = false
        }
      },
      listScroll() {
        this.$emit('listScroll')
      },
      // 待审核列表接口
      waitAudit() {
        let URL = 'shopAuth'
        let obj = {
          audit_status: 1
        }
        loadData(URL, obj).then((res) => {
          if (res.code === 420) {
          // if (res.code !== STATUS_OK) {
            this.isSearch = false
            this.hasMore = false
            this.isShow = true
            this.noSet = true
          } else if (res.code === STATUS_OK) {
            // this.isShow = false
            if (res.data.data.length > 0) {
              this.CheckList = res.data.data
            }
            this._checkMore(res.data)
          } else if (res.code === 400) {
            this.hasMore = false
          }
        })
      },
      // 未通过列表接口
      Nopass() {
        let URL = '/shopAuth'
        let obj = {
          audit_status: 3
        }
        loadData(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            if (res.data.data) {
              this.NopassList = res.data.data
              this._checkMore(res.data)
            }
          } else {
            this.hasMore = false
          }
        })
      },
      // 已领取列表全部
      getRoute(prop, level) {
        let URL = 'shopAuth'
        let obj = {
          audit_status: 2,
          page: this.page,
          procure_prop: prop,
          level: level
        }
        loadData(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            this.ALL = res.data
            this.totalNum = res.data.total
            if (this.ALL.total === 0) {
              this.isType = true
            } else {
              this.isType = false
            }
            if (res.data.data) {
              this.AllList = res.data.data
              this._checkMore(res.data)
            } else {
              this.hasMore = false
            }
          } else {
            this.isSelect = false
            this.hasMore = false
          }
        })
      },
      // 下拉选项框
      onChange() {
        this.AllList.splice(0)
        this.page = 1
        this.hasMore = true
        this.getRoute(this.type, this.grade)
      },
      onChangetwo() {
        this.AllList.splice(0)
        this.page = 1
        this.hasMore = true
        this.getRoute(this.type, this.grade)
      },
      // tap 栏点击事件
      handler(index) {
        if (this.currentIndex === index) return
        this.currentIndex = index
        this.NopassList.splice(0)
        this.CheckList.splice(0)
        this.AllList.splice(0)
        this.page = 1
        this.hasMore = true
        if (index === 0) {
          this.waitAudit()
        } else if (index === 1) {
          this.getRoute(0, 0)
        } else {
          this.Nopass()
        }
      }
    },
    components: {
      Scroll,
      Tab,
      TabItem,
      Group,
      Selector,
      Confirm,
      Modal,
      Loading,
      NoMore
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variable.styl"
  body
    background: $color-white
  .special-content
    background: $color-white
    position: fixed
    width: 100%
    height: 100%
    left: 0
    top: 0
    right: 0
    bottom: 0
    overflow: hidden
    .special-buy
      line-height: 90px;/*px*/
      width: 100%
      text-align: center
      font-size: 38px;/*px*/
      color: $color-3
      position: relative
      a
        font-size: 32px;/*px*/
        color: $color-orange
        position: absolute
        right: 30px
        bottom: 27px
        line-height: 1
      i
        display: inline-block
        width: 25px;/*px*/
        height: 43px;/*px*/
        background: url('arrow.png') no-repeat
        position: absolute
        left: 30px
        bottom: 27px
        background-size: 100% auto
  .special-main
    .vux-tab-item
      color: $color-3
  .search-box
    display: flex
    padding: 32px 0 20px 25px;/*px*/
    border-bottom: 1px solid $color-border;/*no*/
    background: $color-white
    position: relative
    input
      flex: 1
      height: 70px;/*px*/
      padding: 24px 0
      background: $color-bg
      border-radius: 10px
      padding-left: 20px
      font-size: 28px;/*px*/
      color: $color-6
    i
      background: url('close.png') no-repeat
      background-size: 100% auto
      display: inline-block
      width: 32px;/*px*/
      height: 33px;/*px*/
      position: absolute
      right: 120px
      top: 55%
      transform: translateY(-50%)
    label
      display: block
      padding: 0 25px 0 16px
      line-height: 70px;/*px*/
      font-size: 26px;/*px*/
      color: $color-6
  .card
    padding: 50px 25px 0 25px
    border-bottom: 1px solid $color-df;/*no*/
    .card-content
      position: relative
      .pic
        width: 72px;/*px*/
        height: 72px;/*px*/
        img
          width: 100%
          height: 100%
          border-radius: 50%
      span
        padding-left: 24px
        position: absolute
        top: 4px
        left: 70px
        font-size: 30px;/*px*/
        color: $color-3
      .design
        position: absolute
        left: 98px
        top: 46px
        display: flex
        align-items: center
        i
          display: block
          width: 28px;/*px*/
          height: 28px;/*px*/
          background: url('icon1.png') no-repeat
          background-size: 100% auto
        .teacher
          font-size: 20px;/*px*/
          color: $color-cyan
          text-align: center
          border: 1px solid $color-cyan;/*no*/
          height: 28px;/*px*/
          line-height: 28px;/*px*/
      .grade
        position: absolute
        right: 0
        top: 10px
        color: $color-cyan
        font-size: 28px;/*px*/
      .check
        position: absolute
        right: 0
        top: 10px
        color: $color-orange
        border: 1px solid $color-orange;/*no*/
        padding: 10px 23px
        font-size: 28px;/*px*/
    .buy-goods
      padding: 42px 0 0 84px
      position: relative
      i
        display: inline-block
        width: 28px;/*px*/
        height: 28px;/*px*/
        background: url('icon2.png') no-repeat
        background-size: 100% auto
        position: absolute
        top: 40px
      span
        font-size: 26px/*px*/
        color: $color-orange
        padding-left: 45px
        &:last-child
          padding-left: 25px
          color: $color-5
    .buy-scale
      padding: 20px 0 53px 84px
      position: relative
      i
        background: url('icon3.png')
        background-size: 100% auto
        width: 28px;/*px*/
        height: 24px;/*px*/
        display: inline-block
        position: absolute
        top: 20px
      span
        font-size: 26px/*px*/
        color: $color-orange
        padding-left: 45px
        &:last-child
          padding-left: 25px
          color: $color-5
  .no-data
    padding: 88px 0 0 0
    img
      display: block
      margin: 0 auto
      width: 255;/*px*/
      height: 243px;/*px*/
    p
      text-align: center
      font-size: 28px;/*px*/
      color: $color-6
      margin-top: 60px
  .pull-list
    display: flex
    align-items: center
    border-bottom: 1px solid $color-df;/*no*/
    height: 90px;/*px*/
    line-height: 90px;/*px*/
    >div
      flex: 1
      border-right: 1px solid #dfdfdf;/*no*/
    .weui-cells, .vux-no-group-title
      text-align: center
      color: red
    .weui-select
      height: auto
      line-height: 100%
    p
      text-align: center
      font-size: 26px/*px*/
      color: $color-3
  .li-box
    width: 100%
    position: absolute
    left: 0
    top: 90px;/*px*/
    bottom: 0
    background: $color-white
    .scroll
      height: 100%
      overflow: hidden
  .weui-cells
    margin-top: 0!important
    width: 256px;/*px*/
    height: 90px;/*px*/
    padding: 30px 30px
    position: relative
    border-right: 1px solid $color-df;/*no*/
    .weui-cells:before
      border-top: 0
    .weui-select
      color: $color-3
      font-size: 26px;/*px*/
      option
        font-size: 16px!important
    .weui-cell__bd:after
      width: 16px/*px*/!important
      height: 16px/*px*/!important
      transform: rotate(135deg)!important
      margin-top: -12px!important
  .get-card
    padding: 50px 25px 0 25px
    border-bottom: 1px solid $color-df;/*no*/
    .get-content
      position: relative
      .pic
        width: 72px;/*px*/
        height: 72px;/*px*/
        img
          width: 100%
          height: 100%
          border-radius: 50%
      span
        position: absolute
        top: -15px
        left: 96px;/*px*/
        font-size: 30px;/*px*/
        color: $color-3
        line-height: 66px
      .css-new
        display: flex
        align-items: center
        padding-left: 96px;/*px*/
        margin-top: -28px
      .person
        background: url('icon1.png') no-repeat
        width: 28px;/*px*/
        height: 28px;/*px*/
        background-size: 100% auto
        display: block
      .company
        background: url('company.png') no-repeat
        width: 28px;/*px*/
        height: 28px;/*px*/
        background-size: 100% auto
        display: block
      .teacher
        font-size: 20px;/*px*/
        color: $color-cyan
        padding: 0 8px 0 0
        height: 28px;/*px*/
        line-height: 28px;/*px*/
        text-align: center
        border: 1px solid $color-cyan;/*no*/
      .grade
        position: absolute
        right: 0
        top: 10px
        color: $color-cyan
        font-size: 28px;/*px*/
    .buy-goods
      padding: 42px 0 0 84px
      position: relative
      line-height: 30px;/*px*/
      .buy
        background: url('hobby.png') no-repeat
        background-size: 100% auto
        width: 34px;/*px*/
        height: 26px;/*px*/
        display: inline-block
        position: absolute
        top: 40px
      .goods
        background: url('icon2.png') no-repeat
        background-size: 100% auto
        width: 28px;/*px*/
        height: 28px;/*px*/
        display: inline-block
        position: absolute
        top: 40px
      span
        font-size: 26px/*px*/
        color: $color-orange
        padding-left: 45px
        &:last-child
          // padding-left: 25px
          // color: $color-5
      .hobby
        font-size: 26px/*px*/
        color: $color-5
        padding-left: 26px
    .buy-scale
      padding: 20px 0 53px 84px
      position: relative
      .scale
        width: 28px;/*px*/
        height: 24px;/*px*/
        display: inline-block
        background: url('icon3.png') no-repeat
        background-size: 100% auto
        position: absolute
        top: 20px
      .manage
        width: 21px;/*px*/
        height: 28px;/*px*/
        display: inline-block
        position: absolute
        left: 92px
        top: 20px
        background: url('address.png') no-repeat
        background-size: 100% auto
      span
        font-size: 26px/*px*/
        color: $color-orange
        padding-left: 45px
        &:last-child
          padding-left: 25px
          color: $color-5
  .no-more
    padding-top: 58px
    img
      flex-center()
      display: block
      margin: 0 auto
      width: 553px;/*px*/
      height: 333px;/*px*/
    p
      padding-top: 90px
      text-align: center
      font-size: 28px;/*px*/
      color: color-6
    .open
      padding: 12px 42px
      border: 2px solid $color-orange;/*no*/
      text-align: center
      width: 200px
      font-size: 30px;/*px*/
      color: $color-orange
      margin-top: 40px
      margin-left: 270px
  .image
    .pic
      text-align: center
      padding-top: 50px
      img
        width: 389px;/*px*/
        height: 266px;/*px*/
    p
     text-align: center
     font-size: 28px;/*px*/
     color: $color-6
     padding-top: 90px
    p:last-child
      padding-top: 25px
  .picture
    padding-top: 90px
  .text-box
    position: absolute
    width: 100%
    left: 0
    bottom: 0
    top: 92px;/*px*/
    overflow: hidden
    .tabOne
      width: 100%
      height: 100%
    .scroll
      height: 100%
  .no-box
    width: 100%
    position: absolute
    left: 0
    top: 0px;/*px*/
    bottom: 0
    background: $color-white
    // border-top: 1px solid $color-df;/*no*/
    .scroll
      height: 100%
      overflow: hidden
    .get-card
      padding: 50px 25px 0 25px
      border-bottom: 1px solid $color-df;/*no*/
    .get-content
      position: relative
      .pic
        width: 72px;/*px*/
        height: 72px;/*px*/
        img
          width: 100%
          height: 100%
          border-radius: 50%
      span
        font-size: 30px;/*px*/
        color: $color-3
        line-height: 66px
      .design
        display: flex
        padding-left: 95px
        margin-top: -26px
        i
          background: url('icon1.png') no-repeat
          width: 28px;/*px*/
          height: 28px;/*px*/
          background-size: 100% auto
          display: block
        // .teacher
        //   font-size: 20px;/*px*/
        //   color: $color-cyan
        //   text-align: center
        //   border: 1px solid $color-cyan;/*no*/
    .buy-goods
      padding: 42px 0 0 84px
      position: relative
      line-height: 30px;/*px*/
      i
        background: url('icon2.png') no-repeat
        background-size: 100% auto
        width: 28px;/*px*/
        height: 28px;/*px*/
        display: inline-block
        position: absolute
        top: 40px
      span
        font-size: 26px/*px*/
        color: $color-orange
        padding-left: 45px
        &:last-child
          padding-left: 25px
          color: $color-5
      .hobby
        font-size: 26px/*px*/
        color: $color-5
        padding-left: 26px
    .buy-scale
      padding: 20px 0 53px 84px
      position: relative
      i
        width: 28px;/*px*/
        height: 24px;/*px*/
        display: inline-block
        background: url('icon3.png') no-repeat
        background-size: 100% auto
        position: absolute
        top: 20px
      span
        font-size: 26px/*px*/
        color: $color-orange
        padding-left: 45px
        &:last-child
          padding-left: 25px
          color: $color-5
</style>

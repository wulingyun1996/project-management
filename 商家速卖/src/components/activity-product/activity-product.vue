<template>
  <div class="card-product">
    <div class="header">
      <div class="header-left" @click="checkAll"><i :class="{'active': is_all === 1}"></i><span class="all-check">全选</span></div>
      <div class="list">在售商品列表</div>
    </div>
    <div class="productlist">
      <scroll ref="scroll" class="main-content" :data="actProduct" :pullup="pullup" :beforeScroll="beforeScroll" @scrollToEnd="searchMore" @beforeScroll="listScroll">
        <div>
          <div class="product-box" v-for="item in actProduct" @click="setPro(item)">
            <i :class="{'active': item.is_special === 1}"></i>
            <div class="pic">
              <img :src="item.image_path | smallPic(225, 225)" />
            </div>
            <div class="txt">
              <h5>{{item.title}}</h5>
              <p>￥{{item.price}}</p>
            </div>
          </div>
          <loading v-show="hasMore" title=""></loading>
          <no-more v-show="!hasMore && actProduct.length" message="已加载完"></no-more>
        </div>
      </scroll>
    </div>
    <div class="btn" @click="sendSelect">提交</div>
    <pop ref="mess" :title="title"></pop>
  </div>
</template>

<script type="text/ecmascript-6">
  import {closeCertification} from 'api/navtive'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import NoMore from 'base/no-more/no-more'
  import {loadDataPost, STATUS_OK} from 'api/common'
  import Pop from 'base/pop/pop'
  const perpage = 20
  let selectPro = []
  let allId = []
  export default {
    data() {
      return {
        isActive: true,
        page: 1,
        pullup: true,
        beforeScroll: true,
        hasMore: true,
        actProduct: [],
        is_all: 0, // 1 全选 0 非全选
        title: '',
        intScroll: false
      }
    },
    created() {
      closeCertification()
      this.getRoute()
    },
    methods: {
      getRoute() {
        let URL = 'SpecialGoodsList'
        let obj = {
          page: this.page
        }
        loadDataPost(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            allId = res.data.goods_ids.split(',')
            // 设置如果是全选的状态下
            this.actProduct = this.actProduct.concat(res.data.list.data)
            // 初始化操作数组
            let arr = []
            this.actProduct.map((value) => {
              if (value.is_special === 1) {
                arr.push(value.id)
              }
              selectPro = arr
            })
            this._checkMore(res.data.list)
          }
        })
      },
      searchMore() {
        if (!this.hasMore) {
          return
        }
        this.page++
        this.intScroll = true
        this.getRoute()
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
      setPro(item) {
        if (item.is_special === 1) {
          this.$set(item, 'is_special', 0)
          this.is_all = 0
          let selectIndex = selectPro.indexOf(item.id)
          selectPro.splice(selectIndex, 1)
        } else {
          this.$set(item, 'is_special', 1)
          if (selectPro.length > 0) {
            selectPro.push(item.id)
          } else {
            if (selectPro === null) {
              selectPro = []
            }
            selectPro.push(item.id)
          }
        }
      },
      processData() {
        if (this.is_all === 0) {
          // 取消全选
          this.actProduct.map((value) => {
            this.$set(value, 'is_special', 0)
          })
          selectPro = []
        } else {
          // 全选
          this.actProduct.map((value) => {
            this.$set(value, 'is_special', 1)
          })
          selectPro = []
          allId.map(value => {
            selectPro.push(value)
          })
        }
      },
      checkAll() { // 全选
        if (this.is_all === 1) {
          this.is_all = 0
        } else {
          this.is_all = 1
        }
        this.processData()
      },
      sendSelect() {
        // console.log('需要提交的选中的数据', selectPro)
        if (selectPro.length === 0) {
          selectPro = 'remove'
        }
        // todo
        let URL = 'setSpecialGoods'
        let obj = {
          goods_id: selectPro
        }
        loadDataPost(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            // this.$router.replace('/card-manage')
            this.$router.back()
          }
        })
      }
    },
    components: {
      Loading,
      NoMore,
      Scroll,
      Pop
    }
  }
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variable.styl"
  .card-product
    position: fixed
    width: 100%
    height: 100%
    left: 0
    top: 0
    right: 0
    bottom: 0
    background: $color-white
  .header
    height: 88px;/*px*/
    line-height: 88px;/*px*/
    background: $color-white
    padding: 0 26px
    flex-between()
    .header-left
      padding-left: 66px
      position: relative
      i
        display: block
        width: 40px;/*px*/
        height: 40px;/*px*/
        border: 2px solid #ccc;/*no*/
        border-radius: 50%
        position: absolute
        left: 0
        top: 50%
        transform: translateY(-50%)
        &.active
          background: url('gou.png') no-repeat center center
          background-color: $color-orange
          background-size: 25px 17px;/*px*/
          border: none
    .all-check, .list
      font-size: 28px;/*px*/
      color: $color-6
    .list
      color: $color-orange
  .productlist
    border-top: 1px solid $color-border;/*no*/
    position: absolute
    left: 0
    top: 88px;/*px*/
    bottom: 88px;/*px*/
    width: 100%
    .main-content
      height: 100%
      overflow: hidden
    .product-box
      padding: 20px 25px
      display: flex
      position: relative
      background: $color-body
      margin-bottom: 10px
      i
        width: 40px;/*px*/
        height: 40px;/*px*/
        border: 2px solid $color-a6;/*no*/
        border-radius :50%
        display: inline-block
        position: absolute
        top: 75px
        &.active
          background: url('gou.png') no-repeat center center
          background-color :$color-orange
          background-size :25px 17px;/*px*/
          border: none
      .pic
        padding-left: 62px
        img
          width: 150px;/*px*/
          height: 150px;/*px*/
      .txt
        padding-left: 22px
        flex: 1
        h5
          font-size: 26px;/*px*/
          word-break: break-all
          line-height: 1.4
          text-over(2)
        p
          font-size: 24px;/*px*/
          color: $color-orange 
          padding-top: 20px
  .btn  
    position: fixed
    bottom:0
    left: 0
    right: 0
    line-height: 88px;/*px*/
    text-align: center
    background: $color-orange
    font-size: 36px;/*px*/
    color: $color-white
    width: 100% 
</style>

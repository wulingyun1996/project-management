<template>
  <div class="related-content">
    <div class="related-tab">在售商品</div>
    <div class="related-main">
      <scroll ref="scroll" class="main-content" :data="relatedGood" :pullup="pullup" :beforeScroll="beforeScroll" @scrollToEnd="searchMore" @beforeScroll="listScroll">
        <div>
          <ul class="related-li">
            <li v-for="item in relatedGood" @click="selectGoodMess(item)">
              <img :src="item.image_path" />
              <div class="select-foot">
                <p>{{item.title}}</p>
                <div class="price">
                  <i>￥</i>{{item.price}}<i></i>
                </div>
              </div>
              <i class="gou" v-if="item.is_select"></i>
            </li>
          </ul>
          <loading v-show="hasMore" title=""></loading>
          <no-more v-show="!hasMore && relatedGood.length" message="已加载完"></no-more>
        </div>
      </scroll>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import {nativeBackBase, navBack} from 'api/init'
  import Scroll from 'base/scroll/scroll'
  import {loadDataPost, STATUS_OK} from 'api/common'
  import Loading from 'base/loading/loading'
  import NoMore from 'base/no-more/no-more'
  const perpage = 20

  export default {
    data() {
      return {
        page: 1,
        pullup: true,
        beforeScroll: true,
        hasMore: true,
        relatedGood: []
      }
    },
    created() {
      this.getRoute()
      window.nav_back = this.nav_back
      this.nav()
    },
    watch: {
      '$route' () {
        this.nav()
      }
    },
    methods: {
      nav_back() {
        navBack()
      },
      nav() {
        var param = {
          'left': [{
            'title': 'back',
            'function': 'nav_back()' // 默认
          }]
        }
        nativeBackBase(param)
      },
      getRoute() {
        let URL = 'goods'
        let obj = {
          type: 1,
          page: this.page,
          pageSize: perpage
        }
        loadDataPost(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            this.relatedGood = this.relatedGood.concat(res.data.goodsList.data)
            let selectId = this.$route.query.id
            if (selectId) {
              this.relatedGood.map((value) => {
                if (value.id === selectId) {
                  this.$set(value, 'is_select', true)
                }
              })
            }
            this._checkMore(res.data.goodsList)
          }
        })
      },
      searchMore() {
        if (!this.hasMore) {
          return
        }
        this.page++
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
      selectGoodMess(item) {
        if (!item.is_select) {
          this.$set(item, 'is_select', true)
          let selectGood = {
            id: item.id,
            title: item.title
          }
          sessionStorage.setItem('chooseGood', JSON.stringify(selectGood))
          this.$router.back()
        } else {
          this.$set(item, 'is_select', false)
        }
      }
    },
    components: {
      Scroll,
      Loading,
      NoMore
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variable.styl"
  .related-content
    width: 100%
    height: 100%
    position: fixed
    left: 0
    top: 0
    bottom: 0
    right: 0
    background: $color-white
    .related-tab
      width: 100%
      line-height: 92px;/*px*/
      color: $color-orange
      font-size: 28px;/*px*/
      padding-left: 40px
      position: relative
      &:before
        content: ''
        width: 4px
        height: 25px
        position: absolute
        left: 26px
        top: 50%
        transform: translateY(-50%)
        background: $color-orange
    .related-main
      width: 100%
      position: absolute
      left: 0
      top: 92px;/*px*/
      bottom: 0
      .main-content
        height: 100%
        overflow: hidden
      .related-li
        li
          display: flex
          padding: 20px 26px
          position: relative
          margin-bottom: 10px;/*px*/
          background: $color-body
          img
            width: 242px;/*px*/
            height: 242px;/*px*/
          p
            text-over(2)
            font-size: 28px;/*px*/
            line-height: 1.3
            word-break: break-all
          .price
            color: $color-orange
            font-size: 30px;/*px*/
            margin-top: 82px
            i
              font-style: normal
              font-size: 22px;/*px*/
        .select-foot
          padding: 20px 20px 0 20px
          flex: 1
        .gou
          width: 40px;/*px*/
          height: 40px;/*px*/
          background: url('gou.png') no-repeat center center
          background-size: 100% auto
          border-radius: 50%
          position: absolute
          right: 42px
          bottom: 26px
</style>
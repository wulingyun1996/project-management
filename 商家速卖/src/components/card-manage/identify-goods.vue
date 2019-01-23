<template>
  <div class="identify-goods">
    <div>
      <header ref="header">
        <div v-for="(item, index) in items" :key="index" @click="itemClick(index)" :class="activeIndex === index ? 'active' : ''" class="item">
          {{item.name}}
        </div>
        <div class="hr" ref="hr"></div>
      </header>
      <Scroller lock-x :height="height" :scroll-bottom-offst="200" @on-scroll-bottom="onScrollBottom" ref="scrollerBottom" style="background: #F4F4F4;">
        <div>
          <div style="background: #FFF" v-if="list.length > 0 && loading">
            <item v-for="(item, index) in list" :key="index" :hasSelect="hasSelect" @check="check" :item="item">
            </item>
            <div class="nomore" v-if="!hasMore && list.length > 4" ref="more">没有更多了</div>
          </div>
          <div style="backgroungd: #C6C6C6" v-if="list.length === 0 && loading" class="no-data">
            <img src="./no_data.png" alt="">
            <p>啊偶~什么都没有</p>
          </div>
          <Loading tips="loading" v-show="fetching"></Loading>
        </div>
      </Scroller>
      <footer class="edit" ref="footer" @click="edit" v-if="!hasSelect">
        编辑
      </footer>
      <footer class="cancel" ref="footer" v-if="hasSelect">
        <div class="left">
          <img :src="isCheckAll ? require('./check_on.png') : require('./check_off.png')" alt="" @click="checkAll">
          <span>全选</span>
          <span>共{{total}}个</span>
        </div>
        <div class="btn" @click="toggleJoin" :style="{'background': activeIndex === 1 ? '#FF8A00' : ' #FF0000'}">
          {{activeIndex === 0 ? '取消参与' : '参与活动'}}
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import Loading from 'base/loading/loading'
import { Scroller } from 'vux'
import Item from './item.vue'
export default {
  components: {
    Item,
    Scroller,
    Loading
  },
  data () {
    return {
      items: [{name: '参与商品'}, {name: '可添加商品'}],
      activeIndex: 0,
      list: [],
      scroll,
      height: '',
      loading: false,
      hasSelect: false,
      isCheckAll: false,
      fetching: false,
      hasMore: true,
      page: 0,
      pageSize: 10
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    checkAll () {
      this.isCheckAll = !this.isCheckAll
      for (let i = 0; i < this.list.length; i++) {
        this.list[i].checked = this.isCheckAll
      }
    },
    toggleJoin () {
      this.hasSelect = false
      if (!this.isSelect) {
        return
      }
      const arr = []
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].checked) {
          arr.push(this.list[i].id)
        }
      }
      let path = this.activeIndex === 0 ? 'card/delSpecialGoods' : 'card/addSpecialGoods'
      this.$http(path, {goods_id: JSON.stringify(arr)}).then(res => {
        if (res.code === 200) {
          this.page = 0
          this.list = []
          this.hasMore = true
          this.getData()
        }
      })
    },
    onScrollBottom () {
      this.getData(false)
    },
    reset (flag = true) {
      const winH = document.documentElement.clientHeight
      const headerH = getComputedStyle(this.$refs.header, null).height.split('px')[0]
      const footerH = getComputedStyle(this.$refs.footer, null).height.split('px')[0]
      this.height = winH - headerH - footerH + 'px'
      if (flag) {
        this.$refs.scrollerBottom.reset({top: 0})
      } else {
        this.$refs.scrollerBottom.reset({bottom: 0})
      }
    },
    getData (flag = true) {
      if (this.fetching) return
      if (!this.hasMore) return
      this.fetching = true
      this.page++
      let path = this.activeIndex === 0 ? 'card/specialShopList' : 'card/shopListAll'
      this.$http(path, {page: this.page, pagesize: this.pageSize}).then(res => {
        this.fetching = false
        this.loading = true
        if (res.code === 200) {
          const arr = res.data.data
          for (let i = 0; i < arr.length; i++) {
            this.$set(arr[i], 'checked', this.isCheckAll)
          }
          this.list = this.list.concat(arr)
          if (this.list.length >= res.data.total) {
            this.hasMore = false
          }
          this.$nextTick(() => {
            this.reset(flag)
          })
        }
      })
    },
    check (item) {
      item.checked = !item.checked
      let flag = true
      if (!item.checked) {
        flag = false
      } else {
        for (let i = 0; i < this.list.length; i++) {
          if (!this.list[i].checked) {
            flag = false
            break
          }
        }
      }
      this.isCheckAll = flag
    },
    edit () {
      if (this.list.length === 0) {
        this.$vux.toast.text('没有可编辑的商品', 'middle')
        return
      }
      this.hasSelect = true
    },
    itemClick (index) {
      if (this.activeIndex === index) return
      if (this.fetching) return
      this.list = []
      this.isCheckAll = false
      this.loading = false
      this.activeIndex = index
      this.$refs.hr.style.left = document.documentElement.clientWidth * index / this.items.length + 'px'
      this.page = 0
      this.hasMore = true
      this.getData()
    }
  },
  computed: {
    isSelect () {
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].checked) {
          return true
        }
      }
      return false
    },
    total () {
      let num = 0
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].checked) {
          num++
        }
      }
      return num
    }
  }
}
</script>

<style lang="stylus" scoped>
.identify-goods
  height 100vh
  padding-bottom 100px
  padding-top 100px
  background #FFF
  >div
    height 200px
.no-data
  text-align center
  padding-top 240px
  p
    color #cccccc
    font-size 24px
    margin-top 89px
header
  position fixed
  left 0
  top 0
  width 100%
  height 100px
  display flex
  align-items center
  z-index 10
  background #FFF
  border-bottom 1px solid #999;/*no*/
  .item
    flex 1
    font-size 28px
    color #333
    text-align center
    height 100px
    line-height 100px
  .active
    color #FF8A00
  .hr
    position absolute
    height 2px;/*no*/
    width 50%
    background #FF8A00
    bottom 0
    left 0
    transition all .5s
footer
  width 100%
  height 100px
  line-height 100px
  position fixed
  left 0
  bottom 0
  text-align center
  font-size 32px
  color #FFF
  background #FF8A00
.list
  height 100%
  padding-bottom 100px
  overflow-y auto
.nomore
  text-align center
  font-size 26px
  padding 30px 0
  background #F4F4F4
  color #ccc
.cancel
  background #FFF
  display flex
  .left
    flex 1
    background #FFF
    color #333
    font-size 32px
    display flex
    align-items center
    border-top 1px solid #999;/*no*/
    img
      width 44px
      height 44px
      margin-left 24px
      margin-right 12px
    span:last-child
      margin-left 8px
  .btn
    width 260px
</style>

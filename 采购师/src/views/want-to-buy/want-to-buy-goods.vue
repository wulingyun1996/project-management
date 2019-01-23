<template>
  <div class="want-to-buy-goods-wrapper">
    <base-scroll :hasMore="true" class="want-to-bue-wrapper">
      <div class="seperate"></div>
      <div class="form-group">
        <div class="item-icon wtb-name"></div>
        <div class="item-content bd-b">
          <label for="">
            <!-- <input type="text" placeholder="" v-model="goodsName"> -->
            <x-textarea
              :height="25"
              title=""
              @on-focus="justifyBodyHeight"
              @on-blur="restoreBodyHeight"
              v-model="goodsName"
              placeholder="填写求购商品名称、品牌、型号更容易找到卖家（30字）"
              :max="30">
            </x-textarea>
          </label>
        </div>
      </div>
      <div class="form-group">
        <div class="item-icon wtb-category"></div>
        <div class="item-content" @click="showGoodsCategory">
          <label for="">
            <input type="text" placeholder="选择商品分类" v-model="goodsCategory" readonly>
          </label>
          <span class="arrow-right"></span>
        </div>
      </div>
      <div class="form-group">
        <div class="item-icon wtb-nums"></div>
        <div class="item-content bd-b">
          <label for="">
            <input type="text" placeholder="输入商品数量" v-model="goodsNum" maxlength="15">
          </label>
        </div>
      </div>
      <div class="form-group">
        <div class="item-icon wtb-area"></div>
        <div class="item-content">
          <div class="address">
            <group>
              <x-address
                value-text-align="left"
                title=""
                @on-focus="justifyBodyHeight"
                @on-blur="restoreBodyHeight"
                :list='cityList'
                v-model="city"
                :hide-district="true"
                placeholder='供货商首选区域'>
              </x-address>
            </group>
          </div>
          <span class="arrow-right"></span>
        </div>
      </div>
      <div class="form-group">
        <div class="item-icon wtb-clock"></div>
        <div class="item-content">
          <div class="date-time">
            <group>
              <datetime
                v-model="dateTime"
                title=""
                :start-date='startDate'
                placeholder="默认为长期求购">
              </datetime>
            </group>
          </div>
          <span class="arrow-right"></span>
        </div>
      </div>
      <div class="seperate"></div>
      <div class="form-textarea">
        <x-textarea
          title=""
          @on-focus="justifyBodyHeight"
          @on-blur="restoreBodyHeight"
          v-model="goodsMessage"
          placeholder="请填写求购商品信息，详细介绍可以得到更多相关商品推荐哦"
          :max="100">
        </x-textarea>
      </div>
      <div class="form-picture">
        <div class="item-pic" v-for="(item, index) in imgList" :key="index">
          <img :src="item" alt="">
          <span @click="removePic(index)"></span>
        </div>
        <div class="pic-placeholder" @click="uploadPic" v-show="imgListLength !== 2"></div>
        <p>最多可上传2张与商品求购相关的图片~</p>
      </div>
    </base-scroll>
    <div class="want-to-buy-goods-footer" ref="button">
      <router-link to="/want-to-buy-goods/role-explain" tag="h5">《求购规则说明》</router-link>
      <base-footer @footerSubmit="submitWantToBuy">发布</base-footer>
    </div>
    <base-popup-transition ref="popup" class="category-list-container">
      <div class="category-list-wrapper">
        <h1 class="title">
          选择商品分类
          <span @click="hideGoodsCategory"></span>
        </h1>
        <base-scroll
          :has-more="true"
          :data="categoryList"
          :before-scroll="true"
          @beforeScroll="beforeScroll"
          class="category-list">
          <div class="category-list-item bd-b" v-for="(item, index) in categoryList" :key="index">
            <div class="category-item" @click="chooseCurrentItem(index)">
              <h2>{{ item.name }}</h2>
              <span :class="{active: index === item.currentIndex}"></span>
            </div>
            <transition>
              <div class="list" v-show="index === item.currentIndex">
                <ul>
                  <li v-for="goods in item.next" :key="goods.id" @click="chooseGoods(goods.id, goods.goodsIndex, goods.title)">
                    <span class="category-name">{{ goods.name }}</span>
                    <span class="category-icon" :class="{active: currentGoodsIndex === goods.goodsIndex}"></span>
                  </li>
                </ul>
              </div>
            </transition>
          </div>
          <div ref="placeholder"></div>
        </base-scroll>
      </div>
    </base-popup-transition>
    <router-view></router-view>
  </div>
</template>

<script>
import BasePopupTransition from 'components/popup/popup-transition'
import { Group, XAddress, Datetime, XTextarea } from 'vux'
import cityList from 'data/areaAddress'
import { dev, _postMessage, authenAnswerAlert } from 'native'
import { formatDateOne } from 'common'
export default {
  data () {
    return {
      categoryList: [],
      currentGoodsIndex: -1,
      goodsName: '',
      goodsNum: '',
      goodsCategory: '',
      categoryId: '',
      cityList,
      city: [],
      dateTime: '',
      startDate: formatDateOne(),
      goodsMessage: '',
      imgList: []
    }
  },
  computed: {
    imgListLength () {
      return this.imgList.length
    }
  },
  created () {
    this.getGoodsCategory()
    window.album = this.getAndoriadPic
    authenAnswerAlert('您确定放弃编辑吗？')
  },
  methods: {
    getGoodsCategory () {
      let url = 'basic/productCategory'
      this.$http(url).then(res => {
        if (res.code === this.$ok) {
          let goodsIndex = 0
          res.data.forEach(item => {
            item.currentIndex = -1
            if (item.next) {
              item.next.forEach(goodsItem => {
                goodsItem.title = item.name + '>>' + goodsItem.name
                goodsItem.goodsIndex = goodsIndex
                goodsIndex++
              })
            }
          })
          this.categoryList = res.data
        }
      })
    },
    chooseCurrentItem (index) {
      let item = this.categoryList[index]
      if (index === item.currentIndex) {
        item.currentIndex = -1
        return
      }
      item.currentIndex = index
    },
    chooseGoods (id, index, name) {
      this.categoryId = id
      this.currentGoodsIndex = index
      this.goodsCategory = name
      this.hideGoodsCategory()
    },
    showGoodsCategory () {
      this.$refs.popup.show()
    },
    hideGoodsCategory () {
      this.$refs.popup.hide()
    },
    getAndoriadPic (imgUrl) {
      this.imgList.push(imgUrl)
    },
    uploadPic () {
      let currentDev = dev()
      if (currentDev === 'Android') {
        window.android.selectPic()
        return false
      }
      if (currentDev === 'iOS') {
        _postMessage('', 'selectPic').then((val) => {
          let [imgUrl] = val
          this.imgList.push(imgUrl)
        })
      }
    },
    removePic (index) {
      this.imgList.splice(index)
    },
    submitWantToBuy () {
      if (!this.checkFieldValidity()) return
      /* eslint-disable */
      let [province_id, city_id] = this.city
      let [imagePath, imagePathTwo] = this.imgList
      let url = 'asktobuy/addItemAskToBuy'
      let obj = {
        type: 1,
        title: this.goodsName,
        category_id: this.categoryId,
        province_id,
        city_id,
        goods_num: this.goodsNum,
        deadline: this.dateTime,
        content: this.goodsMessage,
        image_path: imagePath ? imagePath : '',
        image_path_two: imagePathTwo ? imagePathTwo : ''
      }
      /* eslint-enable */
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.$t('发布求购成功', 'middle')
          this.$root.listInfo = null
          this.$router.push('/want-to-buy')
          return
        }
        this.$t(res.message, 'middle')
      })
    },
    checkFieldValidity () {
      if (!this.goodsName.trim()) {
        this.$t('请填写主题', 'middle')
        return false
      }
      if (!this.city.length) {
        this.$t('请选择地址', 'middle')
        return false
      }
      // if (!this.dateTime) {
      //   this.$t('请选择截止时间', 'middle')
      //   return false
      // }
      // let t = new Date()
      // let year = t.getFullYear()
      // let month = t.getMonth() + 1
      // let day = t.getDate()
      // let date = `${year}-${month}-${day}`
      // if (this.dateTime && initTime(this.dateTime) < initTime(date)) {
      //   this.$t('截止时间不可小于当前时间', 'middle')
      //   return false
      // }
      if (!this.goodsMessage.trim()) {
        this.$t('请填写求购信息', 'middle')
        return false
      }
      // if (!this.imgList.length) {
      //   this.$t('请上传求购相关的图片', 'middle')
      //   return false
      // }
      return true
    },
    beforeScroll () {
      let dom = this.$refs.placeholder
      dom.style.height = dom.offsetHeight + 1 + 'px'
    }
  },
  components: {
    BasePopupTransition,
    Group,
    XAddress,
    Datetime,
    XTextarea
  }
}
</script>

<style lang="stylus">
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
@import '~@/assets/css/vux'
.want-to-buy-goods-wrapper
  height 100%
  flex-col-btw()
  overflow hidden
  .want-to-bue-wrapper
    flex 1
    padding 0 30px
    overflow unset
    // .scroll-container
    //   overflow unset
    .seperate
      height 24px
      background $color-body
      margin 0 -30px
    .form-group
      flex-align-item()
      height 104px
      .item-icon
        wh(36px)
        margin-right 24px
        &.wtb-name
          bg('wtb-name.png')
        &.wtb-category
          bg('wtb-category.png')
        &.wtb-area
          bg('wtb-area.png')
        &.wtb-nums
          bg('wtb-nums.png')
        &.wtb-clock
          bg('wtb-clock.png')
      .item-content
        flex 1
        height 100%
        flex-align-item()
        position relative
        label,
        input
          width 100%
        .arrow-right
          wh(26px)
          position absolute
          right 0
          top 50%
          transform translateY(-50%)
          bg('arrow-right.png')
        .address,
        .date-time
          position relative
          flex 1
          padding-right 30px
          height 100%
          >div
            height 100%
          .weui-cells
            height 100%
            margin-top 0
            flex-f()
            align-items center
            f14()
            color: $color-c
            &:before,
            &:after
              content unset
            span.vux-popup-picker-value,
            span.vux-cell-placeholder,
            span.vux-cell-value
              f12()
              color $color-3
          .weui-cell
            width 100%
          .vux-cell-box
            width 100%
            height 100%
            flex-f()
            align-items center
            >div
              width 100%
          .weui-cell__ft
            text-align left
            &:after
             content unset
    .form-textarea
      bd($color-e3)
      margin 30px 0 40px
      textarea
        height 200px
    .form-picture
      flex-align-item()
      justify-content flex-start
      .item-pic,
      .pic-placeholder
        margin-right 24px
        wh(140px)
      .item-pic
        position relative
        img
          wh(100%)
        span
          wh(32px)
          bg('wtb-close.png')
          position absolute
          right -16px
          top -16px
      .pic-placeholder
        bg('wtb-pic.png')
      p
        f12()
        color $color-a6
        line-height 40px
  h5
    tc()
    f12()
    color $color-9
    margin-bottom 10px
  .category-list-container
    flex-col()
    justify-content flex-end
    .category-list-wrapper
      height 40%
      background $color-white
      flex-col()
      h1
        f16()
        font-weight 700
      .title
        height 100px
        line-height 100px
        tc()
        background $color-body
        position relative
        span
          width 30px
          height 30px
          position absolute
          right 36px
          top 50%
          transform translateY(-50%)
          bg('close.png')
      .category-list
        padding 0 30px
        flex 1
        // overflow-y auto
      .category-item
        height 80px
        flex-align-item()
        f14()
        color $color-3
        span
          wh(26px)
          bg('arrow-right.png')
          transition all .5s
          &.active
            transform rotate(90deg)
      .list
        color $color-6
        padding 0 20px
        ul
          flex-align-item()
          flex-wrap wrap
          li
            width 50%
            height 40px
            margin-bottom 20px
            flex-align-item()
            .category-icon
              wh(32px)
              border-radius(50%)
              bd($color-c)
              margin-right 100px
              &.active
                bg('choiced.png')
                border none
  .bd-b
    bd-b($color-e3)
</style>

<template>
  <div class="edit-announcement-container">
    <base-header></base-header>
    <!-- <div class="preview" @click="previewDetails"></div> -->
    <div class="limit-times" v-if="showWarning"><span></span><p>您已发布七次公告，再次发布只可保存草稿。</p><span @click="closeWarning"></span></div>
    <base-scroll
      ref="scroll"
      class="content"
      :has-more="true"
      :before-scroll="true"
      @beforeScroll="beforeScrollDetail">
      <!-- 营销公告banner -->
      <div class="edit-banner">
        <div class="edit-banner-bg">
          <span class="banner" v-if="!bannerImage" @click="uploadPic"></span>
          <img :src="bannerImage" alt="">
          <div class="banner-bgPic" v-show="bannerImage">
            <i @click="uploadPic"></i>
            <i @click="deletePic"></i>
          </div>
        </div>
      </div>
        <!-- 主题  -->
      <div class="form-list form-first">
        <div>
          <span>*&nbsp;</span>
          <span>主&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;题</span>
          <textarea type="text" placeholder="请添加公告名称（2~30个字）"  @blur="fous" v-model="title" maxlength="30"></textarea>
        </div>
      </div>
      <!-- 模板 -->
      <div class="form-list form-second">
        <div>
          <span>*</span>
          <span>选择模板</span>
          <span class="choose-color" @click="chooseWhite"><img v-show="showWhite" src="./images/icon-choose-yone.png" alt=""></span>
          <span class="choose-color" @click="chooseYellow"><img v-show="showYellow" src="./images/icon-choose-yone.png" alt=""></span>
          <span class="choose-color" @click="chooseRed"><img v-show="showRed" src="./images/icon-choose-two.png"></span>
        </div>
      </div>
      <!-- 添加详情 -->
      <div class="form-list form-third">
        <div>
          <span>*</span>
          <span>添加详情</span>
          <!-- <span>请添加公告详情页的图文</span> -->
          <u class="editDetails" @click="addMarketAnnouce" v-show="announcementDetail">编辑</u>
        </div>
        <div class="add-details-bg" @click="addMarketAnnouce" v-show="!announcementDetail">
          <img src="./images/icon-add-details.png" alt="">
        </div>
      </div>
      <div class="annnoucement-wrapper" @click="addMarketAnnouce" v-show="announcementDetail">
        <div id="market-annnoucement"></div>
      </div>
      <!-- 推送用户 -->
      <div class="form-fifth">
        <div>
          <span>*</span>
          <span>推送用户</span>
        </div>
        <div>
          <img
            :class="{ check: jurisdictionLength === identityListLength, uncheck: jurisdictionLength !== identityListLength}"
            alt=""
            @click="chooseAllIndentity">
          <span @click="chooseAllIndentity">全部身份</span><span>（{{ count }}）</span>
          <!-- <span :class="{ pullDown: isPulldown, pullUp: isPullup }" @click="showList"></span> -->
        </div>
      </div>
      <div class="identity-container">
        <div class="identity-wrapper" ref="listWrapper">
          <h1>仅展示您店铺的特约采购师身份</h1>
          <ul class="identity-list">
            <li
            :class="{ active: item.checked }"
            v-for="item in idList"
            :key="item.id"
            @click="chooseCurrentIdentity(item)">
              <span>{{ item.title }}（{{ item.num }}）</span>
            </li>
          </ul>
        </div>
        <div ref="scrollTarget"></div>
      </div>
      <div class="placeholder" ref="placeholder"></div>
    </base-scroll>
    <!-- 底部按钮 -->
    <div class="button">
      <div class="button-draft" @click="validateFields(0)" v-show="!isFromDraft">保存草稿</div>
      <div class="button-publish" :class="{unclick: isunclick}" @click="validateFields(1)">发布</div>
    </div>
    <!-- 特约采购师管理弹框 -->
    <base-senior-popup ref="failcgsPop" class="failcgsPop" height="auto" :stop="false" :opacity=0.8>
      <div>
        <div class="poptitle-bg"></div>
        <img src="./images/icon-pop-bg.png" alt="">
        <div class="pop-des">
          <p>您还没有审核通过的特约采购师</p><p>暂不能发布公告哦~</p>
        </div>
        <p class="goOpen">赶紧去<u @click="goOpen"> 特约采购师 </u>开通吧！</p>
      </div>
    </base-senior-popup>
    <!-- 特约活动管理弹框 -->
    <base-senior-popup ref="failmanagePop" class="failcgsPop failmanagePop" height="auto" :stop="false" :opacity=0.8>
       <div>
        <div class="poptitle-bg"></div>
        <img src="./images/icon-pop-bg.png" alt="">
        <div class="pop-des">
          <p>您还没有开通特约认证功能</p><p>暂不能发布公告哦~</p>
        </div>
        <p class="goOpen">赶紧去<u @click="goOpenTwo"> 特约认证 </u>开通吧！</p>
        <!-- <div class="icon-close" @click="closePop"></div> -->
      </div>
    </base-senior-popup>
    <div class="preview" @click="previewDetails"></div>
    <!-- 预览页面的弹框 -->
    <base-senior-popup ref="previewPopup" width="100%" height="100%" class="preview-popup">
      <div class="preview-announce-container" :style="[backgroundColor]">
        <base-scroll
          :has-more="true"
          :before-scroll="true"
          @beforeScroll="beforeScroll">
          <!-- 上面的标题 -->
          <div class="preview-title">
            <p>{{ title | sliceChar(8) }}</p>
            <div class="close" @click="closePreviewPopup">
              <img src="./images/icon-guan.png" alt="">
            </div>
          </div>
          <div class="preview-wrapper">
            <!-- 店铺标题 -->
            <div class="preview-logo" ref="img">
              <div class="line" :style="[borderColor]">
                <div class="logo-info">
                  <div class="logo">
                    <img :src="shopLogo" alt="" v-if="shopLogo">
                    <img src="../../../static/images/seller-sale/logo-small.png" alt="" v-else>
                  </div>
                  <p :style="textColor">{{ shopName }}</p>
                </div>
                <p :style="shopColor">进店逛逛</p>
              </div>
            </div>
            <div class="announcement-detail">
              <div id="preview-annnoucement"></div>
            </div>
            <!-- 底部的店铺logo -->
            <div class="fotter-info">
              <div class="fotter-logo">
                <img :src="shopLogo" alt="" v-if="shopLogo">
                <img src="../../../static/images/seller-sale/logo-small.png" alt="" v-else>
              </div>
              <p :style="[textColor]">{{ shopName }}</p>
            </div>
          </div>
          <div ref="placeholder2"></div>
        </base-scroll>
      </div>
    </base-senior-popup>
  </div>
</template>

<script>
// import data from 'data/data'
import { mixins } from 'mixins'
import { dev, getPic, _postMessage } from 'common/js/dev'
import { patch, createVnode } from 'plugins/snabbdom'
// import { themeBackgroundData } from 'data/backgroundData'
import { sliceChar, judgeObjectLen } from 'commons'
import { invokeNativeMethod } from 'api/navtive'
export default {
  name: 'editAnnounce',
  mixins: [mixins],
  data () {
    return {
      checked: true,
      uncheked: false,
      isPulldown: true,
      isPullup: false,
      showidList: false,
      showWhite: true,
      showYellow: false,
      showRed: false,
      count: '', // 全部身份总人数
      // bannerImage: 'http://ospictest.cgs18.com/uploads/a/4/5/a45041501c5a2d3cfabe0dabe4eb6fc6.jpg', // test
      bannerImage: '', // 公告背景图
      title: '', // 公告主题
      template: '#ffffff', // 公告背景
      identity: '', // 身份数据
      idList: [], // 身份
      draft: 0,
      showWarning: false, // 达到上限
      beyondTen: '',
      isunclick: false, // 不可点击
      limit: '', // 上限次数
      announcementDetail: '', // 原生详情
      // announcementDetail: JSON.stringify(data),
      Vnode: '',
      previewVnode: '',
      shopName: '',
      shopLogo: '',
      // 已选推送用户列表
      jurisdictionList: {},
      jurisdictionLength: 0,
      // 全选
      tempJurisdictionList: {},
      // 推送用户列表去除数量为 0 之后的长度
      identityListLength: 0,
      isBeforeScrollDetail: true,
      isBeforeScroll: true,
      preventPublishClick: true,
      preventDraftClick: true,
      isNeedSave: 0
    }
  },
  computed: {
    id () {
      return this.$route.query.id
    },
    backgroundColor () {
      return {
        background: this.template
      }
    },
    shopColor () {
      let color
      if (this.template === '#ef6370') {
        color = '#ffffff'
      } else {
        color = '#787150'
      }
      return {
        color
      }
    },
    textColor () {
      let color
      if (this.template === '#ef6370') {
        color = '#ffffff'
      } else {
        color = '#333333'
      }
      return {
        color
      }
    },
    borderColor () {
      let color
      if (this.template === '#ef6370') {
        color = '#ffffff'
      } else {
        color = '#666'
      }
      return {
        'border-bottom': `1px dashed ${color}`
      }
    },
    isFromDraft () {
      return this.$route.query.showDraft
    }
  },
  created () {
    this.returnAnnouncementData()
    if (this.id) {
      this.getEditIdentityList().then(() => {
        this.getAnnounceDetail()
      })
    } else {
      this.getIdentityList()
    }
    window.getNoticeDetail = this.getNoticeDetail
    window.album = this.getAndoriodBannerImg
    window.returnAnnouncementData = this.returnIosAnnouncementData
  },
  mounted () {
    this.$nextTick(() => {
      let previewWrapper = document.getElementById('preview-annnoucement')
      let wrapper = document.getElementById('market-annnoucement')
      this.previewVnode = previewWrapper
      this.Vnode = wrapper
      if (this.announcementDetail) {
        this.vnode2html(this.announcementDetail)
      }
    })
  },
  methods: {
    // 安卓返回即时保存
    returnAnnouncementData () {
      let currentDev = dev()
      try {
        if (currentDev === 'Android') {
          let data = window.android.returnAnnouncementData()
          this.parseSavedData(data)
          return
        }
        if (currentDev === 'iOS') {
          _postMessage('', 'returnAnnouncementData')
        }
      } catch (error) {
        //
      }
    },
    // ios返回即时保存
    returnIosAnnouncementData (data) {
      this.parseSavedData(data)
    },
    // 公告详情
    getAnnounceDetail () {
      let { id } = this
      if (!id) return
      let url = 'adv/noticesDetail'
      let params = {
        id
      }
      this.$http(url, params).then(res => {
        if (res.code === this.$ok) {
          let { content, image, title, identity, count, template } = res.data
          let length = identity.length
          let arr = []
          if (length) {
            identity.forEach(item => {
              arr = this.idList.filter((identityItem, identityIndex) => {
                let { id, num } = identityItem
                if (num) {
                  identityItem.index = identityIndex
                  if (id === item.id) {
                    identityItem.checked = true
                    this.jurisdictionList[identityIndex] = id
                  }
                  this.tempJurisdictionList[identityIndex] = id
                  return identityItem
                }
              })
            })
            this.idList = arr
            this.jurisdictionLength = length
          } else {
            arr = this.idList.filter((item, index) => {
              let { id, num } = item
              if (num) {
                item.index = index
                item.checked = true
                this.jurisdictionList[index] = id
                return item
              }
            })
            this.idList = arr
            this.jurisdictionLength = arr.length
            this.tempJurisdictionList = JSON.parse(JSON.stringify(this.jurisdictionList))
          }
          switch (template) {
            case '#ffffff':
              this.chooseWhite()
              break
            case '#fbea97':
              this.chooseYellow()
              break
            case '#ef6370':
              this.chooseRed()
              break
          }
          this.identityListLength = arr.length
          this.count = count
          this.template = template
          this.announcementDetail = content
          this.bannerImage = image
          this.title = title
        }
      })
    },
    // 编辑公告 --- 读取推送用户列表
    async getEditIdentityList () {
      let url = 'adv/getPushGroup'
      await this.$http(url).then(res => {
        if (res.code === this.$ok) {
          let { list, shopName, shopPath, limit } = res.data
          this.limit = limit
          this.idList = list
          this.shopName = shopName
          this.shopLogo = shopPath
          if (limit === 1) {
            this.showWarning = true
            this.isunclick = true
          }
          return
        }
        // if (res.code === 409) {
        //   this.$refs.failcgsPop.show()
        //   return
        // }
        // if (res.code === 408) {
        //   this.$refs.failmanagePop.show()
        // }
      })
      return Promise.resolve()
    },
    // 模板初始化 采购师身份
    getIdentityList () {
      let url = 'adv/getPushGroup'
      this.$http(url).then(res => {
        if (res.code === this.$ok) {
          let { list, count, shopName, shopPath, limit } = res.data
          this.idList = list.filter((item, index) => {
            let { id, num } = item
            if (num) {
              item.index = index
              item.checked = true
              this.jurisdictionList[index] = id
              return item
            }
          })
          let length = this.idList.length
          this.tempJurisdictionList = JSON.parse(JSON.stringify(this.jurisdictionList))
          this.limit = limit
          this.identityListLength = length
          this.jurisdictionLength = length
          this.count = count
          this.shopName = shopName
          this.shopLogo = shopPath
          if (limit === 1) {
            this.showWarning = true
            this.isunclick = true
          }
          return
        }
        // if (res.code === 409) {
        //   this.$refs.failcgsPop.show()
        //   return
        // }
        // if (res.code === 408) {
        //   this.$refs.failmanagePop.show()
        // }
      })
    },
    closeWarning () {
      this.showWarning = false
    },
    getAndoriodBannerImg (imgUrl) {
      this.bannerImage = imgUrl
    },
    uploadPic () {
      let currentDev = dev()
      if (currentDev === 'Android') {
        window.android.selectPic(690, 300)
        return false
      }
      if (currentDev === 'iOS') {
        let obj = {
          width: 690,
          height: 300
        }
        getPic('selectPic', obj).then((val) => {
          let [imgUrl] = val
          this.bannerImage = imgUrl
        })
      }
    },
    beforeScrollDetail () {
      let dom = this.$refs.placeholder
      dom.style.height = dom.offsetHeight + 1 + 'px'
    },
    beforeScroll () {
      let dom = this.$refs.placeholder2
      dom.style.height = dom.offsetHeight + 1 + 'px'
    },
    getNoticeDetail (data) {
      this.announcementDetail = data
    },
    addMarketAnnouce () {
      let dev = this.$dev
      if (dev === 1) {
        window.android.gotoNoticeDetailEditor(this.announcementDetail)
        return
      }
      if (dev === 2) {
        window.webkit.messageHandlers.gotoNoticeDetailEditor.postMessage(this.announcementDetail)
      }
    },
    // 删除 banner 图
    deletePic () {
      this.bannerImage = ''
    },
    // 选择背景色
    chooseWhite () {
      this.showWhite = true
      this.showYellow = false
      this.showRed = false
      this.template = '#ffffff'
    },
    chooseYellow () {
      this.showYellow = true
      this.showRed = false
      this.showWhite = false
      this.template = '#fbea97'
    },
    chooseRed () {
      this.showRed = true
      this.showYellow = false
      this.showWhite = false
      this.template = '#ef6370'
    },
    showList () {
      this.showidList = !this.showidList
      this.isPullup = !this.isPullup
      // if (this.showidList) {
      //   this.$nextTick(() => {
      //     let container = this.$refs.scroll.$el
      //     let containerHeight = container.offsetHeight
      //     let scrollTarget = this.$refs.scrollTarget
      //     let scrollTargetTop = scrollTarget.offsetTop
      //     let listWrapper = this.$refs.listWrapper
      //     let scrollY = listWrapper.offsetHeight
      //     if (scrollTargetTop - containerHeight > 0) {
      //       this.$refs.scroll.scrollBy(0, -scrollY, 500)
      //     }
      //   })
      // }
    },
    // 选择推送用户
    chooseCurrentIdentity (item) {
      let { index, id } = item
      item.checked = !item.checked
      if (item.checked) {
        this.jurisdictionList[index] = id
        // this.count += item.num
      } else {
        delete this.jurisdictionList[index]
        // this.count -= item.num
      }
      this.jurisdictionLength = judgeObjectLen(this.jurisdictionList)
    },
    // 全选事件
    chooseAllIndentity () {
      let { jurisdictionLength, idList, tempJurisdictionList, identityListLength } = this
      if (jurisdictionLength === identityListLength) {
        this.jurisdictionLength = 0
        // this.count = 0
        this.jurisdictionList = {}
        idList.forEach(item => {
          item.checked = false
        })
        return
      }
      this.jurisdictionLength = identityListLength
      this.jurisdictionList = JSON.parse(JSON.stringify(tempJurisdictionList))
      idList.forEach(item => {
        item.checked = true
        // this.count += item.num
      })
    },
    // 保存草稿/发布公告 -- 字段检验
    validateFields (type) {
      // 保存草稿
      if (type === 0) {
        if (!this.validateDraft()) {
          this.$t('保存草稿必须输入重要信息')
          return
        }
        this.draft = 0
        if (!this.preventDraftClick) return
        this.preventDraftClick = false
        this.submitAnnounceDetail(type)
        return
      }
      // 发布公告
      let { limit, bannerImage, title, announcementDetail, jurisdictionLength, preventPublishClick } = this
      if (limit === 1) return
      if (!bannerImage) {
        this.$t('请上传封面图')
        return
      }
      if (!title) {
        this.$t('请填写主题')
        return
      }
      if (title.length < 2) {
        this.$t('主题至少输入两个字')
        return
      }
      if (!announcementDetail) {
        this.$t('请编辑详情')
        return
      }
      if (!jurisdictionLength) {
        this.$t('请选择推送用户')
        return
      }
      this.draft = 1
      if (!preventPublishClick) return
      this.preventPublishClick = false
      this.submitAnnounceDetail(type)
    },
    // 草稿字段检验
    validateDraft () {
      let {
        bannerImage,
        title,
        announcementDetail
      } = this
      if (bannerImage || title || announcementDetail) {
        return true
      }
      return false
    },
    // 提交公告详情
    submitAnnounceDetail (type) {
      let { jurisdictionLength, identityListLength, jurisdictionList, bannerImage, title, template, announcementDetail, draft, id } = this
      let pushUser = jurisdictionLength === identityListLength ? 'all' : Object.values(jurisdictionList).join()
      let url = 'adv/notices'
      let obj = {
        title,
        template,
        pushUser,
        draft,
        content: announcementDetail,
        image: bannerImage,
        id
      }
      if (!id) delete obj.id
      setTimeout(() => {
        this.preventPublishClick = true
        this.preventDraftClick = true
      }, 1000)
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.isNeedSave = 0
          invokeNativeMethod('saveAnnouncementData', '')
          if (type === 0) {
            this.$router.push({ name: 'MarketAnnouncement', query: { fromNative: 1, showDraft: 1 } })
            return
          }
          this.$t('发布成功')
          this.$router.push({ name: 'MarketAnnouncement', query: { fromNative: 1 } })
          return
        }
        if (res.code === 407) {
          this.showWarning = true
        }
      })
    },
    // 预览
    previewDetails () {
      let { bannerImage, title, announcementDetail } = this
      if (!bannerImage) {
        this.$t('请上传封面图')
        return
      }
      if (!title) {
        this.$t('请填写主题')
        return
      }
      if (title.length < 2) {
        this.$t('主题至少输入两个字')
        return
      }
      if (!announcementDetail) {
        this.$t('请编辑详情')
        return
      }
      this.$refs.previewPopup.show()
      let vnode = createVnode('div#preview-annnoucement', JSON.parse(this.announcementDetail), this.template)
      patch(this.previewVnode, vnode)
      this.previewVnode = vnode
    },
    // 关闭预览
    closePreviewPopup () {
      this.$refs.previewPopup.hide()
    },
    // 关闭弹窗
    closePop () {
      // this.$refs.failcgsPop.hide()
      // this.$refs.failmanagePop.hide()
    },
    // 开通特约采购师管理
    goOpen () {
      this.$router.push({ name: 'CgsManage', query: { fromNative: 1 } })
    },
    // 开通特约认证
    goOpenTwo () {
      this.$router.push({ name: 'SpecialAuthen', query: { fromNative: 1 } })
    },
    // vnode2Html
    vnode2html (data, themeBackground = '#f4f4f4') {
      let vnode = createVnode('div#market-annnoucement', JSON.parse(data), themeBackground)
      patch(this.Vnode, vnode)
      this.Vnode = vnode
    },
    parseSavedData (data) {
      if (!data) return
      data = JSON.parse(data)
      let { bannerImage, title, announcementDetail, jurisdictionLength } = data
      this.bannerImage = bannerImage
      this.title = title
      this.announcementDetail = announcementDetail
      this.jurisdictionLength = jurisdictionLength
    },
    fous () {
      window.scroll(0, 0)
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.isNeedSave) {
      let establishActivity = Object.create(null)
      establishActivity.bannerImage = this.bannerImage
      establishActivity.title = this.title
      establishActivity.announcementDetail = this.announcementDetail
      establishActivity.jurisdictionLength = this.jurisdictionLength
      invokeNativeMethod('saveAnnouncementData', JSON.stringify(establishActivity))
    }
    next()
  },
  watch: {
    announcementDetail (val) {
      this.vnode2html(val)
    }
  },
  filters: {
    sliceChar
  }
}
</script>

<style lang="stylus">
@import "~common/stylus/mixin"
.edit-announcement-container
  height 100%
  flex-col()
  overflow hidden
  background $color-white
  .preview-popup
    .preview-announce-container
      height 100%
      .preview-wrapper
        padding 0 30px
      .preview-title
        width 100%
        height 80px
        background-image: radial-gradient(68% 264%, #FFBF00 66%, #FF8A00 100%)
        box-shadow: 0 6px 10px 0 rgba(0,0,0,0.11), inset 0 2px 28px 0 #F88C1C
        border-bottom-left-radius 20px
        border-bottom-right-radius 20px
        display flex
        align-items center
        justify-content space-between
        padding-left 30px
        padding-right 16px
        p
          font-family: PingFangSC-Regular
          font-size: 30px
          color: #FFFFFF
          overflow: hidden
          width 265px
          text-overflow:ellipsis
          white-space: nowrap
          letter-spacing: -0.36px
        .close
          width 60px
          height 60px
          img
            width 100%
            height 100%
      .preview-logo
        margin-bottom 28px
        .line
          width 100%
          height 130px
          display flex
          align-items center
          justify-content space-between
          .logo-info
            flex 1
            display flex
            align-items center
            .logo
              width 100px
              height 100px
              bd(#f4f4f4)
              border-radius(10px)
              img
                width 100%
                height 100%
            p
              flex 1
              text-over(1)
              line-height 1.2
              f16()
              color #333
              margin-left 20px
          p
            width 150px
            f12()
            margin-left 20px
            color #787150
      .fotter-info
        tc()
        .fotter-logo
          wh(160px)
          margin 0 auto
          bd(#f4f4f4)
          border-radius(8px)
          img
            wh(100%)
        p
          font-size: 30px
          color: #333333
          margin-top 10px
  .preview
    bg('icon-preview-y.png')
    width 138px
    height 148px
    position fixed
    top 40%
    right 8px
    z-index 99
  .limit-times
    color #FFF
    background #FF6275
    height 68px
    line-height 68px
    position relative
    span:nth-child(1)
      bg('icon-warn.png')
      width 30px
      height 28px
      display block
      position absolute
      top 50%
      transform translateY(-50%)
      left 32px
    p:nth-child(2)
      font-size 26px
      margin-left 70px
      f13()
    span:nth-child(3)
      bg('icon-close.png')
      width 22px
      height 22px
      display block
      position absolute
      top 50%
      transform translateY(-50%)
      right 12px
  .content
    flex 1
    padding 0 30px
    overflow hidden
    margin-top 32px
    .edit-banner-bg
      border-radius 10px
      width 690px
      height 300px
      text-align center
      position relative
      
      .banner
        bg('icon-add-banner.png')
        width 100%
        height 100%
        display block
      img
        width 100%
        height 100%
        display block
      >div
        i
          position absolute
          width 72px
          height 72px
          bg('icon-edit-y.png')
          bottom 12px
          right 96px
        i:nth-child(2)
          bg('icon-delete-y.png')
          right 12px
  .form-first
    >div
      flex-center()
      textarea
        width 500px
        bd-b(#ccc, width = 1px)
        margin-left 25px
        height 85px
        padding-top 20px
  .form-third
    >div
      span:nth-child(3)
        color #BCBCBC
  .form-list
    padding 18px 0
    >div
      f14()
      span:nth-child(1)
        color $color-orange
      span:nth-child(2)
        color #151515
        width 144px
        display inline-block
      .choose-color
        width 104px
        height 68px
        display inline-block
        background $color-white
        bd(#EEEBEB, width = 1px)
        position relative
        margin 0 0 0 20px
        img
          width 32px
          height 24px
          display block
          position absolute
          top 50%
          left 50%
          transform translate(-50%, -50%)
      span:nth-child(4)
        background #FBEA97
        border none
      span:nth-child(5)
        background #EF6370
        border none
      u
        font-style normal
        color  #4A90E2
        // margin-left 75px
        f14()
    .add-details-bg
      width 692px
      height 360px
      border-radius 10px
      position relative
      margin-top 24px
      img
        position absolute
        width 100%
        height 100%
        display block
        left 0
        top 0
      .add-details-pic
        width 100%
        height 100%
        display block
        position absolute
        top 0.32rem
  .annnoucement-wrapper
    border-radius(8px)
    background #f4f4f4
    border-radius(8px)
    padding 40px 20px
    padding-bottom 24px
    margin-bottom 40px
  .form-second
    flex-align-item()
    >div
      flex-center()
      span:nth-child(2)
        margin-left 10px
  .form-fifth
    flex-f()
    >div
      f14()
      color #151515
    span:nth-child(1)
      color #ff8a00
      background none
    >div:nth-child(2)
      position relative
      flex-f-align()
      margin-left 28px
      img:nth-child(1)
        margin-right 8px
        &.check
          bg('icon-chooseCircle-y.png')
          width 36px
          height 36px
          border-radius 50%
          border 0
        &.uncheck
          bg('icon-unchoose-y.png')
          width 36px
          height 36px
          border-radius 50%
      span:nth-child(4)
        width 28px
        height 18px
        box-sizing content-box
        padding 10px
        &.pullDown
          bg('icon-pullDown-y.png')
          background-origin content-box
          background-clip content-box
        &.pullUp
          bg('icon-pullUp-y.png')
          background-origin content-box
          background-clip content-box
  .identity-container
    background #FFF8F0
    f14()
    margin 20px -30px 0
    .identity-wrapper
      padding 20px 60px
      h1
        color #999
        line-height 40px
        margin-bottom 40px
      .identity-list
        flex-align-item()
        flex-wrap wrap
        li
          f13()
          min-width 48%
          max-width 48%
          height 60px
          margin-bottom 28px
          flex-center()
          border-radius(100px)
          background-color $color-white
          border 1px solid #E9E9E9
          &.active
            background-color #FFF1E0
            bd(#FF8A00, width = 1px)
  // 身份选择
  // .choose-list-all
  //   background #FFF8F0
  //   height 476px
  //   f14()
  //   margin-top 22px
  //   width 100%
  //   p
  //     margin-left 20px
  //     padding-top 22px
  //   .choose-list
  //     margin-top 40px
  //     >div
  //       float left
  //       width 45%
  //       height 62px
  //       line-height 62px
  //       text-align center
  //       border-radius 200px
  //       margin 14px 2.5%
  //       background-color $color-white
  //       border none
  //       &.active
  //         background-color #FFF1E0
  //         bd(#FF8A00, width = 1px)
  .button
    width 100%
    height 88px
    line-height 88px
    tc()
    f16()
    color $color-white
    flex-f-align()
    > div
      height 100%
      flex 1
    .button-draft
      background #FEC785
    .button-publish
      background $color-orange
      &.unclick
        background #D4D4D4
  .failcgsPop
    >div
      width 560px!important
      bd(#979797)
      border-radius(20px)
      overflow unset
      text-align center
      f14()
      background-color #FFD7A7
      >div
        padding 0 0 96px
        // position relative
        .poptitle-bg
          bg('icon-mask-y.png')
          width 142px
          height 140px
          position absolute
          z-index 999
          left 50%
          top -70px
          transform translateX(-50%)
        img
          width 560px
          height 230px
          display block
          position relative
          top 0
          left 0
        .pop-des
          color #666
          // width 478px
          height 136px
          position absolute
          top 92px
          left 50%
          transform translateX(-50%)
          width 100%
        .goOpen
          width 100%
          position absolute
          bottom 28px
          color #FF8A00
          left 50%
          transform translateX(-50%)
          u
            f16()
            color #D0021B
        .icon-close
          bg('icon-close-y.png')
          width 56px
          height 56px
          position absolute
          bottom -112px
          left 50%
          transform translateX(-50%)
  .failmanagePop
    >div
      >div
        .poptitle-bg
          bg('icon-activ-y.png')
          width 142px
          height 140px
</style>

<template>
  <div class="announcement-detail-container">
    <base-header :title="headerTitle" :interceptBack='true' @headerBack="goback"></base-header>
    <div class="announcement-detail">
      <base-scroll
      :has-more="true"
      :before-scroll="true"
      @beforeScroll="beforeScroll">
        <div id="market-annnoucement"></div>
        <div class="detail-user" :style="[textColor]">
          <p>推送用户：</p>
          <p>
            <span v-for="(item, index) in identityList" :key="index">{{ item.title }}<i v-show="identityList.length !== index + 1">、</i> <i v-show="identityList.length === index + 1"></i></span>
          </p>
        </div>
        <div class="detail-user" :style="[textColor]">
          <p>发布时间：</p>
          <p>{{ shartData }}</p>
        </div>
        <div ref="placeholder"></div>
      </base-scroll>
    </div>
    <base-footer @footerSubmit="goEdit" text='编辑'></base-footer>
  </div>
</template>

<script>
import { themeBackgroundData } from 'data/backgroundData'
import { patch, createVnode } from 'plugins/snabbdom'
import { sliceChar } from 'commons'
export default {
  data () {
    return {
      flag: false,
      announceDetail: '',
      // announceDetail: JSON.stringify(data),
      background: '#ffffff',
      Vnode: '',
      soltTitle: '',
      shartData: '',
      identityList: [],
      isBeforeScroll: true
    }
  },
  computed: {
    id () {
      return this.$route.query.id
    },
    headerTitle () {
      return sliceChar(this.$route.query.title, 6)
    },
    backgroundColor () {
      return {
        background: this.background
      }
    },
    textColor () {
      return {
        color: themeBackgroundData[this.background]
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getData().then(() => {
        let wrapper = document.getElementById('market-annnoucement')
        this.Vnode = wrapper
        let { announceDetail, background } = this
        if (announceDetail) {
          this.vnode2html(announceDetail, background)
        }
      })
    })
  },
  methods: {
    async getData () {
      let url = 'adv/noticesDetail'
      let obj = {
        id: this.id
      }
      await this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          /* eslint-disable */
          let { content, rejected_reason, identity, created_at, is_delete, template } = res.data
          this.background = template
          // this.identityList = identity
          if (!identity.length) {
            this.$http('adv/getPushGroup').then(res => {
              if (res.code === this.$ok) {
                res.data.list.forEach(item => {
                  if (item.num !== 0) {
                    this.identityList.push(item)
                  }
                })
              }
            })
          } else {
            this.identityList = identity
          }
          this.announceDetail = content
          this.soltTitle = rejected_reason
          this.shartData = created_at.split(' ')[0]
          if (is_delete !== 1) {
            this.$refs.soltPopup.show()
          }
          this.flag = true
          /* eslint-enable */
        }
      })
    },
    // vnode2Html
    vnode2html (data, themeBackground) {
      let vnode = createVnode('div#market-annnoucement', JSON.parse(data), themeBackground)
      patch(this.Vnode, vnode)
    },
    goEdit () {
      this.$router.push({ path: '/edit-announcement', query: { id: this.id, showDraft: 1 } })
    },
    goback () {
      this.$router.push({ path: '/market-announcement', query: { showDraft: 1, fromNative: 1 } })
    },
    beforeScroll () {
      let dom = this.$refs.placeholder
      dom.style.height = dom.offsetHeight + 1 + 'px'
    }
  }
}
</script>

<style lang="stylus">
@import "~common/stylus/mixin"
.announcement-detail-container
  height 100%
  flex-col-btw()
  overflow hidden
  .announcement-detail
    overflow hidden
    padding 20px 30px 0
    height 100%
    flex 1
    p
      font-size: 28px
      line-height 40px
    .detail-user
      margin-top 20px
      display flex
      font-size: 28px
      p:first-child
        width 25%
      p:last-child
        width 75%
</style>

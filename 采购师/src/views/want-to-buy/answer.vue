<template>
  <div class="answer">
    <div class="answer-area">
      <textarea name="" id="" cols="30" rows="10" placeholder="回答问题" v-model="text" maxlength="100"></textarea>
      <span><span style="color: #FF8D00;">{{text.length}}</span>/100</span>
    </div>
    <div class="recommend" @click="jump">
      <div class="left">
        <img src="./images/rec.png" alt="">
        <span v-if="!recGoods">推荐商品</span>
      </div>
      <img src="./images/arrow.png" alt="" v-if="!recGoods">
      <div v-if="recGoods && recGoods.goodsInfo[0]" class="goods">
        <!-- {{recGoods.title}} -->
        {{recGoods.goodsInfo[0].title}}
        <img src="./images/close.png" alt="" @click.stop="clear">
      </div>
    </div>
    <footer class="ipone-x-absolute-bottom1" @click="submit">
      提交
    </footer>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import {dev} from 'native'
export default {
  data () {
    return {
      text: ''
    }
  },
  mounted () {
    window.nav_alert_back = this.nav_alert_back
    window.back = this.back
    this.nav()
    if (this.$store.state.commentText) {
      this.text = this.$store.state.commentText
    }
    if (this.$route.query.name) {
      let currentDev = dev()
      try {
        if (currentDev === 'Android') {
          window.android.setTitle('回复' + this.$route.query.name)
        } else if (currentDev === 'iOS') {
          window.webkit.messageHandlers.setTitle.postMessage('回复' + this.$route.query.name)
        }
      } catch (e) {
        console.warn(e)
      }
    } else {
      let currentDev = dev()
      try {
        if (currentDev === 'Android') {
          window.android.setTitle('我来回答')
        } else if (currentDev === 'iOS') {
          window.webkit.messageHandlers.setTitle.postMessage('我来回答')
        }
      } catch (e) {
        console.warn(e)
      }
    }
  },
  methods: {
    ...mapMutations(['SET_RECGOODS', 'SET_COMMENT_TEXT']),
    jump () {
      this.SET_COMMENT_TEXT(this.text)
      this.$router.push({path: 'relate-goods'})
    },
    back () {
      this.SET_RECGOODS(null)
      this.SET_COMMENT_TEXT('')
      this.$router.back()
    },
    nav () {
      let param = {
        'left': [{
          'title': 'back',
          'function': 'nav_alert_back()' // 默认
        }]
      }
      let currentDev = dev()
      try {
        if (currentDev === 'Android') {
          window.android.navigationItem(JSON.stringify(param))
        } else if (currentDev === 'iOS') {
          window.webkit.messageHandlers.navigationItem.postMessage(param)
        }
      } catch (e) {
        //
      }
    },
    nav_alert_back () {
      let params = {
        'title': '提示',
        'message': '您确认放弃回复吗?',
        'confirm': 'back()',
        'cancel': ''
      }
      let currentDev = dev()
      try {
        if (currentDev === 'Android') {
          window.android.nativeAlterBack(JSON.stringify(params))
        } else if (currentDev === 'iOS') {
          window.webkit.messageHandlers.nativeAlertBack.postMessage(params)
        }
      } catch (e) {
        console.warn(e)
      }
    },
    clear () {
      this.SET_RECGOODS(null)
    },
    submit () {
      if (!this.text.trim()) {
        this.$t('回答内容不能为空', 'middle')
        return
      }
      if (/^1[3-9][0-9]{9}$/.test(this.text.trim())) {
        this.$t('回答内容不能含有手机号', 'middle')
        return
      }
      this.$vux.loading.show({
        text: '加载中...'
      })
      if (this.$route.query.name) {
        this.$http('asktobuy/replyComment', {id: this.$route.query.id, reply_txt: this.text, goods_id: this.recGoods ? this.recGoods.goods_id : ''}).then(res => {
          this.$vux.loading.hide()
          if (res.code === 200) {
            this.SET_RECGOODS(null)
            this.SET_COMMENT_TEXT('')
            this.$router.back()
          } else {
            this.$t(res.message, 'middle')
          }
        })
      } else {
        this.$http('asktobuy/commentOper', {ask_id: this.$route.query.id, comment_txt: this.text, goods_id: this.recGoods ? this.recGoods.goods_id : ''}).then(res => {
          this.$vux.loading.hide()
          if (res.code === 200) {
            this.SET_RECGOODS(null)
            this.SET_COMMENT_TEXT('')
            this.$router.back()
          } else {
            this.$t(res.message, 'middle')
          }
        })
      }
    }
  },
  computed: {
    ...mapGetters(['recGoods', 'commentText'])
  }
}
</script>

<style lang="stylus" scoped>
.answer-area
  border-top 24px solid #F8F8F8
  border-bottom 24px solid #F8F8F8
  padding 24px 32px 40px 32px
  position relative
  textarea::-webkit-input-placeholder
    color #ccc
  textarea
    height 260px
    padding 20px
    font-size 24px
    color #333
    width 100%
    border 1px solid #CCC;/*no*/
    border-radius 10px
  >span
    position absolute
    right 52px
    bottom 60px
    color #CCC
.recommend
  display flex
  justify-content space-between
  align-items center
  margin-top 42px
  padding-left 32px
  padding-right 30px
  .left
    display flex
    align-items center
    font-size 26px
    color #a6a6a6
    img
      width 38px
      margin-right 26px
  >img
    width 14px
    height 28px
  .goods
    height 60px
    line-height 60px
    flex 1
    background #f8f8f8
    position relative
    color #a6a6a6
    font-size 26px
    >img
      position absolute
      width 32px
      height 32px
      right -16px
      top -16px
footer
  position fixed
  width 100%
  height 98px
  left 0
  bottom 0
  line-height 98px
  text-align center
  color #FFF
  background rgb(255, 141, 0)
  font-size 32px
</style>

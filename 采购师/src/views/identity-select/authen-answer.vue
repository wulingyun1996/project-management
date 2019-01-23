<template>
  <div class="authen-answer-container">
    <div class="authen-wrapper">
      <div class="authen-answer-progress">
        <base-step
          :stepNum='stepNum'
          :currentIndex='index'>
        </base-step>
      </div>
      <swiper
        :show-dots='false' height="400px"
        :min-moving-distance="5000"
        v-model="currentIndex">
        <swiper-item class="black" v-for="(item, index) in questionsList" :key="item.id">
          <div class="authen-answer-body">
            <div class="authen-answer-title">
              <div class="title">{{ index + 1 }}.</div>
              <p>{{ item.question }}</p>
            </div>
            <div class="authen-answer-choice">
              <div class="form-group" v-for="(option, index) in item.option" :key="index">
                <label :for="option.id">
                  <span :class="{active: item.id + '|' + option.currentAnswer === answer}"></span>
                  <input :id="option.id" type="radio" :value="item.id + '|' + option.currentAnswer" v-model="answer">
                  <i v-show="index === 0">A、</i>
                  <i v-show="index === 1">B、</i>
                  <i v-show="index === 2">C、</i>
                  <i v-show="index === 3">D、</i>
                  {{ option.currentAnswer }}
                </label>
              </div>
            </div>
          </div>
        </swiper-item>
      </swiper>
    </div>
    <div class="authen-button" :class="{ 'm-34': $isX }" @click="answerNextQues">
      <span v-show="index < 5">下一题</span><span v-show="index >= 5">答题完成</span> ({{ index }} / 5)
    </div>
    <base-popup-pass
      ref="pass"
      @comfirm='goHome'>
    </base-popup-pass>
    <base-popup-nopass
      ref="nopass"
      @changeAuthenType="changeAuthenType"
      @refreshQues='refreshQues'>
    </base-popup-nopass>
  </div>
</template>

<script>
import BaseStep from 'components/step'
import BasePopupNopass from 'components/popup/popup-nopass'
import BasePopupPass from 'components/popup/popup-pass'
import { Swiper, SwiperItem } from 'vux'
import { nativeGoHome, invokeNativeMethod, authenAnswerAlert } from 'native'
import { mapState } from 'vuex'
import { toJson } from 'common'
export default {
  data () {
    return {
      currentIndex: 0,
      stepNum: 5,
      answer: '',
      questionsList: [],
      answerList: [],
      roleInfo: {}
    }
  },
  computed: {
    ...mapState(['authenRole']),
    index () {
      return this.currentIndex + 1
    },
    answerLength () {
      return this.answerList.length >= 5
    },
    isUnauthendOldRole () {
      return this.roleInfo.is_old === 1 && this.roleInfo.audit_status === 1
    }
  },
  created () {
    this.getQuestions()
    this.queryIdentityRole()
    authenAnswerAlert()
  },
  methods: {
    // 查询是否是新老用户
    queryIdentityRole () {
      let url = 'isOldBuyer'
      this.$http(url).then(res => {
        if (res.code === this.$ok) {
          this.roleInfo = res.data
        }
      })
    },
    getQuestions () {
      let url = 'identityQuestion'
      let obj = {
        identity_form: 2,
        title: this.authenRole.seletedIdentity.join()
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          let id = 0
          res.data.forEach((item, index) => {
            let arr = []
            item.options.split('|').forEach(item => {
              let obj = Object.create(null)
              obj.id = id
              obj.currentAnswer = item
              arr.push(obj)
              id++
            })
            item.option = arr
          })
          this.questionsList = res.data
        }
      })
    },
    answerNextQues () {
      if (!this.answer) {
        this.$t('请选择答案', 'middle')
        return
      }
      if (this.index < this.stepNum) {
        this.currentIndex++
        this.answerList.push(this.answer)
        this.answer = ''
        return
      }
      if (this.answerLength) return
      this.answerList.push(this.answer)
      this.submitAnswer()
    },
    submitAnswer () {
      // eslint-disable-next-line
      let [question_1, question_2, question_3, question_4, question_5] = this.answerList
      let url = 'identityAuth'
      let obj = {
        question_1,
        question_2,
        question_3,
        question_4,
        question_5
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          if (res.data.score < 4) {
            this.$refs.nopass.show()
            return
          }
          if (this.isUnauthendOldRole) invokeNativeMethod('setIsOld', 2)
          invokeNativeMethod('navigationItem', JSON.stringify({}))
          // 清空即时保存内容
          invokeNativeMethod('nativeSaveData', toJson({}))
          this.$refs.pass.show()
        }
      })
    },
    refreshQues () {
      this.initStatus()
      this.getQuestions()
    },
    changeAuthenType () {
      this.$router.replace({ name: 'AuthenType' })
    },
    initStatus () {
      this.currentIndex = 0
      this.answer = ''
      this.answerList.splice(0)
    },
    goHome () {
      invokeNativeMethod('setIdentityAuth', 2)
      nativeGoHome()
    }
  },
  components: {
    BaseStep,
    BasePopupNopass,
    BasePopupPass,
    Swiper,
    SwiperItem
  }
}
</script>

<style lang='stylus' scoped>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.authen-answer-container
  height 100%
  overflow hidden
  flex-col-btw()
  .authen-wrapper
    flex 1
    .authen-answer-progress
      height 220px
      flex-align-item()
      justify-content center
    .authen-answer-body
      padding 0 44px
      .authen-answer-title
        flex-f()
        color $color-4a
        margin-bottom 36px
        .title
          width 66px
          fz(24px)
          line-height 66px
          font-weight 700
        p
          f16()
          line-height 48px
          padding-top 14px
      .authen-answer-choice
        padding-left 140px
        .form-group
          flex-col()
          margin-bottom 40px
          label
            f16()
            color $color-4a
            flex-f()
            // align-items center
            line-height 44px
            span
              wh(32px)
              border-radius(50%)
              bd($color-c)
              margin-top 2px;/*no*/
              margin-right 24px
              &.active
                bg('choiced.png')
                border none
            i
              font-style normal
  .authen-button
    foot-flex()
</style>

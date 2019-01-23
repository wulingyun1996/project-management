<template>
  <div>
    <div class="me-answer">
      <div class="content">
        <div class="split"></div>
        <div class="answer-text">
          <group>
            <x-textarea :max="100" placeholder="回答问题" @on-change="change(value)" @on-blur="onEvent(value)" v-model="value"></x-textarea>
          </group>
        </div>
        <div class="split"></div>
        <div class="answer-recommond">
          <router-link tag="div" to="/related-good" class="recommond recommond-shop" v-show="!selectList.length">
            <i></i>
            <div>推荐商品</div>
          </router-link>
          <div class="recommond recommond-text" v-for="item in selectList">
            <i></i>
            <router-link tag="div" :to="{path:'/related-good', query:{id:item.id}}">{{item.title}}</router-link>
            <span @click="deleteGood(selectList)"></span>
          </div>
        </div>
      </div>
      <div class="footer" :class="{'active':addClass === true}" @click="run">
        <h5>提交</h5>
      </div>
      <pop ref="mess" :title="title"></pop>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import {mapMutations} from 'vuex'
  import {closeAnswer} from 'api/navtive'
  import {loadDataPost, STATUS_OK} from 'api/common'
  import {XTextarea, Group} from 'vux'
  import Pop from 'base/pop/pop'
  export default {
    data() {
      return {
        show: true,
        value: '',
        addClass: false,
        selectList: [],
        title: ''
      }
    },
    created() {
      closeAnswer()
      this.initTitle()
      sessionStorage.setItem('buyId', this.$route.query.id)
    },
    methods: {
      initTitle() {
        this.value = sessionStorage.getItem('textInput') || ''
        let arr = []
        let choose = JSON.parse(sessionStorage.getItem('chooseGood'))
        if (choose) {
          arr.push(choose)
        }
        this.selectList = arr
      },
      onEvent (value) {
        if (value) {
          sessionStorage.setItem('textInput', value)
        } else {
          this.addClass = false
        }
      },
      change(value) {
        if (value) {
          this.addClass = true
        }
      },
      run() {
        if (!this.value.trim()) {
          this.title = '内容不能为空'
          this.$refs.mess.show()
          this.$refs.mess.hide()
          return
        }
        let URL = 'sale/saveAnswer'
        let obj = {
          id: this.$route.query.id,
          goodsId: this.selectList.length ? this.selectList[0].id : '',
          txt: this.value.trim()
        }
        loadDataPost(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            sessionStorage.removeItem('textInput')
            sessionStorage.removeItem('chooseGood')
            this.SUBMIT_ID(1)
            this.$router.back()
          } else {
            this.title = res.message
            this.$refs.mess.show()
            this.$refs.mess.hide()
          }
        })
      },
      deleteGood() {
        this.selectList = []
      },
      ...mapMutations(['SUBMIT_ID'])
    },
    components: {
      XTextarea,
      Group,
      Pop
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variable.styl"
  .me-answer
    width: 100%
    height: 100%
    background: $color-white
    z-index: 201
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: 0
  .split
    width: 100%
    height: 24px
    background: $color-body
  .answer-text
    width: 100%
    padding: 24px 32px
    background: $color-white
    position: relative
    >div
      width: 100%
  .answer-recommond
    flex: 1
    background: $color-white
    padding: 24px 7px 0 32px
    .recommond
      font-size: 26px;/*px*/
      color: $color-a6
      flex-box-center()
      i
        display: block
        margin-right: 28px
        width: 36px;/*px*/
        height: 36px;/*px*/
        background: url('rec.png') no-repeat left center
        background-size: 100% auto
      >div
        flex: 1
        text-over(1)
        height: 76px;/*px*/
        line-height: 76px;/*px*/
    .recommond-shop
      position: relative
      &:after
        content: ''
        width: 13px;/*px*/
        height: 24px;/*px*/
        position: absolute
        transform: translateY(-50%)
        top: 50%
        right: 25px
        background-image: url('arrow.png')
        background-size: 100% auto
    .recommond-text
      position: relative
      padding-right: 40px
      >div
        background: $color-body
        padding: 0 116px 0 20px
      span
        display: block
        width: 30px;/*px*/
        height: 30px;/*px*/
        border-radius: 50%
        background: $color-9 url('x.png') no-repeat center center
        background-size: 14px 14px;/*px*/
        position: absolute
        right: 30px
        top: -5px
  .footer
    width: 100%
    line-height: 98px;/*px*/
    text-align: center
    background: $color-bc
    font-size: 36px;/*px*/
    color: $color-white
    position: fixed
    left: 0
    bottom: 0
    pointer-events: none
    &.active
      background: $color-orange
      pointer-events: auto
</style>

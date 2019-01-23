<template>
  <div class="condition">
    <div class="box">
      <div class="set">
        <i></i>&nbsp;<span>除平台基本认证条件外，商家还可设置本店铺自定义申请条件。</span>
        <p>设置后，在本店铺的采购师特约卡申请页面中均可展示该店铺申请条件内容</p>
      </div>
    </div>
    <div class="txt">
      <textarea v-model="condition" maxlength="50">{{ConditionList.auth_condition}}</textarea>
      <span><i>{{lengths}}</i>/50</span>
    </div>
    <div class="btn" @click="save" :class="{ active: isActive }">保存
    </div> 
  </div>
</template>
<script type="text/ecmascript-6">
  import {nativeBackBase} from 'api/init'
  import { loadData, STATUS_OK } from 'api/common'
  export default {
    data() {
      return {
        condition: '',
        ConditionList: []
      }
    },
    computed: {
      isActive() {
        return this.condition
      },
      lengths() {
        return this.condition.replace(/\n|\r/g, '  ').length
      }
    },
    created() {
      this.getCondition()
    },
    beforeRouteEnter (to, from, next) {
      nativeBackBase()
      next()
    },
    methods: {
      // 获取接口
      getCondition() {
        let URL = 'getCardCondition'
        loadData(URL).then((res) => {
          if (res.code === STATUS_OK) {
            this.ConditionList = res.data
            this.condition = res.data.auth_condition
          } else {
            console.log('lose')
          }
        })
      },
      // 设置接口
      save() {
        if (!this.condition.trim()) {
          this.$vux.toast.text('内容不能为空', 'middle')
          setTimeout(() => {
            this.$vux.toast.hide()
          }, 2000)
          return
        }
        let URL = '/specialCardCondition'
        let obj = {
          auth_condition: this.condition.trim()
        }
        if (this.condition === '') {
          this.$router.push('/special-card')
        } else {
          let URL = '/specialCardCondition'
          let obj = {
            auth_condition: this.condition
          }
          loadData(URL, obj).then((res) => {
            if (res.code === STATUS_OK) {
              this.$router.replace('/special-card')
            } else {
              console.log('lose')
            }
          })
        }
        loadData(URL, obj).then((res) => {
          if (res.code === STATUS_OK) {
            this.getCondition()
            this.$router.push('/special-card')
          } else {
            console.log('lose')
          }
        })
      }
    },
    components: {
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
  @import "~common/stylus/variable.styl"
  .condition
    background: $color-white
    height: 100vh
  .box
    padding: 0 25px
    background: $color-f4
    .set 
      padding: 30px 18px 30px 0
      line-height: 30px
      i
        background: url('notice.png') no-repeat
        background-size: 100% auto
        display: inline-block
        width: 25px;/*px*/
        height: 25px;/*px*/
      span,p
        color: $color-ab
        font-size: 26px;/*px*/
        text-indent: 35px
  .txt
    padding: 40px 33px 0 33px
    background: $color-white
    position: relative
    textarea
      width: 100%
      min-height: 260px;/*px*/ 
      display: block
      position: reative
      border: 1px solid $color-bc;/*no*/ 
      padding: 24px
      font-size: 28px;/*px*/
      color: $color-3
    span
      font-size: 26px;/*px*/
      color: $color-bc
      position: absolute
      right: 62px
      bottom: 25px
      i
        color: $color-orange
        font-style: normal
  .btn  
    position :fixed
    bottom :0
    left :0
    right: 0
    height: 88px
    line-height: 88px
    text-align :center
    background :$color-bc
    font-size :36px
    color: $color-white
    &.active
      background :$color-orange  
  .weui-toast
    top: 50%
    .weui-toast__content 
      font-size: 32px;/*px*/
      padding: 20px!important
</style>
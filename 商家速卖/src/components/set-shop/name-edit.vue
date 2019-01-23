<template>
  <div class="name-edit-container">
    <base-header><span  class='finished' @click='sellNameFinished'>完成</span></base-header>
    <div class='search'>
      <input type='text'
      ref="input"
      text="修改店铺名称"
      placeholder="最多可输入15个字哦~"
      maxlength="15"
      v-model="storeName"
      autofocus="autofocus"
      v-focus
      name="search" 
      >
      <span class='num'><b>{{storeName.length}}</b>/15</span>
      <img class='clear' src='./close.png' v-show='isShow'  @click='clearName'>
    </div>
  </div>
</template>
<script>
import { loadData, STATUS_OK } from 'api/common'
export default {
  data() {
    return {
      storeName: ''
    }
  },
  created() {
    this.getname()
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.input.focus()
    })
  },
  methods: {
    getname() {
      let shopName = this.$route.params.id
      console.log(typeof shopName)
      if (shopName === 'null') {
        this.storeName = ''
      } else if (shopName === 'undefined') {
        this.storeName = ''
      } else {
        this.storeName = shopName
      }
    },
    clearName() {
      if (this.storeName) {
        this.storeName = ''
      }
    },
    async sellNameFinished() {
      if (this.storeName.trim()) {
        let URL = 'shop/editShop'
        let obj = {
          shop_name: this.storeName
        }
        let res = await loadData(URL, obj)
        if (res.code === STATUS_OK) {
          this.$router.back()
        }
      } else {
        this.$vux.toast.text('请输入店铺名称', 'middle')
        return false
      }
    }
  },
  directives: {
    focus: {
      inserted (el) {
        el.focus()
      }
    }
  },
  computed: {
    isShow () {
      return !!this.storeName
    }
  }
}
</script>
<style lang="stylus">
  @import '~common/stylus/mixin'
  @import '~common/stylus/variable'
  .name-edit-container
    width 100%
    height 100%
    text-align center
    .finished
      color #4A90E2
    .search
      width 700px
      height 58px
      margin-left 24px
      margin-top 37px
      position relative
      input
        width 100%
        height 100%
        border 2px solid #CCCCCC
        border-radius 29px
        font-size 28px
        padding-left 32px
      .num
        width 52px
        height 34px
        color #999999
        bottom -100%
        right 0
        position absolute
        color #ccc
        b
          color #FF8A00 
      .clear
        width 32px
        height 32px
        position absolute
        top 50%
        transform translateY(-50%)
        right 20px
</style>

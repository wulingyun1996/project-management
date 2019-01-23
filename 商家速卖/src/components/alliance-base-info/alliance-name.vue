<template>
  <div class="alliance-name-container">
    <base-header><span  class='finsined' @click='editNameFinished'>完成</span></base-header>
    <div class='search'>
      <input type='text'
       ref="input"
       text="修改商圈名称"
       placeholder="请输入商圈名称（2-15个文字）"
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
import { mapMutations } from 'vuex'
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
    ...mapMutations(['ADDALLIANCENAME']),
    getname() {
      let allienceName = this.$route.params.id
      if (allienceName === 'null') {
        this.storeName = ''
      } else if (allienceName === 'undefined') {
        this.storeName = ''
      } else {
        this.storeName = allienceName
      }
    },
    clearName() {
      if (this.storeName) {
        this.storeName = ''
      }
    },
    editNameFinished() {
      let regName = /^[\u4e00-\u9fa5]{2,15}$/
      let regAlliRes = regName.test(this.storeName)
      if (this.storeName.trim() && regAlliRes) {
        this.editBaseInfo()
      } else if (!this.storeName.trim()) {
        this.$vux.toast.text('商圈名称不能为空', 'middle')
        return false
      } else {
        this.$vux.toast.text('请输入正确的商圈名称格式', 'middle')
        return false
      }
    },
    async editBaseInfo () {
      let url = 'apply/editUnionInfo'
      let obj = {
        unionName: this.storeName
      }
      let res = await this.$http(url, obj)
      if (res.code === this.$ok) {
        this.allianceName = this.storeName
        this.$router.back()
        return
      } else if (res.code === 400) {
        this.$vux.toast.text('该商圈名称已存在', 'middle')
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
  .alliance-name-container
    width 100%
    height 100%
    text-align center
    .finsined
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

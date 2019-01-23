<template>
  <div class="container">
    <select-nav class="nav"></select-nav>
    <router-view class="cont_list"></router-view>
  </div>
</template>

<script>
  import SelectNav from './select-nav'
  export default {
    data() {
      return {
        //
      }
    },
    components: {
      SelectNav
    },
    beforeRouteEnter (to, from, next) {
      if (from.name === 'shop-statistic') {
        next(vm => {
          vm.$store.commit('SetShowRecommend', true)
        })
      } else {
        next(vm => {
          vm.$store.commit('SetShowRecommend', false)
        })
      }
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
@import "~common/stylus/variable.styl"
.container
  height 100%
  overflow hidden
  flex-direction column
  background #f8f8f8
  padding-top 88px
.nav
  margin-top -88px
.cont_list
  height 100%
</style>


<template>
  <div class="bread-crumb-container">
    <div class="bread-crumb-icon" @click="toggleSiderBar">
      <svg t="1492500959545" class="svg-icon hamburger" :class="{'active': isToggle}" style="" viewBox="0 0 1024 1024"
      version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1691" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64">
        <path d="M966.8023 568.849776 57.196677 568.849776c-31.397081 0-56.850799-25.452695-56.850799-56.850799l0 0c0-31.397081 25.452695-56.849776 56.850799-56.849776l909.605623 0c31.397081 0 56.849776 25.452695 56.849776 56.849776l0 0C1023.653099 543.397081 998.200404 568.849776 966.8023 568.849776z"
          p-id="1692">
        </path>
        <path d="M966.8023 881.527125 57.196677 881.527125c-31.397081 0-56.850799-25.452695-56.850799-56.849776l0 0c0-31.397081 25.452695-56.849776 56.850799-56.849776l909.605623 0c31.397081 0 56.849776 25.452695 56.849776 56.849776l0 0C1023.653099 856.07443 998.200404 881.527125 966.8023 881.527125z"
          p-id="1693">
        </path>
        <path d="M966.8023 256.17345 57.196677 256.17345c-31.397081 0-56.850799-25.452695-56.850799-56.849776l0 0c0-31.397081 25.452695-56.850799 56.850799-56.850799l909.605623 0c31.397081 0 56.849776 25.452695 56.849776 56.850799l0 0C1023.653099 230.720755 998.200404 256.17345 966.8023 256.17345z"
          p-id="1694">
        </path>
      </svg>
    </div>
    <div class="bread-crumb-body">
      <el-breadcrumb class="breadcrumb-wrapper">
        <transition-group name="breadcrumb">
          <el-breadcrumb-item
            v-for="(item, index) in breadCrumbList"
            :key="item.path"
            v-if="item.meta.title">
            <span
              v-if="item.redirect === 'noredirect' || index === breadCrumbList.length - 1"
              class="no-redirect">
              {{ item.meta.title }}
            </span>
            <router-link :to="item.redirect || item.path" v-else>{{ item.meta.title }}</router-link>
          </el-breadcrumb-item>
        </transition-group>
      </el-breadcrumb>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isToggle: false,
      breadCrumbList: []
    }
  },
  created () {
    this.getBreadCrumbList()
  },
  methods: {
    toggleSiderBar () {
      this.isToggle = !this.isToggle
      this.$emit('toggleSiderBar', this.isToggle)
    },
    getBreadCrumbList () {
      let matched = this.$route.matched.filter(item => item.name)
      let first = matched[0]
      if (first && first.name !== 'dashboard') {
        matched = [{ path: '/dashboard', meta: { title: '首页' } }].concat(matched)
      }
      this.breadCrumbList = matched
    }
  },
  watch: {
    $route () {
      this.getBreadCrumbList()
    }
  }
}
</script>

<style lang='stylus' scoped>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.bread-crumb-container
  height 50px
  flex-f-align()
  .bread-crumb-icon
    padding 0 20px
    cursor pointer
   .hamburger
     display inline-block
     width 16px
     height 16px
     transform rotate(0deg)
     transition .38s
     transform-origin 50% 50%
     &.active
      transform rotate(90deg)
  .bread-crumb-body
    .breadcrumb-wrapper
      display inline-block
      f14()
      line-height 50px
      margin-left 10px
      .no-redirect
        color $color-6
        cursor text
</style>

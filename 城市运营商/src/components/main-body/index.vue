<template>
  <div class="main-body-container">
    <base-bread-crumb @toggleSiderBar="toggleSiderBar"></base-bread-crumb>
    <transition name="fade" mode="out-in">
      <router-view :key="key" class="current-body-wrapper"></router-view>
    </transition>
  </div>
</template>

<script>
import BaseBreadCrumb from 'components/bread-crumb'
export default {
  data () {
    return {
      //
    }
  },
  computed: {
    key () {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    }
  },
  methods: {
    toggleSiderBar (payload) {
      this.$emit('toggleSiderBar', payload)
    }
  },
  components: {
    BaseBreadCrumb
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/mixins'
.main-body-container
  flex-col()
  overflow hidden
  position relative
  .current-body-wrapper
    padding 20px
    flex 1
    overflow-y scroll
    position relative
</style>

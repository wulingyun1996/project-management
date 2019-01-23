<template>
  <div class="test-container">
    <!-- <base-nav-list></base-nav-list> -->
    <div class="hidden" style="display: none"></div>
    <div id="demo" class="demo">
      <ul>
        <li
          v-for="(item, index) of demo"
          :key="index"
          v-html="item.content"
          @click="getCurrentTypes"
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import BaseNavList from 'components/nav-list'
import demo from 'data/demo'
export default {
  data () {
    return {
      demo
    }
  },
  created () {
    this.renderIndexBannerDetail()
  },
  methods: {
    renderIndexBannerDetail () {
      demo.forEach(item => {
        let { type, data } = item
        let str = ''
        if (type === 2) {
          data.forEach(child => {
            str += `
              <div class="banner-shop-item" data-id="${child.id}" data-type="${type}">
                <img src="${child.url}" data-id="${child.id}" data-type="${type}"/>
                <h1 data-id="${child.id}" data-type="${type}">${child.shop_name}</h1>
              </div>
            `
          })
          item.content = `<div class="index-banner-shop-container">${str}</div>`
        }
        if (type === 3) {
          data.forEach(child => {
            str += `
              <div class="banner-goods-item" data-id="${child.id}" data-type="${type}">
                <img src="${child.url}" data-id="${child.id}" data-type="${type}"/>
                <h1 data-id="${child.id}" data-type="${type}">${child.title}</h1>
              </div>
            `
          })
          item.content = `<div class="index-banner-goods-container">${str}</div>`
        }
      })
    },
    getCurrentTypes (e) {
      console.log(e)
    }
  },
  components: {
    BaseNavList
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/mixins'
.test-container
  height 100%
.index-banner-goods-container,
.index-banner-shop-container
  flex-f()
  > div
    flex 1
    img
      width 100%
      height auto
      margin-bottom 20px
    h1
      f16()
      text-over(2)
      border-radius(8px)
      background #409EFF
      line-height 60px
      color #fff
</style>

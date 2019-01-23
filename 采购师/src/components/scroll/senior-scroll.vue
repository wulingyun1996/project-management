<template>
  <div ref="wrapper" class="scroll-container">
    <div class="scroll-content">
      <base-loading v-show="hasRefresh"></base-loading>
      <slot></slot>
      <base-loading v-show="hasLoading" title=""></base-loading>
      <base-no-more v-show="!hasMore" :message="message"></base-no-more>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import BaseNoMore from '../no-more/no-more'
import BaseLoading from '../loading/loading'

const DIRECTION_H = 'horizontal'
const DIRECTION_V = 'vertical'

export default {
  data () {
    return {
      //
    }
  },
  props: {
    message: {
      type: String,
      default: '没有更多了'
    },
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: null
    },
    pullup: {
      type: Boolean,
      default: false
    },
    pulldown: {
      type: Boolean,
      default: false
    },
    beforeScroll: {
      type: Boolean,
      default: false
    },
    scrollOver: {
      type: Boolean,
      default: false
    },
    refreshDelay: {
      type: Number,
      default: 20
    },
    direction: {
      type: String,
      default: DIRECTION_V
    },
    scrollPosY: {
      type: Boolean,
      default: false
    },
    hasLoading: {
      type: Boolean,
      default: false
    },
    hasMore: {
      type: Boolean,
      default: false
    },
    hasRefresh: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    setTimeout(() => {
      this._initScroll()
      if (this.$route.meta.hasOwnProperty('y') && this.scrollPosY) {
        this.scroll.scrollTo(0, this.$route.meta.y, 0)
      }
    }, 20)
  },
  methods: {
    _initScroll () {
      if (!this.$refs.wrapper) return
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click,
        scrollY: this.freeScroll || this.direction === DIRECTION_V,
        scrollX: this.freeScroll || this.direction === DIRECTION_H,
        freeScroll: this.freeScroll
      })
      if (this.listenScroll) {
        this.scroll.on('scroll', (pos) => {
          this.$emit('scroll', pos)
        })
      }
      if (this.pullup) {
        this.scroll.on('scrollEnd', (pos) => {
          if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
            this.$emit('scrollToEnd')
          }
        })
      }
      // 滚动位置记录
      if (this.scrollPosY) {
        this.scroll.on('scrollEnd', (pos) => {
          this.$route.meta.y = pos.y
        })
      }
      // 滚动结束触发时间
      if (this.scrollOver) {
        this.scroll.on('scrollEnd', pos => {
          this.$emit('scrollOver', pos)
        })
      }
      if (this.pulldown) {
        this.scroll.on('touchEnd', (pos) => {
          // 下拉动作
          if (pos.y > 50) {
            this.$emit('pulldown')
          }
        })
      }
      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScroll')
        })
      }
    },
    disable () {
      this.scroll && this.scroll.disable()
    },
    enable () {
      this.scroll && this.scroll.enable()
    },
    refresh () {
      this.scroll && this.scroll.refresh()
    },
    scrollTo () {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollBy () {
      this.scroll && this.scroll.scrollBy.apply(this.scroll, arguments)
    },
    scrollToElement () {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this.refresh()
      }, this.refreshDelay)
    }
  },
  components: {
    BaseNoMore,
    BaseLoading
  }
}
</script>
<style scoped lang="stylus">
.scroll-container
  width 100%
  height 100%
</style>

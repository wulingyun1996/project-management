<template>
  <base-senior-popup width="100%" height="100%" ref="helpPopup" class="buy-help-wrapper">
    <base-scroll :has-more="true">
      <div class="help-banner">
        <h1>买卖速配</h1>
        <h2>让买家和卖家完美相遇</h2>
      </div>
      <div class="help-detail">
        <ul>
          <li>
            <h3>
              <span class="icon-answer"></span>
              <span>买卖速配有什么好处？</span>
            </h3>
            <p>买卖速配是为商家推荐采购或工程合作需求，让您轻松获取大量商机，快速与需求方建立联系。</p>
          </li>
          <li>
            <h3>
              <span class="icon-answer"></span>
              <span>买卖速配匹配规则？</span>
            </h3>
            <p>买卖速配是根据店铺主营商品关联性，服务城市，店内商品关键词来进行高效匹配。</p>
          </li>
        </ul>
      </div>
    </base-scroll>
  </base-senior-popup>
</template>

<script>
export default {
  mounted () {
    this.$refs.helpPopup.show()
  }
}
</script>

<style lang="stylus">
@import "~common/stylus/mixin"
.buy-help-wrapper
  .help-banner
    height 260px
    bg('bg-buy.png')
    color #fff
    tc()
    flex-col()
    justify-content center
    h1
      fz(30px)
      line-height 84px
    h2
      fz(20px)
  .help-detail
    padding 0 30px
    li
      padding-top 50px
      h3
        fz(15px)
        flex-f-align()
        color #FF8A00
        margin-bottom 24px
        .icon-answer
          width 40px
          height 34px
          bg('icon-answer.png')
          margin-right 12px
      p
        fz(13px)
        color #666
        line-height 36px
</style>

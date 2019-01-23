<template>
  <div class="role-explain-container">
    <div class="role-explain-wrapper">
      <p class="explain-header">为构建健康的网络环境，维护求购社区的秩序，更好的保障用户权益，提升求购频道的信息质量，更便捷的发布求购信息，高效的撮合采购成交。因此制定本规则。</p>
      <p class="explain-title">平台中采购师角色均可发布求购信息，但且不得发布、传播含有下列内容的信息：</p>
      <p>1.反对宪法所确定的基本原则，危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</p>
      <p>2.煽动民族仇恨、民族歧视，破坏民族团结，或者侵害民族风俗、习惯的；</p>
      <p>3.散布谣言，扰乱社会秩序，破坏社会稳定的；</p>
      <p>4.散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</p>
      <p>5.侮辱或者诽谤他人，侵害他人合法权利的；</p>
      <p>6.含有虚假、有害、胁迫、侵害他人隐私、骚扰、侵害、中伤、粗俗、猥亵、或其它道德上令人反感的内容；</p>
      <p>7.任何形式的广告。</p>
      <p class="explain-bottom">建材采购师可通过主动发现及接受用 户举报发现违规行为，按照本规则进行内容处理和账号处理，多次信息被屏蔽用户将作永久封号处理。</p>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="stylus" scoped>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.role-explain-container
  pf(100%)
  left 0
  top 0
  color #8d8795
  f14()
  padding 0 25px
  height 100%
  overflow-y auto
  background $color-white
  p
    text-indent 2em
    line-height 50px
    &.explain-header
      margin-top 36px
    &.explain-title
      margin-top 72px
    &.explain-bottom
      margin-top 72px
</style>

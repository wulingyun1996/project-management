<template>
  <div class="container">
    <div>问题和意见</div>
    <group>
      <x-textarea v-model="value" :show-counter="true" :max="200" :autosize="true" placeholder="亲告诉我们您的意见和建议，帮助我们改进和提高"></x-textarea>
    </group>
    <input type="text" value="提交" class="foot-btn">
  </div>
</template>

<script>
import { Group, XTextarea } from 'vux'
export default {
  components: {
    Group,
    XTextarea
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/css/mixins';
@import '~@/assets/css/variable';
.container
  padding 30px
.foot-btn
  foot-btn()
</style>

<template>
  <div class="textarea-container">
    <div class="textarea-wrapper">
      <textarea
        class="textarea"
        autocomplete="off"
        autocapitalize="off"
        autocorrect="off"
        :readonly="readonly"
        :disabled="disabled"
        :placeholder="placeholder"
        :maxlength="max"
        v-model="textareaValue"
        @focus="foucs"
        @blur="blur">
      </textarea>
    </div>
    <div class="textarea-counter" v-show="showCounter">
      <span class="count">{{ count }}</span>/<b>{{ max }}</b>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: '',
    placeholder: '',
    max: {
      type: Number,
      default: 10
    },
    showCounter: {
      type: Boolean,
      default: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      textareaValue: this.value
    }
  },
  computed: {
    count () {
      let len = 0
      if (this.textareaValue) {
        len = this.textareaValue.replace(/\n/g, 'aa').length
      }
      return len > this.max ? this.max : len
    }
  },
  methods: {
    foucs () {
      this.$emit('focus')
    },
    blur () {
      this.$emit('blur')
    }
  },
  watch: {
    value (val) {
      this.textareaValue = val
    },
    textareaValue (newVal) {
      if (this.max && newVal && newVal.length > this.max) {
        this.textareaValue = newVal.slice(0, this.max)
      }
      this.$emit('input', this.textareaValue)
      this.$emit('change', this.textareaValue)
    }
  }
}
</script>

<style lang="stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.textarea-container
  position relative
  background $color-white
  .textarea-wrapper
    height 120px
    width 100%
    f14()
    color $color-3
    .textarea
      wh(100%)
      padding 0
      overflow hidden
      background $color-white
  .textarea-counter
    f12()
    color $color-c!important
    tr()
    span.count
      color $color-orange!important
</style>

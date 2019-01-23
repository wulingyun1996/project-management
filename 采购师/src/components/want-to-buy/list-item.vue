<template>
  <div>
    <div class="buy-list" v-for="(item, index) in wantBuy" :key="index">
      <div class="img-box" @click="goNativeWantToBuy(item.author_id)">
        <img :src="item.avatar | smallPic(99, 99)" v-if="item.avatar" />
        <img v-else src="./images/mifeng.png" />
      </div>
      <div class="text-box">
        <div @click="goDetail(item.id, index)" class="text-left">
          <div class="text-top">
            <div class="text-left">
              {{ item.nickname }}
              <span v-if="item.type && show" :class="{'part': item.type === 2}">{{ item.type_name }}</span>
            </div>
            <div class="text-right">{{ item.created_title }}</div>
          </div>
          <h5 :class="{'one': show}">{{ item.title }}</h5>
          <div class="text-p">供应商首选区域：
            <span>{{ item.province_name }}{{ item.city_name }}</span>
          </div>
          <div class="icon-text icon1" v-if="item.goods_num">
            <span>数量</span>{{ item.goods_num }}
          </div>
          <div class="icon-text icon2" v-if="item.deadline">
            <span>截止</span>{{ item.deadline }}
          </div>
          <div class="img-li">
            <img :src="item.image_path | smallPic(300, 300)" v-if="item.image_path" @click.stop="viewBigPic(item.image_path)"/>
            <img :src="item.image_path_two | smallPic(300, 300)" v-if="item.image_path_two" @click.stop="viewBigPic(item.image_path_two)"/>
          </div>
          <!-- <div class="more" v-if="item.content">
            <span>更多描述：</span>{{ item.content }}
          </div> -->
          <div class="status" v-if="item.status === 3" :class="{'has-photo':item.image_path}">
            <img src="./images/over.png" />
          </div>
        </div>
        <div class="gap-wrapper">
          <div class="gap">
            <div v-if="item.follow_count === 0" :class="[item.focus === 1 ? 'gap0 active' : 'gap0']" @click="onFocus(item, index)" ref="gapFocus">关注</div>
            <div v-else :class="[item.focus === 1 ? 'gap0 active' : 'gap0']" @click="onFocus(item, index)" ref="gapFocus">
              {{ item.follow_count > 999 ? '999+' : item.follow_count }}
            </div>
            <div v-if="item.message_count === 0" class="gap1" @click="goDetail(item.id, index)">回复</div>
            <div v-else class="gap1" @click="goDetail(item.id, index)">{{ item.message_count > 999 ? '999+' : item.message_count }}</div>
          </div>
        </div>
      </div>
      <div class="seperate" v-show="index !== wantBuy.length -1"></div>
    </div>
  </div>
</template>
<script type='text/ecmascript-6'>
import { smallPic } from 'common'
import { invokeNativeMethod } from 'native'
export default {
  props: {
    wantBuy: {
      type: Array
    },
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      //
    }
  },
  created () {
    //
  },
  methods: {
    goDetail (id, index) {
      this.$router.push({name: 'WantBuyDetail', query: { id, type: this.type }})
    },
    viewBigPic (imgPath) {
      this.$emit('viewBigPic', imgPath)
    },
    onFocus (item, index) {
      let url = 'asktobuy/focusOn'
      let obj = {
        ask_id: item.id,
        focus: item.focus ? 0 : 1
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          let isFocus = item.focus
          let focusNum = item.follow_count
          if (isFocus) {
            this.$set(item, 'focus', 0)
            this.$set(item, 'follow_count', focusNum - 1)
          } else {
            this.$set(item, 'focus', 1)
            this.$set(item, 'follow_count', focusNum + 1)
          }
        }
      })
    },
    // 默认 -1 是去往我的求购
    goNativeWantToBuy (userId) {
      invokeNativeMethod('needBuyHome', userId)
    }
  },
  filters: {
    smallPic
  }
}
</script>
<style lang='stylus'>
@import '~@/assets/css/variable'
.buy-list {
  background: $color-white;
  padding: 22px 25px 8px 25px;
  display: flex;
  position relative
  margin-bottom: 20px;
  .seperate {
    position absolute
    left 0
    right 0
    bottom -20px
    height 20px
    width 100%
    background $color-f5
  }
  &:last-child {
    margin-bottom: 0;
  }
  .img-box {
    width: 66px; /* px */
    height: 66px; /* px */
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .text-box {
    flex: 1;
    padding-left: 18px;
    position: relative;
    .status {
      width: 134px; /* px */
      height: 112px; /* px */
      position: absolute;
      right: 0;
      top: 26%;
      img {
        width: 100%;
      }
      &.has-photo {
        top: 48%;
      }
    }
    .text-top {
      display: flex;
      justify-content: space-between;
      padding-top: 18px;
      .text-left {
        font-size: 30px; /* px */
        color: $color-3;
        span {
          display: inline-block;
          padding: 0 8px;
          margin-left: 24px;
          font-size: 24px; /* px */
          background-color: $color-orange2;
          line-height: 40px; /* px */
          color: $color-white;

          &.part {
            background-color: #8f98f4;
          }
        }
      }
      .text-right {
        font-size: 24px; /* px */
        color: $color-a6;
      }
    }
    h5 {
      line-height: 1.5;
      color: $color-3;
      font-size: 30px; /* px */
      font-weight: bold;
      margin-top: 32px;
      &.one {
        text-over(1);
      }
    }
    .text-p {
      color: $color-3;
      font-size: 26px; /* px */
      margin-top: 20px;
      margin-bottom: 26px;
      span {
        color: $color-a6;
      }
    }
    .icon-text {
      font-size: 26px; /* px */
      color: $color-5;
      margin-top: 14px;
      line-height: 1.5;
      span {
        color: $color-orange;
        margin-right: 15px;
      }
    }
    .icon1, .icon2 {
      background-size: 28px 28px; /* px */
      background-position: left center;
      background-repeat: no-repeat;
      padding-left: 50px; /* px */
    }
    .icon1 {
      background-image: url('./images/icon1.png');
    }

    .icon2 {
      background-image: url('./images/icon2.png');
      margin-bottom: 22px;
    }

    .img-li {
      display: flex;

      img {
        display: block;
        margin-right: 20px;
        width: 200px; /* px */
        height: 200px; /* px */
      }
    }

    .more {
      margin-top: 28px;
      color: $color-a6;
      font-size: 26px; /* px */
      line-height: 1.3;
      word-break: break-all;

      span {
        color: $color-a6;
      }
    }

    .gap-wrapper {
      flex-box-center();
      justify-content: flex-end;

      .gap {
        display: flex;
        justify-content: flex-end;
        font-size: 24px; /* px */
        color: #909090;

        >div {
          margin-left: 68px;
          padding-left: 58px; /* px */
          line-height: 80px; /* px */
          width: 106px; /* px */
          cursor: pointer;
        }

        .gap0, .gap1 {
          background-position: left center;
          background-repeat: no-repeat;
          background-size: 40px 40px; /* px */
        }

        .gap0 {
          background-image: url('./images/icon3.png');

          &.active {
            color: $color-orange;
            background-image: url('./images/icon3hover.png');
          }
        }

        .gap1 {
          background-image: url('./images/icon4.png');
        }
      }
    }
  }
}
</style>

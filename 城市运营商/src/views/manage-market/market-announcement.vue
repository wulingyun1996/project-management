<template>
  <div class="market-announcement-container">
    <div class="market-announcement-header">
      <div class="header-wrapper">
        商家
        <base-input
          @changeInputValue="changeInputValue"
          placeholder=""
          class="input-wapper">
        </base-input>
        <base-button
          :type="1"
          @clickCurrentButton="getTableData"
          text="搜索">
        </base-button>
      </div>
    </div>
    <div class="market-announcement-body">
      <base-table
        :data="tableData"
        :columns="columns"
        :total="total"
        :componentList="choosedComponentList"
        @buttonSubmit="operateCurrentRow"
        @viewReason="viewReason"
        @changePage="changePage"
        >
      </base-table>
    </div>
    <base-popup ref="pop">
      <div class="delete-notice">
        <h1>确定要强制下架吗？</h1>
        <div class="text">
          <textarea
            v-model="downReason"
            maxlength="40"
            placeholder="请输入下架原因">
          </textarea>
          <div class="statistics-word">
            <span>{{ downReasonLength }}/40</span>
          </div>
        </div>
        <div class="button-wrapper">
          <base-button
            class="confirm-button"
            :type="1"
            @clickCurrentButton="confirm"
            text="确定">
          </base-button>
          <base-button
            @clickCurrentButton="cancel"
            text="取消">
          </base-button>
        </div>
      </div>
    </base-popup>
  </div>
</template>

<script>
import BaseTableButton from 'components/table-button'
import BaseMarketNotice from 'components/market-notice'
import BasePopup from 'components/popup'
import { mixins } from 'mixins'
const columns = [
  {
    label: '编号',
    prop: 'index'
  },
  {
    label: '消息主题',
    prop: 'theme'
  },
  {
    label: '浏览量',
    prop: 'pageView'
  },
  {
    label: '商家名称',
    prop: 'shopName'
  },
  {
    label: '服务城市',
    prop: 'serviceCity'
  },
  {
    label: '发布时间',
    prop: 'created_at'
  }
]
const buttonList = [
  {
    text: '强制下架',
    buttonType: 4,
    type: 'danger',
    size: 'small'
  }
]
const choosedComponentList = [
  {
    component: BaseMarketNotice,
    label: '状态',
    insertIndex: 6,
    width: 150,
    eventType: 'viewReason'
  },
  {
    component: BaseTableButton,
    label: '操作',
    insertIndex: 7,
    width: 150,
    eventType: 'buttonSubmit'
  }
]
export default {
  name: 'MarketAnnouncement',
  mixins: [mixins],
  data () {
    return {
      searchKeyWords: '',
      columns,
      choosedComponentList,
      downReason: '',
      currentRow: {}
    }
  },
  computed: {
    downReasonLength () {
      return this.downReason.replace(/\n|\r/g, '  ').length
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    changeInputValue (val) {
      this.searchKeyWords = val
    },
    getTableData () {
      let { page, pageSize, searchKeyWords } = this
      let url = 'adv/getNoticesList'
      let obj = {
        page,
        pageSize,
        shop_name: searchKeyWords
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.handlerTableData(res.data.data)
          this.tableData = res.data.data
          this.total = res.data.total
          return
        }
      })
    },
    handlerTableData (data) {
      data.forEach((item, index, arr) => {
        item.index = (index + 1) + ((this.page - 1) * this.pageSize)
        if (item.is_delete) {
          item.buttonList = JSON.parse(JSON.stringify(buttonList))
        } else {
          item.buttonList = []
        }
        item.theme = item.title ? item.title : '/'
        item.pageView = item.browse_count ? item.browse_count : 0
        item.shopName = item.shop_name ? item.shop_name : '/'
        item.serviceCity = item.addr ? item.addr : '/'
      })
    },
    viewReason (row) {
      let { rejected_reason } = row
      this.$mesBox(rejected_reason, '', 3)
    },
    operateCurrentRow (row) {
      this.currentRow = row
      this.$refs.pop.show()
    },
    confirm () {
      if (!this.downReason.trim()) {
        this.$mes('请输入下架原因', 2)
        return
      }
      let { index, id } = this.currentRow
      let { downReason, page, pageSize } = this
      let arrIndex = index - 1 - ((page - 1) * pageSize)
      let url = 'adv/setNoticesOut'
      let obj = {
        id,
        rejected_reason: downReason
      }
      this.$http(url, obj).then(res => {
        if (res.code === this.$ok) {
          this.cancel()
          this.currentRow.is_delete = 0
          this.currentRow.rejected_reason = downReason
          this.currentRow.buttonList = []
          this.tableData.splice(arrIndex, 1, this.currentRow)
          this.downReason = ''
          this.$mes('下架成功')
          return
        }
      })
    },
    cancel () {
      this.$refs.pop.hide()
    },
    changePage (page) {
      this.page = page
      this.getTableData()
    }
  },
  components: {
    BasePopup
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/mixins'
.market-announcement-container
  .market-announcement-header
    flex-f()
    justify-content flex-end
    margin-bottom 10px
    .header-wrapper
      flex-align-item()
    .input-wapper
      width 150px
      margin 0 20px
  .delete-notice
    width 300px
    padding 20px
    background #ccc
    h1
      margin 0
      f16()
    .text
      margin 10px 0
      position relative
    textarea
      width 100%
      height 90px
      padding 5px
      padding-bottom 10px
      f14()
      color #999
    .statistics-word
      position absolute
      right 4px
      bottom 2px
      f12()
      color #999
    .button-wrapper
      flex-f-align()
      justify-content center
      .confirm-button
        margin-right 20px
</style>

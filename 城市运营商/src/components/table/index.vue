<template>
  <div class="table-container">
    <egrid
      border
      style="width: 100%"
      :data="data"
      :max-height="tableHeight"
      :columns="columns"
      :column-type="columnType"
      :columns-handler="columnsHandler"
      @selection-change="selectionChange">
    </egrid>
    <base-pagination @changePage="changePage" :total="total" :pageSize="pageSize" v-show="showPagination"></base-pagination>
  </div>
</template>

<script>
import BaseButton from 'components/table-button'
import BasePagination from 'components/pagination'
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    componentList: {
      type: Array,
      default: () => []
    },
    buttonCellWidth: {
      type: Number,
      default: 250
    },
    // 是否要显示多选, 可选值： selection/index/expand
    columnType: {
      type: String,
      default: ''
    },
    // 要在某两列之间插入带有 button 按钮的列，例如在 3-4 列之间插入一列，insertIndex = 3
    insertIndex: {
      type: Number,
      default: -1
    },
    tableHeight: {
      type: Number,
      default: 450
    },
    total: {
      type: Number,
      default: 0,
      required: true
    },
    pageSize: {
      type: Number,
      default: 10
    },
    // 自定义限制条数，来决定分页按钮是否显示
    limitTotal: {
      type: Number,
      default: 10
    }
  },
  data () {
    return {
      componentLists: this.componentList
    }
  },
  computed: {
    showPagination () {
      return this.total > this.limitTotal
    }
  },
  methods: {
    columnsHandler (cols) {
      cols.forEach(item => {
        item.align = 'center'
        item['min-width'] = '100'
      })
      const vm = this
      let publicItems
      publicItems = {
        align: 'center',
        listeners: {
          'clickCurrentButton' (row, type, flag) {
            vm.$emit('buttonSubmit', row, type, flag)
          }
        }
      }
      this.componentLists.forEach(item => {
        // 允许组件自定义事件名称，如果该项不存在，默认是 buttonSubmit
        if (item.eventType) {
          publicItems = {
            align: 'center',
            listeners: {
              'clickCurrentButton' (row, type, flag) {
                vm.$emit(item.eventType, row, type, flag)
              }
            }
          }
        }
        let newItem = Object.assign({}, publicItems, item)
        cols.splice(newItem.insertIndex, 0, newItem)
      })
      return cols
    },
    selectionChange (rows) {
      this.$emit('selectionChange', rows)
    },
    changePage (page) {
      this.$emit('changePage', page)
    }
  },
  components: {
    BasePagination,
    BaseButton
  }
}
</script>

<style lang='stylus'>

</style>

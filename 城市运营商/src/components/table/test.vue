<template>
  <div class="table-container">
    <egrid
      border
      style="width:100%"
      column-type = selection
      :data="data"
      :height="450"
      :columns="columns"
      :columns-handler="columnsHandler">
    </egrid>
    <base-pagination @changePage="changePage" :total="total" :pageSize="pageSize" v-show="showPagination"></base-pagination>
  </div>
</template>

<script>
import BasePagination from 'components/pagination'

export default {
  props: {
    componentList: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      total: 20,
      pageSize: 10,
      types: 'selection',
      componentLists: this.componentList
    }
  },
  computed: {
    showPagination () {
      return this.total > 10
    }
  },
  methods: {
    columnsHandler (cols) {
      cols.forEach(item => {
        item.align = 'center'
      })
      const vm = this
      let publicItems
      publicItems = {
        align: 'center',
        listeners: {
          'clickCurrentButton' (row, type) {
            vm.$emit('buttonSubmit', row, type)
          }
        }
      }
      this.componentLists.forEach(item => {
        // 允许组件自定义事件名称，如果该项不存在，默认是 buttonSubmit
        if (item.eventType) {
          publicItems = {
            align: 'center',
            listeners: {
              'clickCurrentButton' (row, type) {
                vm.$emit(item.eventType, row, type)
              }
            }
          }
        }
        let newItem = Object.assign({}, publicItems, item)
        cols.splice(newItem.insertIndex, 0, newItem)
      })
      return cols
    },
    // 当 egrid 设置有 column-type = selection 与 @selection-change="selectionChange" 的时候，会触发该事件
    selectionChange (rows) {
      // console.log(rows)
    },
    changePage (page) {
      // console.log(page)
    }
  },
  components: {
    BasePagination
  }
}
</script>

<style lang='stylus' scoped>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'

</style>

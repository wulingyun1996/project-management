<template>
  <div>
    <el-dialog title="添加商圈" :visible.sync="dialogTableVisible">
      <egrid border
      :data="bsData"
      :columns="bsColumns"
      :columns-handler="bsColumnsHandler"
      highlight-current-row
      @current-change="handleCurrentChange"
      >
      </egrid>
      <base-pagination :total="total" @changePage="changePage"></base-pagination>
      <div class="btn-ok">
        <base-button text="确定" @click="$emit('selected', currentRow)" type="primary"></base-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TableRadio from '@/components/table-radio'

const bsColumns = [
  { label: '商圈名称', prop: 'group_name' },
  { label: '圈内商家', prop: 'shop_count' },
  { label: '手机号', prop: 'contact_mobile' },
  { label: '所在城市', prop: 'address' }
]
export default {
  props: {
    bsData: {
      type: Array,
      default: () => []
    },
    total: {
      type: Number,
      default: 0
    },
    dialogTableVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      bsColumns: bsColumns,
      currentRow: null
    }
  },
  methods: {
 
    handleCurrentChange (val) {
      this.currentRow = val
    },
    changePage (page) {
      console.log(page)
    },
    bsColumnsHandler (cols) {
      var vm = this
      cols.forEach(item => {
        item.align = 'center'
      })
      // cols.unshift({
      //   label: '选择',
      //   component: TableRadio,
      //   align: 'center',
      //   listeners: {
      //     clickCurrentButton (row) {
      //       console.log(row)
      //       row.customRadio = true

      //     }
      //   }
      // })
    }
  }
}

</script>
<style lang="stylus" scoped>
.btn-ok
  display flex
  justify-content center
</style>

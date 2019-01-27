<template>
  <div class="sider-bar-item-container">
    <template v-for="item in siderBarData" v-if="!item.hidden && item.children">
      <router-link
        v-if="item.children.length === 1 && !item.children[0].children"
        :to="item.path + '/' + item.children[0].path"
        :key="item.children[0].name">
        <el-menu-item
          :index="item.path + '/' + item.children[0].path"
          class='submenu-title-noDropdown'>
          <svg-icon
            v-if="item.children[0].meta && item.children[0].meta.icon"
            :icon-class="item.children[0].meta.icon">
          </svg-icon>
          <span v-if="item.children[0].meta && item.children[0].meta.title">{{ item.children[0].meta.title }}</span>
        </el-menu-item>
      </router-link>
      <el-submenu
        :index="item.name || item.path"
        :key="item.name"
        v-else>
        <template slot="title">
          <svg-icon v-if="item.meta && item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
          <span v-if="item.meta && item.meta.title">{{ item.meta.title }}</span>
        </template>
        <template v-for="child in item.children" v-if="!child.hidden">
          <base-sider-bar-item
            v-if="child.children && child.children.length > 0"
            :siderBarData="[child]"
            :key="child.path"
            class="nest-menu">
          </base-sider-bar-item>
          <router-link
            :to="item.path+'/'+child.path"
            :key="child.name" v-else>
            <el-menu-item :index="item.path+'/'+child.path" class="el-menu-item-width">
              <svg-icon v-if="child.meta && child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
              <span v-if="child.meta && child.meta.title">{{ child.meta.title }}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>
    </template>
  </div>
</template>

<script>
export default {
  name: 'baseSiderBarItem',
  props: {
    siderBarData: {
      type: Array
    }
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/css/variable'
@import '~@/assets/css/mixins'
.el-menu-item-width
  min-width 180px!important
</style>

<template>
  <div id="domSideBar" class="sideBar">
    <el-scrollbar>
      <el-menu :default-active="activeMenu" class="el-menu-vertical-demo" background-color="#fff" text-color="#717981"
        active-text-color="#187AFE" mode="vertical" :collapse-transition="false" :collapse="opened">
        <sidebar-item v-for="item in routes" :key="item.path" :item="item" :base-path="item.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import SidebarItem from './SideBarItem';
import { mapGetters } from 'vuex';
export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters(['routes', 'opened']),
    activeMenu() {
      return this.$route.path;
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep {
  .el-menu-item.is-active {
    background-color: #e9f5ff !important;
    color: #187afe;
    span {
      color: #187afe !important;
    }
  }
  .el-submenu__title:hover, .el-menu-item:hover {
    background-color: #e9f5ff !important;
  }
}

li {
  color: #b5b6bd;
}
</style>


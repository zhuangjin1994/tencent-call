<template>
  <div v-if="!item.hidden" class="sideItem">
    <template v-if="
      hasOnlyChild(item.children, item) &&
      (!onlyOneChild.children || onlyOneChild.noChild)
    ">
      <page-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)">
          <svg-icon :icon-class="onlyOneChild.meta.icon ? onlyOneChild.meta.icon : ''"
            :class="onlyOneChild.meta.icon ? 'icon-img' : ''" />
          <span slot="title">
            {{ onlyOneChild.meta.title }}
            <span v-if="onlyOneChild.meta.title.trim() === '审批列表' && getCount.auditCount">
              <span :class="getCount.auditCount ? 'red' : ''">({{ getCount.auditCount }})</span>
            </span>
            <span v-else-if="onlyOneChild.meta.title.trim() === '草稿箱' && getCount.draftCount">
              <span :class="getCount.draftCount ? 'red' : ''">({{ getCount.draftCount }})</span>
            </span>
            <span v-else-if="onlyOneChild.meta.title.trim() === '资源配置' && getCount.resourceCount">
              <span :class="getCount.resourceCount ? 'red' : ''">({{ getCount.resourceCount }})</span>
            </span>
          </span>
        </el-menu-item>
      </page-link>
    </template>
    <el-submenu v-else :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <svg-icon :icon-class="item.meta.icon ? item.meta.icon : ''" :class="item.meta.icon ? 'icon-img' : ''" />
        <span>{{ item.meta.title }}</span>
      </template>
      <sidebar-item v-for="child in item.children" :key="child.path" :item="child"
        :base-path="resolvePath(child.path)" />
    </el-submenu>
  </div>
</template>

<script>
import PageLink from './Link';
import { isAbsolutePath } from '@/utils/validate';
import path from 'path';
export default {
  name: 'SidebarItem',
  components: {
    PageLink
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    this.onlyOneChild = null;
    return {};
  },
  computed: {
    getCount() {
      return this.$store.state.app.menuCount;
    }
  },
  methods: {
    hasOnlyChild(children = [], item) {
      const newChildren = children.filter(obj => {
        if (obj.hidden) {
          return false;
        } else {
          return true;
        }
      });
      if (newChildren.length === 1 && !item.meta) {
        this.onlyOneChild = newChildren[0];
        return true;
      }
      if (newChildren.length === 0) {
        this.onlyOneChild = { ...item, path: '', noChild: true };
        return true;
      }
      return false;
    },
    resolvePath(router) {
      if (isAbsolutePath(router)) {
        return router;
      }
      if (isAbsolutePath(this.basePath)) {
        return this.basePath;
      }
      return path.join(this.basePath, router);
    }
  }
};
</script>
<style lang="scss" scoped>
.icon-img {
  display: inline-block;
  font-size: 18px;
  margin-right: 10px;
}

.red {
  color: red;
}

::v-deep {
  .el-menu-item.is-active span.red {
    color: red !important;
    vertical-align: baseline;
  }

  .el-menu-item * {
    vertical-align: baseline;
  }
}
</style>

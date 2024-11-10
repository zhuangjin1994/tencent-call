<template>
  <div id="domBread" class="breadDiv">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item
        v-for="(item, index) in breadList"
        :key="index"
        :to="item.path"
        >{{ item.title }}</el-breadcrumb-item
      >
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  data() {
    return {
      breadList: []
    };
  },
  watch: {
    $route: {
      handler(route) {
        let allList;
        if (route.meta.breadList) {
          allList = route.meta.breadList;
        } else {
          allList = route.matched.filter(item => {
            if (item.meta && item.meta.title) {
              if (item.redirect) {
                item.path = '';
              }
              item.title = item.meta.title;
              return true;
            }
          });
        }
        // 特殊情况：如需求详情有多个入口，采用页面存储的自定义面包屑
        let customBread = localStorage.getItem('customBread') && JSON.parse(localStorage.getItem('customBread'));
        if (customBread) {
          allList = customBread;
        }
        this.breadList = allList;
      },
      immediate: true
    }
  }
};
</script>

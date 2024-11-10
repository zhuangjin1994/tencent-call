<template>
  <div v-loading="loading" class="wscn-http404-container">
    <div class="wscn-http404">
      <div class="pic-404">
        <img class="pic-404__parent" src="@/assets/err_images/404.png" alt="404">
      </div>
      <div class="bullshit">
        <div class="bullshit__oops">非常抱歉!</div>
        <div class="bullshit__headline">{{message}}</div>
        <div v-if="!type" class="bullshit__info">服务器开小差了，请稍后再试哦</div>
        <a v-if="type" @click="toLogin" class="bullshit__return-home" style="margin-top:20px">我已了解</a>
        <a v-else @click="refreshPage" class="bullshit__return-home">刷新试试</a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Page500',
  data() {
    return {
      loading: false
    };
  },
  computed: {
    type() {
      return this.$route.query.type;
    },
    message() {
      return this.$route.query.type === 'loginErr' ? '该账号暂未开通，请联系管理员！' : this.$route.query.type === 'disabled' ? '您的账号已经被禁用，请联系管理员启用' : '您当前无法进入该页面...';
    }
  },
  methods: {
    refreshPage() {
      this.$router.push('/demand/list');
    },
    toLogin() {
      window.open(`http://${document.domain}/_logout/?url=${document.domain}`, '_self');
    }
  }
};
</script>
<style lang="scss" scoped>
@import './common.scss';
</style>

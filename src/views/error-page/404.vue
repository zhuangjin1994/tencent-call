<template>
  <div class="wscn-http404-container">
    <div class="wscn-http404">
      <div class="pic-404">
        <img class="pic-404__parent" src="@/assets/err_images/404.png" alt="404">
      </div>
      <div class="bullshit">
        <div class="bullshit__oops">非常抱歉!</div>
        <div class="bullshit__headline">{{ message }}</div>
        <div class="bullshit__info">请检查您输入的网址是否正确，或单击下面的按钮返回主页。</div>
        <a @click="$router.push('/demand/list')" class="bullshit__return-home">返回首页</a>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Page404',
  computed: {
    message() {
      return '您当前无法进入该页面...';
    }
  }
};
</script>
<style lang="scss" scoped>
@import './common.scss';
</style>


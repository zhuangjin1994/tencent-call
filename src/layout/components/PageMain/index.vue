<template>
  <div class="pageMain">
    <transition name="fade-page" mode="out-in">
      <keep-alive>
        <router-view v-if="!$route.meta.noCache" :key="key"/>
      </keep-alive>
    </transition>
    <transition name="fade-page" mode="out-in">
      <router-view v-if="$route.meta.noCache" :key="key"/>
    </transition>
  </div>
</template>

<script>
export default {
  computed: {
    key() {
      // return this.$route.path
      return Math.random() * 100;
    }
  }
};
</script>

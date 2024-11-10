<template>
  <div class="message-view">
    <list></list>
  </div>
</template>
<script>
import list from './components/list.vue';
export default {
  components: { list }
};
</script>
<style lang="scss" scoped>
.message-view {
  width: calc(100% - 20px);
  height: 100%;
  position: relative;
}
#app .pageMain > div {
  padding: 0 10px;
  
}
</style>

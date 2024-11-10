<template>
  <div class="sideCollapse" id="domColapse">
    <!-- <i
      :class="{ 'el-icon-s-unfold': opened, 'el-icon-s-fold': !opened }"
    ></i> -->
    <!-- <svg-icon icon-class="icon-right" class="tag-menu" :class="!opened ? 'on' : ''" @click="toggleOpen()" /> -->
    <i class="tag-menu" :class="!opened ? 'on' : ''" @click="toggleOpen()"></i>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters(['opened'])
    // toggleClass() {
    //   return {
    //     'el-icon-s-unfold': this.opened === 'true',
    //     'el-icon-s-fold': this.opened !== 'true'
    //   }
    // }
  },
  methods: {
    toggleOpen() {
      this.$store.commit('app/SET_OPENED', !this.opened);
    }
  }
};
</script>
<style lang="scss" scoped>
.sideCollapse .tag-menu {
  width: 18px;
  height: 93px;
  background: url('../../assets/images/rigth.png') no-repeat center top;
  background-size: 18px;
  display: block;
  cursor: pointer;
  transition: .3s;
  position: fixed;
}

.sideCollapse .tag-menu.on {
  background-image: url('../../assets/images/left.png');
}
</style>

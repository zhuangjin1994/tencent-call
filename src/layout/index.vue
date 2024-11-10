<template>
  <div class="wrapper" :class="{ closeBar: opened }">
    <m-header />
    <transition enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
      <notificat-bar v-show="msgIsShow" />
    </transition>
    <div class="wrapper_con">
      <side-bar />
      <page-main />
      <right-panel />
      <side-collapse class="sidecoll" :class="!opened ? 'on' : ''"></side-collapse>
    </div>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel';
import SideBar from './components/sideBar';
import SideCollapse from '@/components/SideCollapse';
import MHeader from './components/header';
import NotificatBar from '@/components/NotificatBar';
import PageMain from './components/PageMain';
import { mapGetters } from 'vuex';
export default {
  name: 'Layout',
  mounted() { },
  computed: {
    ...mapGetters(['opened', 'msgIsShow'])
  },
  components: {
    SideBar,
    MHeader,
    NotificatBar,
    PageMain,
    RightPanel,
    SideCollapse
  },
};
</script>
<style lang="scss" scoped>
.sidecoll {
  position: absolute;
  top: 231px;
  left: 64px;
  transition: left .3s;
  z-index: 3000;
}

.sidecoll.on {
  left: 180px;
}
</style>

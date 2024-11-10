<template>
  <div id="app">
    <router-view />
    <notify></notify>
    <ProtocolDialog></ProtocolDialog>
  </div>
</template>
<script>
import notify from './components/Notify/index.vue';
import ProtocolDialog from '@/components/ProtocolDialog';
export default {
  name: 'App',
  components: {
    notify,
    ProtocolDialog
  },
  created() {
  },
  mounted() {
  },
  methods: {
  },
};
</script>

<style>
</style>

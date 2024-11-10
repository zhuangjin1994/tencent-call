<template>
  <el-tooltip
		ref="tlp"
		:content="text"
		effect="dark"
		:disabled="!tooltipFlag"
		:placement="placement"
	>
		<p class="overflow" :style="{ width: width }" @mouseenter="visibilityChange($event)">{{ text }}</p>
	</el-tooltip>
</template>
<script>
export default {
  props: {
    // 文本内容
    text: {
      type: String,
      default: ''
    },
    // 浮窗位置
    placement: {
      type: String,
      default: 'top-start'
    },
    // 容器的宽度，超出显示...
    width: {
      type: String,
      default: '200px'
    }
  },
  data() {
    return {
      tooltipFlag: false
    };
  },
  methods: {
    visibilityChange(event) {
      const ev = event.target;
      const ev_weight = ev.scrollWidth; // 文本的实际宽度
      const content_weight = this.$refs.tlp.$el.parentNode.clientWidth; // 文本容器宽度(父节点)
      if (ev_weight > content_weight) {
        // 文本宽度 > 实际内容宽度  =》内容溢出
        this.tooltipFlag = true; 
      } else {
        // 否则为不溢出
        this.tooltipFlag = false;
      }
    }
  }
};
</script>
<style scoped>
.overflow {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
}
</style>

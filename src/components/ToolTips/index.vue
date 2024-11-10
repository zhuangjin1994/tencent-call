<!--
 * @Descripttion:
 * @version:
 * @Author: xiao
 * @Date: 2022-02-28 20:41:56
 * @LastEditors: sueRimn
 * @LastEditTime: 2022-03-05 16:28:42
-->
<template>
	<div id="ellipsis">
		<div class="contentCls" :style="{ width: width }">
			<el-tooltip
				:effect="effect"
				:disabled="isElTooltipShow"
				:content="contentText"
				:placement="placement"
			>
				<span @mouseenter="hanldeElTooltip">{{ contentText }}</span>
			</el-tooltip>
		</div>
	</div>
</template>
<script>
export default {
  data() {
    return {
      isElTooltipShow: false,
    };
  },
  props: {
    effect: {
      type: String,
      default: 'dark'
    },
    placement: {
      type: String,
      default: 'top-start'
    },
    outerShellWidth: {
      type: Number,
      default: 800
    },
    contentText: {
      type: String,
      default: ''
    },
  },
  computed: {
    width() {
      // Tooltip 外层壳宽度自动填充px
      return this.outerShellWidth + 'px';
    },
  },
  methods: {
    hanldeElTooltip(val) {
      this.isElTooltipShow = val.target.offsetWidth > this.outerShellWidth ? false : true;
    }
  }
};
</script>

<style scoped lang="scss">
#ellipsis {
	width: 100%;
	// vertical-align: bottom;
	display: grid;
	.contentCls {
		// 外层壳已做单行文本溢出显示省略号处理
		display: inline-block;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
	}
}
</style>

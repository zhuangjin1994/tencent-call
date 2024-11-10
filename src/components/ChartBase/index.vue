<template>
  <div class="chart-empty" :style="{ height: height, width: width }">
    <div ref="chart" class="echart" />
  </div>
</template>

<script>
import echarts from 'echarts';
import { debounce } from '@/utils';

export default {
  name: 'Chart',
  props: {
    // echart options
    options: {
      type: Object,
      default: () => {}
    },
    height: {
      type: String,
      default: '400px'
    },
    width: {
      type: String,
      default: '100%'
    }
  },
  watch: {
    options: {
      immediate: true,
      handler(nVal, oVal) {
        if (this.echart && Object.keys(nVal).length) this.render();
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      // 如果组件在mounted阶段就被销毁，nextTick仍然会执行，所以需要判断$refs
      if (this.$refs.chart) this.initChart();
    });

    // 这个函数不能放在methods里，同个页面有多个相同组件，debounce会有影响
    this.resize = debounce(() => {
      if (this.echart) {
        if (this.$el.clientWidth) this.echart.resize();

        // 计算当前屏幕的宽度
        const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        this.$emit('resize', width);
      }
    }, 300);

    window.addEventListener('resize', this.resize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize);
  },
  methods: {
    initChart() {
      this.echart = echarts.init(this.$refs.chart);

      if (this.options) this.render();
    },
    render() {
      this.echart.setOption(this.options, true);
      this.echart.off('click');
      this.echart.on('click', (params) => {
        this.$emit('handleClick', params);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.chart-empty .echart {
  height: 100%;
  width: 100%;
}
</style>

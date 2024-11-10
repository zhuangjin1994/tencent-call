<template>
  <div
    class="placeholder"
    :style="{ minHeight: minHeight, height: height, justifyContent: justifyContent }"
  >
    <i class="key-icon key-icon-none" />
    <slot>
      <el-empty v-if="content=='img'" description="暂无数据"></el-empty>
      <span v-else>{{ text }}</span>
    </slot>
  </div>
</template>

<script>
import './style.scss';
const textMap = {
  noData: '暂无数据'
};

export default {
  props: {
    height: {
      type: String,
      default: '200px'
    },
    minHeight: {
      type: String,
      default: 'auto'
    },
    type: {
      type: String,
      default: 'noData',
      validator(val) {
        return ~Object.keys(textMap).indexOf(val);
      }
    },
    justifyContent: {
      type: String,
      default: 'center'
    },
    tip: {
      type: String,
      default: null
    },
    // 类型 图片-img 文字-text
    content: {
      type: String,
      default: 'text'
    }
  },
  computed: {
    text() {
      return this.tip || textMap[this.type];
    }
  }
};
</script>

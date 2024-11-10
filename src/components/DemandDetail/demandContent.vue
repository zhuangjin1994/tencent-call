<template>
  <div class="demand-content">
    <el-descriptions size='medium' :column="3">
      <el-descriptions-item :labelStyle="{'color':'#000'}" label="需求类型">{{data.demandType || '--'}}</el-descriptions-item>
      <el-descriptions-item labelClassName="label-text" label="所属部门">
        <text-tooltips :text="data.departmentName || '--'" :width="width"/>
      </el-descriptions-item>
      <el-descriptions-item labelClassName="label-text" label="所属小组">
        <text-tooltips :text="data.demandGroup || '--'" :width="width" />
      </el-descriptions-item>
      <el-descriptions-item :labelStyle="{'color':'#000'}" label="申请时间">{{data.submitDate || '--'}}</el-descriptions-item>
      <el-descriptions-item labelClassName="label-text"  label="需求人">
        <text-tooltips :text="data.demander || '--'"  :width="width"/>
      </el-descriptions-item>
      <el-descriptions-item labelClassName="label-text" label="负责人">
        <text-tooltips :text="data.contractor || '--'"  :width="width"/>
      </el-descriptions-item>
    </el-descriptions>
    <div class="oneline"><span class="label-text">联系方式：</span>{{ data.wechat || '--' }}</div>
    <div class="oneline"><span class="label-text supplier">供应商：</span>
      <span v-if="data.supplierNamesMap && data.supplierNamesMap[0]">【国内】{{ data.supplierNamesMap[0].join(',') }}；</span>
      <span v-if="data.supplierNamesMap && data.supplierNamesMap[1]">【海外】{{ data.supplierNamesMap[1].join(',') }}</span>
      <span v-if="!data.supplierNamesMap">--</span>
    </div>
    <!-- <div class="oneline" style="text-indent: -83px"><span class="label-text">国内供应商：</span>
      <span style="text-indent: -20px">{{ data.supplierNamesMap && data.supplierNamesMap[0] ? data.supplierNamesMap[0].join(',') : '--' }}</span>
    </div>
    <div class="oneline" style="text-indent: -83px"><span class="label-text">海外供应商：</span>
      <span style="text-indent: -20px">{{ data.supplierNamesMap && data.supplierNamesMap[1] ? data.supplierNamesMap[1].join(',') : '--' }}</span>
    </div> -->
    <div class="oneline"><span class="label-text">项目成员：</span>{{ data.members || '--' }}</div>
    <div class="oneline"><span class="label-text">需求标签：</span>{{ data.tag || '--' }}</div>
    <div class="tinymce">
      <span class="title">需求目的：</span>
      <!-- <span style="text-indent:20px" class="pre">{{ data.purpose || '--' }}</span> -->
      <span class="mess">
        <p v-html="data.purpose || '--'"></p>
      </span>
    </div>
    <div v-if="data.demandType && data.demandType.includes('访谈')" class="tinymce"><span class="title">访谈背景：</span>
      <!-- <span class="pre">{{ data.background || '--' }}</span> -->
      <span class="mess">
        <p v-html="data.background || '--'"></p>
      </span>
    </div>
    <div v-if="data.demandType && data.demandType.includes('访谈')" class="tinymce"><span class="title">专家要求：</span>
      <!-- <span class="pre">{{ data.expertRequirement || '--' }}</span> -->
      <span class="mess">
        <p v-html="data.expertRequirement || '--'"></p>
      </span>
    </div>
    <div v-if="data.demandType && data.demandType.includes('访谈')">
      <template v-if="isHide">
        <!-- 只显示部分内容 -->
        <div class="hide-bg" ref="content">
          <span class="content summary" >
            <span class="label-text">访谈问题：</span>
            <!-- <span class="pre">{{ data.interviewQuestion || '--' }}</span> -->
            <span class="fold-mess">
              <p v-html="data.interviewQuestion || '--'"></p>
            </span>
          </span>
          <div class="show-btn" v-if="needShowBtn">
            <span class="fold-btn" @click.stop.prevent="isHide = false">展开查看更多<i style="left:-18px" class="el-icon-arrow-down arrow-icon"/></span>
          </div>
        </div>
      </template>
      <template v-else>
        <!-- 显示完整内容 -->
        <div class="show-bg" ref="content">
          <span class="content">
            <span class="label-text">访谈问题：</span>
            <!-- <span class="pre">{{ data.interviewQuestion || '--11' }}</span> -->
            <span class="fold-mess">
              <p v-html="data.interviewQuestion"></p>
            </span>
          </span>
          <div class="hide-btn" v-if="needShowBtn">
            <span class="fold-btn" @click.stop.prevent="isHide = true">收起<i class="el-icon-arrow-up arrow-icon"/></span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import TextTooltips from '@/components/TextTooltips';
export default {
  components: {
    TextTooltips
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    width: {
      type: String,
      default: '180px'
    }
  },
  data() {
    return {
      // content: '九届六中全会审议通过《中共中央关于党的百年奋斗重大成就和历史经验的决议》强调，必须实现创新成为第一动力、协调成为内生九届六中全会审议通过《中共中央关于党的百年奋斗重大成就和历史经验的决议》强调，必须实现创新成为第一动力、协调成为内生九届六中全会审议通过《中共中央关于党的百年奋斗重大成就和历史经验的决议》强调，必须实现创新成为第一动力、协调成为内生',
      content: '党的十九届六中全会审议通过《中共中央关于党的百年奋斗重大成就和历史经验的决议》强调，必须实现创新成为第一动力、协调成为内生特点、绿色成为普遍形态、开放成为必由之路、共享成为根本目的的高质量发展。  近日新华社记者奔赴多地，到企业车间、基层一线、群众当中，亲历贯彻全会精神的火热气象，感受落实新发展理念蔚然成风。  提质增效，跃上发展新台阶  走进济钢集团，黑色钢铁已不见踪影。36岁的技术人员陈书超身着白大褂，正操作数控机床加工直径几微米的精密零部件。  对于转型发展，他有着切身收获：“企业从‘靠钢吃饭’到‘无钢发展’，我的工作也从铸造‘大黑粗’变成加工‘高精尖’，环境好了，收入也高了。”  2017年，有着60年历史的济钢关停全部钢铁生产线。如今，济钢度过转型阵痛，向新材料、高端装备制造转型。2021年，集团产值预计和退出钢铁产能前相当，但能耗、大气污染物排放均只有以前的“零头”。  “要努力提升技能，适应企业转型的新需要，以实际行动响应全会关于推动高质量发展的号召。”陈书超说。  12月的浙江安吉，依旧满目青翠。“保护生态环境就是保护生产力，改善生态环境就是发展生产力，我们深有体会。”浙江省湖州市委常委、安吉县委书记杨卫东说。  “绿水青山就是金山银山。”刚刚从山川乡大里村调研回来的他，掰着手指给记者盘算，“那里旅游资源丰富、客流充足，要把闲置办公楼等资源都盘活用好，同时想办法带动村民参与乡村旅游经营，壮大集体经济、为村民增收。”  从北到南、由西至东，各地干部群众高度认同全会总结的宝贵经验，将贯彻新发展理念作为自觉行动。  冬日南国，天蓝海碧。记者登上海南洋浦经济开发区国投洋浦港码头，近5万吨进口菜籽原料经检疫合格后，被装上一辆辆卡车，运往洋浦保税港区的澳斯卡粮油加工厂。  “我们既是开放战略的践行者，更是受益者，从自贸港加工增值政策获得巨大商机。”海南澳斯卡国际粮油有限公司总经理张慧介绍，自今年7月投产以来，公司已完成加工增值业务95票，免征关税约1758万元。  “全会提出全面深化改革开放，我们将依托国内超大规模市场优势，抢抓市场机遇，以高水平开放推动高质量发展。”张慧说。  改革创新，汇聚发展新动力',
      isHide: true,
      needShowBtn: false
    };
  },
  methods: {
    resize() {
      this.needShowBtn = this.$refs.content && this.$refs.content.offsetHeight >= 64 ? true : false;
    }
  },
  mounted() {
    setTimeout(() => {
      this.needShowBtn = this.$refs.content && this.$refs.content.offsetHeight >= 64 ? true : false;
    }, 1000);
    // 窗口宽度变化时计算按钮显示与否
    window.addEventListener('resize', this.resize, true);
  },
  destroyed() {
    window.removeEventListener('resize', this.resize, true);
  },
};
</script>
<style lang="scss" scoped>
.demand-content {
  font-size: 14px;
  color: #606266;
  // .oneline,  .show-bg {
  .oneline {
    padding-left: 70px;
    text-indent: -70px; // 首行缩进
  }
  .oneline {
    padding-bottom: 10px;
  }
  .show-more {
    text-align: center;
    color: #016FFA;
  }
  .tinymce {
    // display: inline;
    padding-bottom: 10px;
  }
  .title {
    font-weight: normal;
    float: left;
    vertical-align: top;
    color: #000;
  }
  .mess {
    font-weight: 400;
    display: block;
    color: #595a5e;
    margin-left: 70px;
  }
  .fold-mess {
    // font-weight: 400;
    // margin-left: 70px;
    // display: inline-block;
    display: inline-block;
    vertical-align: top;
    max-width: calc(100% - 70px);
  }
}
.hide-bg { 
  position: relative;
  margin-bottom: 20px;
}
// .hide-bg, .show-bg {
//   word-wrap :break-word;
//   word-break: normal;
// }
.fold-btn{
  position: relative;
  cursor: pointer;
  color: #016FFA;
}
.arrow-icon {
  left: -20px;
  top: 1px;
  position: absolute;
}
.summary {
  // padding-left: 70px;
  // text-indent: -70px; 
  max-height: 64px;
  line-height: 24px;
  overflow: hidden;    /* 隐藏溢出内容 */
  text-overflow: clip;    /* 修剪文本 */
  display: -webkit-box;    /* 弹性布局 */
  -webkit-box-orient: vertical;    /* 从上向下垂直排列子元素 */
  -webkit-line-clamp: 2;    /* 限制文本仅显示前三行 */
}
.show-btn {
  width: calc(100% - 70px);
  height: 40px;
  line-height: 50px;
  position: absolute;
  top: 56px;
  z-index: 0;
  text-align: center;
  padding-left: 70px;
  background: linear-gradient(rgba(255,255,255,.9), white);    /* 背景色半透明到白色的渐变层 */
}
.hide-btn {
  text-align: center;
  padding-left: 70px;
}
</style>
<style lang="scss">
.demand-content {
  .label-text {
    color: #000;
    display: inline;
    min-width: 82px;
    text-align: right;
  }
  .supplier {
    padding-left: 13px;
  }
}
</style>

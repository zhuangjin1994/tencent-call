<template>
	<div class="audit-step">
    <div v-if="data.length" class="step-box">
			<el-steps :active="active" align-center>
				<el-step v-for="(item, index) in data" :title="item.step" :key="index">
					<template slot="description">
						<p>
							<tool-tips :contentText="item.approver" :outerShellWidth='120'/>
							<span style="color:#016FFA">{{item.actionName}}</span>
								<el-popover
									placement="bottom"
									title="审批意见"
									width="200"
									trigger="click"
									:content="item.opinion || '暂无'">
								<i slot="reference" v-if="item.opinion" class="el-icon-message-solid opinion"></i>
							</el-popover>
						</p>
						<p>{{item.approvalTime}}</p>
						<p>{{item.remark}}</p>
					</template>
				</el-step>
			</el-steps>
		</div>
		<placeholder v-else height="100px"/>
	</div>
</template>
<script>
import ToolTips from '@/components/ToolTips';
import Placeholder from '@/components/Placeholder';
export default {
  components: {
    ToolTips,
    Placeholder
  },
  computed: {
    active() {
      if (!this.data.length) {
        return 0;
      }
      let num = this.data.length;
      for (let key in this.data) {
        if (!this.data[key].actionName) {
          num = key;
          break;
        }
      }
      return Number(num);
    }
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  }
};
</script>
<style lang="scss" scoped>
 .step-box {
	width: 100%;
	margin-top: 20px;
	overflow-x: auto;
	.opinion {
		font-size: 16px;
		margin-left: 4px;
		vertical-align: text-bottom;
		color: #016FFA;
		cursor: pointer;
	}
	.el-step {
		min-width: 180px;
		flex-basis: 200px !important;
	}
}
</style>
<style lang="scss">
.audit-step {
	.el-step__head.is-finish	{
		color: #303133;
		border-color: #303133;
	}
	.el-step__title {
		font-weight: 600;
		font-size: 14px;
	}
	// 进行中
	.el-step__title, .is-process{
		color: #409eff;
		border-color: #409eff;
	}
	// 已完成
	.el-step__title.is-finish {
		color: #303133;
		border-color: #303133;
	}
	// 待完成
	.el-step__title.is-wait {
		color: #C0C4CC;
		border-color: #303133;
	}
	.el-step__description.is-finish {
		p {
			color: #303133;
			font-weight: 400;
			font-size: 12px;
		}
	}
	
}
</style>

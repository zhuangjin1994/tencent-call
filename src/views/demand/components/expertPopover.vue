<template>
	<div class="expert-popover">
		<div class="popover-left">
      <img class="avatar" :src="require('@/assets/images/avatar.png')"/>
			<!-- <el-avatar class="avatar" :size="50">{{data.supplierName}}</el-avatar> -->
			<p>
				{{data.accountName}}
			</p>
		</div>
		<div class="popover-right">
			<el-descriptions :column="1">
				<!-- <el-descriptions-item	label="供应商">{{data.supplierName || data.accountName || '--'}}</el-descriptions-item>
				<el-descriptions-item	label="账号名">{{data.accountName || '--'}}</el-descriptions-item> -->
				<el-descriptions-item	label="手机">{{data.phone || '--'}}</el-descriptions-item>
				<el-descriptions-item	label="邮箱">
					<text-tooltips :text="data.email || '--'"  width="200px"/>
				</el-descriptions-item>
				<el-descriptions-item	label="微信">{{data.wechat || '--'}}</el-descriptions-item>
				<el-descriptions-item	label="其他">{{data.accountOther || '--'}}</el-descriptions-item>
			</el-descriptions>
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
    }
  }
};
</script>
<style lang="scss">
.expert-popover {
	.popover-left {
		width: 100px;
		float: left;
		text-align: center;
		.avatar {
			height: 60px;
			width: 60px;
			color: #606266;
			margin-top: 76px;
		}
		.expert_name {
			font-size: 16px;
			color: #666;
			text-align: center;
			margin-top: 20px;
			font-weight: 600;
		}
		.expert_email {
			font-size: 12px;
			color: #999;
			text-align: center;
			margin-top: 10px;
		}
	}
	.popover-right {
		border-left: 1px solid #eee;
		width: 250px;
		float: left;
		padding: 40px 22px;
		.el-descriptions-item__label {
			font-size: 14px;
			text-align: right;
			min-width: 46px;
			color: #606266;
			line-height: 24px;
			font-weight: 600;
		}
		.el-descriptions-item__content {
			font-size: 13px;
			line-height: 24px;
			color: #303133;
		}
	}
}
</style>

<template>
	<div class="demand-activity">
    <div v-if="data.length">
			<el-timeline style="padding-left:2px">
				<el-timeline-item 
					v-for="(activity, index) in data" 
					:key="index" 
					:timestamp="activity.operationTime" 
					placement="top"
					color="#1989fa"
				>
					<el-card class="activity-card">
						<div class="card-container">
							<el-avatar v-if="activity.supplierBelong" :size="32" class="supplier-avatar">{{activity.supplierBelong}}</el-avatar>
							<img class="avatar" v-else :src="require('@/assets/images/avatar.png')"/>
							<div>
								<span class="operator">{{activity.createBy}} </span>
								<!-- 只供应商方操作显示角色，supplierBelong存在-供应商，supplierBelong不存在-需求方 -->
								<span v-if="activity.supplierBelong" class="role-name">{{activity.roleName}}</span>
								<p class="actions">{{activity.operationField}}</p>
								<p class="actions" v-if="activity.demandRemarks">{{`编辑备注：${activity.demandRemarks}`}}</p>
								<p class="actions" v-if="activity.remarks">{{ activity.operationDetail == '中止' ? '中止原因：' : '转派备注：' }}{{ activity.remarks }}</p >
							</div>
						</div>
						<!-- <div class="card-time">
							<i class="el-icon-time avatar"></i>
							{{activity.operationTime}}
						</div> -->
					</el-card>
				</el-timeline-item>
			</el-timeline>
		</div>
		<placeholder v-else height="100px" />
	</div>
</template>
<script>
import Placeholder from '@/components/Placeholder';
export default {
  components: {
    Placeholder
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  }
};
</script>
<style lang="scss">
.demand-activity {
	.activity-card {
		width: 98%;
		color: #606266;
		.el-card__body {
			display: flex;
			justify-content: space-between;
			padding: 6px 10px 8px;
		}
		.card-container {
			display: flex;
			justify-content: space-between;
			.operator {
				font-size: 14px;
				font-weight: 600;
				color: #595a5e;
			}
			.avatar {
				margin: 6px 15px 0 0;
				width: 30px;
				height: 30px;
			}
		}
		.card-time, .role-name {
			min-width: 110px;
			color: #848c94;
			font-size: 12px;
		}
		.card-time {
			min-width: 140px;
			margin: 18px 0 0 20px;
		}
		.role-name {
			display: inline-block;
			margin-left: 8px;
		}
		.actions {
			color: #848c94;
			font-size: 12px;
			word-break: break-all;
		}
	}
	.el-timeline-item__timestamp {
		color: #606266 !important;
	}
	.supplier-avatar {
		color: #fff;
		min-width: 32px;
		margin: 6px 15px 0 0;
		background-color: #1891FF;
	}
}
</style>

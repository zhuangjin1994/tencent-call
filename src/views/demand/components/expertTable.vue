<template>
	<div class="experts-table">
		<el-table 
			:row-style="tableRowStyle" 
			@selection-change="handleSelectionChange" 
			:data="data" 
			:row-key="getRowkeys"
			:cell-style="{ padding: '6px 0 0', cursor: 'pointer' }"
			:row-class-name="tableRowStyle"
			@row-click="handleClickRow"
			height="70vh"
		>
      <el-table-column v-if="type=='checkList'" type="selection" width="55"/>
			<el-table-column
				v-for="(val, key) in TABLE_COLS_ENUM"
				:key="key"
				:prop="key"
				:label="val"
				show-overflow-tooltip
			></el-table-column>
			<el-table-column label="供应商" align="center">
				<template slot-scope="{row}">
					<el-popover placement="right" width="400" trigger="hover">
						<el-avatar slot="reference" :size="32" class="supplier-avatar">{{row.supplierName}}</el-avatar>
						<expert-popover :data="row" />
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column label="标识" align="center">
				<template slot-scope="{row}">
					<el-tooltip :content="row.collect == 0 ? '收藏' : '取消收藏'" placement="top" effect="dark">
						<svg-icon :icon-class="row.collect == 0 ? 'star-off' : 'star-on'" @click.stop="handleCollect(row)"
							class="light-star" />
					</el-tooltip>
					<el-tooltip :content="row.hide == 1 ? '取消隐藏' : '隐藏'" placement="top" effect="dark">
						<svg-icon :icon-class="row.hide == 1 ? 'view-off' : 'view-on'" @click.stop="handleMark(row)"
							class="view" />
					</el-tooltip>
				</template>
			</el-table-column>
		</el-table>
		<!-- 详情抽屉 -->
		<el-drawer
			ref="drawer"
			:size="$route.query.type === 'talent' ?  '50%' : '70%'"
			title="我是标题"
			:with-header="false"
			:visible.sync="drawer"
			direction="rtl">
			<expert-info
				:data="expertData"
				:operation="operationData"
				@closeDrawer='$refs.drawer.closeDrawer()'
				@getInfo="getExpertInfo"
				@refresh="refresh"
			/>
		</el-drawer>
	</div>
</template>
<script>
import { markExpert, getEchoExpert, expertOperation, getTalentExpert } from '@/api/demand.js';
import ExpertInfo from './ExpertInfo.vue';
import ExpertPopover from './expertPopover.vue';
let TABLE_COLS_ENUM = {
  expertName: '专家名称',
  industry: '行业',
  company: '公司',
  position: '职位',
  createdDate: '响应时间'
};
export default {
  components: {
    ExpertInfo,
    ExpertPopover
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      drawer: false,
      TABLE_COLS_ENUM,
      expertData: {},
      operationData: [],
      multipleSelection: []
    };
  },
  methods: {
    // 收藏-collect:1  取消收藏collect：0
    handleCollect(row) {
      const params = {
        collect: row.collect == 0 ? 1 : 0,
        responseId: row.responseId
      };
      markExpert(params).then(res => {
        this.$message.success(`${row.collect == 1 ? '取消收藏' : '收藏'}成功`);
        this.$emit('refresh');
      });
    },
    // 置灰-hide:1  取消置灰hide：0
    handleMark(row) {
      const params = {
        hide: row.hide == 0 ? 1 : 0,
        responseId: row.responseId
      };
      markExpert(params).then(res => {
        this.$message.success(`${row.hide == 1 ? '取消标记' : '标记'}成功`);
        this.$emit('refresh');
      });
    },

    tableRowStyle({ row, rowIndex }) {
      if (this.data[rowIndex].hide == 1) {
        return 'light-row table-row';
      }
      return 'table-row';
    },

    handleClickRow(row, column) {
      if (column && column.label == '操作') {
        return;
      }
      // 获取专家基本信息
      const params = {
        confirmId: row.confirmId,
        responseId: row.responseId
      };
      this.getExpertInfo(params);
      // 获取专家动态
      expertOperation({ responseId: row.responseId }).then(res => {
        this.operationData = res.data || [];
      }).catch(err => { });
    },

    getExpertInfo(params) {
      let api = this.$route.query.type === 'talent' ? getTalentExpert : getEchoExpert;
      api(params).then(res => {
        this.expertData = res.data || {};
        this.drawer = true;
      }).catch(err => { });
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    refresh() {
      this.$refs.drawer.closeDrawer();
      this.$emit('refresh');
    },

    getRowkeys(row) {
      return row.id;
    }
  }
};
</script>
<style lang="scss" scoped>
.experts-table {
	.avatar {
		height: 30px;
		width: 30px;
		margin-top: 5px;
		cursor: pointer;
	}

	.light-star {
		font-size: 20px;
		color: rgb(242, 203, 81);
	}

	.view {
		font-size: 20px;
		margin-left: 10px;
	}

	.el-table--striped .el-table__body tr.el-table__row--striped.current-row td,
	.el-table__body tr.current-row>td {
		color: #fff;
		background-color: #a2a4a7 !important;
	}
}
.supplier-avatar {
	color: #fff;
	background-color: #1891FF;
}
</style>
<style>
.el-table .light-row {
	background-color: #e4e4e4;
}

.el-table .common-row {
	background: #fff;
}

.table-row {
	cursor: pointer;
}
</style>

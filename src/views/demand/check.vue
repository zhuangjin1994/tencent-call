<template>
  <div>
    <el-card class="check-card">
      <div class="check-header">
        <div class="main-title">{{`【${confirmInfo.demandNum}】 ${confirmInfo.title}`}}</div>
        <!-- <el-button type="primary" @click="onConfirm">确认</el-button> -->
      </div>
      <el-collapse v-model="openeds">
        <el-collapse-item title='需求信息' name="1">
          <demand-content :data='confirmInfo'/>
        </el-collapse-item>
        <!-- delivery info -->
        <el-collapse-item title='交付信息' name="2">
          <div class="choose-tags" v-if="hasPermission">
            已选择：
            <el-tag effect="plain" :key="item.id" v-for="(item, index) in selectedTags" closable :disable-transitions="false" @close="handleClose(item, index)">
              {{`${item.supplierName} - ${item.expertName}`}}
            </el-tag>
            <el-button class="reset-btn" @click="resetTags" icon="el-icon-refresh-left">重置</el-button>
          </div>
          <div v-if="historyChoice.length">
            历史选择：
            <el-tag effect="plain" type="info" :key="item.id" v-for="item in historyChoice" :disable-transitions="false" >
              {{`${item.supplierName} - ${item.expertName}`}}
            </el-tag>
          </div>
          <!-- table -->
          <el-container class="container-wrapper">
            <el-aside width="220px">
              <el-menu :default-openeds="['disable', 'enable']" :default-active="supplierId">
                <el-submenu index="enable">
                  <template slot="title"><i class="el-icon-folder-opened"/>已响应</template>
                  <el-menu-item default-active="2" v-for="item in enabledList" :key="item.supplierAccountId" :index="item.supplierAccountId.toString()">
                    <div @click="onClickSupplier(item.supplierAccountId)">{{ item.accountName }}</div>
                  </el-menu-item>
                </el-submenu>
                <el-submenu index="disable">
                  <template slot="title"><i class="el-icon-folder" />未响应</template>
                  <el-menu-item v-for="item in disableList" :key="item.supplierAccountId" :index="item.supplierAccountId.toString()">
                    <div @click="onClickSupplier(item.supplierAccountId)">{{ item.accountName }}</div>
                  </el-menu-item>
                </el-submenu>
              </el-menu>
            </el-aside>
            <el-container>
              <el-header>
                项目列表
                <div>
                  <el-button v-if="hasPermission" type="primary" @click="onConfirm" :loading="loading.confirm">确定</el-button>
                  <el-button class="export-btn" icon="el-icon-download" @click="handleExport">导出</el-button>
                </div>
              </el-header>
              <el-main>
                <el-table v-loading="loading.table" :row-key="getRowKey" :data="tableData" ref='table' @selection-change="handleSelectionChange">
                  <el-table-column v-if="hasPermission" reserve-selection type="selection" width="55"/>
                  <el-table-column prop="createdDate" show-overflow-tooltip width="100" label="响应时间"/>
                  <el-table-column
                    v-for="(key, val) of TABLE_COLS_ENUM"
                    show-overflow-tooltip
                    :key="key"
                    :prop="val"
                    :label="key"
                    align="center"
                  />
                </el-table>
              </el-main>
            </el-container>
          </el-container>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>
<script>
const TABLE_COLS_ENUM = {
  expertId: '专家ID',
  expertName: '专家名称',
  industry: '行业',
  company: '目前公司',
  position: '目前职位',
  background: '资历背景',
  magnification: '倍率',
  speciality: '特长(产品/区域)',
  questionAnswer: '问题回答',
  convenientDate: '方便约谈时间',
  commend: '专家评价', // 后端说没有就后面再加此字段
  other: '其他'
};
import { mapGetters } from 'vuex'; 
import common from '@/mixins/common.js';
import { deepClone } from '@/utils';
import DemandContent from '@/components/DemandDetail/demandContent';
import {
  getDemandConfirmInfo,
  getHistoryChoice, 
  getEchoSupplier, 
  confirmChoose,
  getEchoExpert 
} from '@/api/demand.js';
export default {
  mixins: [common],
  components: {
    DemandContent
  },
  data() {
    return {
      selectedTags: [],
      confirmInfo: {},
      historyChoice: [],
      demandContent: {},
      openeds: ['1', '2'],
      TABLE_COLS_ENUM,
      supplierId: '',
      enabledList: [],
      disableList: [],
      tableData: [],
      loading: {
        confirm: false,
        table: false
      }
    };
  },
  computed: {
    demandId() {
      return this.$route.query.id;
    },
    hasPermission() {
      return this.confirmInfo.demander === this.userId;
    },
    ...mapGetters(['userId'])
  },
  methods: {
    async getDetail() {
      try {
        let res = await getDemandConfirmInfo({demandId: this.demandId});
        this.confirmInfo = res.data || {};
        const { purpose, background, expertRequirement, interviewQuestion } = this.confirmInfo;
        this.demandContent = { purpose, background, expertRequirement, interviewQuestion };
      } catch (err) {
        console.log(err);
      }
    },

    // 获取供应商
    async getSuppliers() {
      const { data } = await getEchoSupplier({demandId: this.demandId});
      this.enabledList = (data || []).filter(item => item.responsed);
      this.disableList = (data || []).filter(item => !item.responsed);
      let id = this.enabledList.length ? this.enabledList[0].supplierAccountId : this.disableList[0].supplierAccountId;
      this.supplierId = id;
      await this.getExperts(id);
    },

    // 获取供应商对应专家
    async getExperts(id) {
      this.loading.table = true;
      const params = {
        supplierId: id,
        demandId: this.demandId
      };
      const { data } = await getEchoExpert(params);
      this.loading.table = false;
      this.tableData = data.data || [];
    },

    // 获取历史选择
    getHistory() {
      getHistoryChoice({demandId: this.demandId}).then(res => {
        this.historyChoice = res.data || [];
      })
        .catch(_ => {});
    },

    async onClickSupplier(id) {
      this.supplierId = id;
      await this.getExperts(id);
      let table = this.tableData;
      let responseIds = this.selectedTags.map(item => item.responseId);
      // let expertIds = this.selectedTags.map(item => item.expertId)
      // let supplierIds = this.selectedTags.map(item => item.supplierAccountId)
      // let times = this.selectedTags.map(item => item.createdDate)
      table.forEach(row => {
        this.$refs.table.toggleRowSelection(row, false);
        // if (expertIds.includes(row.expertId) && supplierIds.includes(row.supplierAccountId) && times.includes(row.createdDate)) {
        if (responseIds.includes(row.responseId)) {
          this.$refs.table.toggleRowSelection(row, true);
        }
      });    
    },

    onConfirm() {
      this.loading.confirm = true;
      let responseIdList = this.selectedTags.map(item => item.responseId);
      const params = {
        responseIdList,
        demandId: this.demandId
      };
      confirmChoose(params).then(res => {
        this.$message.success('确认成功');
        this.$router.push('/demand/list');
      }) .finally(_ => this.loading.confirm = false);
    },

    handleExport() {
      let params = {
        demandId: this.demandId,
        supplierId: this.supplierId,
      };
      this.downloadExcel('/excel/expertListExport', params, '专家信息');
    },

    handleSelectionChange(val) {
      this.selectedTags = val;
      // this.selectedTags = val
      // let data = deepClone(this.selectedTags)
      // data.push(...val)
      // let obj = {}
      // let res = []
      // // 避免重复添加相同的专家，此处去重
      // res = data.reduce((prev, cur) => {
      //   if (obj[cur.expertId] && obj[cur.supplierId]){} 
      //   else {
      //     obj[cur.supplierId] = true
      //     obj[cur.expertId] = true
      //     prev.push(cur)
      //   }
      //   return prev
      // }, [])
      // this.selectedTags = res
    },

    resetTags() {
      this.selectedTags = [];
      this.$refs.table.clearSelection();
    },

    handleClose(item, index) {
      this.selectedTags.splice(index, 1);
      this.$refs.table.toggleRowSelection(item, false);
    },
    getRowKey(row){
      return row.responseId;
    },
    handleChange() {},
  },
  async mounted() {
    this.getHistory();
    await this.getDetail();
    await this.getSuppliers();
  }
};
</script>
<style lang="scss" scoped>
$border: 1px solid #E9E9E9;
.check-card {
  min-height: 700px;
  .check-header {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
    .main-title {
      color: #606266;
      font-size: 18px;
      font-weight: 600;
    }
  }

  .el-tag + .el-tag {
    margin-left: 10px;
    margin-top: 8px;
  }
  .choose-tags {
    min-height: 26px;
    margin-bottom: 16px;
    .reset-btn {
      float: right;
    }
  }
  .container-wrapper {
    height: 610px;
    margin-top: 20px;
    .el-aside {
      border: $border;
      border-right: none;
    }
    .el-container {
      border: $border;
      .el-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #303133;
        border-bottom: 1px solid #f4f4f5;
        font-size: 16px;
      }
      .export-btn {
        color: #016FFA;
        border: 1px solid #016FFA;
      }
    }
  }
  .descStyle {
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    display: -webkit-box;
    /* autoprefixer: off */// autoprefixer会自动移除老式过时的代码, 添加注释关闭autoprefixer
    -webkit-line-clamp: 2; //行数
    -webkit-box-orient: vertical;
  }
}
</style>

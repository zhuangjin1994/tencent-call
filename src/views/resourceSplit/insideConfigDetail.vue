<template>
  <!--内部配置详情-->
    <el-container class="check-detail">
        <el-header height="">
            <div class="btn-header" v-if='info.auditStatus === "rejected"'>
                <div >
                    <span class="editBtns">
                        <el-button  type="primary" icon="el-icon-edit" @click="gotoEdit">编辑</el-button>
                    </span>
                </div>
            </div>
        </el-header>
        <el-main>
            <el-collapse v-model="activeNames">
                <el-collapse-item name="1" title="配置记录">
                    <audit-steps :data="auditHistory"/>
                </el-collapse-item>
                <el-collapse-item name="2" title="配置信息" >
                    <el-descriptions >
                        <el-descriptions-item label="单号">{{info.billNumber}}</el-descriptions-item>
                        <el-descriptions-item label="申请人">{{info.applier}}</el-descriptions-item>
                        <el-descriptions-item label="审批人" >
                        <text-tooltips :text="info.auditor || '--'"  />
                        </el-descriptions-item>
                        <el-descriptions-item label="申请时间">{{info.applyDate}}</el-descriptions-item>
                    </el-descriptions>
                </el-collapse-item>
                <el-collapse-item name="3" title="基本信息">
                    <el-table show-summary :summary-method="getSummaries" :data="form.domains"
                        border
                        style="width: 100%">
                        <el-table-column
                        prop="departmentName"
                        label="部门名称"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="preparationHours"
                        label="配额时长"
                        >
                        </el-table-column>
                    </el-table>
                </el-collapse-item>          
                <el-collapse-item name="4" title="资源附件">
                    <template slot="title">
                        资源附件
                        <el-button v-if="fileLists && fileLists.length" class="collapse-btn" type="text" @click.stop="handleBatchDownload">
                        <i class="el-icon-download" style="margin-right:2px"></i>
                        一键下载
                        </el-button>
                    </template>
                    <file-list :data="fileLists"/>
                </el-collapse-item>
            </el-collapse>
        </el-main>    
    </el-container>
          
</template>
<script>
import { mapGetters } from 'vuex';
import common from '@/mixins/common.js';
import TextTooltips from '@/components/TextTooltips';
import uploadCos from '@/mixins/uploadCos.js'; 
import FileList from '@/components/DemandDetail/fileList.vue'; 
import AuditSteps from '@/components/DemandDetail/auditSteps.vue';
import {insideConfigDetail} from '@/api/supplier.js';
export default {
  name: 'insideDetail',
  data() {
    return {
      activeNames: ['1', '2', '3', '4'],
      billNumber: '',
      auditHistory: [],
      fileLists: [],
      info: {
        billNumber: '',
        applier: '',
        auditor: '',
        applyDate: '',
        auditStatus: ''
      },
      form: {
        domains: [],
        attatchmentList: []
      }
    };    
  },
  mixins: [common, uploadCos],
  components: {
    FileList,
    TextTooltips,
    AuditSteps
  },
  created(){
    let {billNumber} = this.$route.params;
    this.billNumber = billNumber;
  },
  mounted(){
    this.fetchData();
  },
  methods: {
    gotoEdit(){
      this.$router.push({ path: `/resourceSplit/insideAdd/${this.billNumber}` }); 
    },
    fetchData() {
      const parms = {'billNumber': this.billNumber};
      insideConfigDetail(parms).then(res => {
        const {resourceDetail, resourceRecords} = res.data;
        this.auditHistory = resourceRecords; // 配置记录
        const {billNumber, applier, auditor, applyDate, supplierName, supplierId,
          supplierBelong, applyHours, attatchmentList, auditStatus} = resourceDetail;
        this.info.billNumber = billNumber;
        this.info.applier = applier;
        this.info.auditor = auditor;
        this.info.applyDate = applyDate;
        this.info.auditStatus = auditStatus;
        // 基本信息
        const deepData = resourceDetail.resourceList;
        deepData.forEach((item) => {
          item['preparationHours'] = Number(item['preparationHours'] / 60).toFixed(3);
        });
        this.form.domains = deepData;
        // 附件
        this.fileLists = attatchmentList;

      }).catch(_ => {});
    },
    handleBatchDownload() {
      if (!this.fileLists.length) {
        this.$message.error('暂无文件可下载');
        return;
      }
      let files = this.fileLists.map(item => ({key: item.attachmentKey, name: item.attachmentName}));
      this.batchDownloadFile(files);
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        // 第一列 显示文字 小计
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        if (index === 1) { // 第三列 显示合计
          sums[index] = data.reduce((sum, current) => sum + Number(current.preparationHours), 0).toFixed(3);
        }
      });
      return sums;
    }
  }


};
</script>
<style lang="scss">
@import "@/style/mixin.scss";
.el-container {
  margin: 0 10px;
  height: 100%;
  overflow: hidden;
    .btn-header {
        display: flex;
        margin-bottom: 5px;
        justify-content: flex-end;
        .editBtns{
            display: flex;
            justify-content: flex-end;
            margin-right: 50px;
        }
    }
}

.el-header {
  background-color: #fff;
  color: #191b27;
  padding: 10px 10px 17px 20px;
  font-size: 20px;
  border-bottom: 2px solid #eee;
}
.el-main {
    padding: 0;
    overflow-x: hidden;
    background-color: #fff;
    color: #333;
    height: 100%;
}

.check-detail {
  .el-form-item, .el-form-item__content {
    width: 100%;
  }
  .el-collapse-item__content {
    padding: 10px 0 25px 40px;
  }
}
.el-descriptions-item__content{
  width:200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

</style>

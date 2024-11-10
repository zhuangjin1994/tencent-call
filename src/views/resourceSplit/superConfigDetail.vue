<template>
  <!--供应商配置详情-->
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
                        <el-descriptions-item label="审批人">
                            <text-tooltips :text="info.auditor || '--'"  />
                        </el-descriptions-item>
                        <el-descriptions-item label="申请时间">{{info.applyDate}}</el-descriptions-item>
                    </el-descriptions>
                </el-collapse-item>
                <el-collapse-item name="3" title="基本信息">
                    <el-form ref="form" label-width="110px" :model="form" >
                        <el-form-item label="供应商类型：" prop="supplierBelong" >
                            <el-radio  v-model="form.supplierBelong" :label="0" disabled>国内</el-radio>
                            <el-radio  v-model="form.supplierBelong" :label="1" disabled>国外</el-radio>
                        </el-form-item>
                        <el-form-item label="供应商名称：" prop="accountName">
                            <el-input readonly  v-model="form.accountName" class='inputStyle' disabled></el-input>
                        </el-form-item>
                        <el-form-item  label="资源配置：" prop='preparationHours'>
                            <el-input readonly  v-model="form.preparationHours" class='inputStyle' disabled>
                            <template slot="append">时</template>
                            </el-input>
                        </el-form-item>
                    </el-form>    
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
import {superConfigDetail} from '@/api/supplier.js';
export default {
  name: 'superConfigDetail',
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
        supplierBelong: 0,
        accountName: '',
        preparationHours: '',
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
      this.$router.push({ path: `/resourceSplit/superAdd/${this.billNumber}` }); 
    },
    fetchData() {
      const parms = {'billNumber': this.billNumber};
      superConfigDetail(parms).then(res => {
        const {resourceDetail, resourceRecords} = res.data;
        this.auditHistory = resourceRecords; // 配置记录
        const {billNumber, applier, auditor, applyDate, supplierName, supplierId, supplierBelong, applyHours, attatchmentList, auditStatus} = resourceDetail;
        this.info.billNumber = billNumber;
        this.info.applier = applier;
        this.info.auditor = auditor;
        this.info.applyDate = applyDate;
        this.info.auditStatus = auditStatus;
        // 基本信息
        this.form.supplierBelong = supplierBelong;
        this.form.accountName = supplierName;
        this.form.preparationHours = Number(applyHours / 60).toFixed(3); 
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
    }
  }


};
</script>
<style lang="scss" scoped>
@import "@/style/mixin.scss";
.el-container {
  margin: 0 10px;
  height: 100%;
  overflow: hidden;
  .btn-header {
        display: flex;
        margin-bottom: 5px;
        justify-content: flex-end;;
   }
  .el-header {
    background-color: #fff;
    color: #191b27;
    padding: 10px 10px 17px 20px;
    font-size: 20px;
    border-bottom: 2px solid #eee;
    .editBtns{
        display: flex;
        justify-content: flex-end;
        margin-right: 50px;
        }
    }
  .el-main {
    padding: 0;
    overflow-x: hidden;
    background-color: #fff;
    color: #333;
    height: 100%;
    .inputStyle{
        width: 60%;
        }
    }
}
</style>
<style lang="scss">
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

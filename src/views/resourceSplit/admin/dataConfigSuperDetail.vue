<template>
  <!--超管供应商详情-->
  <el-container class="check-detail">
    <el-header height="">
      <div class="btn-header">
        <div>
          <span class="demand-num"></span>
        </div>
        <div v-if="(auditStatus === 'approving')">
          <span class="btns">
            <el-button @click="handleAudit('approved')" :loading='loading.approved' type="primary" icon="el-icon-check">
              通过</el-button>
            <el-button @click="handleAudit('rejected')" :loading='loading.rejected' icon="el-icon-close">驳回</el-button>
          </span>
        </div>
      </div>
    </el-header>
    <el-main>
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1" title="配置记录">
          <audit-steps :data="auditHistory" />
        </el-collapse-item>
        <el-collapse-item name="2" title="配置信息">
          <el-descriptions :column="3">
            <el-descriptions-item label="单号">{{ info.billNumber }}</el-descriptions-item>
            <el-descriptions-item label="申请人">{{ info.applier }}</el-descriptions-item>
            <el-descriptions-item label="审批人" >
              <text-tooltips :text="info.auditor || '--'"  />
            </el-descriptions-item>
            <el-descriptions-item label="申请时间">{{ info.applyDate }}</el-descriptions-item>
          </el-descriptions>  
        </el-collapse-item>
        <el-collapse-item name="3" title="基本信息">
          <el-form ref="form" label-width="110px" :model="form">
            <el-form-item label="供应商类型：" prop="supplierBelong">
              <el-radio v-model="form.supplierBelong" :label="0" disabled>国内</el-radio>
              <el-radio v-model="form.supplierBelong" :label="1" disabled>国外</el-radio>
            </el-form-item>
            <el-form-item label="供应商名称：" prop="accountName">
              <el-input readonly v-model="form.accountName" class='inputStyle' disabled></el-input>
            </el-form-item>
            <el-form-item label="资源配置：" prop='preparationHours'>
              <el-input readonly v-model="form.preparationHours" class='inputStyle' disabled>
                <template slot="append">时</template>
              </el-input>
            </el-form-item>
          </el-form>
        </el-collapse-item>
        <el-collapse-item name="4" title="资源附件">
          <template slot="title">
            资源附件
            <el-button v-if="fileLists && fileLists.length" class="collapse-btn" type="text"
              @click.stop="handleBatchDownload">
              <i class="el-icon-download" style="margin-right:2px"></i>
              一键下载
            </el-button>
          </template>
          <file-list :data="fileLists" />
        </el-collapse-item>
      </el-collapse>
    </el-main>
    <el-footer height="70px" v-if="this.auditStatus == 'approving' ">
      <el-form ref="form" size="mini" :rules="rules">
        <el-form-item class="remark" prop="auditOpinion" label="审批意见：">
          <el-input style="width:90%" type="textarea" :rows="2" :disabled="auditStatus != 'approving'"
            placeholder="请输入审批备注" v-model="auditOpinion" maxlength=999></el-input>
        </el-form-item>
      </el-form>
    </el-footer>
  </el-container>
</template>
<script>
import common from '@/mixins/common.js';
import TextTooltips from '@/components/TextTooltips';
import uploadCos from '@/mixins/uploadCos.js';
import { CheckStatusEnum } from '@/enums/index.js';
import { superConfigDetail, adminAuditDetail } from '@/api/supplier.js';
import FileList from '@/components/DemandDetail/fileList.vue';
import AuditSteps from '@/components/DemandDetail/auditSteps.vue';
export default {
  mixins: [common, uploadCos],
  components: {
    FileList,
    TextTooltips,
    AuditSteps
  },
  computed: {
    id() {
      return this.$route.query.id;
    }
  },

  data() {
    return {
      demandInfo: {},
      billNumber: '',
      auditStatus: '', // 审批状态
      CheckStatusEnum,
      activeNames: ['1', '2', '3', '4'],
      fileLists: [],
      auditHistory: [],
      info: {
        billNumber: '',
        applier: '',
        auditor: '',
        applyDate: ''
      },
      form: {
        supplierBelong: '',
        accountName: '',
        preparationHours: '',
        attatchmentList: []
      },
      auditOpinion: '',
      loading: {
        approved: false,
        rejected: false
      },
      rules: {
        auditOpinion: [{ max: 999, message: '备注最多填写999字符', trigger: 'change' }]
      }
    };
  },
  methods: {
    fetchData() {
      const parms = { 'billNumber': this.billNumber };
      superConfigDetail(parms).then(res => {
        const { resourceDetail, resourceRecords } = res.data;
        this.auditHistory = resourceRecords; // 配置记录
        const { auditStatus, billNumber, applier, auditor, applyDate, supplierName, supplierId, supplierBelong, applyHours, attatchmentList
        } = resourceDetail;
        this.auditStatus = auditStatus;
        this.info.billNumber = billNumber;
        this.info.applier = applier;
        this.info.auditor = auditor;
        this.info.applyDate = applyDate;
        // 基本信息
        this.form.supplierBelong = supplierBelong;
        this.form.accountName = supplierName;
        this.form.preparationHours = Number(applyHours / 60).toFixed(3);
        // 附件
        this.fileLists = attatchmentList;

      }).catch(_ => { });
    },
    // 审批
    handleAudit(key) {
      let loadingKey = key === 'approved' ? 'approved' : 'rejected';
      this.loading[loadingKey] = true;
      const params = {
        auditStatus: key,
        billNumber: this.billNumber,
        remark: this.auditOpinion
      };
      adminAuditDetail(params).then(res => {
        this.$message.success('操作成功');
        this.$router.push('/resourceSplit/dataConfigSuper?pages=supplier');
      }).finally(_ => this.loading[loadingKey] = false);
    },

    handleBatchDownload() {
      if (!this.fileLists.length) {
        this.$message.error('暂无文件可下载');
        return;
      }
      let files = this.fileLists.map(item => ({ key: item.attachmentKey, name: item.attachmentName }));
      this.batchDownloadFile(files);
    }
  },
  created() {
    let { billNumber } = this.$route.params;
    this.billNumber = billNumber;
  },
  mounted() {
    this.fetchData();
  }
};
</script>
<style lang="scss" scoped>
@import "@/style/mixin.scss";

.el-container {
  margin: 0 10px;
  height: 100%;
  overflow: hidden;
}

.el-header {
  background-color: #fff;
  color: #191b27;
  padding: 10px 10px 17px 20px;
  font-size: 20px;
  border-bottom: 2px solid #eee;

  .demand-num {
    font-weight: 600;
    font-size: 16px;
  }

  .btn-header {
    display: flex;
    margin-bottom: 5px;
    justify-content: space-between;

    .demand-status {
      color: #016FFA;
      font-size: 12px;
      margin-left: 40px;
    }

    .btns {
      margin-right: 10px;
    }

    .dot {
      content: '';
      display: inline-block;
      margin-right: 6px;
      vertical-align: middle;
      margin-bottom: 2px;
      @include circle(4px, #016FFA);
    }
  }

  .main-title {
    display: block;
    font-size: 14px;
  }
}

.el-main {
  overflow-x: hidden;
  padding: 0;
  // padding-left: 20px;
  background-color: #fff;
  color: #333;
  height: 100%;

  .inputStyle {
    width: 60%;
  }
}

.el-footer {
  padding: 10px;
  background: #fff;
  text-align: center;
  border-top: 2px solid #eee;
}
</style>
<style lang="scss">
.check-detail {

  .el-form-item,
  .el-form-item__content {
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
  text-overflow: ellipsis
}

</style>

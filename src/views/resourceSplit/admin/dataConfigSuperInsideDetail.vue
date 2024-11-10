<template>
  <!--超管内部资源配置详情-->
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
            <el-descriptions-item label="审批人">
              <text-tooltips :text="info.auditor || '--'"  />
            </el-descriptions-item>
            <el-descriptions-item label="申请时间">{{ info.applyDate }}</el-descriptions-item>
          </el-descriptions>
        </el-collapse-item>
        <el-collapse-item name="3" title="基本信息">
          <el-table show-summary  :summary-method="getSummaries" :data="form.domains" border style="width: 100%">
            <el-table-column prop="departmentName" label="部门名称">
            </el-table-column>
            <el-table-column prop="preparationHours" label="配额时长">
            </el-table-column>
          </el-table>
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
          <el-input style="width:90%" type="textarea" :disabled="auditStatus != 'approving'" :rows="2"
            placeholder="请输入审批意见" v-model="auditOpinion" maxlength=999></el-input>
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
import { superConfigInsideDetail, adminAuditInsideDetail } from '@/api/supplier.js';
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
        domains: [],
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
      superConfigInsideDetail(parms).then(res => {
        const { resourceDetail, resourceRecords } = res.data;
        this.auditHistory = resourceRecords; // 配置记录
        const { auditStatus, billNumber, applier, auditor, applyDate, supplierName, supplierId, supplierBelong, applyHours, attatchmentList } = resourceDetail;
        this.auditStatus = auditStatus;
        this.info.billNumber = billNumber;
        this.info.applier = applier;
        this.info.auditor = auditor;
        this.info.applyDate = applyDate;
        // 基本信息
        const deepData = resourceDetail.resourceList;
        deepData.forEach((item) => {
          item['preparationHours'] = Number(item['preparationHours'] / 60).toFixed(3);
        });
        this.form.domains = deepData;
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
      adminAuditInsideDetail(params).then(res => {
        this.$message.success('操作成功');
        this.$router.push('/resourceSplit/dataConfigSuper?pages=default');
      }).finally(_ => this.loading[loadingKey] = false);
    },
    handleBatchDownload() {
      if (!this.fileLists.length) {
        this.$message.error('暂无文件可下载');
        return;
      }
      let files = this.fileLists.map(item => ({ key: item.attachmentKey, name: item.attachmentName }));
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
  },
  created() {
    let { billNumber } = this.$route.params;
    this.billNumber = billNumber; // 审批用
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
  padding-bottom: 15px;

  .el-form-item,
  .el-form-item__content {
    width: 100%;
  }

  .el-collapse-item__content {
    padding: 10px 0 25px 40px;
  }
}

.el-descriptions-item__container{
  align-items: center
}

.el-descriptions-item__content{
  width:200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

</style>

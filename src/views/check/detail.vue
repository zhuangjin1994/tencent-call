<template>
  <el-container class="check-detail" v-loading="loading.page">
    <el-header height="">
      <div class="btn-header">
        <div>
          <span class="demand-num">{{ demandInfo.demandNum }}</span>
        </div>
        <div>
          <span class="btns" v-if="['业务审批人', '统管审批人'].includes(demandInfo.actionName)">
            <el-button size="mini" @click="handleAudit('agree')" type="primary"
              icon="el-icon-check">通过</el-button>
            <el-button size="mini" @click="handleAudit('reject')" icon="el-icon-close">驳回
            </el-button>
          </span>
        </div>
      </div>
      <span class="check-title">
        <tool-tips :contentText="demandInfo.title"></tool-tips>
      </span>
    </el-header>
    <el-main>
      <el-collapse v-model="spreads">
        <el-collapse-item name="basicInfo" title="基本信息">
          <demand-content :data='demandInfo' />
        </el-collapse-item>
        <el-collapse-item name="files" title="需求附件">
          <template slot="title">
            需求附件
            <el-button v-if="fileList && fileList.length" class="collapse-btn" type="text"
              @click.stop="handleBatchDownload">
              <i class="el-icon-download" style="margin-right:2px"></i>
              一键下载
            </el-button>
          </template>
          <file-list :data="fileList" />
        </el-collapse-item>
        <el-collapse-item name="audits" title="审批记录">
          <audit-steps :data="examRecords" />
        </el-collapse-item>
      </el-collapse>
    </el-main>
    <el-footer v-if="['业务审批人', '统管审批人'].includes(demandInfo.actionName)" height="70px">
      <el-form ref="form" size="mini" inline :rules="rules">
        <el-form-item class="remark" prop="auditOpinion">
          <label class="remark-lable">审批意见：</label>
          <el-input class="remark-text" type="textarea" :rows="1" placeholder="请输入审批意见" v-model="auditOpinion">
          </el-input>
        </el-form-item>
      </el-form>
    </el-footer>
  </el-container>
</template>
<script>
import { mapGetters } from 'vuex';
import common from '@/mixins/common.js';
import ToolTips from '@/components/ToolTips';
import uploadCos from '@/mixins/uploadCos.js';
import { 
  auditDemand,
  getDemandInfo,
  getAttatchmentList,
  getAuditHistory,
  getDataPermission
} from '@/api/demand.js';
import DemandContent from '@/components/DemandDetail/demandContent';
import FileList from '@/components/DemandDetail/fileList.vue';
import AuditSteps from '@/components/DemandDetail/auditSteps.vue';
export default {
  mixins: [common, uploadCos],
  components: {
    FileList,
    ToolTips,
    AuditSteps,
    DemandContent
  },
  computed: {
    id() {
      return this.$route.query.id;
    },
    ...mapGetters(['userId'])
  },
  data() {
    return {
      demandInfo: {},
      spreads: ['basicInfo', 'files', 'audits'],
      fileList: [],
      examRecords: [],
      auditOpinion: '',
      loading: {
        page: false,
        agree: false,
        reject: false
      },
      rules: {
        auditOpinion: [{ max: 999, message: '备注最多填写999字符', trigger: 'change' }]
      }
    };
  },
  methods: {
    fetchData() {
      getDemandInfo({ demandId: this.id }).then(res => {
        this.demandInfo = res.data || {};
        const { approver, actionName } = this.demandInfo;
      }).catch(_ => { });
    },

    getFileList() {
      const params = {
        businessId: this.id,
        attachmentType: 'description'
      };
      getAttatchmentList(params).then(res => {
        this.fileList = res.data || [];
      }).catch(_ => { });
    },

    getExamRecords() {
      getAuditHistory({ demandId: this.id }).then(res => {
        this.examRecords = res.data || [];
      }).catch(_ => { });
    },

    handleAudit(key) {
      this.loading.page = true
      // let loadingKey = key === 'agree' ? 'agree' : 'reject';
      // this.loading[loadingKey] = true;
      const params = {
        demandStatus: key,
        demandId: this.id,
        auditOpinion: this.auditOpinion
      };
      auditDemand(params).then(res => {
        this.$message.success('操作成功');
        this.$router.push('/demand/check');
      }).finally(_ => this.loading.page = false);
    },

    handleBatchDownload() {
      if (!this.fileList.length) {
        this.$message.error('暂无文件可下载');
        return;
      }
      let files = this.fileList.map(item => ({ key: item.attachmentKey, name: item.attachmentName }));
      this.batchDownloadFile(files);
    }
  },
  mounted() {
    let params = {
      type: 'auditDetail',
      id: this.$route.query.id
    };
    getDataPermission(params).then(res => {
      if (res.data == 'true') {
        this.fetchData();
        this.getFileList();
        this.getExamRecords();
      } else {
        this.$router.push('/demand/list');
        this.$message.error('您暂无权限访问该页面，已返回首页');
      }
    }).catch(err => { // todo：只在getDataPermission出错时进入
      // this.$message.error('权限查询失败，请稍后再试')
      this.$router.push('/demand/list');
    });
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'CheckDetail' && from.name === 'DemandIndex') {
      const breadList = [
        { title: '需求列表', path: { path: '/demand/list' } },
        { title: '审批详情', path: '' },
      ];
      window.localStorage.setItem('customBread', JSON.stringify(breadList));
    } else {
      window.localStorage.setItem('customBread', '');
    }
    next();
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

  .check-title {
    display: block;
    font-size: 14px;
  }
}

.el-main {
  overflow-x: hidden;
  padding: 0;
  background-color: #fff;
  color: #333;
  height: 100%;
}

.el-footer {
  padding: 20px 10px;
  text-align: center;
  border-top: solid 1px #d0d0d0;
  background: #fff;
}

.remark {
  text-align: left;
}

.remark-lable {
  margin-right: 10px;
}

.remark-text {
  width: calc(100% - 88px);
  background-color: #f6f5f5;

}

::v-deep {
  .el-textarea__inner {
    background-color: #f6f5f5;
  }
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
</style>

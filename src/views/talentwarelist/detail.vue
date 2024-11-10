<template>
  <div class="talent-detail">
    <el-card class="header-filter">
      <div class="main-title">{{`[${demandInfo.demandNum}] ${demandInfo.title}`}}</div>
      <el-collapse :value="['1']">
        <!-- 需求信息 -->
        <el-collapse-item name="1">
          <template slot="title">
            需求信息
          </template>
          <demand-content :data='demandInfo'/>
        </el-collapse-item>
      </el-collapse>
      <div class="table-header">
        <div class="title">数据列表</div>
        <div class="operate-btn" style="display: flex">
          <el-input style="margin-right:16px" v-model="keyword" type="text" placeholder="请输入关键字">
            <i slot="suffix" class="el-icon-search" style="cursor: pointer;line-height:32px" @click="initTalentFiles"></i>
          </el-input>
          <el-button v-auth="['coAdministrator', 'suAdministrator']" @click="handleClickFile('bacth_download')" type="primary">一键下载</el-button>
        </div>
      </div>
      <el-container class="container-wrapper">
        <el-aside width="220px">
          <el-menu :default-active="supplierId">
            <el-menu-item v-for="(item, index) in supplierList" :key="index" :index="item.toString()">
              <div @click="onClickSupplier(item)">{{ item }}</div>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <el-table v-loading="loading" height="500px" :data="tableData" ref='table'>
            <el-table-column label="编号">
              <template slot-scope="scope">
                {{scope.$index + 1 > 9 ? scope.$index + 1 : `0${scope.$index + 1}`}}
              </template>
            </el-table-column>
            <el-table-column
              v-for="(key, val) of TABLE_COLS_ENUM"
              :key="key"
              show-overflow-tooltip
              :prop="val"
              :label="key"
            />
          <el-table-column label="操作" align="center">
            <template slot-scope="{row}">
              <el-button type="text" size="mini" @click="handleClickFile('preview', row)">预览</el-button>
              <el-button v-auth="['coAdministrator', 'suAdministrator']" type="text" size="mini" @click="handleClickFile('download', row)">下载</el-button>
            </template>
          </el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-card>
    <preview-dialog :dialog-visible.sync="previewDialogVisible" :url="localUrl" :type="uploadType" />
  </div>
</template>
<script>
const TABLE_COLS_ENUM = {
  expertName: '专家姓名',
  attachmentName: '文件名',
  uploadDate: '上传时间',
};
import { mapGetters } from 'vuex';
import uploadCos from '@/mixins/uploadCos.js';
import PreviewDialog from '@/components/Upload/PreviewDialog';
import { getDemandInfo, } from '@/api/demand.js';
import {
  queryTalentFiles,
  getTalentAuth,
  applyAuthority
} from '@/api/talent.js';
// import DemandContent from '../demand/components/DemandContent'
import DemandContent from '@/components/DemandDetail/demandContent';
export default {
  mixins: [uploadCos],
  components: {
    DemandContent,
    PreviewDialog
  },
  computed: {
    id() {
      return this.$route.query.id;
    },
    ...mapGetters(['roles'])
  },
  data() {
    return {
      keyword: '',
      tableData: [],
      TABLE_COLS_ENUM,
      demandInfo: {},
      demandContent: {},
      supplierList: [],
      supplierId: '',
      allListData: [],
      loading: false,
      // 预览dialog      
      previewDialogVisible: false,
      uploadType: 'jpg',
      localUrl: ''
    };
  },
  methods: {
    initDemandInfo() {
      getDemandInfo({demandId: this.id}).then(res => {
        this.demandInfo = res.data || {};
        const { purpose, background, expertRequirement, interviewQuestion } = this.demandInfo;
        this.demandContent = { purpose, background, expertRequirement, interviewQuestion };
      }).catch(_ => {});
    },

    initTalentFiles() {
      this.loading = true;
      const params = {
        demandId: this.id,
        keyword: this.keyword
      };
      queryTalentFiles(params).then(res => {
        this.allListData = res.data || [];
        this.supplierList = res.data.map(item => item.supplierName);
        if (this.supplierList.length) {
          this.onClickSupplier(this.supplierList[0]);
          this.supplierId = this.supplierList[0];
        } else {
          this.tableData = [];
        }
      }).catch(_ => {})
        .finally(_ => {
          this.loading = false;
        });
    },

    onClickSupplier(name) {
      let data = this.allListData.find(item => item.supplierName === name);
      this.tableData = data.attachMentList || [];
    },

    handleClickFile(type, row) {
      // 超管/普管拥有直接操作附件的权限
      if (['coAdministrator', 'suAdministrator'].includes(this.roles[0])) {
        this.handleFileOperate(type, row);
        return;
      }
      getTalentAuth({demandId: this.id}).then(res => {
        this.handleFileOperate(type, row);
      }).catch(err => {
        this.$confirm('当前文件暂无操作权限，即将向需求创建人发起申请，是否确认？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
          applyAuthority({ demandId: this.id }).then(res => {
            this.$message.success(`申请成功，请等待审批结果`);
          }).catch(_ => {});
        }).catch(_ => {});
      });
    },

    handleFileOperate(type, row) {
      if (type === 'preview') {
        this.previewFile({name: row.attachmentName, key: row.attachmentKey});
      } else if (type === 'download') {
        this.downloadFile({name: row.attachmentName, key: row.attachmentKey});
      } else {
        if (!this.tableData.length) {
          this.$message.error('暂无文件可下载');
          return;
        }
        let files = this.tableData.map(item => ({key: item.attachmentKey, name: item.attachmentName}));
        this.batchDownloadFile(files);
      }
    },
    
    onSearch() {
      this.fetchData();
    },
    onReset() {
      this.keyword = '';
    }
  },
  mounted() {
    this.initDemandInfo();
    this.initTalentFiles();
  }
};
</script>
<style lang="scss" scoped>
.main-title {
  font-weight: 600;
  color: #606266;
  font-size: 18px;
}
.el-container {
  border-top: #D8D8D8 1px solid;
}
.el-aside {
  border-right: 1px solid #D9D9D9;
}
.el-main {
  padding: 0 20px !important;
}
.table-header { 
  display: flex;
  padding-bottom: 16px;
  justify-content: space-between;
  .title {
    color: #016FFA;
    font-size: 16px;
    font-weight: 600;
  }
}
</style>

<template>
  <el-dialog title="附件列表" @open="initAttatchments" @close="resetForm" :visible.sync="visible" class="dialog-container file-dialog" width="548px">
    <el-table :data="tableData" height="400px">
      <el-table-column prop="attachmentName" label="文件名" show-overflow-tooltip=""/>
      <el-table-column  v-if="params.attachmentType=='accept'" label="是否共享">
        <template slot-scope="{row}">
          <el-switch
            :value="row.share"
            active-color="#027AFF"
            inactive-color="#E5E5E5"
            :active-value="0"
            :disabled="!hasPermission"
            @change="handleChangeStatus(row)"
            :inactive-value="1">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="text" @click="handlePreview(row)">预览</el-button>
          <el-button type="text" @click="handleDownload(row)">下载</el-button>          
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <div v-if="params.attachmentType=='accept'" class="share-btn">
        一键共享
        <el-switch
          :disabled="!hasPermission"
          :value="ifShare"
          active-color="#027AFF"
          inactive-color="#E5E5E5"
          :active-value="0"
          @change="handleBatchShare"
          :inactive-value="1">
        </el-switch>
      </div>
      <el-button type="primary" @click="handleBatchDownload">一键下载</el-button>          
    </div>
    <preview-dialog :dialog-visible.sync="previewDialogVisible" :url="localUrl" :type="uploadType" />
  </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex';
import uploadCos from '@/mixins/uploadCos.js';
import PreviewDialog from '@/components/Upload/PreviewDialog';
import { getAttatchmentList, shareFiles } from '@/api/demand.js';
export default {
  mixins: [uploadCos],
  components: {
    PreviewDialog
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    params: {
      businessId: '',
      attachmentType: 'description'
    },
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tableData: [],
      ifShare: 1,

      // 预览dialog      
      previewDialogVisible: false,
      uploadType: 'jpg',
      localUrl: ''
    };
  },
  computed: {
    id() {
      return this.$route.query.id;
    },
    visible: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit('update:dialogVisible', val);
      }
    },
    // 共享/下载只在【当前需求为自己创建】时可编辑
    hasPermission() {
      return this.name === this.userId;
    },
    ...mapGetters(['userId'])
  },
  methods: {
    initAttatchments() {
      getAttatchmentList(this.params).then(res => {
        this.tableData = res.data || [];
        this.changeBacthBtn();
      }).catch(_ => {});
    },

    // 单个共享
    handleChangeStatus(row) {
      // share: 0--共享  1--不共享 
      let share = row.share == 1 ? 0 : 1;
      shareFiles({attachmentList: [row.attatchmentId], share }).then(res => {
        this.$message.success('操作成功');
        this.changeBacthBtn();
        this.initAttatchments();
      }).catch(_ => {});
    },

    // 一键共享
    handleBatchShare() {
      if (!this.tableData.length) {
        this.$message.error('暂无数据可操作');
        return;
      }
      let share = this.ifShare == 1 ? 0 : 1;
      let attachmentList = this.tableData.map(item => item.attatchmentId);
      shareFiles({attachmentList, share }).then(res => {
        this.$message.success('操作成功');
        this.changeBacthBtn();
        this.initAttatchments();
      }).catch(_ => {});
    },

    // 控制一键共享按钮的状态
    changeBacthBtn() {
      if (!this.tableData.length) return;
      let noShare = this.tableData.some(item => item.share == 1);
      this.ifShare = noShare ? 1 : 0;
    },

    handleBatchDownload() {
      if (!this.tableData.length) {
        this.$message.error('暂无文件可下载');
        return;
      }
      let files = this.tableData.map(item => ({key: item.attachmentKey, name: item.attachmentName}));
      this.batchDownloadFile(files);
    },

    handlePreview(row) {
      this.previewFile({name: row.attachmentName, key: row.attachmentKey});
    },
    handleDownload(row) {
      this.downloadFile({name: row.attachmentName, key: row.attachmentKey});
    },
    resetForm() {
      this.ifShare = 1;
      this.tableData = [];
    }
  },

  mounted() {
    this.initAttatchments();
  }
};
</script>
<style lang="scss" scoped>
.dialog-footer {
  justify-content: right;
  .share-btn {
    margin-right: 8px;
    line-height: 36px;
  }
}
</style>

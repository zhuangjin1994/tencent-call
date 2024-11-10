<template>
  <div class="common-uploader">
    <div>
      <el-upload
        v-if="!isEdit"
        class="upload"
        drag
        ref="uploader"
        :accept="accept"
        action="#"
        :data="params"
        :file-list="fileList"
        :http-request="handleUpload"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :on-change="(file, fileList) => {handleChange(file, fileList)}"
        :before-upload="beforeUpload"
        :disabled="isEdit"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处或<em>点击上传</em>，按住Ctrl可同时多选。</div>
      </el-upload>
      <div v-else>
        <p class="empty-text" v-if="!fileList.length">暂无上传附件</p>
        <ul v-else v-for="item in fileList" :key="item.key">
          <li class="file-name" @click="handlePreview(item)">{{item.name}}</li>
        </ul>
      </div>
    </div>
    <!-- 附件预览查看 -->
    <preview-dialog :dialog-visible.sync="previewDialogVisible" :url="localUrl" :type="uploadType"/>
  </div>
</template>
<script>
import PreviewDialog from './PreviewDialog';
import { previewFile } from '@/api/demand.js';
import uploadCos from '@/mixins/uploadCos.js';
export default {
  mixins: [uploadCos],
  components: {
    PreviewDialog
  },
  props: {
    // 上传文件的类型
    accept: {
      type: String,
      default: '.doc, .docx, .xlsx, .pptx, .pdf, .jpg, .png, .jpeg, .mp3, .mp4'
    },
    // 额外参数
    params: {
      type: Object,
      default: () => {}
    },
    // 接口返回的附件详情
    fileDetail: {
      type: Array,
      default: () => []
    },
    // 是否允许编辑附件 ture:不让编辑  false: 允许编辑
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    fileDetail(nVal, oVal) {
      if (nVal) {
        this.fileShow();
      }
    },
    // 实时传递上传情况给父组件
    isUploaded(nVal, oVal) {
      this.$emit('refresh', nVal);
    }
  },
  data() {
    return {
      // 附件数组
      fileList: [],
      onCrossFiles: [],
      // 预览dialog      
      previewDialogVisible: false,
      uploadType: 'jpg',
      localUrl: '',
      // 未上传完成前不可提交
      uploadFileNum: 0,
      isUploaded: false
    };
  },
  methods: {
    // 文件上传前校验
    beforeUpload(file) {
      let fileType = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
      const extension1 = fileType === 'docx';
      const extension2 = fileType === 'xlsx';
      const extension3 = fileType === 'pptx';
      const extension4 = fileType === 'pdf';
      const extension5 = fileType === 'jpg';
      const extension6 = fileType === 'png'; 
      const extension7 = fileType === 'jpeg';
      const extension8 = fileType === 'mp3';
      const extension9 = fileType === 'mp4';
      const extension10 = fileType === 'doc';
      if (!extension1 && !extension2 && !extension3 && !extension4 && !extension5 && !extension6 && !extension7 && !extension8 && !extension9 && !extension10) {
        this.$message.error('您只能上传以下类型文件：doc, .docx, .xlsx, .pptx, .pdf, .jpg, .png, .jpeg, .mp4, .mp3!');
        return false;
      } else {
        return extension1 || extension2 || extension3 || extension4 || extension5 || extension6 || extension7 || !extension8 || !extension9;
      }
    },

    handleUpload(File) {
      this.uploadFile(File, res => {
        this.isUploaded = true;
        // res存在，说明uploadCos 中 callback(fileUrl) 返回有值，即上传成功
        if (res) {
          this.uploadFileNum--;
          this.$message.success('上传成功');
          this.fileList.push({
            name: File.file.name,
            key: res.key
          });
          // 上传完成
          if (this.uploadFileNum == 0) {
            this.isUploaded = false;
          }
        }
      });
    },

    // 上传中文件移除 
    handleRemove(file) {
      const index = this.fileList.findIndex(item => item.key === file.key);
      if (index < 0) {
        const { cos, taskId } = file.raw;
        cos.cancelTask(taskId);
      } else {
        this.fileList.splice(index, 1);
      }
    },

    // 删除确认提示
    beforeRemove(file, fileList) {
      return this.$confirm('确认删除此附件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      });
    },

    // 预览上传文件
    handlePreview(file) {
      this.previewFile(file);
    },

    // 附件回显
    fileShow() {
      this.fileList = this.fileDetail.map(item => ({
        key: item.attachmentKey,
        name: item.attachmentName,
      }));
    },
    handleChange(file, fileList) {
      this.isUploaded = true;
      this.uploadFileNum = fileList.length - this.fileList.length;
    }
  }
};
</script>
<style lang='scss'>
.common-uploader {
  // 去除‘按 delete 键可删除’提示
  .el-upload-list__item.is-success.focusing .el-icon-close-tip {
    display: none !important;
  }
  .file-name {
    color: #016FFA;
    font-size: 14px;
    cursor: pointer;
    text-decoration: underline;
  }
  .empty-text {
    color: #C0C4CC;
    font-size: 14px;
  }
}
</style>

<template>
  <el-dialog append-to-body @close="resetForm" title="验收申诉" width="600px" :visible.sync="visible" class="dialog-container complain-dialog">
    <el-form ref="form" label-width="100px" :rules="rules" :model="form">
      <el-form-item label="申诉原因：" prop="appealReason">
        <el-input class="textarea" :autosize="{ minRows: 4, maxRows: 10000}"  type="textarea" placeholder="请输入申诉原因" v-model="form.appealReason"></el-input>
      </el-form-item>
      <el-form-item label="上传附件：">
        <Upload @refresh="(val) => {isUploaded = val}" ref="uploader"/>
      </el-form-item>
    </el-form>
    <div slot="footer" center class="dialog-footer">
      <el-button :disabled="isUploaded" :loading="loading" type="primary" @click="onSubmit">确定</el-button>
      <el-button @click="visible=false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import Upload from '@/components/Upload';
import { expertAppeal } from '@/api/demand.js';
export default {
  components: {
    Upload
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      form: {
        appealReason: ''
      },
      rules: {
        appealReason: [{ required: true, message: '请填写申诉原因' }, { max: 300, message: '申诉原因不能超过300字符', trigger: 'change' }],
      },
      isUploaded: false
    };
  },
  computed: {
    visible: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit('update:dialogVisible', val);
      }
    },
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = {
            ...this.form,
            ...this.params
          };
          if (this.$refs.uploader.fileList.length) {
            params.attatchmentList = this.$refs.uploader.fileList.map(item => ({
              attachmentName: item.name,
              attachmentKey: item.key
            }));
          } else {
            params.attatchmentList = [];
          }
          expertAppeal(params).then(res => {
            this.$message.success('申诉成功');
            this.visible = false;
            this.$emit('refresh');
          }).catch(err => {});
        }
      });
    },
    resetForm() {
      this.$refs.form.resetFields();
      this.$refs.uploader.fileList = [];
      this.form = {
        appealReason: ''
      };
    }
  }
};
</script>
<style lang="scss">
.complain-dialog {
  .el-textarea__inner, .el-upload-dragger {
    width: 410px;
  }
}
</style>

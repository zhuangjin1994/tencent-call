<template>
  <el-dialog @open="initForm" @close="resetForm" :title="title" :visible.sync="visible" width="700px" class="dialog-container supplier-diaolog">
    <el-form ref="form" label-width="110px" :model="form" :rules="rules">
      <el-form-item label="供应商类型：" prop="supplierBelong">
        <el-radio :disabled="type=='audit'" v-model="form.supplierBelong" label="internal">国内</el-radio>
        <el-radio :disabled="type=='audit'" v-model="form.supplierBelong" label="overseas">国外</el-radio>
      </el-form-item>
      <el-form-item label="供应商名称：" prop="accountName">
        <el-input :disabled="type!=='add'" placeholder="请输入供应商名称" v-model="form.accountName"></el-input>
      </el-form-item>
      <el-form-item v-if="type!=='add'" label="新增编制时长：" :prop="type=='audit' ? '' : 'preparationHours'">
        <el-tooltip class="item" effect="dark" content="增加编制时长输入正数，减少编辑时长输入负数" placement="top-start">
          <i class="el-icon-question tip-bubble" />
        </el-tooltip>
        <el-input :disabled="type=='audit'" placeholder="请输入编制时长" v-model="form.preparationHours">
          <template slot="append">时</template>
        </el-input>
      </el-form-item>
      <el-form-item label="上传附件：">
        <Upload ref="uploader" :file-detail="form.attatchmentList" :is-edit="isEdit"/>
      </el-form-item>
    </el-form>
    <div slot="footer" center class="dialog-footer">
      <div v-if="type==='audit'">
        <el-button @click="handleAudit('2')" :loading="loading.reject">驳回</el-button>
        <el-button type="primary" @click="handleAudit('1')" :loading="loading.pass">通过</el-button>
      </div>
      <div v-else>
        <el-button type="primary" @click="onSave" :loading="loading.save">保存</el-button>
        <el-button @click="visible=false">取消</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import store from '@/store';
import { checkNum } from '@/utils';
import Upload from '@/components/Upload'; 
import {
  addSupplier,
  editSupplier,
  auditSupplier,
  getSupplierInfo,
  getSupplierAttachment
} from '@/api/supplier';
export default {
  components: {
    Upload
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'add'
    },
    data: {
      type: Object,
      default: () => {}
    }
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
    title() {
      let titles = {
        add: '新增供应商',
        edit: '编辑供应商',
        audit: '审批供应商'
      };
      return titles[this.type];
    },
    isEdit() {
      return this.type === 'audit';
    }
  },
  data() {
    return {
      loading: {
        save: false,
        pass: false,
        reject: false
      },
      form: {
        supplierBelong: 'internal',
        accountName: '',
        preparationHours: '',
        attatchmentList: []
      },
      rules: {
        supplierBelong: { required: true, message: '请选择供应商类型' },
        accountName: { required: true, message: '请填写供应商名称' },
        preparationHours: [{ validator: checkNum, trigger: 'blur', required: true }]
      },
    };
  },
  methods: {
    onSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading.save = true;
          let api = this.type === 'add' ? addSupplier : editSupplier;
          const params = {
            ...this.form
          };
          params.preparationHours = params.preparationHours * 60;
          if (this.$refs.uploader.fileList.length) {
            params.attatchmentList = this.$refs.uploader.fileList.map(item => ({
              attachmentName: item.name,
              attachmentKey: item.key
            }));
          }
          api(params).then(res => {
            this.doSuccess(); 
          }).catch(err => {})
            .finally(_ => this.loading.save = false);
        }
      });
    },

    handleAudit(type) {
      this.$refs.form.validate(valid => {
        if (valid) {
          let loadingKey = type === '2' ? 'reject' : 'pass';
          this.loading[loadingKey] = true;
          const params = {
            auditStatus: type,
            supplierAccountId: this.form.supplierAccountId
          };
          auditSupplier(params).then(res => {
            this.doSuccess();
            store.dispatch('app/getMessages');
          }).catch(err => {})
            .finally(_ => this.loading[loadingKey] = false);
        }
      });
    },

    doSuccess() {
      this.$message.success(`${this.title}成功`);
      this.visible = false;
      this.$emit('refresh');
    },

    initForm() {
      if (this.type === 'add') return;
      const { supplierAccountId, auditStatus } = this.data;
      this.form = Object.assign(this.form, this.data);
      if (this.type === 'edit') {
        getSupplierAttachment({ supplierAccountId }).then(res => {
          this.form.attatchmentList = res.data.data || [];
        }).catch(err => {});
      } else {
        getSupplierInfo({ supplierAccountId, auditStatus }).then(res => {
          let data = res.data || {};
          this.form.attatchmentList = data.data.attatchmentList || [];
          let minute = data.data.preparationHours || '';
          if (minute || minute == 0) {
            this.form.preparationHours = +((minute / 60).toFixed(2));
          }
        });
      }
    },

    resetForm() {
      this.$refs.form.resetFields();
      this.form = {
        supplierBelong: 'internal',
        accountName: '',
        preparationHours: '',
        attatchmentList: []
      };
    }
  }
};
</script>
<style lang='scss'>
.supplier-diaolog {
  .el-dialog__body {
    display: flex;
    padding-bottom: 0;
    justify-content: center;
  }
  .el-form-item__content{
    .el-input,.el-select,.el-date-editor{
      width:360px !important;
    }
  }
  .tip-bubble {
    font-size: 16px;
    top: 8px;
    left: -124px;
    position: absolute;
    color: #FF0000;
  }
}
</style>

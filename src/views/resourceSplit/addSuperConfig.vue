<template>
  <div class="dialog-container supplier-diaolog">
    <div class="card-container">
      <el-card class="demand-edit-card">
        <el-form ref="form" label-width="110px" :model="form" :rules="rules">
          <el-form-item label="供应商类型：" prop="supplierBelong">
            <el-radio v-model="form.supplierBelong" :label='0'>国内</el-radio>
            <el-radio v-model="form.supplierBelong" :label='1'>国外</el-radio>
          </el-form-item>
          <el-form-item label="供应商名称：" prop="accountName">
             <el-autocomplete style="width: 360px;" v-model="form.accountName" :fetch-suggestions="querySearchAsync"
              placeholder="请输入供应商" @select="handleSelect"></el-autocomplete>
          </el-form-item>
          <el-form-item label="资源配置：" prop="applyHours">
            <el-tooltip class="item" effect="dark" content="增加资源配置时长输入正数，减少编辑时长输入负数" placement="top-start">
              <i class="el-icon-question tip-bubble" />
            </el-tooltip>
            <el-input placeholder="请输入资源配置" v-model="form.applyHours" maxlength = 10 >
              <template slot="append">时</template>
            </el-input>
          </el-form-item>
          <el-form-item label="上传附件：">
            <Upload @refresh="(val) => {isUploaded = val}" ref="uploader" :file-detail="form.attatchmentList" :is-edit="isEdit" />
          </el-form-item>
        </el-form>
      </el-card>
      <div class="bottom-fix">
        <el-card>
          <div>
            <el-button @click="goBack">取消</el-button>
            <el-button type="primary" @click="onSave" :loading="loading.save" :disabled="isUploaded">确认</el-button>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>
<script>
import store from '@/store';
import { checkNum } from '@/utils';
import Upload from '@/components/Upload';
import {
  addSupplierConfig,
  editSuperConfig,
  superConfigDetailEdit,
  getSuperListApi
} from '@/api/supplier';
export default {
  components: {
    Upload
  },
  computed: {
    title() {
      let titles = {
        add: '新增供应商',
        edit: '编辑供应商'
      };
      return titles[this.type];
    },
    isEdit() {
      return this.type === 'audit';
    }
  },
  data() {
    return {
      type: 'add',
      superList: [], // 供应商列表
      billNumber: '',
      loading: {
        save: false,
        pass: false,
        reject: false
      },
      state: '',
      timeout: null,
      form: {
        supplierBelong: 0,
        supplierId: '', // 供应商id
        accountName: '', // 供应商名称
        applyHours: '',
        attatchmentList: []
      },
      rules: {
        supplierBelong: { required: true, message: '请选择供应商类型' },
        accountName: { required: true, message: '请填写供应商名称', trigger: 'change', },
        applyHours: [{ validator: checkNum, trigger: 'change', required: true }]
      },
      isUploaded: false
    };
  },
  created() {
    this.getSuperList();
  },
  mounted() {
    const { pageType } = this.$route.params;
    this.type = pageType;
    if (pageType != 'add') {
      this.billNumber = pageType;
      this.getDetail();
    }
  },
  methods: {
    querySearchAsync(queryString, cb) {
      let superList = this.superList;
      const supplierBelong = this.form.supplierBelong;
      // var results = queryString ? superList.filter(item => this.createStateFilter(queryString) && item.supplierBelong == supplierBelong) : superList.filter(item => item.supplierBelong == supplierBelong);
      let results = queryString ? superList.filter(item => {
        return item.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0 && item.supplierBelong == supplierBelong;
      }) : superList.filter(item => item.supplierBelong == supplierBelong);
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 500 * Math.random());
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      this.form.supplierId = item.supplierId;
      // this.form.accountName = this.form.accountName;
    },
    // 供应商列表
    getSuperList() {
      // const  parms ={"departmentName":" "}
      let arr = [];
      getSuperListApi().then(res => {
        this.superList = res.data || [];
      }).catch(_ => { });

    },
    // 编辑获取详情
    getDetail() {
      const parms = { 'billNumber': this.billNumber };
      superConfigDetailEdit(parms).then(res => {
        const data = res.data;
        const { supplierBelong, supplierId, supplierName, applyHours, attatchmentList } = data;
        this.form.supplierBelong = supplierBelong;
        this.form.accountName = supplierName;
        this.form.supplierId = supplierId;
        this.form.applyHours = Number(applyHours / 60).toFixed(3);
        this.form.attatchmentList = attatchmentList;
      }).catch(_ => {
        console.log(_);
      });
    },
    goBack() {
      this.$router.push('/resourceSplit/dataConfig?pages=supplier');
    },
    onSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading.save = true;
          let api = this.type === 'add' ? addSupplierConfig : editSuperConfig;

          const { applyHours } = this.form;
          const params = {
            ...this.form
          };
          params.applyHours = Number(applyHours * 60).toFixed(3);
          this.type !== 'add' ? params.billNumber = this.billNumber : '';
          if (this.$refs.uploader.fileList.length) {
            params.attatchmentList = this.$refs.uploader.fileList.map(item => ({
              attachmentName: item.name,
              attachmentKey: item.key
            }));
          }
          api(params).then(res => {
            this.doSuccess();
          }).catch(err => { })
            .finally(_ => this.loading.save = false);
        }
      });
    },
    doSuccess() {
      this.type === 'add' ? this.$message.success(`新增成功`) : this.$message.success(`修改成功`);
      // this.$emit('refresh')
      this.$router.push('/resourceSplit/dataConfig?pages=supplier');
    },

  }
};
</script>
<style lang='scss' scoped>
.supplier-diaolog {
  position: relative;
  height: 100%;
  .el-dialog__body {
    display: flex;
    padding-bottom: 0;
    justify-content: center;
  }

  .el-form-item__content {

    .el-input,
    .el-select,
    .el-date-editor {
      width: 360px !important;
    }
  }

  .tip-bubble {
    font-size: 16px;
    top: 8px;
    left: -100px;
    position: absolute;
    color: #FF0000;
  }
}

.bottom-fix {
  text-align: center;
  background: #f0f2f5;

}

.card-container {
  position: relative;
  overflow: hidden;
  height: 100%;

  .demand-edit-card {
    height: calc(100% - 90px);
  }
}

::v-deep {
  .el-upload {
    width: 80%;

    .el-upload-dragger {
      width: 100%;
    }
  }

  .el-autocomplete {
    .el-input {
      width: 360px !important;
    }
  }
}
</style>

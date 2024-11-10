<template>
  <div class="dialog-container supplier-diaolog">
    <div class="card-container">
      <el-card class="demand-edit-card" body-style="{height:100%}">
        <el-form ref="form" label-width="110px" :model="form">
          <el-form-item :label="title" required>
            <div class="rightTable">
              <el-button type="primary" @click="addDomain" icon="el-icon-plus" style="margin-bottom:20px;">添加行
              </el-button>
              <div class="table-view">
                <el-row class="table-header" type="flex" justify="center">
                  <el-col class="border-r" :span="10">部门名称</el-col>
                  <el-col class="border-r" :span="10">配额时长</el-col>
                  <el-col :span="3">操作</el-col>
                </el-row>
                <el-row class="table-row border-t" type="flex" justify="center" v-for="(domains, index) in form.domains"
                  :key="index">
                  <el-col :span="10" class="border-r">
                    <el-form-item :prop="`domains.${index}.value`"
                      :rules="{ required: true, message: '请选择部门', trigger: 'change' }">
                      <el-select v-model="domains.value" filterable remote reserve-keyword
                        @change='changeValue($event, domains)' placeholder="请选择部门"
                        @clear="clearOption($event, domains, index)" clearable :remote-method="remoteMethod">
                        <el-option v-for="item in dpartList" :key="item.departmentId" :label="item.departmentName"
                          :value="item.departmentId" :disabled="item.disabled || false">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10" class="border-r">
                    <el-form-item label="" :prop="`domains.${index}.preparationHours`" :rules="[
                      { required: true, message: '请输入配额时长', trigger: 'blur' },
                      {
                        validator: (rule, value, cb) => {
                          var reg = /^[+-]?\d*\.?\d{1,3}$/
                          if (value == '' || value == null || value == 'undefined') {
                            return cb('请填写编制时长，不能为空');
                          } else if (value && !reg.test(value)) {
                            return cb('可以填入正负数，最多保留三位小数');
                          } else if (value > 99999 || value < -999) {
                            return cb('编制时长范围为-999 ～ 99999 ');
                          } else {
                            return cb()
                          }
                        }, trigger: 'change', required: true
                      }
                    ]">
                      <el-input v-model="domains.preparationHours" maxlength=10  placeholder="请输入配额时长"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="3">
                    <i class="el-icon-delete" style='font-size:24px;'
                      @click.prevent="removeDomain(index,)"></i>
                  </el-col>
                </el-row>
              </div>
              合计： {{ sum }}
            </div>
          </el-form-item>
          <el-form-item label="上传附件：" class="upload-item">
            <Upload ref="uploader" @refresh="(val) => {isUploaded = val}" :file-detail="form.attatchmentList" :is-edit="isEdit" />
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
import Upload from '@/components/Upload';
import filters from '@/utils/filters.js'
import {
  addInsideConfig,
  insideConfigDetailEdit,
  editInsideConfig,
  dpartmentList
} from '@/api/supplier';
export default {
  components: {
    Upload
  },
  computed: {
    title() {
      return this.type == 'add' ? '新增配置：' : '编辑配置：';
    },
    isEdit() {
      return this.type === 'audit';
    }
  },
  data() {
    return {
      type: 'add',
      totalData: [],
      options: [],
      loading: {
        save: false,
        pass: false,
        reject: false
      },
      billNumber: '', // 编辑提交
      resourceId: '', // 编辑查详情
      dpartList: [], // 部门列表
      value: [],
      list: [],
      state: '',
      form: {
        domains: [
          { value: '', label: '', preparationHours: '' }
        ],
        attatchmentList: []
      },
      sum: 0,
      isUploaded: false
    };
  },
  watch: {
    'form.domains': {
      deep: true,
      handler(nVal, oVal) {
        let num = nVal.reduce((total, item) => total+=Number(item.preparationHours), 0)
        this.sum = num.toFixed(3) ? num.toFixed(3) : '--'
      }
    }
  },
  created() {
    // this.getDepartMentList('')
  },
  mounted() {
    const { pageType } = this.$route.params;
    this.type = pageType;
    this.getDepartMentList('');
    setTimeout(() => {
      // 编辑页面
      if (pageType != 'add') {
        this.billNumber = pageType;
        this.getDetail();
      } else {
        this.getCacheData();
      }
    }, 300);
  },
  methods: {
    getCacheData() {
      let vuexList = this.$store.getters.department;
      if (vuexList && vuexList.length > 0) {
        this.form.domains = this.$store.getters.department;
      }
    },
    getRealDepartId(string) {
      let result;
      if (Number.isNaN(Number(string))) {
        result = this.getDepartmentId(string);
      } else {
        result = string;
      }
      return result;
    },
    changeValue(event, domains) {
      const indexs = this.dpartList.findIndex((item) => item.departmentId == domains.value);
      if (indexs != -1) {
        const departmentName = this.dpartList[indexs].departmentName;
        this.form.domains.forEach((item) => {
          if (item.value == domains.value) {
            item.departmentId = domains.value;
            item.departmentName = departmentName;
            this.changeOptionsStasus(item.departmentId);
          }
        });
      }
    },
    changeOptionsStasus(optionId) {
      const optionIndex = this.dpartList.findIndex(item => item.departmentId === optionId);
      if (optionIndex != -1) {
        this.dpartList.forEach(item => item.disabled = false);
        // this.dpartList[optionIndex].disabled = true
        this.form.domains.forEach((el) => {
          let i = this.dpartList.findIndex(item => item.departmentId === el.departmentId);
          if (i !== -1) {
            this.dpartList[i].disabled = true;
          }
        });
      }
    },
    clearOption(e, domain, index) {
      this.dpartList.forEach(item => item.disabled = false);
      this.form.domains[index].departmentId = '';
      this.form.domains[index].departmentName = '';
      this.form.domains.forEach((el) => {
        let i = this.dpartList.findIndex(item => item.departmentId === el.departmentId);
        if (i !== -1) {
          this.dpartList[i].disabled = true;
        }
      });
    },
    remoteMethod(query) {
      if (query !== '') {
        dpartmentList({ departmentName: query }).then(res => {
          let selectData = res.data || [];
          this.form.domains.forEach((el) => {
            let i = selectData.findIndex(item => item.departmentId === el.departmentId);
            // 编辑页面 已经存在的部门要剔除掉 设置为true
            if (i !== -1) {
              selectData[i].disabled = true;
            }
          });
          this.options = selectData;
          this.dpartList = selectData;
        }).catch(err => { })
          .finally(_ => this.loading.select = false);
      } else {
        this.options = [];
      }
    },
    // 部门列表
    getDepartMentList(value) {
      const parms = { 'departmentName': value };
      dpartmentList(parms).then(res => {
        this.dpartList = res.data || [];
        this.list = this.dpartList.map(item => {
          return { value: `${item.departmentId}`, label: `${item.value}` };
        });
      }).catch(_ => { });
    },
    // 编辑获取部门名称
    getDepartmentName(departmentId) {
      const index = this.dpartList.findIndex((item) => item.departmentId == departmentId * 1);
      if (index != -1) {
        const departmentName = this.dpartList[index].departmentName;
        return departmentName;
      }
    },
    // 编辑获取部门id
    getDepartmentId(departmentName) {
      const index = this.dpartList.findIndex((item) => item.departmentName == departmentName);
      if (index != -1) {
        const departmentId = this.dpartList[index].departmentId;
        return departmentId;
      }
    },
    // 编辑获取详情
    getDetail() {
      const parms = { 'billNumber': this.billNumber };
      insideConfigDetailEdit(parms).then(res => {
        const data = res.data;
        const deepData = data.departmentResourceList;
        let copyData = [];
        for (let k = 0; k < deepData.length; k++) {
          let obj = {};
          obj['value'] = deepData[k]['departmentName'];
          obj['departmentName'] = deepData[k]['departmentName'];
          obj['departmentId'] = typeof (deepData[k]['departmentId'] == 'number') ? deepData[k]['departmentId'] : this.getDepartmentId(deepData[k]['departmentId']);
          obj['preparationHours'] = Number(deepData[k]['preparationHours'] / 60).toFixed(3);
          copyData.push(obj);
        }
        this.$nextTick(function () {
          this.form.domains = copyData;
          this.billNumber = data.billNumber;
          this.form.attatchmentList = data.attatchmentList;
        });
      }).catch(err => {
        console.log(err);
      });
    },
    removeDomain(index) {
      if (this.form.domains.length == 1) {
        this.$message.error('至少保留一条数据!');
        return;
      }
      // 先获取删除的这一条所在的value
      const deleteValue = this.form.domains[index].departmentName;
      this.dpartList.forEach((item) => {
        if (item.departmentName == deleteValue){
          item.disabled = false;
        }
      });
      this.form.domains.splice(index, 1);
    },
    addDomain() {
      this.form.domains.push({
        value: '',
        departmentName: '',
        departmentId: '',
        preparationHours: ''
      });
    },
    goBack() {
      this.type === 'add' ? this.$store.dispatch('department/addData', this.form.domains) : '';
      this.$router.push('/resourceSplit/dataConfig?pages=default');
    },
    onSave() {
      const options = this.options;
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading.save = true;
          let api = this.type === 'add' ? addInsideConfig : editInsideConfig;
          const params = {};
          this.type !== 'add' ? params.billNumber = this.billNumber : '';
          this.$nextTick(function () {
            const deepData = this.form.domains.slice();
            let submitData = [];
            for (let i = 0; i < deepData.length; i++) {
              let tempObj = {};
              tempObj['departmentName'] = !isNaN(deepData[i]['value']) ? this.getDepartmentName(deepData[i]['value']) : deepData[i]['value'];
              // 判断是部门  则获取部门id
              tempObj['departmentId'] = (this.type == 'add') ? deepData[i]['value'] : this.getRealDepartId(deepData[i]['value']);
              tempObj['preparationHours'] = Number(deepData[i]['preparationHours'] * 60).toFixed(3);
              submitData.push(tempObj);
            }
            params.departmentResourceList = submitData;
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
          });
        }
      });
    },
    doSuccess() {
      this.$store.dispatch('department/removeAllData');
      this.type === 'add' ? this.$message.success(`新增成功`) : this.$message.success(`修改成功`);
      this.$router.push('/resourceSplit/dataConfig?pages=default');
    },

  }
};
</script>
<style lang='scss' scoped>
.supplier-diaolog {
  padding: 0 !important;
  position: relative;
  height: 100%;

  .card-container {
    height: 100%;
    background: #f0f2f5;
    padding: 0 10px;

    >.demand-edit-card {
      height: calc(100% - 90px);
      position: relative;
      overflow: hidden;
      overflow-y: auto;
    }

    .tableBox {
      display: flex;
    }
  }

  .el-dialog__body {
    display: flex;
    padding-bottom: 0;
    justify-content: center;
  }

  .el-form-item__content {
    width: 100%;

  }


  .tip-bubble {
    font-size: 16px;
    top: 8px;
    left: -124px;
    position: absolute;
    color: #FF0000;
  }
}

.bottom-fix {
  text-align: center;
  background: #f0f2f5;
}

.table-view {
  width: 90%;
  border: 1px solid #dfe6ec;
}

.no-border {
  border: none;
}

.border-r {
  border-right: 1px solid #dfe6ec;
}

.border-t {
  border-top: 1px solid #dfe6ec;
}

.table-header {
  .el-col {
    padding: 5px 10px;
    font-size: 12px;
    font-weight: 600;
    color: #181921;

    >.el-date-editor {
      width: 100%;
    }
  }
}

.table-row {
  .el-col {
    position: relative;
    display: flex;
    align-items: center;
    padding: 20px;

    .el-form-item--small.el-form-item {
      margin-bottom: 0;
    }
  }
}

.w100 {
  width: 100%;
}


::v-deep {
  .el-upload {
    width: 90%;

    .el-upload-dragger {
      width: 100%;
    }
  }
}
</style>

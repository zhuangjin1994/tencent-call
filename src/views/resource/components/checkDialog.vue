<template>
  <el-dialog :title="type === 'add' ? '新增配额' : '审批配额'" @close="resetForm" @open="initForm" :visible.sync="visible" width="500px" class="dialog-container resource-check-diaolog">
    <el-form ref="form" label-width="100px" :model="form" :rules="rules">
      <el-form-item label="选择部门：" prop="departmentName">
        <el-select filterable v-model="form.departmentName" :disabled="type=='check'" placeholder="请选择部门">
          <el-option 
            v-for="(item, index) in departments" 
            :key="index" 
            :label="item.departmentName" 
            :value="item.departmentName"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="编制时长：" prop="preparationHours">
        <el-input placeholder="请输入时长" v-model="form.preparationHours" :disabled="type=='check'">
          <template slot="append">时</template>
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" center class="dialog-footer">
      <el-button type="primary" v-if="type==='add'" :loading="loading.save" @click="onSave">保存</el-button>
      <template v-else>
        <el-button @click="onAudit('2')" :loading="loading.reject">驳回</el-button>
        <el-button type="primary" @click="onAudit('1')" :loading="loading.pass">通过</el-button>
      </template>
    </div>
  </el-dialog>
</template>
<script>
import store from '@/store';
import { addResource, auditResource, queryAllDepartments } from '@/api/resource.js';
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'add'
    },
    rowId: {
      type: String,
      default: ''
    },
    detail: {
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
    }
  },
  data() {
    return {
      departments: [],
      form: {
        departmentName: '',
        preparationHours: ''
      },
      rules: {
        departmentName: { required: true, message: '请选择部门' },
        preparationHours: [
          { required: true, message: '请填写编制时长' },
          { pattern: /^[0-9]\d{0,3}(?:\.\d{1,2})?$/, message: '请填写0～9999的数量范围，至多保留两位小数', trigger: 'blur'}
        ]
      },
      loading: {
        save: false,
        reject: false,
        pass: false
      }
    };
  },
  methods: {
    onSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading.save = true;
          const { departmentName, preparationHours} = this.form;
          const params = {
            departmentName,
            preparationHours: preparationHours * 60
          };
          addResource(params).then(res => {
            this.$message.success('新增配额成功');
            this.visible = false;
            this.$emit('refresh');
          }).catch(() => {})
            .finally(_ => this.loading.save = false);
        }
      });
    },

    onAudit(key) {
      let loadingKey = key === '2' ? 'reject' : 'pass';
      this.loading[loadingKey] = true;
      const params = {
        auditStatus: key,
        departmentId: this.rowId
      };
      auditResource(params).then(res => {
        this.$message.success(`${key === '2' ? '驳回' : '通过'}成功`);
        this.visible = false;
        this.$emit('refresh');
        store.dispatch('app/getMessages');
      }).catch(() => {})
        .finally(_ => this.loading[loadingKey] = false);
    },

    // 获取所属部门
    getDepartments() {
      queryAllDepartments().then(res => {
        this.departments = (res.data || {}).data || [];
      }).catch(err => {});
    },

    initForm() {
      if (this.type === 'check') {
        this.form = Object.assign(this.form, this.detail);
        let minute = this.detail.preparationHours || '';
        if (minute || minute == 0) {
          this.form.preparationHours = +((minute / 60).toFixed(2));
        }
      }
    },

    resetForm() {
      this.$refs.form.resetFields();
      this.form = {
        departmentName: '',
        preparationHours: ''
      };
    }
  },
  mounted() {
    this.getDepartments();
  }
};
</script>
<style lang='scss'>
.resource-check-diaolog {
  .el-dialog__body {
    display: flex;
    justify-content: center;
  }
}
</style>>

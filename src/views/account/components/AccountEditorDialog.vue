<template>
  <el-dialog :title="title" @close="resetForm" @open="initForm" :visible.sync="visible" width="700px" class="dialog-container account-dialog">
    <el-form ref="form" label-width="100px" :model="form" :rules="rules">
      <el-form-item v-if="type=='default'" label="所属部门：" prop="departmentName">
        <el-input disabled v-model="form.departmentName"></el-input>
      </el-form-item>
      <el-form-item v-if="type!=='default'" label="所属供应商：" prop="supplierName">
        <el-input disabled v-model="form.supplierName"></el-input>
      </el-form-item>
      <el-form-item label="账号名称：" prop="name">
        <el-input v-model="form.name" :disabled="type=='default'" placeholder="请输入账号名称"></el-input>
      </el-form-item>
      <!-- <el-form-item label="账户名称：" prop="name">
        <el-input disabled v-if="type==='default'" placeholder="请输入账户名称" v-model="form.name"></el-input>
        <el-select v-else v-model="form.name" clearable placeholder="请选择供应商账号">
          <el-option
            v-for="(item, index) in account"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="角色：" prop="roleId">
        <el-select v-model="form.roleId" clearable placeholder="请选择角色">
          <el-option
            v-for="(item, key) in roles"
            :key="item.key"
            :label="item"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="邮箱地址：" prop="email">
        <el-input :disabled="type!='add'" placeholder="请输入邮箱地址" v-model="form.email"></el-input>
      </el-form-item>
       <el-form-item v-if="type=='default'" label="联系方式：" :rules="{ max: 50, message: '长度不能超过50个字符', trigger: 'change' }" prop="contactInformation">
        <el-input placeholder="请输入联系方式" v-model="form.contactInformation"></el-input>
      </el-form-item>
      <el-form-item label="手机号码：" prop="contactInformation" v-if="type!='default'">
        <el-input placeholder="请输入手机号码" v-model="form.contactInformation"></el-input>
      </el-form-item>
      <el-form-item v-if="type!='default'" label="微信号：" prop="weChat">
        <el-input placeholder="请输入微信号" v-model="form.weChat"></el-input>
      </el-form-item>
      <el-form-item v-if="type!='default'" label="其他：" prop="other">
        <el-input placeholder="请输入其他描述" v-model="form.other"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" center class="dialog-footer">
      <el-button v-if="type==='add'" type="primary"  @click="onSave" :loading="loading.save">保存</el-button>
      <el-button v-else type="primary" @click="onSubmit" :loading="loading.submit">确定</el-button>
      <el-button @click="visible=false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { addSupplierAccount, editSupplierAccount, editAccount } from '@/api/account.js';
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: 'add'
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
      return this.type === 'add' ? '新增供应商' : this.type === 'default' ? '编辑内部账号' : '编辑供应商账号';
    },
    roles() {
      let supplier_role = {
        coAdministrator: '管理员',
        supplier: '用户'
      };
      let default_role = {
        demander: '需求方',
        auditor: '审批人',
        coAdministrator: '普通管理员',
        suAdministrator: '超级管理员',
      };
      return ['supplier', 'add'].includes(this.type) ? supplier_role : default_role;
    },
  },
  data() {
    return {
      form: {
        name: '',
        roleId: '',
        email: '',
        contactInformation: '',
        weChat: '',
        departmentName: '',
        supplierName: '',
        other: ''
      },
      rules: {
        name: [{ required: true, message: '请输入账户名称' }, { max: 50, message: '名称不能超过50个字符', trigger: 'change' }],
        roleId: { required: true, message: '请选择角色' },
        email: [
          { required: true, message: '请输入邮箱地址' },
          { pattern: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,6})$/, message: '请输入正确的邮箱格式', trigger: 'blur'}
        ],
        supplierName: { required: true, message: '请填写所属供应商' },
        contactInformation: [{ required: true, message: '请输入手机号码' }, {pattern: /^1[345789]\d{9}$/, message: '请正确输入手机号码'}, { max: 50, message: '长度不能超过50个字符', trigger: 'change' }],
        weChat: [{ required: true, message: '请输入微信号' }, { max: 50, message: '长度不能超过50个字符', trigger: 'change' }],
        other: [{ max: 50, message: '长度不能超过50个字符', trigger: 'change' }]
      },
      loading: {
        save: false,
        submit: false
      }
    };
  },
  methods: {
    onSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading.save = true;
          const { roleId, email, contactInformation, name, weChat, other } = this.form;
          const params = {
            email,
            weChat,
            roleId,
            accountName: name,
            contactInformation,
            supplierId: this.params.supplierId,
            other
          };
          addSupplierAccount(params).then(res => {
            this.doSuccess();
          }).catch(_ => {})
            .finally(_ => this.loading.save = false);
        }
      });
    },

    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading.submit = true;
          let api = this.type === 'default' ? editAccount : editSupplierAccount;
          let name = this.type === 'default' ? 'userCnName' : 'accountName';
          const params = {
            ...this.form,
            [name]: this.form.name
          };
          delete params.name;
          api(params).then(res => {
            this.doSuccess();
          }).catch(_ => {})
            .finally(_ => this.loading.submit = false);
        }
      });
    },
  
    doSuccess() {
      this.$message.success(`${this.title}成功`);
      this.visible = false;
      this.$emit('refresh');
    },

    initForm() {
      if (this.type === 'add') {
        this.form.supplierName = this.params.supplierName;
      } else {
        this.form = Object.assign(this.form, this.params);
        
      }
    },

    resetForm() {
      this.$refs.form.resetFields();
      this.form = {
        name: '',
        roleId: '',
        email: '',
        contactInformation: '',
        weChat: '',
        departmentName: '',
        supplierName: '',
        other: ''
      };
    }
  }
};
</script>
<style lang='scss'>
.account-dialog {
  .el-dialog__body {
    display: flex;
    justify-content: center;
  }
  .el-form-item__content{
    .el-input,.el-select,.el-date-editor{
      width:360px !important;
    }
  }
}
</style>

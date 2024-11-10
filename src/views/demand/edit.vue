<template>
  <div class="demand-editor">
    <div class="card-container">
      <el-card class="demand-edit-card">
        <el-form ref="form" label-width="115px" :rules="rules" :model="form" size="medium">
          <el-row>
            <el-col :span="12">
              <el-form-item label="所属部门：" ref="departmentIdList" prop="departmentIdList">
                <el-select :disabled="isEdit && (!isAdministrator || (isAdministrator && isSelf && notEnd))" v-model="form.departmentIdList" multiple filterable placeholder="请选择所属部门">
                  <el-option v-for="(item, index) in departments" :key="index" :label="item.departmentName" :value="item.departmentId"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :rules="checkSdd ? { required: true, message: '请选择所属小组', trigger: 'change' } : ''" label="所属小组：" v-if="checkSdd" ref="demandGroupList" prop="demandGroupList">
                <el-select :disabled="isEdit && (!isAdministrator || (isAdministrator && isSelf && notEnd))" v-model="form.demandGroupList" multiple clearable placeholder="请选择小分队【仅限SD】">
                  <el-option v-for="(item, index) of strategyGroup" :key="index" :label="item" :value="item"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item ref="contractor" label="负责人：" prop="contractor">
                <el-select 
                  :disabled='isEdit && (!isSelf || (isAdministrator && isSelf && !notEnd))' 
                  v-model="form.contractor" 
                  filterable
                  remote
                  clearable
                  placeholder="请输入负责人"
                  @change="changeMembers"
                  :loading="loading.select"
                  :remote-method="((val)=>{remoteMembers(val, 'contractors')})"
                  @visible-change="((val)=>{showHistoryList(val, 'contractors')})"
                >
                  <el-option
                    v-for="item of contractors"
                    :key="item.userDeptId"
                    :label="item.userTotalInfo"
                    :disabled="item.disabled"
                    :value="item.userTotalInfo"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系方式：" ref="wechat" prop="wechat">
                <el-input :disabled='isEdit && (!isSelf || (isAdministrator && isSelf && !notEnd))' placeholder="可填写：手机号、微信号、座机号等，便于供应商联络" v-model="form.wechat"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目成员：" prop="membersList">
                <el-tooltip class="item" effect="dark" content="可查询/编辑需求内容、接收会邀" placement="top-start">
                  <i class="el-icon-question tip-bubble"></i>
                </el-tooltip>
                <el-select 
                  @visible-change="((val)=>{showHistoryList(val, 'memberList')})"
                  v-model="form.membersList"  
                  @change="changeMembers"
                  :remote-method="((val)=>{remoteMembers(val, 'memberList')})"
                  remote
                  multiple
                  ref="membersList"
                  filterable
                  reserve-keyword
                  :loading="loading.select"
                  placeholder="请选择项目成员"
                >
                  <el-option 
                    v-for="item of memberList" 
                    :key="item.userDeptId" 
                    :label="item.userTotalInfo" 
                    :disabled="item.disabled"
                    :value="item.userTotalInfo"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="业务审批人：" prop="approverList">
                <!-- :disabled='isEdit && (!isSelf || (isAdministrator && isSelf && !notEnd))'  -->
                <el-select
                  :disabled='isEdit && (!isSelf || !isApproving)' 
                  v-model="form.approverList"
                  multiple
                  filterable
                  remote
                  ref="approverList"
                  reserve-keyword
                  placeholder="请选择审批人"
                  @change="changeMembers"
                  :loading="loading.select"
                  :remote-method="((val)=>{remoteMembers(val, 'approvers')})"
                  @visible-change="((val)=>{showHistoryList(val, 'approvers')})"
                >
                  <el-option
                    v-for="item of approvers"
                    :key="item.userDeptId"
                    :label="item.userTotalInfo"
                    :disabled="item.disabled"
                    :value="item.userTotalInfo"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="需求类型：" ref="demandTypeList" prop="demandTypeList">
            <el-checkbox-group v-model="form.demandTypeList">
              <!-- :disabled="isEdit && (!isSelf || (isAdministrator && isSelf && !notEnd))" -->
              <el-checkbox :disabled="isEdit && (!isSelf || (isAdministrator && isSelf && !notEnd))" label="访谈">访谈</el-checkbox>
              <el-checkbox :disabled="isEdit && (!isSelf || (isAdministrator && isSelf && !notEnd))" label="数据">数据
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="需求标题：" ref="title" prop="title">
            <el-input class="textarea" :autosize="{ minRows: 1, maxRows: 10000}" :disabled='isEdit && (!isSelf || (isAdministrator && isSelf && !notEnd))' type="textarea" :rows="2" placeholder="请输入需求标题" v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="需求目的：" ref="purpose" prop="purpose">
            <el-input v-if="isEdit && (!isSelf || (isAdministrator && isSelf && !notEnd))" class="textarea" disabled type="textarea" v-html="form.purpose || '--'"></el-input>
            <vue-tinymce class="tinymce" v-else v-model="form.purpose" :setting="{...setting, placeholder: '请说明申请原因【仅供内部审批参考】'}"/>
            <el-input v-model="form.purpose" style="display:none"></el-input>
          </el-form-item>
          <el-form-item label="访谈背景：" ref="background" prop="background">
            <el-input v-if="isEdit && (!isSelf || (isAdministrator && isSelf && !notEnd))" class="textarea" disabled type="textarea" v-html="form.background || '--'"></el-input>
            <vue-tinymce v-else v-model="form.background" :setting="{...setting, placeholder: '请补充背景说明（若有）【仅供内部审批参考】'}"/>
            <el-input v-model="form.background" style="display:none"></el-input>
          </el-form-item>
          <el-form-item label="专家要求：" ref="expertRequirement" prop="expertRequirement">
            <el-input v-if="isEdit && (!isSelf || (isAdministrator && isSelf && !notEnd))" class="textarea" disabled type="textarea" v-html="form.expertRequirement || '--'"></el-input>
            <vue-tinymce v-else v-model="form.expertRequirement" :setting="{...setting, placeholder: '请输入专家要求，包括所属行业、曾任职公司、职位等'}"/>
            <el-input v-model="form.expertRequirement" style="display:none"></el-input>
          </el-form-item>
          <el-form-item label="访谈问题：" ref="interviewQuestion" prop="interviewQuestion">
            <el-input v-if="isEdit && (!isSelf || (isAdministrator && isSelf && !notEnd))" class="textarea" disabled type="textarea" v-html="form.interviewQuestion || '--'"></el-input>
            <vue-tinymce v-else v-model="form.interviewQuestion" :setting="{...setting, placeholder: '请输入详细访谈问题，以便更快匹配专家'}"/>
            <el-input v-model="form.interviewQuestion" style="display:none"></el-input>
          </el-form-item>
          <el-form-item label="供应商：" ref="supplierList" prop="supplierList">
            <div v-for="item in suppliers" :key="item.name">
              <el-checkbox
               style="position:relative"
                :disabled="!item.list.length ||(editorType !== 'draftsEdit' && disabledChecks[item.key].length == item.list.length) || (isEdit && (!isSelf || (isAdministrator && isSelf && !notEnd)))"
                :indeterminate="indeterminate[item.key]" v-model="checkAll[item.key]"
                @change="val => handleCheckedAll(val, item)">{{ item.name }}
                <span v-if="item.name=='海外'" class="tip-supplier">（海外供应商费用相对较高，国内需求不建议勾选）</span>
              </el-checkbox>
              <div class="check-supplier">
                <el-checkbox-group :disabled='isEdit && (!isSelf || (isAdministrator && isSelf && !notEnd))'
                  class="checkbox-group" v-model="checks[item.key]" @change="val => handleCheckedSingle(val, item)">
                  <el-checkbox
                    :disabled="editorType != 'draftsEdit' && disabledChecks[item.key].includes(i.supplierId)"
                    v-for="i in item.list" :label="i.supplierId" :key="i.supplierId">
                    <tool-tips :contentText="i.accountName" :outerShellWidth='110' />
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </el-form-item>
          <el-form-item style="position:relative" label="需求标签：" ref="tagList" prop="tagList">
            <el-tooltip class="item" effect="dark" content="可输入相关tag，便于后续索引" placement="top-start">
              <i class="el-icon-question tip-bubble"></i>
            </el-tooltip>
            <el-select v-model="tagList" multiple filterable allow-create default-first-option placeholder="请输入需求标签">
              <el-option v-for="(item, index) in form.tagList" :key="index" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上传附件：">
            <Upload ref="uploader" @refresh="(val) => {isUploaded = val}" :file-detail="form.attatchmentList"
              :is-edit="isEdit && (!isSelf || (isAdministrator && isSelf && !notEnd))" />
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <div class="bottom-fix">
      <el-card>
        <el-button type="primary" v-if="['draftsEdit', 'add'].includes(editorType)" :loading="loading.submit"
          @click="handleClickBtn('submit')" :disabled="isUploaded">提交</el-button>
        <el-button :loading="loading.save" @click="handleClickBtn('save')" :disabled="isUploaded">保存</el-button>
        <el-button @click="$router.go(-1)">取消</el-button>
      </el-card>
    </div>
    <!-- 编辑备注弹框 -->
    <el-dialog :visible.sync="dialogVisible" width="600px">
      <el-form ref="remarkform" label-width="100px" :model="remarkForm" :rules="remarkRules">
        <el-form-item label="编辑备注：" prop="demandRemarks">
          <el-input type="textarea" :rows="5" placeholder="请对编辑内容进行简单概括" v-model="remarkForm.demandRemarks"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" center class="dialog-footer">
        <el-button type="primary" @click="onSaveDemand" :loading="loading.dialog">保存</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  addDemand,
  getMember,
  getSuperior,
  submitDemand,
  addEditDemand,
  submitEditDemand,
  getDemandEditInfo,
  querySuppliers,
  getDeptByName,
  getDataPermission
} from '@/api/demand.js';
import { getDepartment } from '@/api/account.js';
import { deepClone } from '@/utils';
import uploadCos from '@/mixins/uploadCos.js';
import ToolTips from '@/components/ToolTips';
import { strategyGroup } from '@/enums/index.js';
import Upload from '@/components/Upload';
import { mapGetters } from 'vuex';
const longInteger = {
  max: 9999,
  message: '字符长度不能超过9999个',
  trigger: 'change'
};
export default {
  mixins: [uploadCos],
  components: {
    Upload,
    ToolTips
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        });
        callback(new Error(rule.field + '为必传项'));
      } else {
        callback();
      }
    };
    const checkText = (rule, value, cb, pa) => {
      if (!(value.replace(/[\s，]/g, ''))) {
        let msg = this.rulesText[Object.keys(pa)[0]];
        return cb(msg);
      } else {
        return cb();
      }
    };
    const checkText2 = (rule, value, cb, pa) => {
      if (value && value.replace(/[\s，]/g, '') == '') {
        let msg = this.rulesText[Object.keys(pa)[0]];
        return cb(msg);
      } else {
        return cb();
      }
    };
    return {
      demandStatus: '',
      demander: '', // 需求人
      form: {
        demandTypeList: ['访谈'],
        title: '',
        purpose: '',
        background: '',
        expertRequirement: '',
        interviewQuestion: '',
        supplierList: [],
        // departmentNameList: [],
        departmentIdList: [],
        demandGroupList: [],
        membersList: [],
        question: '',
        approverList: [],
        contractor: '',
        wechat: '',
        tagList: [],
        attatchmentList: []
      },
      tagList: [],
      rules: {
        demandTypeList: [{ required: true, message: '请选择需求类型' }],
        title: [{ validator: checkText2, trigger: 'blur' }, { required: true, message: '请填写标题' }, { max: 999, message: '标题长度不能超过999个', trigger: 'change' }],
        purpose: [{ required: true, message: '请填写需求目的' }, { validator: checkText2, trigger: 'blur' }],
        // purpose:[{ validator: validateRequire }],
        background: [{ validator: checkText2, trigger: 'blur' }],
        expertRequirement: [{ required: true, message: '请填写专家要求' }, { validator: checkText2, trigger: 'blur' }],
        interviewQuestion: [{ validator: checkText2, trigger: 'blur' }, { required: true, message: '请填写访谈问题' }],
        supplierList: { required: true, message: '请选择供应商' },
        departmentIdList: { required: true, message: '请选择所属部门' },
        // demandGroupList: { required: true, message: '请选择所属小组' },
        approverList: { required: true, message: '请选择业务审批人' },
        contractor: { required: true, message: '请选择负责人' },
        wechat: { max: 50, message: '联系方式字符不能超过50个', trigger: 'change' }
      },
      rulesText: {
        title: '请填写标题',
        purpose: '请填写需求目的',
        background: '请正确填写背景',
        expertRequirement: '请正确填写专家要求',
        interviewQuestion: '请正确填写访谈问题'
      },

      // 下拉框数据
      strategyGroup,
      memberList: [],
      approvers: [],
      contractors: [],
      departments: [],
      approver: '',

      loading: {
        save: false,
        submit: false,
        select: false,
        dialog: false
      },
      // 供应商
      allSuppliers: [],
      suppliers: [
        { name: '国内', key: 'internal', list: [] },
        { name: '海外', key: 'overseas', list: [] }
      ],
      indeterminate: {
        internal: false,
        overseas: false
      },
      checkAll: {
        internal: true,
        overseas: false
      },
      checks: {
        internal: [],
        overseas: []
      },
      disabledChecks: {
        internal: [],
        overseas: []
      },
      // 编辑备注弹框
      dialogVisible: false,
      remarkForm: {
        demandRemarks: ''
      },
      remarkRules: {
        demandRemarks: [{ required: true, message: '请先填写编辑备注' }, { max: 9999, message: '备注不能超过9999个', trigger: 'change' }]
      },
      // tiny中文文档：http://tinymce.ax-z.cn/plugins/quickbars.php
      setting: {
        toolbar: false,
        menubar: false,
        toolbar_drawer: 'sliding',
        quickbars_selection_toolbar: 'removeformat | bold italic underline strikethrough | forecolor backcolor',
        plugins: 'quickbars',
        quickbars_insert_toolbar: false, // 去除快速插入图片,table
        language: 'zh_CN', // 本地化设置
        height: 150,
        branding: false, // 右下角水印关闭
        // paste_data_images: false,
        // paste_enable_default_filters: false,
        // paste_filter_drop: false
        // paste_data_images: true
        // readonly: true
      },
      isUploaded: false
    };
  },
  watch: {
    'form.purpose': {
      handler(nVal, oVal) {
        this.changeTinymceStyle('purpose', 0);
      }
    },
    'form.background': {
      handler(nVal, oVal) {
        this.changeTinymceStyle('background', 1);
      }
    },
    'form.expertRequirement': {
      handler(nVal, oVal) {
        this.changeTinymceStyle('expertRequirement', 2);
      }
    },
    'form.interviewQuestion': {
      handler(nVal, oVal) {
        this.changeTinymceStyle('interviewQuestion', 3);
      }
    },

  },
  computed: {
    editorType() {
      return this.$route.query.type;
    },
    rowId() {
      return this.$route.query.id;
    },

    isEdit() {
      return this.editorType === 'edit';
    },
    
    // 是否选择战略发展部-id为30
    checkSdd() {
      // return this.form.departmentNameList.includes('战略发展部')
      return this.form.departmentIdList.includes('30');
    },

    // 当前需求是否自己创建【2.三期迭代新增:项目成员同样有编辑权限】
    isSelf() {
      return this.userId === this.demander || this.form.membersList.includes(this.userId);
    },
    
    // 属于管理员和超管
    isAdministrator() {
      return ['coAdministrator', 'suAdministrator'].includes(this.roles[0]);
    },
    // 审批中和进行中状态
    notEnd() {
      return this.demandStatus !== 'end';
    },
    // 审批中状态
    isApproving() {
      return this.demandStatus === 'approving';
    },
    checkedSupplier() {
      const { internal, overseas } = this.checks;
      return [...internal, ...overseas];
    },
    ...mapGetters(['departmentName', 'userId', 'roles', 'departmentId'])
  },
  methods: {
    handleClickBtn(type) {
      if (type === 'save') { // 保存按钮
        if (['add', 'draftsEdit'].includes(this.$route.query.type)) { // 草稿箱保存不进行表单校验
          this.onSave('save');
        } else { // 创建好的需求进行保存时弹出必填项弹框--需求编辑保存
          this.$refs.form.validate((valid, object) => {
            if (valid) {
              this.dialogVisible = true;
            } else {
              this.scrollIntoView(object);
            }
          });
        }
      } else { // 需求提交
        this.$refs.form.validate((valid, object) => {
          if (valid) {
            this.onSubmit(this.submitParams(type));
          } else {
            this.scrollIntoView(object);
          }
        });
      }
    },

    // 校验不通过滚动到该不通过位置
    scrollIntoView(object) {
      let keys = ['purpose', 'background', 'expertRequirement', 'interviewQuestion'];
      for (const key in keys) {
        this.changeTinymceStyle(keys[key], key);
      }
      for (let i in object) {
        let dom = this.$refs[i];
        if (Object.prototype.toString.call(dom) !== '[object Object]') {
          dom = dom[0];
        }
        // 滚动到指定节点
        dom.$el.scrollIntoView({
          block: 'center', // 值有start,center,end，nearest，当前显示在视图区域中间
          behavior: 'smooth'// 值有auto、instant,smooth，缓动动画（当前是慢速的）
        });
        break; // 检测第一项跳出循环
      }
    },

    onSaveDemand() {
      this.$refs.remarkform.validate(valid => {
        if (valid) {
          this.onSave('dialog');
        }
      });
    },

    submitParams(type) {
      this.form.supplierList = this.checkedSupplier;
      const params = {
        ...this.form,
        ...this.remarkForm,
        demandId: this.editorType !== 'add' ? this.rowId : '',
      };
      // params.purpose = this.purpose
      params.tagList = this.tagList;
      // 是否战略发展部
      // if (!params.departmentNameList.includes('战略发展部')) {
      if (!params.departmentIdList.includes('30')) {
        params.demandGroupList = [];
      }
      // 数据格式处理
      // params.tagList = params.tagList ? params.tagList.replace(/[\s，]/g, ',').split(',').filter(item => item !== '') : []
      if (this.$refs.uploader.fileList.length) {
        params.attatchmentList = this.$refs.uploader.fileList.map(item => ({
          attachmentName: item.name,
          attachmentKey: item.key
        }));
        // 提交操作多传一个附件预览链接给后端
        // if (type === 'submit') {
        //   params.attatchmentList.forEach(item => {
        //     this.getObjectUrl({key: item.attachmentKey}, 'preview', url => {
        //       item.url = url
        //     })
        //   })
        // }
      } else {
        params.attatchmentList = [];
      }
      return params;
    },

    onSave(type) {
      this.loading[type] = true;
      let requestApi = this.editorType === 'add' ? addDemand : addEditDemand;
      requestApi(this.submitParams('save')).then(res => {
        this.$message.success('保存成功');
        if (this.editorType === 'draftsEdit') {
          this.$router.push('/demand/drafts');
        } else {
          this.$router.push('/demand/list');
        }
      }).finally(_ => this.loading[type] = false);
    },

    onSubmit(params) {
      this.loading.submit = true;
      let requestApi = this.editorType === 'add' ? submitDemand : submitEditDemand;
      requestApi(params).then(res => {
        this.$message.success('添加成功');
        this.$router.push('/demand/list');
      }).finally(_ => this.loading.submit = false);
    },

    // 获取详情
    async getFormData() {
      try {
        const { data } = await getDemandEditInfo({ demandId: this.rowId });
        const keys = Object.keys(this.form);
        for (const key of keys) {
          this.form[key] = data[key] ? data[key] : '';
        }
        this.demander = data.createBy;
        this.demandStatus = data.demandStatus;
        this.tagList = data.tagList;
        this.form.background = data.background ? data.background : '';
        this.form.interviewQuestion = data.interviewQuestion ? data.interviewQuestion : '';
        // 供应商回显
        if (this.form.supplierList.length) {
          let internalIds = this.suppliers[0].list.map(item => item.supplierId);
          let foreignIds = this.suppliers[1].list.map(item => item.supplierId);
          this.checks.internal = internalIds.filter(item => this.form.supplierList.indexOf(String(item)) != -1);
          this.disabledChecks.internal = deepClone(this.checks.internal);

          this.checks.overseas = foreignIds.filter(item => this.form.supplierList.indexOf(String(item)) != -1);
          this.disabledChecks.overseas = deepClone(this.checks.overseas);

          this.handleCheckedSingle(this.checks.internal, this.suppliers[0]);
          this.handleCheckedSingle(this.checks.overseas, this.suppliers[1]);
        } else { // 适配草稿箱全不选供应商后的回显情况
          this.checks.internal = [];
          this.checks.overseas = [];
          this.handleCheckedSingle(this.checks.internal, this.suppliers[0]);
          this.handleCheckedSingle(this.checks.overseas, this.suppliers[1]);
        }
      } catch (err) {
        console.error(err);
      }
    },

    // 项目成员 / 业务审批人 / 承办人
    remoteMembers(val, key) {
      this.loading.select = true;
      getMember({ userTotalInfo: val }).then(res => {
        this[key] = res.data || [];
      }).catch(err => { })
        .finally(_ => this.loading.select = false);
    },

    // 记录并缓存【最近输入】
    changeMembers(val) {
      this.$refs.membersList.query = '';
      this.$refs.approverList.query = '';
      if (!val.length) return;
      let mapMemberList = JSON.parse(localStorage.getItem('mapMemberList'));
      if (!mapMemberList) {
        mapMemberList = typeof (val) === 'string' ? [val] : val;
      } else {
        val = typeof (val) === 'string' ? val.split(',') : val;
        val.forEach(item => {
          if (!mapMemberList.includes(item)) {
            mapMemberList.push(item);
          }
        });
      }
      window.localStorage.setItem('mapMemberList', JSON.stringify(mapMemberList));
    },

    // 回显【最近输入】
    showHistoryList(val, key) {
      if (!val) return;
      let mapMemberList = JSON.parse(localStorage.getItem('mapMemberList')) || [];
      if (!mapMemberList.length) return;
      let data = mapMemberList.map(item => ({ userTotalInfo: item, userDeptId: item.split('(')[0] }));
      this[key] = [
        { userTotalInfo: '最近输入', userDeptId: 'recently_input', disabled: true },
        ...data
      ];
    },

    // 供应商全选与多选交互
    handleCheckedAll(val, item) {
      let data = item.list.map(i => i.supplierId);
      if (this.editorType === 'draftsEdit') {
        this.checks[item.key] = val ? data : [];
      } else { // 非草稿箱取消全选供应商需要保留默认回显
        this.checks[item.key] = val ? data : deepClone(this.disabledChecks[item.key]);
      }
      // if (this.checks[item.key].length) {
      if (this.checks[item.key].length === item.list.length) {
        this.indeterminate[item.key] = false;
        this.checkAll[item.key] = true;
      } else {
        this.indeterminate[item.key] = true;
        this.checkAll[item.key] = false;
      }
      this.validSupplier();
    },

    handleCheckedSingle(val, item) {
      let num = val.length;
      this.checkAll[item.key] = num > 0 && num === item.list.length;
      this.indeterminate[item.key] = num > 0 && num < item.list.length;
      this.validSupplier();
    },

    // 触发供应商校验
    validSupplier() {
      this.$set(this.form, 'supplierList', this.checkedSupplier);
      this.$nextTick(() => {
        this.$refs.form.validateField('supplierList');
      });
    },

    // 校验失败修改富文本框样式
    changeTinymceStyle(key, index) {
      setTimeout(() => { // 确保获取到dom元素再操作
        let tinymcdDom = document.getElementsByClassName('tox-tinymce');
        this.$refs['form'].validateField([key], (errorMessage) => {
          let valid = errorMessage ? false : true;
          if (!tinymcdDom.length) return;
          if (valid) {
            tinymcdDom[index].style.border = '1px solid  #ccc';
          } else {
            tinymcdDom[index].style.border = '1px solid red';
          }
        });
      }, 400);
    },

    async initForm() {
      this.form.contractor = this.userId;
      // this.form.departmentNameList = this.departmentName ? [this.departmentName] : []
      this.form.departmentIdList = this.departmentId ? [this.departmentId] : [];
      if (this.editorType !== 'add') {
        await this.getFormData();
      }
    },

    resetForm() {
      this.$refs.form.resetFields();
      this.$refs.uploader.fileList = [];
      this.form = {
        demandTypeList: ['访谈'],
        title: '',
        purpose: '',
        background: '',
        expertRequirement: '',
        interviewQuestion: '',
        supplierList: [],
        departmentIdList: this.departmentId ? [this.departmentId] : [],
        demandGroupList: [],
        membersList: [],
        question: '',
        approverList: this.approver ? [this.approver] : [],
        contractor: '',
        wechat: '',
        tagList: [],
        attatchmentList: []
      };
      this.tagList = [];
    },

    // 初始化供应商数据
    async getSuppliers() {
      await querySuppliers().then(res => {
        this.allSuppliers = res.data || []
        // 获取国内供应商
        this.suppliers[0].list = this.allSuppliers.filter(item => item.supplierBelong == '0')
        // 三期新需求：默认不全选
        this.checks.internal = []
        this.handleCheckedSingle(this.checks.internal, this.suppliers[0])
        // 默认全选
        // if (this.suppliers[0].list.length) {
        //   this.checks.internal = this.suppliers[0].list.map(item => item.supplierId)
        //   this.handleCheckedSingle(this.checks.internal, this.suppliers[0])
        // }
        // 海外供应商
        this.suppliers[1].list = this.allSuppliers.filter(item => item.supplierBelong == '1')
        // 三期新需求：默认不全选
        this.checks.overseas = []
        this.handleCheckedSingle(this.checks.overseas, this.suppliers[1])
        // 默认全选
        // if (this.suppliers[0].list.length) {
        //   this.checks.overseas = this.suppliers[1].list.map(item => item.supplierId)
        //   this.handleCheckedSingle(this.checks.overseas, this.suppliers[1])
        // }
      }).catch(err => { })
    },

    // 获取所属部门
    getDepartments() {
      getDepartment().then(res => {
        this.departments = res.data || [];
      }).catch(err => { });
    },

    // 获取默认上级审批人
    getDefaultSuperior() {
      getSuperior().then(res => {
        this.approver = res.data.superiorTotalInfo;
        this.form.approverList = this.approver ? [this.approver] : [];
      }).catch(err => { });
    }
  },
  beforeRouteLeave(to, from, next) {
    if (['DemandDetail', 'DemandBaseDetail'].includes(to.name) && from.query.type == 'edit') {
      const breadList = [
        { title: '需求列表', path: '/demand/list' },
        { title: '需求跟踪', path: '' },
      ];
      window.localStorage.setItem('customBread', JSON.stringify(breadList));
    } else if (['DemandDetail', 'DemandBaseDetail'].includes(to.name) && from.query.type == 'draftsEdit') {
      const breadList = [
        { title: '草稿箱', path: '/demand/drafts' },
        { title: '需求跟踪', path: '' },
      ];
      window.localStorage.setItem('customBread', JSON.stringify(breadList));
    } else {
      window.localStorage.setItem('customBread', '');
    }
    next();
  },
  async mounted() {
    if (this.editorType === 'add') { // 新增时回显默认审批人
      await this.getSuppliers();
      await this.initForm();
      this.getDepartments();
      this.getDefaultSuperior();
      return;
    }
    let params = {
      type: 'edit',
      id: this.$route.query.id
    };
    let res = await getDataPermission(params);
    if (res.data == 'true') {
      await this.getSuppliers();
      await this.initForm();
      this.getDepartments();
    } else {
      this.$router.push('/demand/list');
      this.$message.error('您暂无权限访问该页面，已返回首页');
    }

    // if (this.editorType === 'add') { // 新增时回显默认审批人
    //   await this.getDefaultSuperior()
    // }
    // await this.getSuppliers()
    // await this.initForm()
    // this.getDepartments()
    
    // let dom = document.getElementsByClassName("tox-edit-area__iframe") 
    // var y = dom[0].contentWindow.document
    // console.log(y.getElementsByClassName('mce-content-body ')[0], 111);
    // y.getElementsByClassName('mce-content-body ')[0].addRule('.mce-content-body ::before','color:green');
    // document.styleSheet[0].addRule('.red:before','background-color:green');
    // if (y.document)y=y.document;
  }
};
</script>
<style lang="scss">
.demand-editor {
  padding: 0 !important;

  /* card */
  .card-container {
    background: #f0f2f5;
    padding: 0 10px;

    .el-form-item .el-form-item__content {
      .el-select {
        width: 100%;
      }

      .textarea .el-textarea__inner {
        overflow: hidden;
        font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
      }
    }

    .el-form-item__label {
      font-weight: 700;
    }

    .checkbox-group {
      margin-left: 18px;
    }

    .check-supplier .el-checkbox__inner {
      border-radius: 50%;
    }

    .tip-bubble {
      font-size: 16px;
      top: 10px;
      left: -100px;
      position: absolute;
      color: #FF0000;
    }

    .tip-supplier {
      left: 56px;
      font-weight: 400;
      font-style: italic;
      position: absolute;
      color: #FF0000;
      font-size: 12px;
    }

    .el-upload,
    .el-upload-dragger {
      width: 100%;
    }
  }
  /* footer */
  .bottom-fix {
    position: sticky;
    left: 0;
    bottom: 0;
    z-index: 10;
    padding: 0 10px;
    padding-top: 0;
    text-align: center;
    background: #f0f2f5;
  }
}
.green::before {
  content: 'green';
  background-color: green;
}
</style>

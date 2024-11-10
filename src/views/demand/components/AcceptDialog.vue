<template>
  <el-dialog
    :title="isAccept?'专家验收':'验收调整'"
    :visible.sync="visible"
    width="880px"
    append-to-body
    @open="initFormData"
    @close="resetForm"
    class="dialog-container settlement-dialog"
    destroy-on-close
  >
    <el-form ref="form" label-width="80px" size="mini" inline :model="form" :rules="rules">
      <el-form-item label="访谈日期：" prop="interviewDate">
        <div class="block" style="display:inline-block">
          <el-date-picker
            v-model="form.interviewDate"
            type="date"
            :disabled="isAccept"
            placeholder="请选择访谈日期"
            class="input-width"
          ></el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="开始时间：" prop="beginDate">
        <div class="block">
          <el-time-picker
            :disabled="isAccept"
            placeholder="请选择开始时间"
            v-model="form.beginDate"
            class="input-width"
            format="HH:mm"
          ></el-time-picker>
        </div>
      </el-form-item>
      <el-form-item label="倍率系数：" prop="magnification">
        <el-input
          placeholder="请输入倍率系数"
          v-model="form.magnification"
          class="input-width"
          :disabled="isAccept"
          @input="changeRatio"
        ></el-input>
      </el-form-item>
      <el-form-item label="实际时长：" prop="actualHours">
        <el-input
          v-model="form.actualHours"
          class="input-width"
          :disabled="isAccept"
          @input="onActualInputBlur"
          placeholder="请输入实际时间"
        >
          <template slot="append">{{ form.actualHoursUnit }}</template>
        </el-input>
      </el-form-item>
      <el-form-item label="实收时长：" prop="incomeHours">
        <el-input v-model="form.incomeHours" class="input-width" disabled placeholder="实收时长">
          <template slot="append">{{ form.incomeHoursUnit }}</template>
        </el-input>
        <i
          class="el-icon-circle-plus"
          @click="addRemark"
          v-if="!showRemark"
          style="margin-left:5px;"
        ></i>
      </el-form-item>
      <el-tooltip
        class="item"
        effect="dark"
        content="如果您的实收时长过多或者过少，可在调整时长里面输入分值对实收时长进行加减调整。"
        placement="top-start"
        v-if="showRemark"
      >
        <i class="el-icon-question"></i>
      </el-tooltip>
      <el-form-item label="调整时长：" v-if="showRemark" class="remark-form-item" prop="adjustHours">
        <el-input
          placeholder="调整时长"
          v-model="form.adjustHours"
          :disabled="isAccept"
          class="input-width input-with-select"
          @input="changeadjustHours"
        >
          <el-select v-model="symbol" slot="prepend" @change="changeSymbol">
            <el-option label="+" value="+"></el-option>
            <el-option label="-" value="-"></el-option>
          </el-select>
          <template slot="append">{{ form.adjustHoursUnit }}</template>
        </el-input>
        <i class="el-icon-error" style="color:#999;margin-left:5px;" v-if="!isAccept" @click="removeRemark"></i>
      </el-form-item>
      <br/>
      <el-descriptions style="margin-left:25px;margin-bottom:6px" size='medium' :column="3">
        <el-descriptions-item label="专业度">
          <el-rate :disabled="!isSelf" allow-half v-model="form.professionalism" show-score text-color="#ff9900"></el-rate>
        </el-descriptions-item>
        <el-descriptions-item label="分享度">
          <el-rate :disabled="!isSelf" allow-half v-model="form.shared" show-score text-color="#ff9900"></el-rate>
        </el-descriptions-item>
        <el-descriptions-item label="服务满意">
          <el-rate :disabled="!isSelf" allow-half v-model="form.satisfaction" show-score text-color="#ff9900"></el-rate>
        </el-descriptions-item>
      </el-descriptions>
      <el-form-item label="服务评价：" prop="serviceEvaluation">
        <el-input type="textarea" :disabled="!isSelf" style="width:660px" placeholder="请输入本次访谈的补充说明（若有）" v-model="form.serviceEvaluation" :rows="5" />
      </el-form-item>
      <br />
      <el-form-item label="附件：">
        <Upload ref="uploader" @refresh="(val) => {isUploaded = val}" :file-detail="form.attatchmentList" :is-edit="!isSelf"/>
      </el-form-item>
      <!-- <el-form-item style="display:block" label="是否共享：">
        <el-tooltip class="item" effect="dark" content="开启共享后，本需求内容及验收上传的附件将会展示在“智库”里，其他用户可申请在线预览，您可在智库模块下【我的审批】中进行授权" placement="top-start">
          <i  class="el-icon-question tips-bubble"></i>
        </el-tooltip>
        <el-switch :disabled="!isSelf" v-model="form.whethershare"></el-switch>
      </el-form-item> -->
    </el-form>
    <div class="btns dialog-footer" slot="footer">
      <el-button
        type="primary"
        :loading="loading"
        @click="onSubmit"
        :disabled="isUploaded"
      >确定</el-button>
      <el-button @click="onCancel">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  adjustAccept,
  demandAccept,
  getAcceptInfo
} from '@/api/demand.js';
import { mapGetters } from 'vuex';
import Upload from '@/components/Upload';
const textIncomeHours = (rule, value, callback) => {
  if (value < 0) {
    callback('实收时长不能小于0');
  } else {
    return callback();
  }
};
export default {
  components: {
    Upload
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    // 弹框类型：验收（accept）/调整验收（modify_accept）
    type: {
      type: String,
      default: 'accept'
    },
    confirmId: {
      type: String,
      default: ''
    },
    demander: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      radio: '0',
      responseId: '',
      form: {
        // 实际时长
        actualHours: '',
        actualHoursUnit: '分',
        actualHoursMin: '0',
        // 实收时长
        incomeHours: '',
        incomeHoursUnit: '分',
        incomeHoursMin: '0',
        // 调整时长
        adjustHours: '',
        adjustHoursUnit: '分',
        lastRemarkTime: '0',
        adjustHoursMin: '0',
        interviewDate: '', // 访谈日期
        beginDate: '', // 开始时间
        magnification: '', // 倍率系数
        endTime: '', // 结束时间
        serviceEvaluation: '', // 服务评价
        attatchmentList: [], // 附件
        // whethershare: false, // 是否共享 1-共享 0-不共享
        // 打星评分
        professionalism: 0,
        shared: 0,
        satisfaction: 0
      },
      loading: false,
      rules: {
        magnification: [
          { required: true, message: '请输入倍率信息', triggle: 'change' },
          { pattern: /^[0-9]*\.?[0-9]{0,2}$/, message: '请输入正确的倍率系数(如2,1.2,1.22)', trigger: 'change' }
        ],
        beginDate: [{type: 'date', required: true, message: '请填写开始时间', triggle: 'blur' }],
        interviewDate: [{type: 'date', required: true, message: '请填写访谈日期', triggle: 'blur' }],
        actualHours: [{ required: true, message: '请填写实际时长', triggle: 'blur' }],
        incomeHours: [{ required: true, message: '请填写实收时长', triggle: 'blur', validator: textIncomeHours }],
        serviceEvaluation: [{ max: 300, message: '服务评价不能超过300字符', trigger: 'change' }]
      },
      // 是否展示增值备注
      showRemark: false,
      expertAllmess: {},
      attatchmentList: [],
      // 实收时长总时间（单位分）
      totalTime: '',
      symbol: '+',
      isUploaded: false
    };
  },
  computed: {
    visible: {
      get: function () {
        return this.dialogVisible;
      },
      set: function (val) {
        this.$emit('update:dialogVisible', val);
      }
    },
    isAccept() {
      return this.type == 'accept';
    },
    adjustHours: {
      get() {
        return this.form.adjustHours;
      },
      set(newValue) {
        return newValue;
      },
    },
    incomeHoursAll() {
      return {
        actualHours: this.form.actualHours,
        actualHoursMin: this.form.actualHoursMin,
        magnification: this.form.magnification,
        remark: this.form.adjustHoursMin
      };
    },
    isSelf() {
      return this.userId === this.demander;
    },
    ...mapGetters(['userId', 'roles'])
  },
  methods: {
    initFormData() {
      const params = {
        demandId: this.$route.query.id,
        confirmId: this.confirmId
      };
      getAcceptInfo(params).then(res => {
        if (this.isAccept) {
          this.showRemark = true;
        } else {
          this.form = Object.assign(this.form, res.data);
          this.showRemark = res.data.adjustHours ? true : false;
        }
        this.form.interviewDate = new Date(res.data.interviewDate);
        this.form.beginDate = new Date(res.data.beginDate);
        this.form.magnification = String(res.data.magnification);
        this.form.actualHours = String(res.data.actualHours);
        this.form.incomeHours = String(res.data.incomeHours);
        // 是否共享
        // this.form.whethershare = res.data.whethershare ? true : false
        // 调整时长
        this.symbol = res.data.adjustHours >= 0 ? '+' : '-';
        this.form.adjustHours = String(res.data.adjustHours).replace(/-/g, '');
        this.responseId = res.data.responseId;
        this.onActualInputBlur();
        this.changeadjustHours();
      }).catch(err => {});
    },
    // 关闭dialog
    resetForm() {
      this.visible = false;
      this.$parent.showSettlementDialog = false;
      this.$refs.form.clearValidate();
      this.$nextTick(() => {
        this.clearForm();
      });
      // Object.assign(this.$data, this.$options.data())
    },
    onActualInputBlur() {
      // this.form.actualHours = this.form.actualHours.replace(/[^\d]{0,3}/g, '')
      let bool = /^[0-9]*\.?[0-9]{0,3}$/.test(this.form.actualHours);
      if (!bool) {
        this.form.actualHours = '';
      }
      if (this.form.actualHours < 0) {
        this.$message.error('实际时长不能小于0');
        this.form.actualHours = '';
        return;
      } else if (!this.form.actualHours) {
        this.form.actualHoursUnit = '分';
      }
      if (this.form.actualHoursUnit == '分') {
        this.form.actualHoursMin = this.form.actualHours;
        if (this.form.actualHours >= 60) {
          this.form.actualHours = (this.form.actualHours / 60).toFixed(3);
          this.form.actualHoursUnit = '时';
        }
      } else if (this.form.actualHoursUnit == '时') {
        this.form.actualHoursMin = this.form.actualHours * 60;
      }
    },
    // 处理时间
    formatDateTime(date) {
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? ('0' + m) : m;
      let d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      let h = date.getHours();
      let minute = date.getMinutes();
      minute = minute < 10 ? ('0' + minute) : minute;
      let miao = date.getSeconds();
      miao = miao < 10 ? ('0' + miao) : miao;
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + miao;
    },
    // 确定按钮
    onSubmit() {
      const { professionalism, shared, satisfaction, serviceEvaluation, interviewDate, actualHoursMin, incomeHoursMin, beginDate, magnification, incomeHours, adjustHours, adjustHoursMin } = this.form;
      const commonParams = {
        shared,
        satisfaction,
        magnification,
        professionalism,
        serviceEvaluation,
        confirmId: this.confirmId,
        responseId: this.responseId,
        incomeHours: incomeHoursMin,
        demandId: this.$route.query.id
      };
      if (this.$refs.uploader.fileList.length) {
        commonParams.attatchmentList = this.$refs.uploader.fileList.map(item => ({
          attachmentName: item.name,
          attachmentKey: item.key
        }));
      }
      // commonParams.whethershare = whethershare ? 1 : 0
      if (this.isAccept) {
        this.loading = true;
        demandAccept(commonParams).then(res => {
          this.visible = false;
          this.$message.success('验收成功');
          this.$emit('refresh');
        }).finally(_ => this.loading = false);
      } else {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.loading = true;
            const params = {
              ...commonParams,
              interviewDate: this.moment(interviewDate).format('yyyy-MM-DD'),
              actualHours: actualHoursMin,
              beginDate: `${this.moment(interviewDate).format('yyyy-MM-DD')} ${this.moment(beginDate).format('HH:mm')}`,
              adjustHours: adjustHoursMin - 0
            };
            adjustAccept(params).then(res => {
              this.visible = false;
              this.$message.success('调整验收成功');
              this.$emit('refresh');
            }).catch(_ => {})
              .finally(_ => this.loading = false);
          }
        });
      }
    },
    // 取消
    onCancel() {
      this.$confirm('退出将无法保留填写记录，是否确认退出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.visible = false;
        this.$refs.form.resetFields();
        this.resetForm();
      }).catch(_ => { });
    },
    // 增加备注
    addRemark() {
      this.showRemark = true;
      this.symbol = '+';
    },
    // 移除备注
    removeRemark() {
      if (this.form.adjustHoursMin) {
        this.form.incomeHoursMin = parseFloat(this.form.incomeHoursMin ? this.form.incomeHoursMin : '0') - parseFloat(this.form.adjustHoursMin ? this.form.adjustHoursMin : '0') + '';
        if (this.form.incomeHoursMin >= 60) {
          this.form.incomeHours = (this.form.incomeHoursMin / 60).toFixed(3);
          this.form.incomeHoursUnit = '时';
        } else {
          this.form.incomeHours = this.form.incomeHoursMin;
          this.form.incomeHoursUnit = '分';
        }
      }
      if (this.form.incomeHours == 0) {
        this.form.incomeHours = '';
      }
      this.form.adjustHours = '';
      this.form.adjustHoursUnit = '分';
      this.form.adjustHoursMin = 0;
      this.showRemark = false;
    },
    changeRatio() {
      let bool = /^[0-9]*\.?[0-9]{0,2}$/.test(this.form.magnification);
      if (!bool) {
        this.form.magnification = '';
      }
    },
    // 修改增值备注下拉框值
    changeSymbol(option) {
      if (option == '-') {
        this.form.adjustHoursMin = this.form.adjustHours ? option + this.form.adjustHoursMin
          : '0';
      } else {
        this.form.adjustHoursMin = this.form.adjustHours ? Math.abs(this.form.adjustHoursMin) + ''
          : '0';
      }
    },
    changeadjustHours() {
      let bool = /^[0-9]*\.?[0-9]{0,3}$/.test(this.form.adjustHours);
      if (!bool) {
        this.form.adjustHours = '';
      }
      // this.form.adjustHours = this.form.adjustHours.replace(/[^\d]{0,3}/g, '')

      if (!this.form.adjustHours) {
        this.form.adjustHoursUnit = '分';
      }
      let remark = Math.abs(this.form.adjustHours);
      if (remark) {
        if (this.form.adjustHoursUnit == '分') {
          this.form.lastRemarkTime = this.form.adjustHoursMin ? this.form.adjustHoursMin : '0';
          if (this.symbol == '-') {
            this.form.adjustHoursMin = '-' + this.form.adjustHours;
          } else {
            this.form.adjustHoursMin = this.form.adjustHours;
          }
          if (remark >= 60) {
            this.form.adjustHours = (this.form.adjustHours / 60).toFixed(3);
            this.form.adjustHoursUnit = '时';
          }
        } else {
          this.form.lastRemarkTime = this.form.adjustHoursMin ? this.form.adjustHoursMin : '0';
          if (this.symbol == '-') {
            this.form.adjustHoursMin = '-' + (this.form.adjustHours * 60);
          } else {
            this.form.adjustHoursMin = this.form.adjustHours * 60;
          }
        }
      } else {
        this.form.adjustHoursMin = '0';
      }
      // 实收时长
      let t1 = parseFloat(this.form.incomeHoursMin ? this.form.incomeHoursMin : '0') - parseFloat(this.form.lastRemarkTime ? this.form.lastRemarkTime : '0') + parseFloat(this.form.adjustHoursMin ? this.form.adjustHoursMin : '0') + '';
      this.totalTime = t1;
      if (t1 >= 60) {
        this.form.incomeHours = (t1 / 60).toFixed(3) + '';
        this.form.incomeHoursUnit = '时';
      } else {
        this.form.incomeHours = t1 + '';
        this.form.incomeHoursUnit = '分';
      }
    },
    //  清除数据
    clearForm() {
      this.$refs.form.resetFields();
      this.$refs.form.clearValidate();
      this.form = {
        // 实际时长
        actualHours: '',
        actualHoursUnit: '分',
        actualHoursMin: '0',
        // 实收时长
        incomeHours: '',
        incomeHoursUnit: '分',
        incomeHoursMin: '0',
        // 增值备注
        adjustHours: '',
        adjustHoursUnit: '分',
        lastRemarkTime: '0',
        adjustHoursMin: '0',
        interviewDate: '', // 访谈日期
        beginDate: '', // 开始时间
        magnification: '', // 倍率系数
        endTime: '', // 结束时间
        serviceEvaluation: '', // 服务评价
        attatchmentList: [], // 附件
        // whethershare: false, // 是否共享
        // 打星评分
        professionalism: 0,
        shared: 0,
        satisfaction: 0
      };
      this.showRemark = false;
      this.symbol = '+';
    }
  },
  watch: {
    // actualTime(newVal, oldVal) {
    //   if (!newVal) {
    //     this.form.actualTimeUnit = "分"
    //   }
    // },
    // payTime(newVal, oldVal) {
    //   if (!newVal) {
    //     this.form.payTimeUnit = "分"
    //   }
    // },
    // 计算实收时长
    incomeHoursAll(newVal, oldVal) {
      if (!newVal.magnification || !newVal.actualHours) {
        if (!newVal.remark || newVal.remark == 0) {
          this.form.incomeHours = '';
          return;
        }
      }
      // 实收时长=倍率*实际时长+增值备注
      let pay = newVal.actualHoursMin * newVal.magnification + parseFloat(newVal.remark ? newVal.remark : '0') + '';
      if (pay < 0) {
        this.$message.error('实收时长不能小于0');
        if (Math.abs(newVal.remark) > pay && this.symbol == '-') {
          this.symbol = '+';
          this.form.adjustHoursMin = newVal.remark.slice(1);
        }
        return;
      }
      this.form.incomeHoursMin = pay;
      this.totalTime = pay;
      if (pay >= 60) {
        this.form.incomeHours = (pay / 60).toFixed(3);
        this.form.incomeHoursUnit = '时';
      } else if (pay > 0 && pay < 60) {
        this.form.incomeHours = parseFloat(pay).toFixed(3) + '';
        this.form.incomeHoursUnit = '分';
      } else if (pay == 0) {
        this.form.incomeHours = '0';
        this.form.incomeHoursUnit = '分';
        this.form.incomeHoursMin = '0';
      }
    },
  }
};
</script>
<style lang="scss" scoped>
.el-dialog__body {
  padding: 20px 24px;
  max-height: 500px !important;
  overflow-y: auto !important;
}
.el-descriptions--small {
  font-size: 14px !important;
}
.settlement-dialog {
  .main-title {
    font-size: 18px;
    color: #606266;
    font-weight: bold;
    margin-left: -10px;
  }
  .btns {
    text-align: center;
    // margin-top: 30px;
  }
  .input-width {
    width: 155px !important;
  }
  .date-width {
    width: 300px !important ;
  }
  .el-input-group__append,
  .el-input-group__prepend {
    padding: 0 8px !important;
    // background: #d8d8d8;
    color: #979797;
  }
  .el-icon-circle-plus {
    color: #016ffa;
  }
  .el-icon-question {
    color: #ff0000;
    // margin-left: -5px;
    // margin-top: 7px;
    // margin-right: 3px;
    position: relative;
    left: 5px;
    top: 2px;
  }
}
.el-form-item {
  margin-left: 8px !important;
}
.remark-form-item {
  margin-left: 0px !important;
}
.text-width {
  //   line-height: 2 !important;
  width: 650px !important;
}
.el-textarea__inner {
  line-height: 18px !important;
}
.box-card {
  padding-bottom: 20px;
  .avatar {
    width: 80px;
    height: 100%;
    float: left;
    .avatar-icon {
      margin-top: 45px;
      margin-left: 20px;
      text-align: center;
    }
    .img-avatar {
      height: 40px;
      width: 40px;
      // background: #606266;
      border-radius: 50%;
    }
    .avatar-name {
      display: block;
      width: 80px;
      text-align: center;
    }
  }
  .expert-desc {
    margin-left: 10px;
    width: 88%;
    float: left;
    .desc-top {
      .desc-title {
        display: inline-block;
        font-size: 16px;
        color: #303133;
        font-weight: bold;
        margin-bottom: 16px;
      }
      .desc-part {
        display: inline-block;
        font-size: 14px;
        color: #606266;
        margin-left: 20%;
        border: 1px solid black;
        .desc-pt {
          margin-right: 16px;
        }
        .desc-sp {
          color: #303133;
          margin-right: 8px;
        }
      }
    }
    .desc-bg {
      font-size: 14px;
      color: #303133;
      margin-top: 16px;
    }
    .desc-extra {
      font-size: 14px;
      color: #303133;
      margin-top: 16px;
      .desc-sp {
        margin-right: 8px;
      }
    }
  }
}
.resetTimeBtn {
  display: inline-block;
  margin-left: 10px;
}
::v-deep {
  .el-select {
    width: 20px !important;
  }
  .el-upload-dragger {
    width: 650px !important;
    padding: 0 20px;
  }
  .el-select .el-input {
    width: 20px !important;
  }
  .el-select .el-input__inner {
    margin-left: 10px !important;
    padding: 0 5px !important;
    color: black !important;
  }
  .el-input__suffix-inner {
    display: none !important;
  }
  .el-input-group__append {
    width: 20px !important;
    text-align: center;
    padding: 0 5px !important;
  }
}
pre {
  all: initial !important; /*清除继承样式*/
  display: block !important; /*设置布局流，避免换行导致的错误布局*/
  white-space: pre-line !important; /*保留换行符，设置溢出换行*/
  font-size: 14px !important; /*设置字号*/
  color: #606266 !important;
  font-family: "";
}
.tips-bubble {
  font-size: 16px;
  top: 1px;
  left: -88px !important;
  position: absolute;
  color: #FF0000;
}
</style>

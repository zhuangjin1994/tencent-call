<template>
  <el-dialog @open="initData" @close="resetForm" title="需求验收" width="850px" :visible.sync="visible" class="dialog-container accept-dialog">
    <div class="main-title">{{`【${demandInfo.demandNum}】 ${demandInfo.title}`}}</div>
    <el-collapse v-model="openeds">
      <el-collapse-item title="需求信息" name="1">
        <demand-content class="demand-content" :data="demandInfo" width="140px"/>
      </el-collapse-item>
      <el-collapse-item title="交付信息" name="2">
        <el-form ref="formLoad" label-width="80px" size="mini" inline :model="form" :rules="rules">
          <el-form-item label="访谈日期：" style="display:inline-block">
            <el-date-picker disabled v-model="deliveryInfo.interview_begin_date" type="date" placeholder="选择日期" />
          </el-form-item><br>
          <el-form-item label="开始时间：">
            <el-time-picker disabled placeholder="起始时间" format="HH:mm" v-model="deliveryInfo.beginDate" class="input-width" />
          </el-form-item>
          <el-form-item label="结束时间：">
            <el-time-picker disabled placeholder="结束时间" format="HH:mm" v-model="deliveryInfo.endDate" class="input-width" />
          </el-form-item>
          <el-form-item label="倍率系数：">
            <el-input disabled placeholder="请输入倍率系数" v-model="deliveryInfo.magnification" class="short-width" />
          </el-form-item>
          <el-form-item label="实际时间：">
            <el-input disabled placeholder="请输入实际时间" v-model="actualHours" class="input-width">
              <template slot="append">时</template>
            </el-input>
          </el-form-item>
          <el-form-item label="实收时长：">
            <el-input disabled placeholder="请输入实收时长" v-model="incomeHours" class="input-width">
              <template slot="append">时</template>
            </el-input>
          </el-form-item>
          <!-- <el-form-item label="增值备注：" >
            <el-input disabled v-model="form.remarkMoney" class="short-width">
              <template slot="append">时</template>
            </el-input>
          </el-form-item> -->
          <el-descriptions style="margin-left:25px;margin-bottom:6px" size='medium' :column="3">
            <el-descriptions-item label="专业度">
              <el-rate :disabled="!hasPermission" allow-half v-model="form.professionalism" show-score text-color="#ff9900"></el-rate>
            </el-descriptions-item>
            <el-descriptions-item label="分享度">
              <el-rate :disabled="!hasPermission" allow-half v-model="form.shared" show-score text-color="#ff9900"></el-rate>
            </el-descriptions-item>
            <el-descriptions-item label="服务满意">
              <el-rate :disabled="!hasPermission" allow-half v-model="form.satisfaction" show-score text-color="#ff9900"></el-rate>
            </el-descriptions-item>
          </el-descriptions>
          <el-form-item label="专家结论：">
            <el-input :disabled="!hasPermission" type="textarea" style="width:660px" placeholder="请输入专家结论" v-model="form.comments" :rows="5" />
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="专家信息" name="3">
        <div class="supplier-info">
          <span style="margin-right:102px">供应商名称：{{deliveryInfo.supplierName || '--'}}</span>
          响应时间：{{deliveryInfo.createdDate || '--'}}
        </div>
        <el-card style="height:300px">
          <div  class="expert-card">
          <div class="card-name">
            <i class="el-icon-s-custom avatar"></i>
            <div>{{deliveryInfo.expertName || '--'}}</div>
          </div>
          <div class="card-content">
            <div class="overview">
              <span class="expert-name">{{deliveryInfo.expertName}}-{{deliveryInfo.expertId}}</span>
            </div>
            <el-descriptions class="input-row" size='medium' :column="3">
              <el-descriptions-item labelClassName="label-text" :labelStyle="{'width':'60px','text-align':'right'}" label="行业">
                <text-tooltips :text="deliveryInfo.industry || '--'" width="130px"/>
              </el-descriptions-item>
              <el-descriptions-item labelClassName="label-text" label="目前公司">
                <text-tooltips :text="deliveryInfo.company || '--'" width="130px"/>
              </el-descriptions-item>
              <el-descriptions-item labelClassName="label-text" label="方便约谈时间">
                <text-tooltips :text="deliveryInfo.convenientDate || '--'" width="130px"/>
              </el-descriptions-item>
            </el-descriptions>
            <div class="oneline"><span class="label-text">专家背景：</span>{{ deliveryInfo.background || '--' }}</div>
            <div class="oneline"><span class="label-text">问题回答：</span>{{ deliveryInfo.questionAnswer || '--' }}</div>
            <div class="oneline"><span class="label-text">专家评论：</span>{{ '--' }}</div>
            <div class="oneline"><span class="label-text" style="margin-left:30px">特长：</span>{{ deliveryInfo.speciality || '--' }}</div>
            <div class="oneline"><span class="label-text" style="margin-left:30px">其他：</span>{{ deliveryInfo.other || '--' }}</div>
          </div>
          </div>
        </el-card>
        <div class="upload-container">
          <span style="font-size: 14px">上传附件：</span>
          <Upload ref="uploader" class="upload" :file-detail="form.attatchmentList" :is-edit="!hasPermission"/>
        </div> 
      </el-collapse-item>
    </el-collapse>
    <div style="text-align:right;position:relative">
      <el-tooltip class="item" effect="dark" content="共享之后的文件将会出现在“智库”里面，如有用户在智库下载您上传的文件可在智库模块【我的审批】进行查看授权！" placement="top-start">
        <i  class="el-icon-question tip-bubble"></i>
      </el-tooltip>
      是否共享：<el-switch :disabled="!hasPermission" v-model="form.whethershare"></el-switch>
    </div>
    <div slot="footer" center class="dialog-footer">
      <el-button type="primary" :disabled="!hasPermission" @click="onConfirm" :loading="loading">确定</el-button>
      <el-button @click="visible=false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import store from '@/store';
import { mapGetters } from 'vuex';
import Upload from '@/components/Upload';
// import DemandContent from './DemandContent'
import DemandContent from '@/components/DemandDetail/demandContent';
import date from '@/utils/dateTransform';
import TextTooltips from '@/components/TextTooltips';
import { getAcceptInfo, getDemandInfo, demandAccept } from '@/api/demand.js';
export default {
  components: {
    Upload,
    DemandContent,
    TextTooltips
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
      imgSrc: '',
      openeds: ['1', '2', '3'],
      demandInfo: {},
      deliveryInfo: {},
      form: {
        attatchmentList: [],
        whethershare: false,
      },
      actualHours: '',
      incomeHours: '',
      rules: {}
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
    // 是否管理员--【实际时长/实收时长】的编辑权限只限于管理员
    isAdministrator() {
      return ['suAdministrator', 'coAdministrator'].includes(this.roles[0]);
    },
    // 除时长外的其余编辑选项只在【当前需求为自己创建】时可编辑
    hasPermission() {
      return this.demandInfo.demander === this.userId;
    },
    ...mapGetters(['roles', 'userId'])
  },
  methods: {
    async initData() {
      try {
        let res = await getAcceptInfo(this.params);
        const { data } = await getDemandInfo({demandId: this.params.demandId});
        this.deliveryInfo = res.data || {};
        this.demandInfo = data || {};
        // this.deliveryInfo.beginDate = this.deliveryInfo.beginDate ? date.timeFormat(this.deliveryInfo.beginDate, 'HH:mm:ss') : ''
        // this.deliveryInfo.endDate = this.deliveryInfo.endDate ? date.timeFormat(this.deliveryInfo.endDate, 'HH:mm:ss') : ''
        this.incomeHours = +((this.deliveryInfo.incomeHours / 60).toFixed(2));
        this.actualHours = +((this.deliveryInfo.actualHours / 60).toFixed(2));
      } catch (err) {
        console.log(err);
      }
    },

    onConfirm() {
      this.loading = true;
      const params = {
        ...this.form,
        ...this.params
      };
      if (this.$refs.uploader.fileList.length) {
        params.attatchmentList = this.$refs.uploader.fileList.map(item => ({
          attachmentName: item.name,
          attachmentKey: item.key
        }));
      }
      params.whethershare = params.whethershare ? 0 : 1;
      params.incomeHours = this.deliveryInfo.incomeHours;
      // params.whethershare = '1'
      demandAccept(params).then(res => {
        this.visible = false;
        this.$message.success('验收成功');
        this.$emit('refresh');
        store.dispatch('app/getMessages');
      }).finally(_ => this.loading = false);
    },

    resetForm() {
      this.form = {
        attatchmentList: [],
        whethershare: false
      };
    }
  },
};
</script>
<style lang="scss">
@import "@/style/mixin.scss";
.accept-dialog {
  .input-width {
    width: 174px !important;
  }
  .short-width{
    width: 140px !important;
  }
  .el-input-group__append {
    padding: 0 10px;
  }
  min-height: 500px;
   .el-dialog__body {
    max-height: 540px;
    overflow-y: auto;
   }
  .main-title {
    font-weight: 600;
    font-size: 18px;
    color: #606266;
  }
  .expert-card{
    display: flex;
    // height: 100%;
    // overflow: auto;
    // height: 290px !important;
  }
  .supplier-info {
    height: 40px;
    line-height: 40px;
    color: #606266;
  }
  .el-card__body {
    display: flex;
    padding: 24px 0 32px 24px !important;
    justify-content: space-between;
    .card-name {
      margin-right: 20px;
    }
    .card-content {
      flex: 1;
      height: 260px;
      overflow: auto;
      padding-right: 20px;
      .expert-name {
        color: #303133;
        font-weight: 600;
        font-size: 16px;
      }
      .overview {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #E9E9E9;
        margin-bottom: 10px;
        line-height: 40px;
      }
      .input-row .el-descriptions-item__container {
        align-items: center;
      }
      .input-content {
        width: 120px;
        .el-input-group__append {
          padding: 0 5px;
        }
      }
      .oneline {
        padding-left: 70px;
        text-indent: -70px;
        padding-bottom: 10px;
        font-size: 14px;
        color: #606266;
      }
      .label-text {
        display: inline;
        font-weight: 600;
      }
    }
    .avatar {
      font-size: 40px;
      color: #f7f9fe;
      background: #bdcef0;
      border-radius: 50%;
      border: 1px solid #bdcef0;
    }
  }
  .tip-bubble {
    font-size: 16px;
    top: 2px;
    right: 112px;
    position: absolute;
    color: #FF0000;
  }
  .upload-container {
    display: flex;
    margin-top: 24px;
    .upload {
      flex: 1;
    }
  }
}
</style>

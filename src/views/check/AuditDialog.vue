<template>
  <el-dialog title="需求审批" :visible.sync="visible" width="800px" @close="resetForm" class="dialog-container audit-dialog">
    <div class="main-title">{{data.demandName}}</div>
    <div class="sub-title">需求信息</div>
    <el-form ref="form" label-width="100px" size="mini" inline :model="data">
      <!-- <el-form-item label="需求类型：">{{data.demandType || '--'}}</el-form-item>
      <el-form-item label="所属部门：">{{data.departmentName || '--'}}</el-form-item>
      <el-form-item label="所属小组：">{{data.demandGroup || '--'}}</el-form-item>
      <el-form-item label="申请时间："> {{data.submitDate || '--'}}</el-form-item>
      <el-form-item label="需求人：">{{data.demander || '--'}}</el-form-item>
      <el-form-item label="业务承办人："> {{data.contractor || '--'}}</el-form-item>
      <el-form-item class="long-item" label="供应商：">{{data.supplier || '--'}}</el-form-item>
      <el-form-item class="long-item" label="项目成员：">{{data.members || '--'}}</el-form-item>
      <el-form-item class="long-item" label="需求标签：">{{data.tag || '--'}}</el-form-item> -->
      <demand-content class="demand-content" :data='data' width="140px"/>
      <el-form-item class="remark" label="备注：">
        <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="auditOpinion"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" center class="dialog-footer check-footer">
      <el-button type="primary" :loading="loading.pass" @click="handleAudit('to_be_responsed')">通过</el-button>
      <el-button :loading="loading.reject" @click="handleAudit('reject')">驳回</el-button>
    </div>
  </el-dialog>
</template>
<script>
import store from '@/store';
import { auditDemand } from '@/api/demand.js';
// import DemandContent from '@/views/demand/components/DemandContent'
import DemandContent from '@/components/DemandDetail/demandContent';
export default {
  components: {
    DemandContent
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {}
    },
    id: {
      type: String,
      default: ''
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
    demandContent() {
      const { purpose, background, expertRequirement, interviewQuestion } = this.data;
      return { purpose, background, expertRequirement, interviewQuestion };
    }
  },
  data() {
    return {
      auditOpinion: '',
      loading: {
        reject: false,
        pass: false
      }
    };
  },
  methods: {
    handleAudit(key) {
      let loadingKey = key === 'to_be_responsed' ? 'pass' : 'reject';
      this.loading[loadingKey] = true;
      const params = {
        demandStatus: key,
        demandId: this.id,
        auditOpinion: this.auditOpinion
      };
      auditDemand(params).then(res => {
        this.$message.success('操作成功');
        this.visible = false;
        store.dispatch('app/getMessages');
        if (loadingKey === 'pass') {
          this.$emit('switchPage');
        } else {
          this.$emit('refresh');
        }
      }).finally(_ => this.loading[loadingKey] = false);
    },
    resetForm() {
      this.auditOpinion = '';
    }
  }
};
</script>
<style lang="scss">
@import "@/style/mixin.scss";
.audit-dialog {
  .el-dialog__body {
    padding: 16px 23px;
  }
  .main-title {
    color: #606266;
    line-height: 36px;
    font-size: 18px;
  }
  .sub-title {
    font-weight: 600;
    line-height: 40px;
    color: #016FFA;
    font-size: 16px;
    padding-left: 4px;
    position: relative;
    &::before {
      @include circle(6px, #016FFA);
      position: absolute;
      content: '';
      top: 17px;
      left: -7px;
    }
  }
  // .el-form-item {
  //   width: 30%;
  //   margin-bottom: 2px;
  //   .el-form-item__content {
  //     overflow: hidden;
  //     text-overflow: ellipsis;
  //     white-space: nowrap;
  //     width: 126px;
  //   }
  // }
  // .long-item {
  //   width: 55%;
  //   .el-form-item__content {
  //     width: 310px;
  //   }
  // }
  .remark {
    margin-top: 20px;
    .el-form-item__label {
      font-weight: 600;
    }
    .el-form-item__content {
      width: 630px;
    }
  }
  .demand-content {
    margin-top: 4px;
    padding-left: 30px;
  }
  .check-footer {
    margin-top: 10px;
  }
}
</style>

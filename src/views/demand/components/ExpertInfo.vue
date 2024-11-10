<template>
  <el-container class="expert-drawer">
    <el-header>
      <span>
        <i class="el-icon-s-order header-icon"></i>
        {{expertInfo.expertName}}
        <span class="position">（{{expertInfo.position}}）</span>
      </span>
      <div class="btn-header">
        <template v-if="!isTalentDetail">
        <el-button
          size="mini"
          class="btn"
          v-for="item in btns"
          :key="item.name" 
          @click="handleClick(item.type)"
          type="primary" >{{item.name}}
        </el-button>
        </template>
        <svg-icon icon-class="arrow" class="header-icon" style="cursor:pointer" @click="$emit('closeDrawer')"/>
      </div>
    </el-header>
    <el-container style="height:calc(100% - 60px);">
      <el-aside :width="isTalentDetail ?  '100%' : '70%'">
        <el-tabs v-model="activeName" @tab-click="handleTabsClick">
          <el-tab-pane label="专家信息" name="expert">
            <el-descriptions size='middle' :column="2">
              <el-descriptions-item labelClassName="label-text descriptions" label="专家名称">{{expertInfo.expertName || '--'}}</el-descriptions-item>
              <el-descriptions-item labelClassName="label-text descriptions" label="行业">{{expertInfo.industry || '--'}}</el-descriptions-item>
              <el-descriptions-item labelClassName="label-text descriptions" label="公司">
                <text-tooltips :text="expertInfo.company || '--'" width="220px"/>
              </el-descriptions-item>
              <el-descriptions-item labelClassName="label-text descriptions" label="职位">{{expertInfo.position || '--'}}</el-descriptions-item>
            </el-descriptions>
            <div class="oneline"><span class="label-text">产品:</span>
              <span v-if="expertInfo.product" class="pre">{{ expertInfo.product }}</span>
              <span v-else>--</span>
            </div>
            <div class="oneline"><span class="label-text">资历背景:</span>
              <span v-if="expertInfo.background" class="pre">{{ expertInfo.background }}</span>
              <span v-else>--</span>
            </div>
            <el-descriptions size='middle' :column="2">
              <el-descriptions-item labelClassName="label-text descriptions" label="倍率系数">
                {{expertInfo.magnification ? expertInfo.magnification : expertInfo.magnification == 0 ? 0 : '--' }}
              </el-descriptions-item>
              <el-descriptions-item labelClassName="label-text descriptions" label="费用">
                {{expertInfo.cost ? expertInfo.cost : expertInfo.cost == 0 ? 0 : '--' }}
              </el-descriptions-item>
            </el-descriptions>
            <div class="oneline"><span class="label-text">特长:</span>
              <span v-if="expertInfo.speciality" class="pre">{{ expertInfo.speciality }}</span>
              <span v-else>--</span>
            </div>
            <div class="oneline"><span class="label-text">问题回答:</span>
              <span v-if="expertInfo.questionAnswer" class="pre">{{ expertInfo.questionAnswer }}</span>
              <span v-else>--</span>
            </div>
            <div class="oneline"><span class="label-text">方便约谈时间:</span>{{ expertInfo.convenientDate || '--' }}</div>
            <div class="oneline"><span class="label-text">专家评价:</span>
              <span v-if="expertInfo.expertEvaluation" class="pre">{{ expertInfo.expertEvaluation }}</span>
              <span v-else>--</span>
            </div>
            <div class="oneline"><span class="label-text">合作年限:</span>
              <span class="pre">{{ expertInfo.cooperationDuration || '--' }}</span>
            </div>
            <div class="oneline"><span class="label-text">其他:</span>
              <span class="pre">{{ expertInfo.other || '--' }}</span>
            </div>
            <div class="oneline"><span class="label-text">补充信息:</span>
              <span class="pre">{{ expertInfo.supplement || '--' }}</span>
            </div>
          </el-tab-pane>
          <el-tab-pane label="访谈信息" name="interview">
            <el-descriptions size='middle' :column="3">
              <el-descriptions-item labelClassName="label-text descriptions" label="访谈时间">{{interviewInfo.interviewDate || '--'}}</el-descriptions-item>
              <el-descriptions-item labelClassName="label-text descriptions" label="开始时间">
                <text-tooltips :text="interviewInfo.beginDate || '--'" width="116px"/>
              </el-descriptions-item>
              <el-descriptions-item labelClassName="label-text descriptions" label="倍率系数">
                {{interviewInfo.magnification ? interviewInfo.magnification : interviewInfo.magnification == 0 ? 0 : '--' }}
              </el-descriptions-item>
              <el-descriptions-item labelClassName="label-text descriptions" label="实际时长">
                <span>{{interviewInfo.actualHours | formatHours(interviewInfo.actualHours)}}</span>
              </el-descriptions-item>
              <el-descriptions-item labelClassName="label-text descriptions" label="实收时长">
                <span>{{interviewInfo.incomeHours | formatHours(interviewInfo.incomeHours)}}</span>
              </el-descriptions-item>
              <el-descriptions-item labelClassName="label-text descriptions" label="调整时长">
                <span>{{interviewInfo.adjustHours | formatHours(interviewInfo.adjustHours)}}</span>
              </el-descriptions-item>
              <el-descriptions-item labelClassName="label-text descriptions" label="专业度">
                <el-rate disabled allow-half v-model="interviewInfo.professionalism" text-color="#ff9900"></el-rate>
              </el-descriptions-item>
              <el-descriptions-item labelClassName="label-text descriptions" label="分享度">
                <el-rate disabled allow-half v-model="interviewInfo.shared" text-color="#ff9900"></el-rate>
              </el-descriptions-item>
              <el-descriptions-item labelClassName="label-text descriptions" label="服务满意">
                <el-rate disabled allow-half v-model="interviewInfo.satisfaction" text-color="#ff9900"></el-rate>
              </el-descriptions-item>
            </el-descriptions>
            <div class="oneline"><span class="label-text">专家结论:</span>{{ interviewInfo.expertConclusion || '--' }}</div>
            <div class="oneline"><span class="label-text">服务评价:</span>{{ interviewInfo.serviceEvaluation || '--' }}</div>
          </el-tab-pane>
          <el-tab-pane label="专家附件" name="file">
            <div class="header-btn">
              <el-button v-if="!isTalentDetail && hasExpertAttach" class="batch-download" size="mini" type="primary" @click="handleClickFile('bacth_download')">一键下载</el-button>
              <!-- <span class="batch-share" v-if="!isTalentDetail && hasExpertAttach && isSelf">一键共享
              <el-switch
                :value="ifShare"
                active-color="#027AFF"
                inactive-color="#E5E5E5"
                :active-value="0"
                @change="handleBatchShare"
                :inactive-value="1">
              </el-switch></span> -->
            </div>
            <div v-if="hasExpertAttach" class="file-box">
              <el-card :body-style="{ padding: '14px' }" shadow="hover" class="file-card" v-for="(item, index) in expertAttachList" :key="index">
                <svg-icon :icon-class="gainIcon(item.attachmentName)" class="file-icon" />
                <div class="file-name">
                  <text-tooltips :text="item.attachmentName" width="100%"/>
                </div>
                <span class="btns">
                   <!-- <el-switch
                    :width="35"
                    v-if="!isTalentDetail && isSelf"
                    :value="item.share"
                    active-color="#027AFF"
                    inactive-color="#E5E5E5"
                    :active-value="0"
                    @change="handleChangeStatus(item)"
                    :inactive-value="1"
                  /> -->
                  <el-tooltip class="item" effect="light" content="预览" placement="top">
                    <img class="el-icon-view file-btn" :src="require('@/assets/btn_icons/preview.png')" @click="handleClickFile('preview', item)"/>
                  </el-tooltip>
                  <el-tooltip v-if="!isTalentDetail" class="item" effect="light" content="下载" placement="top">
                    <img class="el-icon-view file-btn" :src="require('@/assets/btn_icons/download.png')" @click="handleClickFile('download', item)"/>
                  </el-tooltip>
                </span>
              </el-card>
            </div>
            <placeholder v-else content="img" height="300px"/>
          </el-tab-pane>
        </el-tabs>
      </el-aside>
      <el-main v-if="!isTalentDetail">
        <div class="main-header">跟进动态</div>
        <div v-if="operation.length" class="step-box">
          <el-timeline class="timeline">
            <el-timeline-item 
              v-for="(item, index) in operation" 
              :key="index" 
              :timestamp="item.operationDetail" 
              placement="top"
              color="#1989fa"
            >
            <p v-if="item.attachmentList && item.attachmentList.length">
              附件：
              <span v-for="(item, index) in item.attachmentList" :key="index">
                <el-tooltip class="item" :content="item.attachmentName" placement="top">
                  <svg-icon :icon-class="gainIcon(item.attachmentName)" class="file-icon" @click="handleClickFile('preview', item)"/>
                </el-tooltip>
              </span>
            </p>
            <p v-if="item.remarks" style="word-break:break-all">备注：{{item.remarks}}</p>
            <p>执行人：{{item.createBy}}</p>
            <p>执行时间：{{item.operationDateStr}}</p>
            </el-timeline-item>
          </el-timeline>
        </div>
        <placeholder v-else height="100px" />
      </el-main>
    </el-container>
    <!-- 申诉弹框 -->
    <complain-dialog @refresh="refreshData" :dialog-visible.sync="dialog.complain" :params="complainParams"/>
    <!-- 预览弹框 -->
    <preview-dialog :dialog-visible.sync="previewDialogVisible" :url="localUrl" :type="uploadType" />
    <!-- 验收/调整验收弹框 -->
    <accept-dialog @refresh="refreshData" :dialog-visible.sync="dialog.accept" :type="acceptType" :confirmId="interviewInfo.confirmId" :demander="expertInfo.demander"/>
  </el-container>
</template>
<script>
import { mapGetters } from 'vuex';
import common from '@/mixins/common.js';
import AcceptDialog from './AcceptDialog';
import uploadCos from '@/mixins/uploadCos.js';
import Placeholder from '@/components/Placeholder';
import TextTooltips from '@/components/TextTooltips';
import ComplainDialog from './ComplainDialog.vue';
import PreviewDialog from '@/components/Upload/PreviewDialog';
import { getTalentAuth, applyAuthority } from '@/api/talent.js';
import { confirmChoose, cancelChoose, shareFiles } from '@/api/demand.js';
export default {
  mixins: [uploadCos, common],
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    operation: {
      type: Array,
      default: () => []
    }
  },
  components: {
    Placeholder,
    AcceptDialog,
    TextTooltips,
    PreviewDialog,
    ComplainDialog,
  },

  watch: {
    data: {
      deep: true,
      immediate: true,
      handler(nVal) {
        if (nVal) {
          this.expertInfo = nVal.expertInfo || {};
          this.interviewInfo = nVal.interviewInfo || {};
          this.expertAttachList = nVal.expertAttachList || [];
          this.demandStatus = this.expertInfo.demandStatus;
          this.changeBacthBtn();
        }
      }
    }
  },
  
  computed: {
    btns() {
      const { demander, expertStatus } = this.expertInfo;
      // 1.专家详情里面的按钮只能自己操作自己的, 但是管理员可以对他人进行验收调整; 2.需求状态已完成情况下不能进行任何操作
      if ((!this.isSelf && expertStatus !== 'accepted') || this.demandStatus === 'end') {
        return [];
      }
      let data = [
        {name: '选中', type: 'checked', showStatus: ['unchoose']},
        {name: '取消选中', type: 'uncheck', showStatus: ['going']},
        {name: '申诉', type: 'complain', showStatus: ['checked', 'accepted']},
        {name: '验收', type: 'accept', showStatus: ['checked']},
        {name: '修改', type: 'modify_accept', showStatus: ['accepted']}
      ];
      let result = data.filter(item => item.showStatus.includes(expertStatus));

      // 在专家状态已完成的状态下，需求人/审批人只有申诉按钮，管理员只有调整验收按钮，且管理员可以对他人需求进行调整
      if (expertStatus === 'accepted') {
        if (['coAdministrator', 'suAdministrator'].includes(this.roles[0])) {
          result = [{name: '修改', type: 'modify_accept', showStatus: ['accepted']}];
        } else {
          result = [{name: '申诉', type: 'complain', showStatus: ['checked', 'accepted']}];
        }
      }
      return result;
    },
    // 属于智库详情页面
    isTalentDetail() {
      return this.$route.query.type === 'talent';
    },
    // 是否有专家附件
    hasExpertAttach() {
      return this.expertAttachList && this.expertAttachList.length;
    },
    // 是否是自己的需求
    isSelf() {
      return this.userId === this.expertInfo.demander;
    },
    ...mapGetters(['userId', 'roles'])
  },
  
  data() {
    return {
      ifShare: 1,
      activeName: 'expert',
      expertInfo: {},
      interviewInfo: {},
      expertAttachList: [],
      dialog: {
        complain: false,
        accept: false
      },
      acceptType: 'accept',
      complainParams: {},
      // 预览dialog      
      previewDialogVisible: false,
      uploadType: 'jpg',
      localUrl: '',
      // 需求信息
      demandStatus: '',
      demander: ''
    };
  },
  methods: {
    handleTabsClick() {},
    handleClick(operation){
      switch (operation) {
        case 'checked': {
          const confirmParams = {
            responseIdList: [this.expertInfo.responseId],
            demandId: this.$route.query.id
          };
          this.confirmOperate('选中', confirmChoose, confirmParams, 'refresh');
          break;
        }
        case 'uncheck': {
          const cancelParams = {
            responseId: this.expertInfo.responseId,
            confirmId: this.interviewInfo.confirmId
          };
          this.confirmOperate('取消选择', cancelChoose, cancelParams, 'refresh');
          break;
        }
        case 'complain':
          this.dialog.complain = true;
          this.complainParams = {
            responseId: this.expertInfo.responseId,
            confirmId: this.interviewInfo.confirmId
          };
          break;
        case 'accept':
          this.dialog.accept = true;
          this.acceptType = operation;
          break;
        case 'modify_accept':
          this.dialog.accept = true;
          this.acceptType = operation;
          break;
      }
    },

    // share: 0--共享  1--不共享 
    handleChangeStatus(item) {
      const params = {
        share: item.share == 1 ? 0 : 1,
        demandId: this.$route.query.id,
        attachmentList: [item.attatchmentId]
      };
      shareFiles(params).then(res => {
        this.$message.success('操作成功');
        this.$emit('getInfo', {confirmId: this.interviewInfo.confirmId, responseId: this.expertInfo.responseId});
        this.changeBacthBtn();
      }).catch(_ => {});
    },

    // 一键共享
    async handleBatchShare() {
      if (!this.expertAttachList.length) {
        this.$message.error('暂无数据可操作');
        return;
      }
      const params = {
        share: this.ifShare == 1 ? 0 : 1,
        demandId: this.$route.query.id,
        attachmentList: this.expertAttachList.map(item => item.attatchmentId)
      };
      await shareFiles(params).then(res => {
        this.$message.success('操作成功');
        this.$emit('getInfo', {confirmId: this.interviewInfo.confirmId, responseId: this.expertInfo.responseId});
        this.changeBacthBtn();
      }).catch(_ => {});
    },

    // 控制一键共享按钮的状态
    changeBacthBtn() {
      if (!this.expertAttachList.length) return;
      let noShare = this.expertAttachList.some(item => item.share == 1);
      this.ifShare = noShare ? 1 : 0;
    },

    handleClickFile(type, row) {
      // 智库详情页附件下载/预览需要申请
      if (this.isTalentDetail) {
        // 超管/普管拥有直接操作附件的权限
        if (['coAdministrator', 'suAdministrator'].includes(this.roles[0])) {
          this.handleFileOperate(type, row);
          return;
        }
        // 其余角色需要先申请附件操作权限
        getTalentAuth({demandId: this.$route.query.id}).then(res => {
          this.handleFileOperate(type, row);
        }).catch(err => {
          this.$confirm('当前文件暂无操作权限，即将向需求创建人发起申请，是否确认？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(res => {
            applyAuthority({ demandId: this.$route.query.id }).then(res => {
              this.$message.success(`申请成功，请等待审批结果`);
            }).catch(_ => {});
          }).catch(_ => {});
        });
      } else { // 普通详情页附件无特殊操作要求
        this.handleFileOperate(type, row);
      }
    },

    handleFileOperate(type, row) {
      if (type === 'preview') {
        this.previewFile({name: row.attachmentName, key: row.attachmentKey});
      } else if (type === 'download') {
        this.downloadFile({name: row.attachmentName, key: row.attachmentKey});
      } else {
        if (!this.expertAttachList.length) {
          this.$message.error('暂无文件可下载');
          return;
        }
        let files = this.expertAttachList.map(item => ({key: item.attachmentKey, name: item.attachmentName}));
        this.batchDownloadFile(files);
      }
    },

    gainIcon(name) {
      if (!name) return '';
      // 获取文件类型
      let start = name.lastIndexOf('.') + 1;
      name = name.substr(start);
      // 获取icon
      let names = {
        doc_docx: 'word',
        xlsx: 'excel',
        pptx: 'pptx',
        pdf: 'pdf', 
        jpg_png_jpeg: 'img',
        mp3: 'audio',
        mp4: 'vedio'
      };
      for (let i in names) {
        if (i.includes(name)) {
          return names[i];
        }
      }
    },
    // 关掉抽屉 & 刷新expertlist数据
    refreshData() {
      this.$emit('refresh');
    }
  },
  filters: {
    formatHours(time) {
      if (!time && time != 0) {
        return '--';
      } else if (!time && time == 0) {
        return 0;
      } else if (Math.abs(time) >= 60) {
        return `${parseFloat((time / 60).toFixed(3))} 时`;
      } else {
        return `${time} 分`; 
      }
    } 
  },
};
</script>
<style lang="scss">
.expert-drawer {
  height: 100%;
  font-size: 14px;
  .el-header {
    font-weight: 600;
    font-size: 18px;
    color: #606266;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #E6EBF5;
    .btn-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .btn {
        margin-right: 10px;
      }
    }
    .header-icon {
      font-size: 20px;
      color: #1891ff;
    }
    .position {
      font-size: 12px;
      color: #606266;
    }
  }
  .el-aside {
    width: 70%;
    padding: 0 16px;
    border-right: 1px solid #E6EBF5;
    .descriptions {
      padding-bottom: 8px;
    }
    .el-descriptions-item__content {
      color: #595a5e;
    }
    .oneline {
      color: #595a5e;
      padding-bottom: 20px;
      padding-left: 100px;
      text-indent: -100px; // 首行缩进
    }
    .label-text {
      margin-right: 10px;
      display: inline-block;
      min-width: 90px;
      color: #000;
      text-align: right;
      font-size: 14px;
    }
    .header-btn {
      display: flex;
      justify-content: space-between;
      margin-right: 20px;
      margin: 6px 20px 20px 0;
    }
    .file-box {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: center;
    }
    .el-card {
      border: 1px solid #707070 !important;
    }
    .file-card {
      flex: 1;
      margin: 0 16px 16px 0;
      width: calc((100% - 40px) / 2);
      min-width: calc((100% - 40px) / 2); // 加入这两个使item宽度生效
      max-width: calc((100% - 40px) / 2);
      border: 1px solid rgb(24, 145, 255);
      &:nth-child(2n) { // 去除第3n个的margin-right
        margin-right: 0 ;
      }
      .file-name {
        display: inline-block;
        // width: 120px;
        width: calc(100% - 160px);
        min-width: 120px;
        margin-left: 4px;
        color: #707070;
      }
      .file-icon {
        font-size: 30px;
        color: #666;
      }
      .btns {
        float: right;
        width: 100px;
        color: #606266;
        font-size: 16px;
        display: flex;
        align-items: center;
        height: 30px;
        justify-content: flex-end;
        .file-btn {
          width: 16px;
        }
        .file-btn:nth-child(2) {
          margin: 0 10px 0 20px ;
        }
      }
    }
  }
  .el-main {
    height: 100%;
    padding: 0;
    .main-header {
      height: 40px;
      color: #606266;
      padding: 10px;
      font-size: 14px;
      font-weight: 600;
      box-sizing: border-box;
      border-bottom: 1px solid #E6EBF5;
    }
    .step-box {
      overflow: auto;
      height: calc(100% - 40px);
    }
    .timeline {
      .el-timeline-item__timestamp {
        color: #606266;
      }
      padding: 20px;
      p {
        font-size: 12px;
        color: #909399;
      }
    }
    .file-icon {
      font-size: 16px;
      color: #666;
      cursor: pointer;
      margin-right: 4px;
    }
  }
  .pre {
    all: initial !important; /*清除继承样式*/
    // display: block !important; /*设置布局流，避免换行导致的错误布局*/
    white-space: pre-line !important; /*保留换行符，设置溢出换行*/
    font-size: 14px !important; /*设置字号*/
    color: #606266 !important;
    font-family: "";
    word-break: break-all;
  }
}
</style>

<template>
  <div class="header mrr-header">
    <div class="header_l">
      <a href="javascript:;" class="logoLink">MRR市场研究资源管理</a>
    </div>
    <div class="header_r">
      <div class="headr_d1">
        <bread-crumb class="bread" />
      </div>
      <div class="headr_d2">
        <ul class="headrUl clearFixed">
          <li id="domMessage">
            <el-popover popper-class="message-popover" placement="bottom" width="320" trigger="click"
              v-model="isShowPopover" @show="showPopover">
              <div class="message-view" v-loading="loading">
                <div class="message-header">消息 <i class="headRead" v-if="visible"></i></div>
                <div class="message-list" v-if="messageList.length !== 0">
                  <div class="message-item" v-for="item in messageList" :key="item.messageId">
                    <div class="message">
                      <i :class="item.whetherRead === 0 ? 'isNoRead' : 'isRead'"></i>
                      <!-- {{ item.operationContent }} -->
                      <div style="display:inline-block; font-size: 12px;">{{ item.operationDetail }}</div>
                      <div class="single" style="display:inline-block;margin-left:10px;" @click="goDetail(item)">{{
                          item.operationContent
                      }}
                      </div>
                      <!-- <div class="single">
                      </div> -->
                    </div>
                    <div class="bottom-row">
                      <div>执行人：{{ item.demandOperator || item.supplierOperator }}</div>
                      <div class="date">{{ item.createdDate }}</div>
                    </div>
                  </div>
                </div>
                <Placeholder height="263px" v-else>暂无数据</Placeholder>
                <el-row class="message-footer">
                  <el-col :span="12" :offset="0" style="border-right: #c4c3c3 solid 1px;"
                    v-if="messageList.length !== 0">
                    <el-button type="text" size="medium" style="width: 100%;" class="clearAll" @click="clearAll">清除未读
                    </el-button>
                  </el-col>
                  <el-col :span="messageList.length !== 0 ? 12 : 24" :offset="0">
                    <el-button type="text" size="medium" style="width: 100%;" class="checkAll" @click="checkAll">查看全部
                    </el-button>
                  </el-col>
                </el-row>
              </div>
              <el-badge :hidden="!visible" is-dot slot="reference">
                <i class="el-icon-message-solid iconFont" />
              </el-badge>
            </el-popover>
            <!-- <el-dropdown @command="handleMessagesCommand" trigger="click" @visible-change="initMsgData">
              <el-badge :hidden="!totalNum" is-dot>
                <i class="el-icon-message-solid iconFont" />
              </el-badge>
              <el-dropdown-menu slot="dropdown" class="message-menu">
                <p class="message-title" disable>消息中心</p>
                <el-dropdown-item :command="item.type" v-for="item in resultMessage" :key="item.title"
                  class="message-container">
                  <span class="title">{{item.title}}<span class="num">({{item.num}})</span></span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
          </li>
          <li id="domPersonal">
            <user-dropdown />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import store from '@/store';
import BreadCrumb from '@/components/BreadCrumb';
import UserDropdown from '@/components/UserDropdown';
import { mapGetters } from 'vuex';
import service from '@/utils/services';
import Placeholder from '@/components/Placeholder/index.vue';
export default {
  components: {
    BreadCrumb,
    UserDropdown,
    Placeholder
  },
  computed: {
    resultMessage() {
      return this.messageList.filter(item => item.auth.includes(store.getters.roles[0]));
    },
    totalNum() {
      let totalNum = this.messageList.reduce((total, cur) => {
        return total + Number(cur.num);
      }, 0);
      return totalNum;
    },
    ...mapGetters(['messages'])
  },
  watch: {
    messages: {
      deep: true,
      immediate: true,
      handler(nVal, oVal) {
        this.messageList.forEach(item => {
          for (let key in nVal) {
            if (item.key === key) {
              item.num = nVal[key];
            }
          }
        });
      }
    }
  },
  data() {
    return {
      visible: false,
      loading: false,
      isShowPopover: false,
      listId: [],
      messageList: [
        { key: 'demandCheckedCount', title: '需求待验收消息', num: '0', auth: ['demander', 'auditor', 'suAdministrator', 'coAdministrator'], type: 'demand_to_accepted' },
        { key: 'demandAuditCount', title: '需求待审批', num: '0', auth: ['auditor', 'suAdministrator', 'coAdministrator'], type: 'demand_to_checked' },
        { key: 'resourceAuditCount', title: '资源待审批', num: '0', auth: ['suAdministrator'], type: 'resource_to_checked' },
        { key: 'supplierAuditCount', title: '供应商待审批', num: '0', auth: ['suAdministrator'], type: 'supplier_to_checked' },
        { key: 'talentAuditCount', title: '智库附件待审批', num: '0', auth: ['demander', 'auditor', 'suAdministrator', 'coAdministrator'], type: 'file_to_checked' }
      ]
    };
  },
  mounted() {
    this.getMsgList();
  },
  methods: {
    initMsgData(val) {
      // if (!val) return
      // getMsgData().then(res => {
      //   this.messageList.forEach(item => {
      //     for(let key in res.data) {
      //       if (item.key === key) {
      //         item.num = res.data[key]
      //       }
      //     }
      //   })
      // })
    },
    handleMessagesCommand(type) {
      switch (type) {
        case 'demand_to_accepted':
          this.$router.push({ path: '/demand/list', query: { status: 'to_be_accepted' } });
          break;
        case 'demand_to_checked':
          this.$router.push({ path: '/demand/check' });
          break;
        case 'resource_to_checked':
          this.$router.push({ path: '/resource/index' });
          break;
        case 'supplier_to_checked':
          this.$router.push({ path: '/supplier/index' });
          break;
        case 'file_to_checked':
          this.$router.push({ path: '/talentwarelist/index', query: { status: 'examine' } });
          break;
      }
    },
    checkAll() {
      this.isShowPopover = false;
      this.$router.push({ path: '/msessage-push/index', replace: true });
    },
    clearAll() {
      this.messageList.forEach(element => {
        if (element.whetherRead === 0) {
          this.readMsg(element.messageId).then(res => {
            element.whetherRead = 1;
            this.visible = this.messageList.findIndex(item => item.whetherRead === 0) === -1 ? false : true;
          });
        }
      });
    },
    async getMsgList() {
      const res = await service.post('/message/list', { 'pageSize': 20, 'pageNum': 1 });
      const messageId = [];
      res.data.data.forEach(element => {
        messageId.push(element.messageId);
        // if (element.operationContent.indexOf(',') !== -1) {
        //   element.operationContent = element.operationContent.split(',')
        // }
      });
      this.listId = messageId;
      this.messageList = res.data.data;
      this.loading = false;
      this.visible = res.data.data.findIndex(item => item.whetherRead === 0) === -1 ? false : true;
    },
    showPopover() {
      this.loading = true;
      this.getMsgList();
    },
    async readMsg(id) {
      const res = await service.post('/message/markRead', { messageId: id });
      return res.data;
    },
    goDetail(data) {
      let path = '';
      let type = '';
      const {demandStatus} = data
      if (data.actionName) {
        path = 'check-detail';
        type = 'auditDetail';
      } else {
        path = demandStatus === 'approving' || demandStatus === 'reject' ? 'base-detail' : 'detail';
        type = 'edit';
      }
      if (data.messageId) {
        if (data.whetherRead === 0) {
          this.readMsg(data.messageId).then(res => {
            if (res) {
              this.visible = this.messageList.findIndex(item => item.whetherRead === 0) === -1 ? false : true;
            }
          });
        }
        this.isShowPopover = false;
        window.open(`${location.origin}#/demand/${path}?id=${data.demandId}&type=${type}`, Math.floor(Math.random() * 100));
        // this.$router.push({ path: , query: { id: data.demandId, type: "edit" }, replace: true })
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.message-menu {
  font-size: 14px;

  .message-title {
    line-height: 30px;
    text-align: center;
  }

  .message-container {
    padding: 0px 24px;

    .title {
      line-height: 40px;
    }

    .num {
      margin-left: 24px;
      color: red;
      float: right;
    }
  }
}

.message-view {
  width: 100%;
  height: 350px;
  border-radius: 5px;
  position: relative;
  overflow: hidden;

  .message-header {
    width: 100%;
    height: 50px;
    background-color: #f2f2f2;
    padding-left: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: #000;

    .headRead {
      width: 7px;
      height: 7px;
      border-radius: 4px;
      background-color: #ff0000;
      vertical-align: middle;
      display: inline-block;
      margin-left: 5px;
    }
  }

  .message-list {
    width: 100%;
    height: 263px;
    position: relative;
    overflow: hidden;
    overflow-y: auto;

    .message-item {
      position: relative;
      padding: 12px;
      border-bottom: #f5f5f5 solid 1px;

      .message {
        color: #000;
        font-size: 14px;
        margin-bottom: 5px;

        .isNoRead,
        .isRead {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: #ff0000;
          vertical-align: middle;
          display: inline-block;
          margin-right: 5px;
        }

        .isRead {
          opacity: 0;
        }
      }

      .date {
        font-size: 12px;
        color: #606266;
        padding-left: 10px;
      }
    }
  }

  .noData {
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  .message-footer {
    width: 100%;
    position: relative;
    display: inline-block;
    background-color: #f2f2f2;
    border-top: #c4c3c3 solid 1px;
    overflow: hidden;
  }
}
</style>
<style lang='scss' scoped>
.mrr-header {
  .el-badge__content.is-fixed {
    top: 15px;
    right: 14px;
    transform: translateX(100%) translateY(-50%) scale(0.8);
  }
}

.single,
.slogan {
  display: inline-block;
  cursor: pointer;
}

.single {
  color: #409eff;
  width: 90%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 12px;

  // >* {
  //   display: inline-block;
  //   vertical-align: middle;
  // }
}

.bottom-row {
  display: flex;
  justify-content: space-between;
  color: rgb(170, 170, 170);
  font-size: 12px;
  padding-left: 10px;
}

.message-popover {
  padding: 0 !important;
}
</style>

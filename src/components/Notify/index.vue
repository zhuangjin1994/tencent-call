<template>
  <div class="notify" :class="{ active: isActive }">
    <div class="notify-header">
      <el-row align="middle" type="flex" justify="center">
        <el-col :span="12">消息提醒</el-col>
        <el-col :span="12" class="notify-clear">
          <el-button type="text" size="medium" @click="readMsg(msgBody.messageId)">标记已读</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="notify-content">
      <el-row align="middle" type="flex" justify="start">
        <el-col :span="24">
          <el-row align="middle" type="flex" justify="start">
            <el-col :span="24">
              {{ msgBody.operationDetail }}
            </el-col>
          </el-row>
          <el-row align="middle" type="flex" justify="start">
            <el-col :span="24">
              <div class="single" @click="goDetail(msgBody)">{{ msgBody.operationContent }}</div>
            </el-col>
          </el-row>
          <div class="bottom-row">
            <span class="operator">
              执行人：{{ msgBody.demandOperator || msgBody.supplierOperator }}
            </span>
            <span class="created-tiem">
              {{ msgBody.createdDate }}
            </span>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import service from '@/utils/services';
import avatarImg from '@/assets/images/avatar.png';
export default {
  data() {
    return {
      isActive: false,
      msgBody: {},
      time: '',
      circleUrl: avatarImg,
    };
  },
  mounted() {
    this.getCount()
    this.getMsgOutTime();
  },
  computed: {
    getRoutePath() {
      return this.$route.path;
    },
    getLoginTime() {
      return this.$store.state.user.loginTime;
    }
  },
  methods: {
    async getMessage() {
      if (this.getRoutePath === '/500' || this.getRoutePath === '/transit-page') return;
      const res = await service.post('/message/singleMessage', { currentDateStr: this.getLoginTime });
      if (res.data) {
        // res.data.operationContent = res.data.operationContent.split(",");
        this.msgBody = res.data;
        this.isActive = true;
      }
    },
    backNotify() {
      this.isActive = !this.isActive;
    },
    getMsgOutTime() {
      this.time = setInterval(() => {
        this.getMessage();
        setTimeout(() => {
          clearInterval(this.time);
          this.getMsgOutTime();
          this.getCount()
        }, 500);
      }, 10000);
    },
    async readMsg(id) {
      const res = await service.post('/message/markRead', { messageId: id });
      this.isActive = false;
      if (this.time) {
        clearInterval(this.time);
        this.getMsgOutTime();
      }
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
        this.readMsg(data.messageId);
        window.open(`${location.origin}#/demand/${path}?id=${data.demandId}&type=${type}`, Math.floor(Math.random() * 100));
        // this.$router.push({
        //   path: `/demand/${path}`,
        //   query: { id: data.demandId, type: "edit" },
        // });
      }
    },
    async getCount() {
      const res = await service.post('/demand/getMenuBarCount');
      this.$store.commit('app/SET_MENUCOUNT', res.data);
    }
  },
};
</script>
<style lang="scss" scoped>
.notify {
  min-width: 300px;
  max-width: 350px;
  position: fixed;
  display: inline-flex;
  align-items: center;
  overflow: hidden;
  bottom: 20px;
  right: 20px;
  background-color: #f5f5f5;
  border: #dedede 1px solid;
  border-radius: 5px;
  flex-wrap: wrap;
  transform: translateY(300%);
  transition: 0.5s;
  z-index: 11;

  .notify-header {
    width: 100%;
    height: 40px;
    border-bottom: 1px #dedede solid;
    position: relative;
    padding: 0 10px;

    .el-col {
      align-items: center;
    }

    .notify-clear {
      display: flex;
      justify-content: flex-end;
    }
  }

  .notify-content {
    width: 100%;
    padding: 10px;
    padding-bottom: 5px;
    background-color: #fff;

    .el-row {
      margin-bottom: 5px;

      :last-child {
        margin-bottom: 0;
      }
    }

    .single,
    .slogan {
      display: inline-block;
      cursor: pointer;
    }

    .single {
      color: #409eff;
      // font-weight: 500;
      width: 90%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}

.notify.active {
  transform: translateY(0);
}

.avatar {
  width: 35px;
}

.bottom-row {
  width: 95%;
  position: relative;
  display: flex;
  justify-content: space-between;
  color: rgb(170, 170, 170);
  font-size: 12px;
}
</style>

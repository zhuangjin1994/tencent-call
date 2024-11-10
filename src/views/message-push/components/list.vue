<template>
  <el-card class="box-card" body-style="{width: 100%; height: 100%; position: relative;}">
    <div slot="header" class="clearfix">
      <!-- <span>卡片名称</span> -->
      <el-row class="listHeader" type="flex" justify="end" align="middle" v-if="list.length !== 0">
        <el-col :span="6" class="clear-col">
          <el-button type="text" size="medium" class="clear-btn" icon="el-icon-delete
" @click="clearList">一键清除</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="list-content" v-if="list.length !== 0">
      <el-row type="flex" class="lItem" justify="start" align="middle" v-for="litem in list" :key="litem.id">
        <!-- <el-col :span="2" :pull="1" class="avatar">
        </el-col> -->
        <el-col :span="14">
          <img :src="circleUrl" class="avatar" />
          <i :class="litem.whetherRead === 0 ? 'isNoRead' : 'isRead'"></i>
          <div class="single" style="margin-top:5px;">
            <div style="margin-left:5px;color:#303133">{{ litem.operationDetail }}</div>
            <div @click="goDetail(litem)" class="single" style="margin-left:5px">{{ litem.operationContent }}</div>
          </div>
          <!-- <div v-for="(sItem, index) in litem.operationContent" :key="index" @click="goDetail(litem)"
            :class="index === 1 ? 'single' : 'slogan'">
            {{ sItem }}
          </div> -->
        </el-col>
        <el-col :span="6" class="demandOperator">执行人：{{ litem.demandOperator || litem.supplierOperator }}
        </el-col>
        <el-col :span="4">{{ litem.createdDate }}</el-col>
      </el-row>
    </div>
    <Placeholder v-else kind="0" height="600px"></Placeholder>
    <el-row type="flex" justify="end" align="middle" v-if="list.length !== 0">
      <el-col :span="24" style="text-align: right;">
        <el-pagination layout="prev, pager, next, jumper, sizes, total" :total="total" :page-size="pageSize"
          :current-page="pageNum" :page-sizes="[10, 20, 30, 50]" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" v-if="total !== 0" />
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import service from '@/utils/services';
import avatarImg from '@/assets/images/avatar.png';
import Placeholder from '@/components/Placeholder/index.vue';
export default {
  data() {
    return {
      list: [],
      listId: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      circleUrl: avatarImg
    };
  },
  components: {
    Placeholder
  },
  mounted() {
    this.getMsgList(this.pageSize, this.pageNum);
  },
  methods: {
    async getMsgList(pageSize, pageNum) {
      const res = await service.post('/message/list', { 'pageSize': pageSize, 'pageNum': pageNum });
      const messageId = [];
      const filterData = [];
      res.data.data.forEach(element => {
        messageId.push(element.messageId);
        // if (element.operationContent.indexOf(',') !== -1) {
        //   element.operationContent = element.operationContent.split(',')
        // }
        if (!element.whetherClear) {
          filterData.push(element);
        }
      });
      this.list = res.data.data;
      this.listId = messageId;
      this.total = res.data.total;
    },
    clearList() {
      this.$confirm('此操作将清空消息列表, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const res = service.post('/message/clear', { messageIdList: this.listId });
        this.list = [];
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getMsgList(this.pageSize, this.pageNum);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageNum = val;
      this.getMsgList(this.pageSize, this.pageNum);
    },
    async readMsg(id) {
      const res = await service.post('/message/markRead', { messageId: id });
    },
    goDetail(data) {
      console.log(data);
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
          this.readMsg(data.messageId);
        }
        window.open(`${location.origin}#/demand/${path}?id=${data.demandId}&type=${type}`, Math.floor(Math.random() * 100));
        // this.$router.push({ path: `/demand/${path}`, query: { id: data.demandId, type: "edit" } })
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.box-card {
  width: 100%;
  height: 100%;
  position: relative;
}

.list-content {
  width: 100%;
  height: calc(100% - 130px);
  position: relative;
  background-color: #ffffff;
  overflow: hidden;
  overflow-y: auto;
}

.listHeader {
  position: relative;
  height: 20px;
  padding: 10px;

  .clear-col {
    display: flex;
    justify-content: flex-end;
    padding-right: 35px;
  }
}

.lItem {
  height: 56px;
  position: relative;
  border: #ededed 1px solid;
  font-size: 12px;
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 10px;

  .el-col {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 12px;
  }

  .avatar {
    width: 35px;
    margin: 0 15px;
  }

  .single {
    color: #409eff;
    width: 90%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
  }

  .isNoRead,
  .isRead {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: #ff0000;
    vertical-align: middle;
    margin-right: 5px;
  }

  .isRead {
    opacity: 0;
  }

  .demandOperator {
    font-size: 12px;
    padding: 0 20px;
  }
}
</style>

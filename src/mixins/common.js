import axios from 'axios';
import store from '@/store';
import date from '@/utils/dateTransform';
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters(['userName']),
  },
  methods: {
    /**
		 * 操作确认弹框
		 * @param msg 提示语句
		 * @param api api
		 * @param params 操作所需参数
		 * @param type 页面操作行为
		 */
    confirmOperate(msg, api, params, type) {
      this.$confirm(`确定${msg}吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then((res) => {
        api(params)
          .then((res) => {
            this.$message.success(`${msg}成功`);
            if (!type) {
              this.fetchData();
            } else if (type.includes('refresh')) {
              this.refreshData(type);
            } else if (['talent'].includes(type)) { // 一些页面操作之后刷新消息中心数据
              store.dispatch('app/getMessages');
            }
          })
          .catch((_) => {});
      })
        .catch(_ => console.log('已取消操作'));
    },


    // 翻页
    onPageChange(pageNum) {
      this.page.pageNum = pageNum;
      this.fetchData();
    },
    // 每页多少条
    onSizeChange(pageSize) {
      this.page.pageSize = pageSize;
      this.fetchData();
    },
    onSearch() {
      this.page.pageNum = 1;
      // this.page.pageSize =10
      this.fetchData();
    },

    getColor(status) {
      const colors = {
        approving: '#F25643',
        to_be_responsed: '#14c3c3',
        to_be_confirmed: '#14c3c3',
        to_be_accepted: '#14c3c3',
        finished: '#14c3c3',
        end: '#ceced6',
        whithdraw: '#016FFA',
        temporary_storage: '#016FFA',
        reject: '#016FFA',
      };
      return colors[status];
    },

    /**
     * 封装导出Excel文件post请求
     * @param url  下载接口url
     * @param params 参数
     * @param file 文件名
     * @returns {Promise}
     */
    downloadExcel(url, params, file) {
      if (!this.tableData.length) {
        this.$message.error('暂无数据可导出');
        return;
      }
      this.filterEmptyKey(params);
      axios.request({
        method: 'post',
        url: process.env.VUE_APP_BASE_API + url,
        data: params,
        headers: {
          STAFFNAME: this.userName,
          // STAFFNAME: 'v_anityxiao'
        },
        responseType: 'blob',
      }).then((res) => {
        const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        // 判断类型是否返回json，返回json时报错, 使用FileReader读取文件的内容
        if (res.data.type !== 'application/vnd.ms-excel') {
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = JSON.parse(e.target.result);
            if (result) {
              this.$message.error(result.msg);
            }
          };
          reader.readAsText(blob);
        } else {
          const time = date.timeFormat(new Date(), 'YYYYMMDDHHmmss');
          const fileName = `${file}${time}.xlsx`;
          // 兼容 IE
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileName);
          } else {
            const link = document.createElement('a');
            link.style.display = 'none';
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            // 释放内存
            URL.revokeObjectURL(link.href);
          }
        }
      })
        .catch((err) => {
          console.log(err);
        });
    },

    getCellStyle({ column }) {
      // TODO 针对Safari表格width与showOverflowTooltip暂不能共存异常
      const tempWidth = column.realWidth || column.width;
      if (column.showOverflowTooltip) {
        return {
          minWidth: `${tempWidth}px`,
          maxWidth: `${tempWidth}px`,
        };
      }
      return {};
    },

    /**
     * 服务端接口empty字符串，数组跟null返回的结果不同，对此进行过滤
     * @param params
     */
    filterEmptyKey(params) {
      Object.keys(params).forEach((key) => {
        if (params[key] === '' || params[key] === null || (Array.isArray(params[key]) && !params[key].length)) {
          delete params[key];
        }
      });
    },
  },
};


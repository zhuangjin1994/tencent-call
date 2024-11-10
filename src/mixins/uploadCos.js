// 腾讯云对象储存文档：https://cloud.tencent.com/document/product/436/8629
// 腾讯云对象存储
import COS from 'cos-js-sdk-v5';
// 获取临时秘钥接口
import { getCosSign, previewFile } from '@/api/demand.js';
import { Message } from 'element-ui';
export default {
  data() {
    return {
      config: {
        Bucket: '',
        Region: '',
      },
      urls: [],
    };
  },

  methods: {
    // 附件上传
    uploadFile(File, callback) {
      const { file } = File;
      getCosSign().then((response) => { // 后台接口返回 密钥相关信息
        const result = response.data || {};
        const { credentials } = result;
        this.config.Bucket = result.bucket;
        this.config.Region = result.region;
        const cos = new COS({
          getAuthorization(options, callback) {
            callback({
              TmpSecretId: credentials.tmpSecretId,
              TmpSecretKey: credentials.tmpSecretKey,
              XCosSecurityToken: credentials.sessionToken,
              StartTime: result.startTime,
              ExpiredTime: result.expiredTime,
              expiration: result.expiration,
              requestId: result.requestId,
            });
          },
        });
        const key = `demand/${new Date().getTime()}${file.name}`;
        cos.putObject(
          { // 此处暂应用最简单的上传函数，此外，腾讯云还支持分片上传函数等等。
            Bucket: this.config.Bucket, // 存储桶名称
            Region: this.config.Region, // 地区
            Key: key, // 图片名称
            StorageClass: 'STANDARD', // 上传模式：默认标准模式
            Body: file, // 上传文件对象
            onTaskReady: (tid) => {
              file.cos = cos;
              file.taskId = tid;
            },
            onHashProgress: (progressData) => {
              console.log('校验中', JSON.stringify(progressData));
            },
            onProgress: (progressData) => {
              const num = progressData.percent * 100;
              File.onProgress({ percent: num }); // 上传进度条
            },
          },
          // 文件上传后回调函数
          (err, data) => {
            if (err) {
              Message({
                message: '文件上传失败,请重新上传',
                type: 'error',
              });
            } else {
            // data如果是个带有Location等的对象，则说明上传成功。
              callback({ url: data.Location, key });
            }
          },
        );
      })
        .catch((err) => {
        // 去除文件列表失败文件
          const idx = this.$refs.uploader.uploadFiles.findIndex(item => item.uid === file.uid);
          this.$refs.uploader.uploadFiles.splice(idx, 1);
          this.$refs.uploader.uploadFileNum--;
        });
    },

    // 预览文件
    previewFile(file) {
      const type = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
      if (['jpg', 'mp4', 'mp3', 'png', 'jpeg'].includes(type)) { // 弹框预览[图片,视频,音频]内容
        this.uploadType = type;
        this.getObjectUrl(file, 'preview', (url) => {
          this.localUrl = url;
          this.previewDialogVisible = true;
        });
      } else { // [pptx，pdf，excel，word】类型文件在新窗口打开预览
        const { name, key } = file;
        const params = {
          attachmentName: name,
          attachmentKey: key,
        };
        previewFile(params).then((res) => {
          window.open(`https://${res.data.previewUrl}&sign=${encodeURIComponent(res.data.sign)}`, Math.random() * 1000);
        })
          .catch((err) => {
            this.$message.error('预览发生错误，请稍后再试');
          });
      }
    },

    // 下载文件
    downloadFile(file) {
      this.getObjectUrl(file, 'download', (url) => {
        window.open(url, '_self');
      });
    },

    // 批量下载文件
    batchDownloadFile(files) {
      getCosSign().then((response) => {
        const res = response.data || {};
        const { credentials } = res;
        this.config.Bucket = res.bucket;
        this.config.Region = res.region;
        const cos = new COS({
          getAuthorization(options, callback) {
            callback({
              TmpSecretId: credentials.tmpSecretId,
              TmpSecretKey: credentials.tmpSecretKey,
              XCosSecurityToken: credentials.sessionToken,
              StartTime: res.startTime,
              ExpiredTime: res.expiredTime,
              expiration: res.expiration,
              requestId: res.requestId,
            });
          },
        });
        files.forEach((item, index) => {
          cos.getObjectUrl({
            Bucket: this.config.Bucket,
            Region: this.config.Region,
            Key: item.key,
            sign: true,
          }, (err, data) => {
            if (err) {
              console.log(err);
            } else {
              // 创建下载
              setTimeout(() => {
                const url = `${data.Url + (data.Url.indexOf('?') > -1 ? '&' : '?')}response-content-disposition=attachment%3B%20filename=${item.name}`;
                const a = document.createElement('a');
                a.href = url;
                a.download = 'name';
                a.click();
              }, 1000 * index);
            }
          });
        });
      });
    },

    // 对接腾讯云sdk获取附件对象url
    getObjectUrl(file, type, callback) {
      getCosSign().then((response) => {
        const resp = response.data || {};
        const { credentials } = resp;
        this.config.Bucket = resp.bucket;
        this.config.Region = resp.region;
        const cos = new COS({
          getAuthorization(options, callback) {
            callback({
              TmpSecretId: credentials.tmpSecretId,
              TmpSecretKey: credentials.tmpSecretKey,
              XCosSecurityToken: credentials.sessionToken,
              StartTime: resp.startTime,
              ExpiredTime: resp.expiredTime,
              expiration: resp.expiration,
              requestId: resp.requestId,
            });
          },
        });
        cos.getObjectUrl({
          Bucket: this.config.Bucket,
          Region: this.config.Region,
          Key: file.key,
          sign: true,
        }, (err, data) => {
          if (err) {
            console.log(err);
          } else {
            // 链接拼接【预览，下载】的参数
            const url = type === 'download' ? `${data.Url}${(data.Url.indexOf('?') > -1 ? '&' : '?')}response-content-disposition=attachment%3B%20filename=${file.name}` : `${data.Url + (data.Url.indexOf('?') > -1 ? '&' : '?')}response-content-disposition=inline`;
            callback(url);
          }
        });
      });
    },
  },
};

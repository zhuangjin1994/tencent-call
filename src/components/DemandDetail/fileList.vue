<template>
  <div>
		<div v-if="data.length" class="file-box">
			<el-card shadow="hover" class="file-card" v-for="(item, index) in data" :key="index">
				<svg-icon :icon-class="gainIcon(item.attachmentName)" class="file-icon" />
				<div class="file-name">
					<text-tooltips :text="item.attachmentName" width="100%"/>
				</div>
				<span class="btns">
					<el-tooltip class="item" effect="light" content="预览" placement="top">
            <img class="el-icon-view file-btn" :src="require('@/assets/btn_icons/preview.png')" @click="handlePreview(item)"/>
					</el-tooltip>
					<el-tooltip class="item" effect="light" content="下载" placement="top">
            <img class="el-icon-view file-btn" :src="require('@/assets/btn_icons/download.png')" @click="handleDownload(item)"/>
					</el-tooltip>
				</span>
			</el-card>
		</div>
		<placeholder v-else height="100px"/>
    <preview-dialog :dialog-visible.sync="previewDialogVisible" :url="localUrl" :type="uploadType" />
	</div>
</template>
<script>
import uploadCos from '@/mixins/uploadCos.js';
import TextTooltips from '@/components/TextTooltips';
import Placeholder from '@/components/Placeholder';
import PreviewDialog from '@/components/Upload/PreviewDialog';
export default {
  mixins: [uploadCos],
  components: {
    Placeholder,
    TextTooltips,
    PreviewDialog
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      previewDialogVisible: false,
      uploadType: 'jpg',
      localUrl: ''
    };
  },
  methods: {
    handlePreview(row) {
      this.previewFile({name: row.attachmentName, key: row.attachmentKey});
    },
    handleDownload(row) {
      this.downloadFile({name: row.attachmentName, key: row.attachmentKey});
    },
    gainIcon(name) {
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
    }
  }
};
</script>
<style lang="scss" scoped>
.file-box {
	width: 98%;
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-start;
	align-items: center;
	.el-card {
		border: 1px solid #707070;
	}
	.file-card {
		flex: 1;
		margin: 0 10px 10px 0;
		width: calc((100% - 40px) / 4);
		min-width: calc((100% - 40px) / 4); // 加入这两个使item宽度生效
		max-width: calc((100% - 40px) / 4);
		&:nth-child(4n) { // 去除第3n个的margin-right
      margin-right: 0 ;
    }
		.file-name {
			color: #707070;
			font-size: 14px;
			display: inline-block;
			width: calc(100% - 90px);
      min-width: 70px;
			margin-left: 4px;
		}
		.file-icon {
			font-size: 30px;
			color: #4285F4;
		}
		.btns {
			float: right;
			color: #606266;
			font-size: 16px;
			.file-btn {
				color: #016FFA;
				cursor: pointer;
				width: 16px;
			}
			.file-btn:nth-child(2) {
				margin-left: 12px;
			}
		}
	}
}
</style>
<style lang="scss">
.file-box {
	.el-card__body {
		padding: 10px;
	}
}
</style>

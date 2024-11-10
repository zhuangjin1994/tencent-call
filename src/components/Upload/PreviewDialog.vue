<template>
	<el-dialog
    title="附件预览"
    :visible.sync="visible"
    width="600px"
    min-heigth="400px"
    append-to-body
    class="preview-dialog"
  >
    <video
      :src="url"
      controls
      width="100%"
      height="500px"
      muted
      v-if="type==='mp4'"
      id="video"
    ></video>
    <div class="audio-box" v-else-if="type==='mp3'">
      <div class="audio-img">
        <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iODBweCIgaGVpZ2h0PSI4MHB4IiB2aWV3Qm94PSIwIDAgODAgODAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+6Z+z6aKR6aKE6KeIPC90aXRsZT4KICAgIDxnIGlkPSLpobXpnaItMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9Iumfs+mikemihOiniCI+CiAgICAgICAgICAgIDxjaXJjbGUgaWQ9IuakreWchuW9oiIgZmlsbD0iI0VCRUZGNSIgZmlsbC1ydWxlPSJub256ZXJvIiBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiPjwvY2lyY2xlPgogICAgICAgICAgICA8ZyBpZD0iaWNvbi8yL2J1Y2tldOWkh+S7vS0xNSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTYuMDAwMDAwLCAxNi4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxyZWN0IGlkPSLnn6nlvaLlpIfku70tMTgiIHg9IjAiIHk9IjAiIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCI+PC9yZWN0PgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTMxLjU3MTQyODYsNCBMNDEsMTMuOSBMNDEsNDQgTDcsNDQgTDcsNCBMMzEuNTcxNDI4Niw0IFoiIGlkPSLnn6nlvaIiIHN0cm9rZT0iI0MxQ0NERCIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSIjRkZGRkZGIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8cG9seWdvbiBpZD0i55+p5b2iIiBmaWxsPSIjQzFDQ0REIiBwb2ludHM9IjMxIDMgNDIgMTQgMzEgMTQiPjwvcG9seWdvbj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yNy43MzM2NjU3LDE4IEwzMS4yMzY4NTk4LDIwLjMzNDcxNTEgQzMyLjA3NjU2NzQsMjAuODk0NTIwMSAzMi41ODA5NDExLDIxLjgzNjk1MSAzMi41ODA5NDExLDIyLjg0NjE1MzggTDI3LjczNDc4NzIsMjEuMjMwNzY5MiBMMjcuNzM0NDUzLDMzLjQ5MDQ4NzggQzI3LjcwNTA0NzksMzUuNzY4ODIxOCAyNS42MjM4OTczLDM4LjAzMDQyNDYgMjIuNjIxNjYxMiwzOC44MzQ4NzEzIEMxOS4xNzQ2NDk1LDM5Ljc1ODQ5NTMgMTUuODE4NzM1NSwzOC40MTE0NzQyIDE1LjEyNjAxNzQsMzUuODI2MjE1NCBDMTQuNDMzMjk5NCwzMy4yNDA5NTY2IDE2LjY2NjA5NTcsMzAuMzk2NDQ1IDIwLjExMzEwNzQsMjkuNDcyODIxIEMyMS4xODc0MzcsMjkuMTg0OTU1MyAyMi4yNTI5MTc1LDI5LjExNzY1NTYgMjMuMjMxNjc4NiwyOS4yMzk2NjYgTDIzLjIzMDg0NTksMTggTDI3LjczMzY2NTcsMTggWiIgaWQ9Iui3r+W+hCIgZmlsbD0iIzAwNkVGRiI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=">
      </div>
      <div class="audio">
      <audio :src="url" controls style="width:550px;border-radius:0px;"></audio>
      </div>
    </div>
    <img
      class="preview-img"
      :src="url"
      width="500"
      v-else
    />
  </el-dialog>
</template>
<script>
export default {
  props: {
    url: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'jpg'
    },
    dialogVisible: {
      type: Boolean,
      default: false
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
    }
  }
};
</script>
<style lang='scss' scoped>
.preview-dialog .el-dialog__body {
  display: flex;
  justify-content: center;
}
.audio-box {
  background: #fff;
  .audio-img {
    text-align: center;
    height: 260px;
    line-height: 260px;
  }
  .audio {
    width: 554px;
    background: #fff;
    border-radius: 0px;
  }
}
.preview-img {
  display: block;
  width: 100%;
  height: auto;
}
</style>

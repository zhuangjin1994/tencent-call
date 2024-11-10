<template>
  <div ref="rightPanel" class="rightPanel-container">
    <div class="rightPanel-background" />
    <div class="rightPanel">
      <div class="handle-button">
        <div class="el-icon-question explain panel-icon"  @click="showExplain">
          <span class="rota">操作指引</span>
        </div>
        <!-- <svg-icon icon-class="guide" class="explain panel-icon" >
          <span class="rota">查看说明</span>
        </svg-icon> -->
         <el-popover
            placement="right"
            popper-class="panel-popover"
            trigger="click">
            <div class="img-box">
              <span class="img-item" v-for="item in codeData" :key="item.name" >
                <img :src="gainImg(item)" class="img">
                <span class="img-name">{{item}}</span>
              </span>
            </div>
            <div slot="reference" class="el-icon-phone code panel-icon">
              <span class="rota">联系方式</span>
            </div>
          </el-popover>
      </div>
      <div class="rightPanel-items">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RightPanel',
  data() {
    return {
      codeData: [
        '六度',
        'BCC',
        'CIC',
        'GLG',
        'Linker',
        '凯盛',
        'AlphaSights',
        'GuidePoint'
      ]
    };
  },
  mounted() {
    this.insertToBody();
  },
  beforeDestroy() {
    const elx = this.$refs.rightPanel;
    elx.remove();
  },
  methods: {
    showExplain() {
      window.open('https://iwiki.woa.com/pages/viewpage.action?pageId=735505488', '_target');
    },
    gainImg(img) {
      return require(`@/assets/images/${img}.png`);
    },
    insertToBody() {
      const elx = this.$refs.rightPanel;
      const body = document.querySelector('body');
      body.insertBefore(elx, body.firstChild);
    }
  }
};
</script>

<style lang="scss">
.panel-popover{
  min-width: 100px;
  .img-box {
    max-height: 108px;
    width: 326px;
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    justify-content: flex-start;
    .img-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      .img {
        height: 80px;
        width: 90px;
        margin-top: 6px;
        margin-right: 10px;
        border: 1px solid black;
        display: inline-block;
      }
      .img-name { 
        margin-top: 4px;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.rightPanel {
  width: 100%;
  max-width: 260px;
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  box-shadow: 0px 0px 15px 0px #606266;
  transition: all .25s cubic-bezier(.7, .3, .1, 1);
  transform: translate(100%);
  background: #fff;
  z-index: 40000;
}
.handle-button {
  bottom: 200px;
  position: absolute;
  left: -48px;
  font-size: 24px;
  z-index: 0;
  pointer-events: auto;
  .explain, .code {
    height: 46px;
    width: 46px;
    line-height: 46px;
    border-radius: 5px;
    background: #fff;
    text-align: center;
    cursor: pointer;
    position: relative;
    color: #606266;
    display: block;
    font-weight: 600;
    box-shadow: 0 2px 5px rgba(0,0,0,0.8);
  }
  .explain {
    margin-bottom: 5px;
  }
  .rota {
    display: block;
    position: absolute;
    border-radius: 5px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    margin: auto;
    -webkit-transform-origin: -50% 50%;
    transform-origin: -50% 50%;
    -webkit-transform: rotate3d(1,0,0,90deg);
    transform: rotate3d(1,0,0,90deg);
    -webkit-transition: -webkit-transform .3s ease-in;
    transition: transform .3s ease-in;
    opacity: 0;
    filter: alpha(opacity=0);
    background: #1B8BF5;
    color: #fff;
    font-size: 12px;
    line-height: 16px;
    padding: 8px;
    box-sizing: border-box;
  }
  .panel-icon {
    color: #606266;
  }
  .panel-icon:hover .rota {
    -webkit-transform: rotate3d(1,0,0,0deg);
    transform: rotate3d(1,0,0,0deg);
    -webkit-transition-timing-function: ease-out;
    transition-timing-function: ease-out;
    opacity: .9;
    filter: alpha(opacity=90);
  }
}
</style>

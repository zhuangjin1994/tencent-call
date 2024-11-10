<template>
  <el-dialog :title="title" :visible.sync="$store.state.user.readTag" width="900px" top="10vh" id="protocol_dialog"
    :before-close="handleClose" @open="openDialog">
    <div slot="title" class="header-title">
        <img src="../../assets/images/logo.png" alt class="protocol_img" />
        <span class="protocol_title">{{ title }}</span>
    </div>
    <div>
      <p class="mess_title">信息安全声明</p>
      <p class="mess_main">{{ mess }}</p>
      <p v-for="(item, index) in messBranch" :key="'index' + index" class="mess_branch">{{ item }}</p>
      <p v-for="(cont, ind) in message" :key="'ind' + ind" class="mess_main">{{ cont }}</p>
    </div>
    <span slot="footer" class="dialog-footer">
      <div>
        <el-checkbox v-model="checked">我已阅读并承诺遵守以上规定</el-checkbox>
      </div>
      <div>
        <el-button type="primary" @click="onSure" :disabled="!checked">确 定</el-button>
      </div>
    </span>
  </el-dialog>
</template>
<script>
import {
  removeToken
} from '@/utils/auth';
export default {
  data() {
    return {
      title: 'MRR市场研究资源使用须知',
      checked: false,
      mess: '专家call平台是提出访谈需求、与专家供应商对接并选择访谈专家、查阅访谈记录的内部管理平台，您不得通过本平台发布包括但不限于以下的违反法律法规的内容，也不得发布与专家访谈项目无关的问题、需求等信息内容。',
      messBranch: [
        '（1）反对宪法所确定的基本原则的内容；',
        '（2）危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的内容；',
        '（3）损害国家荣誉和利益的内容；',
        '（4）煽动民族仇恨、民族歧视，破坏民族团结的内容；',
        '（5）破坏国家宗教政策，宣扬邪教和封建迷信的内容；',
        '（6）散布谣言，扰乱社会秩序，破坏社会稳定的内容；',
        '（7）散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的内容；',
        '（8）侮辱或者诽谤他人，侵害他人合法权益的内容；',
        '（9）侵害他人知识产权、商业秘密等合法权利的内容；',
        '（10）恶意虚构事实、隐瞒真相以误导、欺骗他人的内容；',
        '（11）发布、传送、传播不良广告信息及垃圾信息；',
        '（12）其他法律法规禁止的内容。'
      ],
      message: [
        '本平台中包含的供应商信息、专家信息、访谈人信息、访谈信息、商业信息、技术信息、财务信息、管理信息、市场信息、法律信息、经济数据或者任何其它非公开或专有的信息、数据、设想或概念均为保密信息，仅限腾讯内部工作、学习使用，未经腾讯公司书面同意，禁止以任何方式（包括但不限于复制、转载、拍照、录像、截图等）擅自获取、发布、传播和用于其他用途或目的。否则，无论您是否在职，公司将按照《防止办公网内高危行为管理办法》和《阳光行为准则》对违规行为进行处理，并对情节恶劣者追究法律责任（包括但不限于民事、刑事责任）的权利。',
        '本平台著作权、商标权、专利权、商业秘密等知识产权，以及本平台中发布的任何信息，包括但不限于文字、图片、音频、视频、图表、有关数据或电子文档等的知识产权归腾讯所有，未经腾讯书面同意，您不得为任何商业或非商业目的自行或许可任何第三方实施、利用、转让上述知识产权。'
      ]
    };
  },
  methods: {
    handleClose() {
      this.checked = false;
      this.$store.commit('user/SET_READTAG', false);
      removeToken();
      window.open(`http://${document.domain}/_logout/?url=${document.domain}`, '_self');
    },
    onSure() {
      window.localStorage.setItem('readTag', true);
      this.$store.commit('user/SET_READTAG', false);
    },
    openDialog() {
      this.checked = false;
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep {
  .el-dialog__body {
    overflow: auto;
    height: 50vh !important;
  }

  .el-dialog__header,
  .el-dialog__footer {
    background: #eee;
  }

  .el-dialog__header {
    align-items: center;
  }
}

.protocol_img {
  width: 24px;
  height: 15px;
  vertical-align: text-bottom;
}

.protocol_title {
  display: inline-block;
  margin-left: 10px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
}

.mess_title {
  font-size: 16px;
  font-weight: 600;
  color: #000;
}

.mess_main {
  margin-top: 10px;
  font-size: 14px;
  color: #000;
  font-weight: 600;
}

.mess_branch {
  font-size: 14px;
  line-height: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
</style>

<template>
  <div class="login">
    <div class="loginBox">
      <h2 class="loginH2">后台管理系统</h2>
      <div class="loginCon">
        <div class="titleDiv">
          <h3>MRR市场研究资源管理</h3>
        </div>
        <el-form ref="loginForm" :rules="rules" :model="ruleForm">
          <el-form-item prop="user">
            <el-input v-model="ruleForm.user" placeholder="请输入账号名" prefix-icon="el-icon-user"/>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="ruleForm.password" placeholder="请输入密码" prefix-icon="el-icon-lock" show-password/>
          </el-form-item>
          <el-button type="primary" class="loginBtn" @click="_login">登录</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { encrypt_ECB } from '@/utils/sm4.js';
export default {
  data() {
    return {
      showSlide: false,
      ruleForm: {
        user: 'aachen',
        password: '123456'
      },
      rules: {
        user: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在3到5个字符', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    };
  },
  mounted() {},
  methods: {
    onSuccess() {
      this.showSlide = false;
      this._login();
    },
    onFail() {
      this.$message.error('验证失败');
    },
    _login() {
      const { user, password } = this.ruleForm;
      const params = {
        loginName: user,
        password: encrypt_ECB(password, '2021tencentCall')
      };
      this.$store
        .dispatch('user/_login', params).then(res => {
          this.$router.push(this.$route.query.redirect || '/');
        });
    }
  }
};
</script>
<style scoped lang="scss">
.login {
  height: 100%;
  width: 100%;
  background-size: 100% 100%;
  overflow: hidden;
}
.loginBox {
  height: 455px;
  width: 550px;
  margin: 0 auto;
  position: relative;
  top: 50%;
  margin-top: -287px;
  border: 1px solid #999;
}
.loginH2 {
  font-size: 38px;
  color: #fff;
  text-align: center;
}
.loginCon {
  margin-top: 30px;
  background: #eee;
  border-radius: 4px;
  .titleDiv {
    padding: 0 28px;
    background: #fff;
    position: relative;
    height: 120px;
    border-radius: 4px 4px 0 0;
    h3 {
      font-size: 22px;
      color: #555;
      font-weight: initial;
      padding-top: 23px;
    }
    p {
      font-size: 16px;
      color: #888;
      padding-top: 12px;
    }
    i {
      font-size: 65px;
      color: #ddd;
      position: absolute;
      right: 27px;
      top: 29px;
    }
  }
  .el-form {
    padding: 25px 25px 30px 25px;
    background: #eee;
    border-radius: 0 0 4px 4px;
  }
}
.loginBtn {
  width: 100%;
  background: #19b9e7;
}
.slideShadow {
  position: fixed;
  z-index: 999;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
}
.slideSty {
  position: absolute;
  width: 380px;
  height: 311px;
  background: #e8e8e8;
  border: 1px solid #dcdcdc;
  left: 50%;
  top: 50%;
  margin-left: -188px;
  margin-top: -176px;
  z-index: 99;
  border-radius: 5px;
}
.iconBtn {
  padding: 9px 0 0 19px;
  color: #5f5f5f;
  border-top: 1px solid #d8d8d8;
  margin-top: 17px;
  i {
    font-size: 22px;
    cursor: pointer;
  }
  i:last-child {
    margin-left: 7px;
  }
}
</style>
<style>
.slideSty .slide-verify {
  margin: 13px auto 0 auto;
  width: 350px !important;
}
.slideSty .slide-verify-slider {
  width: 100% !important;
}
.slideSty .slide-verify-refresh-icon {
  display: none;
}
</style>

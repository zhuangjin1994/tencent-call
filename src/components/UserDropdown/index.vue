<template>
  <div>
    <el-dropdown class="userDd">
      <div class="userDrop">
        <span class="userDrop_text">{{ userName }}<i class="el-icon-caret-bottom"/></span>
      </div>
      <el-dropdown-menu solt="dropdown">
        <!-- <el-dropdown-item>
          <div><i class="el-icon-s-home" />修改密码</div>
        </el-dropdown-item>
        <el-dropdown-item>
          <router-link to="/driver"><i class="el-icon-s-custom" />基本信息</router-link>
        </el-dropdown-item> -->
        <el-dropdown-item>
          <a @click="loginOut()"><i class="el-icon-switch-button" />退出登录</a>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters(['userName'])
  },
  methods: {
    loginOut() {
      this.$store.dispatch('user/loginOut');
    }
  }
};
</script>

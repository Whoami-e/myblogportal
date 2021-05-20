<template>
  <div class="login-part">
    <div class="center login-center-box">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form :model="User" label-width="100px">
            <el-form-item label="账号" required :show-message="false">
              <el-input type="text" v-model="User.userName" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" required :show-message="false">
              <el-input type="password" v-model="originalPassword" show-password placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item label="验证码" required :show-message="false">
              <el-input type="text" v-model="loginInfo.verifyCode" @keyup.enter.native="doLogin"
                        placeholder="请输入右侧验证码"></el-input>
              <img :src="captchaPath" @click="updateVerifyCode" class="captcha_code">
            </el-form-item>
            <el-form-item class="login-button">
              <el-button type="primary" @click="doLogin" v-if="!isCommitting"> 登录</el-button>
              <el-button type="primary" v-else disabled> 登录</el-button>
              <el-button type="info">
                <a href="/forget-password" style="text-decoration: none;color: #FFFFFF;">忘记密码？</a>
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import {hex_md5} from "@/utils/md5";
import * as api from '@/api/api';
export default {
  data(){
    return {
      isCommitting: false,
      originalPassword: '',
      User: {
        userName: '',
        password: '',
      },
      loginInfo: {
        verifyCode: '',
        captcha_key: ''
      },
      captchaPath: ''
    }
  },
  methods: {
    doLogin(){
      if(this.User.userName === ''){
        this.$message.error('请输入用户名');
        return;
      }
      if(this.originalPassword === ''){
        this.$message.error('请输入密码');
        return;
      }
      if(this.loginInfo.verifyCode === ''){
        this.$message.error('请输入验证码');
        return;
      }

      this.User.password = hex_md5(this.originalPassword);

      api.doLogin(this.loginInfo.verifyCode,this.loginInfo.captcha_key,this.User).then(response => {
        this.isCommitting = true;
        if (response.code === 20001) {
          this.$message.success(response.message);
          let redirect = this.$route.query.redirect;
          if (redirect) {
            // 访问需要登录的功能时
            location.href = redirect;
          } else {
            location.href = '/';
          }
        } else {
          this.updateVerifyCode();
          this.$message.error(response.message);
        }
        this.isCommitting = false;
      });
    },
    updateVerifyCode(){
      this.captchaPath = '/user/captcha?captcha_key=' + this.loginInfo.captcha_key + '&random=' + Date.parse(new Date());
    }
  },

  mounted() {
    this.loginInfo.captcha_key = Date.parse(new Date());
    this.updateVerifyCode()
  }
}
</script>
<style>
.login-part{
  margin-top: 20px;
  width: 1100px;
  margin-bottom: 20px;
}
.captcha_code {
  cursor: pointer;
  width: 120px;
  height: 40px;
  padding-left: 10px;
  padding-right: 10px;
  vertical-align: middle;
  margin-left: 10px;
  border: solid 1px #E6E6E6;
  border-radius: 4px;
}
.login-button {
  margin-bottom: 0px;
}
h1 {
  color: #ffffff;
  font-size: 20px;
}
.admin-login-header-box {
  width: 100%;
  height: 46px;
  background-color: #545c64;
  margin-bottom: 20px;
}
.center {
  margin: 0 auto;
  width: 1140px;
}

.login-center-box .el-input {
  width: 200px;
}
.login-center-box {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 40px;
  border-radius: 4px;
  width: 1060px;
  /*box-shadow: 0 1px 10px #afafaf;*/
}
.login-center-box .el-form-item__label {
  background: #FBFBFB;
  border: solid 1px #E6E6E6;
  text-align: center;
  border-radius: 4px;
}
.login-center-box .el-input__inner {
  height: 42px;
}
</style>

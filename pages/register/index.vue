<script src="../../plugins/VueParticles.js"></script>
<template>
  <div class="register-part">
    <div class="register-title">
      <span>新用户注册</span>
    </div>
    <div class="register-center-box">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form label-position="right" label-width="100px">
            <el-form-item label="用户名" required :show-message="false">
              <el-input v-model="User.userName" @blur="onInputBlur" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" required :show-message="false">
              <el-input v-model="originalPassword" placeholder="请输入密码" show-password type="password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱地址" required :show-message="false">
              <el-input v-model="User.email"  placeholder="请输入邮箱地址"></el-input>
              <el-button v-if="!isCountDowning" class="emailCodeBtn" type="primary" @click="getEmailCode">获取验证码</el-button>
              <el-button v-else type="primary" @click="getEmailCode" disabled>{{countDownText}}</el-button>
            </el-form-item>
            <el-form-item label="邮箱验证码" required :show-message="false">
              <el-input v-model="emailCode" placeholder="请输入邮箱验证码"></el-input>
            </el-form-item>
            <el-form-item label="图灵验证码" placeholder="请输入图灵验证码" required :show-message="false">
              <el-input v-model="loginInfo.verifyCode" placeholder="请输入图灵验证码"></el-input>
              <img :src="captchaPath" @click="updateVerifyCode" class="captcha_code">
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="doRegister"> 注册</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import * as api from '@/api/api';
import {hex_md5} from "@/utils/md5";
export default {
  data(){
    return{
      isCountDowning: false,
      countDownText: '重新发送（60s）',
      captchaPath: '',
      originalPassword: '',
      User: {
        userName: '',
        password: '',
        email: ''
      },
      loginInfo: {
        // 图灵验证码
        verifyCode: '',
        captcha_key: ''
      },
      emailCode: ''
    }
  },
  methods:{
    //输入框失去焦点
    onInputBlur(){
      api.checkUserName(this.User.userName).then(result =>{
        if (result.code === api.SUCCESS_CODE) {
          this.$message.error(result.message);
          this.User.userName = '';
        } else {
          this.$message.success(result.message);
        }
      })
    },
    doRegister(){
      if (this.User.userName === '') {
        this.$message.error('请输入用户名！');
        return;
      }
      if(this.originalPassword === ''){
        this.$message.error('请输入密码！');
        return;
      }
      if (this.User.email === '') {
        this.$message.error('请输入邮箱地址！');
        return;
      }
      if (this.emailCode === '') {
        this.$message.error('请输入邮箱验证码！')
        return;
      }
      if (this.loginInfo.verifyCode === ''){
        this.$message.error('请输入图灵验证码！');
        return;
      }
      this.User.password = hex_md5(this.originalPassword);
      api.doRegister(this.loginInfo.verifyCode,this.loginInfo.captcha_key,this.emailCode,this.User).then(result =>{
        if (result.code === 20003) {
          this.$message.success(result.message);
          location.href = '/login';
          this.makeEmpty()
        } else {
          this.updateVerifyCode()
          this.$message.error(result.message);
        }
      })
    },
    makeEmpty(){
      this.User.password = '';
      this.User.userName = '';
      this.User.email = '';
      this.loginInfo.captcha_key = '';
      this.loginInfo.verifyCode = '';
      this.emailCode = '';
      this.originalPassword = '';
    },
    getEmailCode(){
      let reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
      if (!reg.test(this.User.email)) {
        this.$message.error('邮箱地址格式不正确！');
        return;
      }
      api.getEmailCode(this.User.email,'register').then(result => {
        if (result.code === api.SUCCESS_CODE) {
          this.startCountDown();
          this.$message({
            message: result.message,
            center: true,
            type: 'success'
          });
        } else {
          this.$message.error(result.message);
        }
      });
    },
    startCountDown() {
      let time =60;
      this.isCountDowning = true;
      let that = this;
      let interval = setInterval(function () {
        time--;
        if (time <= 0) {
          that.isCountDowning = false;
          clearInterval(interval);
        }
        that.countDownText = '重新发送（' +time+ 's）';
      },1000);
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
.register-title{
  border-bottom: 1px solid #DCDCDC;
  margin-bottom: 20px;
  padding-bottom: 10px;
  font-size: 16px;
  color: #737F90;
  font-weight: bold;
}
.captcha_code {
  cursor: pointer;
  height: 40px;
  padding-left: 10px;
  padding-right: 10px;
  vertical-align: middle;
  margin-left: 10px;
  padding-left: 10px;
  padding-right: 10px;
  vertical-align: middle;
  margin-left: 10px;
  border: solid 1px #DCDFE6;
  border-radius: 4px;
}
.emailCodeBtn{
  margin-left: 10px;
}
.register-part {
  width: 1100px;
  background-color: rgba(255, 255, 255, 0.9);
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 4px;
}
.register-center-box .el-input{
  width: 60%;
}
.register-center-box .el-form-item__label{
  /*border: 1px solid #DCDFE6;*/
  /*height: 40px;*/
  border-radius: 4px;
}
</style>

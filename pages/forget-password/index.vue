<template>
  <div class="forget-password-box">
    <div class="forget-center-box">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form label-position="right" label-width="100px">
            <el-form-item label="邮箱地址" required :show-message="false">
              <el-input v-model="User.email"  placeholder="请输入邮箱地址"></el-input>
              <el-button v-if="!isCountDowning" class="emailCodeBtn" type="primary" @click="getEmailCode">获取验证码</el-button>
              <el-button v-else type="primary" @click="getEmailCode" disabled>{{countDownText}}</el-button>
            </el-form-item>
            <el-form-item label="邮箱验证码" required :show-message="false">
              <el-input v-model="emailCode" placeholder="请输入邮箱验证码"></el-input>
            </el-form-item>
            <el-form-item label="新密码" required :show-message="false">
              <el-input v-model="originalPassword1" placeholder="请输入密码" show-password type="password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" required :show-message="false">
              <el-input v-model="originalPassword2" @blur="checkPass" placeholder="请确认密码" show-password type="password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="doForget"> 忘记密码</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import * as api from "@/api/api";
import {hex_md5} from "@/utils/md5";

export default {
  data(){
    return{
      captchaPath: '',
      originalPassword1: '',
      originalPassword2: '',
      User: {
        password: '',
        email: ''
      },
      emailCode: '',
      isCountDowning: false,
      countDownText: '重新发送（60s）',
      loginInfo: {
        // 图灵验证码
        verifyCode: '',
        captcha_key: ''
      }
    }
  },
  methods:{
    checkPass(){
      if (this.originalPassword1 !== this.originalPassword2) {
        this.$message.error('两次输入密码不一致!');
        return;
      }
    },
    doForget(){
      if (this.emailCode === '') {
        this.$message.error('请输入邮箱验证码！');
        return;
      }
      this.User.password = hex_md5(this.originalPassword2);
      api.doForget(this.emailCode,this.User).then(result =>{
        if (result.code === api.SUCCESS_CODE) {
          this.$message.success(result.message);
          location.href = '/login';
        } else {
          this.$message.error(result.message);
        }
      })
    },
    getEmailCode(){
      let reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
      if (!reg.test(this.User.email)) {
        this.$message.error('邮箱地址格式不正确！');
        return;
      }
      api.getEmailCode(this.User.email,'forget').then(result => {
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
.forget-password-box{
  width: 1100px;
  background-color: rgba(255, 255, 255, 0.9);
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 4px;
}
.forget-center-box .el-input{
  width: 60%;
}
.emailCodeBtn{
  margin-left: 10px;
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
</style>

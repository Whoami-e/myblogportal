<template>
  <div class="setting-user-info-box">
	<template>
	  <el-tabs v-model="activeName">
	    <el-tab-pane label="个人信息" name="first">
			<div class="user-info-list-part">
			  <el-form status-icon label-width="100px" v-if="userInfo !== null" class="demo-ruleForm">
			    <el-form-item label="ID">
			      <el-input type="text" v-model="userInfo.id" disabled></el-input>
			    </el-form-item>
			    <el-form-item label="用户头像" class="user-info-avatar">
			      <div class="user-avatar-container" @click="showAvatarDialog">
			        <el-avatar :src="userInfo.avatar"></el-avatar>
			      </div>
			    </el-form-item>
			    <el-form-item label="用户名">
			      <el-input readonly="true" ondblclick="this.readOnly=false" onchange="this.readOnly=true" id="username" type="text" v-model="userInfo.userName"></el-input>
			    </el-form-item>
			    <el-form-item label="签名">
			      <el-input readonly="true" ondblclick="this.readOnly=false" onchange="this.readOnly=true"  type="textarea" resize="none" v-model="userInfo.sign"></el-input>
			    </el-form-item>
			    <el-form-item>
			      <div class="warning">
			        *注意：修改用户信息后一定要按下面的按钮！
			      </div>
			    </el-form-item>
			    <el-form-item>
			      <el-button type="primary" size="medium" @click="updateAdminInfo">更新账户信息</el-button>
			    </el-form-item>
			  </el-form>
			</div>
		</el-tab-pane>
	    <el-tab-pane label="修改邮箱" name="second">
			<div class="setting-email-box">
			  <el-form :model="email" status-icon :rules="rules" label-width="100px" ref="email" class="demo-dynamic">
			    <el-form-item label="原邮箱地址" prop="oldEmail">
			      <el-input type="email" v-model="email.oldEmail" placeholder="请输入原邮箱地址"></el-input>
			    </el-form-item>
			    <el-form-item label="新邮箱地址" prop="newEmail">
			      <el-input type="email" v-model="email.newEmail" placeholder="请输入新邮箱地址"></el-input>
			      <el-button v-if="!isCountDowning" type="primary" @click="getVerifyCode">获取验证码</el-button>
			      <el-button v-else type="primary" @click="getVerifyCode" disabled>{{countDownText}}</el-button>
			    </el-form-item>
			    <el-form-item label="验证码" prop="verifyCode">
			      <el-input v-model="email.verifyCode" placeholder="请输入验证码"></el-input>
			    </el-form-item>
			    <el-form-item>
			      <el-button type="primary" @click="updateEmailAddress">确定</el-button>
			    </el-form-item>
			  </el-form>
			</div>
		</el-tab-pane>
	  </el-tabs>
	</template>
    
    <div class="user-info-dialog">
      <!-- <myUpload
          field="file"
          @crop-upload-success="cropUploadSuccess"
          @crop-upload-fail="cropUploadFail"
          v-model="showAvatar"
          :width="300"
          :height="300"
          url="/admin/image/avatar"
          img-format="png"></myUpload> -->
    </div>
  </div>
</template>
<script>
import * as api from '@/api/api';
// import avatarUpload from 'vue-image-crop-upload/upload-2.vue';

export default {
  data() {
	  let validateOldEmail = (rule, value, callback) => {
		if (value === '') {
		  callback(new Error('请输入旧邮箱地址'));
		}
	  };
	  let validateNewEmail = (rule, value, callback) => {
		if (value === '') {
		  callback(new Error('请输入新邮箱地址'));
		}
	  };
	  let validateVerifyCode = (rule, value, callback) => {
		if (value === '') {
		  callback(new Error('请输入验证码'));
		}
	  };
    return {
      lastUserName: '',
      showAvatar: false,
      userInfo: null,
	  activeName: 'first',
	  isCountDowning: false,
	  countDownText: '重新发送（60s）',
	  email: {
	    oldEmail: '',
	    newEmail: '',
	    verifyCode: ''
	  },
	  rules: {
	    oldEmail: [
	      { required: true, validator: validateOldEmail, trigger: 'blur' },
	      { pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/, message: '请输入正确的邮箱格式'}
	    ],
	    newEmail: [
	      { required: true, validator: validateNewEmail, trigger: 'blur' },
	      { pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/, message: '请输入正确的邮箱格式'}
	    ],
	    verifyCode: [
	    { required: true, validator: validateVerifyCode, trigger: 'blur' }
	  ]
	  }
    }
  },
  methods: {
	toastE(msg) {
	  this.$message({
	    message: msg,
	    center: true,
	    type: 'error'
	  });
	},
	updateEmailAddress() {
	  if (this.email.oldEmail === '') {
	    this.$message.error('请输入原邮箱地址！')
	    return;
	  }
	  if (this.email.newEmail === '') {
	    this.$message.error('请输入新邮箱地址！')
	    return;
	  }if (this.email.verifyCode === '') {
	    this.$message.error('请输入邮箱验证码！')
	    return;
	  }
	  api.updateEmailAddress(this.email.oldEmail,this.email.newEmail,this.email.verifyCode).then(result => {
	    if (result.code === api.SUCCESS_CODE) {
	      this.$message({
	        message: result.message,
	        center: true,
	        type: 'success'
	      });
	      this.email.oldEmail ='';
	      this.email.newEmail ='';
	      this.email.verifyCode ='';
	    } else {
	      this.toastE(result.message);
	      this.email.verifyCode ='';
	    }
	  })
	},
	getVerifyCode() {
	  let reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
	  if (!reg.test(this.email.newEmail)) {
	    this.$message.error('邮箱地址格式不正确');
	    return;
	  }
	  api.getEmailCode(this.email.newEmail,'update').then(result => {
	    if (result.code === api.SUCCESS_CODE) {
	      this.startCountDown();
	      this.$message({
	        message: result.message,
	        center: true,
	        type: 'success'
	      });
	    } else {
	      this.toastE(result.message);
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
	checkLogin(){
	  api.checkToken().then(result =>{
	    if (result.code === 40000) {
	      this.$message.error('尚未登录，无法评论！');
	      location.href = '/login?redirect='+location.href;
	    }
	  })
	},
    showAvatarDialog() {
      this.showAvatar = true;
    },
    cropUploadSuccess(response) {
      if (response.code === api.SUCCESS_CODE) {
        this.$message.success(response.message);
        this.userInfo.avatar = '/portal/image/' + response.data.path;
      } else {
        this.$message.error(response.message);
      }
    },
    cropUploadFail() {
      this.$message.error('图片上传失败！');
    },
    // toUpdateEmailAdrPage() {
    //   this.$router.push({
    //     path: '/settings/email'
    //   })
    // },
    updateAdminInfo() {
      if (this.userInfo.userName === '') {
        this.$message.error('请输入用户名！');
        return;
      }
      if (this.lastUserName === this.userInfo.userName) {
        this.doUpdateInfo();
      } else {
        api.checkUserName(this.userInfo.userName).then(result => {
          if (result.code === api.FAILED_CODE) {
            this.doUpdateInfo();
          } else {
            this.$message.error(result.message);
          }
        });
      }

    },
    doUpdateInfo() {
      if (this.userInfo.avatar === '') {
        this.$message.error('请上传头像！');
      }
      api.updateUserInfo(this.userInfo,this.userInfo.id).then(result => {
        if (result.code === api.SUCCESS_CODE) {
          this.getAdminInfo();
          this.$message.success(result.message);
        } else {
          this.$message.error(result.message);
        }
      });
    },
    getAdminInfo() {
      api.checkToken().then(result => {
        if (result.code === api.SUCCESS_CODE) {
          this.userInfo = result.data;
          this.lastUserName = this.userInfo.userName;
        } else {
          this.$message.error(result.message);
        }
      })
    }
  },
  mounted() {
	  // this.checkLogin();
    this.getAdminInfo();
  }
}
</script>
<style>
.warning {
  color: red;
  font-weight: 400;
}
.user-avatar-container {
  width: 40px;
  cursor: pointer;
}
.setting-user-info-box .el-input {
  width: 20%;
  margin-right: 10px;
}

.setting-user-info-box .el-textarea__inner {
  width: 20%;
}

.user-info-avatar {
  display: inline-block;
}
.setting-user-info-box{
	margin-top: 20px;
	margin-bottom: 20px;
	background-color: rgba(255, 255, 255, 0.9);
	border-radius: 4px;
	padding: 20px;
}
</style>
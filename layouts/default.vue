<template>
  <div id="area">
<!--    <vue-canvas-nest :config="config" :el="'#area'"></vue-canvas-nest>-->
    <div id="blog-box">
      <div id="blog-header" class="blog-header clear-fix">
        <div class="logo-box float-left">
          <div class="logo">
            <a href="/" style="text-decoration: none;color: #737F90;">HALO博客</a>
          </div>
        </div>
        <div id="login-tips-text-box" style="display: none;" class="login-tips-text-box float-right">
          <span>
            <a :href="'/login'+redirectPath" style="text-decoration: none;color: #737F90;">
              <i class="sob_blog sobfingermap"></i> 登录
            </a>
          </span>
            <span>
            <a href="/register" style="text-decoration: none;color: #737F90;">
              <i class="sob_blog sobmembers-add"></i> 注册
            </a>
          </span>
        </div>

        <div id="user-info-box" style="display: none;" class="user-info-box float-right clear-fix">
          <div class="user-avatar float-left">
            <img
              v-if="userInfo !== null"
              style="object-fit: cover"
              :src="userInfo.avatar">
          </div>
          <div class="user-name float-left" v-if="userInfo !== null">
            <el-dropdown @command="handlerCommend">
            <span class="el-dropdown-link">
              {{ userInfo.userName }} <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="userInfo">个人信息</el-dropdown-item>
                <el-dropdown-item command="admin" v-if="userInfo.roles === 'admin'">管理中心</el-dropdown-item>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>

        <div class="navigation-box float-right">
          <NuxtLink to="/">
            <span><i class="sob_blog sobhome"></i> 首页</span>
          </NuxtLink>
          <NuxtLink to="/about">
            <span><i class="sob_blog sobabout_line"></i> 关于</span>
          </NuxtLink>
          <NuxtLink to="/link">
            <span><i class="sob_blog soblink"></i> 友链</span>
          </NuxtLink>
        </div>
      </div>
      <Nuxt/>
      <div class="blog-footer">
        <div class="copy-right-box">
          <p>
            Copyright ©
            <a href="/">
              HALO博客
            </a>
            (2021-{{ year }})

          </p>
        </div>
        <div>
			<a href="/about" target="_blank">
				<span>关于我们</span>
			</a>
           |
		   <a href="" target="_blank">
			<span>联系我们</span>
		   </a>
		   |
		   <a href="/link" target="_blank">
		   	<span>友情链接</span>
		   </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import * as api from '@/api/api';

export default {
  data() {
    return {
      year: '',
      userInfo: null,
      redirectPath: '',
      config: {
        color: '0,0,255',
        opacity: 0.8,
        zIndex: -2,
        count: 100
      }
    }
  },
  methods: {
    handlerCommend(commend) {
      if (commend === 'logout') {
        api.logout().then(result => {
          if (api.SUCCESS_CODE === result.code) {
            this.$message.success(result.message);
            this.userInfo = null;
            location.href = '/';
          }
        })
      } else if (commend === 'admin') {
        //TODO:
      } else if (commend === 'userInfo') {
        location.href = '/userInfo'
      }
    },
    checkToken() {
      api.checkToken().then(result => {
        let loginTip = document.getElementById('login-tips-text-box');
        let userInfoBox = document.getElementById('user-info-box');
        if (api.SUCCESS_CODE === result.code) {
          this.userInfo = result.data;
          // 显示用户信息
          if (userInfoBox) {
            userInfoBox.style.display = 'block';
          }
        } else {
          // 显示登录按钮
          if (loginTip) {
            loginTip.style.display = 'block';
          }
        }
      })
    }
  },
  mounted() {
		// console.log(this.$store.state.currentActivityTab);
		// this.$store.commit("setCurrentActivityTab","about");
		// console.log(this.$store.state.currentActivityTab);
    if (this.redirectPath !== '?redirect=' + location.href
      && this.$route.path !== '/'
      && this.$route.path !== '/login'
      && this.$route.path !== '/register'
      && this.$route.path !== '/forget-password') {
      this.redirectPath = '?redirect=' + location.href;
    }
    this.year = new Date().getFullYear();
    this.checkToken()
  }
}
</script>
<style>
.blog-footer a:hover{
	color: red;
	font-size: 16px;
	font-weight: 600;
}
.blog-footer a{
	text-decoration: none;
	color: #737F90;
}
#area{
  /*background: url("../image/38.jpg") no-repeat center center;;*/
  /*background-size: cover;*/
}
.user-name {
  cursor: pointer;
}

.user-name span {
  color: #737F90;
  font-size: 16px;
  font-weight: 600;
}

.user-avatar img {
  width: 33px;
  height: 33px;
  border-radius: 50%;
  margin-right: 5px;
  vertical-align: middle;
}

.el-message {
  min-width: 0 !important;
}

.default-border-radius {
  border-radius: 4px;
}

.navigation-box span:hover, .login-tips-text-box span:hover {
  color: red;
}

.navigation-box span {
  margin-right: 20px;
  color: #737F90;
  font-size: 18px;
  cursor: pointer;
}

.navigation-box {
  font-size: 20px;
  font-weight: 600;
}

.navigation-box {
  font-size: 16px;
  font-weight: bold;
}

.login-tips-text-box span {
  margin-right: 10px;
  cursor: pointer;
}

.login-tips-text-box {
  color: #737F90;
  font-size: 16px;
  font-weight: bold;
}

.logo-box .logo {
  color: #737F90 !important;
  font-size: 24px;
  font-weight: 600;
}

a {
  text-decoration: none;
}

.copy-right-box {
  margin-bottom: 10px;
}

.blog-footer {
  color: #737F90;
  text-align: center;
  padding-bottom: 30px;
}

* {
  padding: 0;
  margin: 0;
}

body {
  background: #F2F2F9;
  background: url("../image/38.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
}

.blog-header {
  line-height: 30px;
  margin-top: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 10px;
  border-radius: 4px;
}

#blog-box {
  width: 1140px;
  margin: 0 auto;
}

.float-left {
  float: left;
}

.float-right {
  float: right;
}

.clear-fix {
  overflow: hidden;
  zoom: 1;
}
</style>

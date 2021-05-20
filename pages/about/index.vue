<template>
  <div class="about-page-box">
	  <div class="about-box">
		  <el-tabs v-model="activeName">
		      <el-tab-pane label="关于网站" name="first">
				<p>
					HALO博客创立于2021年04月22日。HALO博客是一个学习编程的社区网站。
					你可以在这里学习、写博客、写笔记、分享经验。
					你可以遇到志同道合的人，收获知识、经验与朋友。
				</p>
			  </el-tab-pane>
		      <el-tab-pane label="尚未开发" name="second">
				  <img src="../../image/TODO.png" />
			  </el-tab-pane>
		    </el-tabs>
	  </div>
  </div>
</template>

<script>
export default {
    data() {
      return {
        activeName: 'first'
      };
    },
    methods: {
    }
  };
</script>

<style>
.about-box img{
	margin-left: 80px;
}
.about-box .el-tabs__content{
	padding-left: 15px;
}
.about-page-box{
	width: 1140px;
	background-color: rgba(255, 255, 255, 0.9);
	margin-top: 20px;
	margin-bottom: 20px;
	border-radius: 4px;
}
.about-box{
	padding: 20px;
}
.about-box .el-tabs__item.is-active{
	color: red;
}
.about-box .el-tabs__active-bar{
	background-color: red;
}
.about-box .el-tabs__item:hover{
	color: red;
}
</style>

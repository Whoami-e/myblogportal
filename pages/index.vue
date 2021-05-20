<template>
  <div id="index-page-box" class="index-page-box clear-fix">
	<el-backtop>
    </el-backtop>
    <div id="index-left-part" class="index-left-part default-border-radius float-left">
      <div class="index-left-user-info">
        <div class="user-avatar">
          <img :src="userInfo.avatar">
        </div>
        <div class="user-name">
          <span v-text="userInfo.userName"></span>
        </div>
        <div class="user-sign">
          <span v-text="userInfo.sign"></span>
        </div>
      </div>
      <div class="left-user-self-link">
        <span class="sob_blog sobwechat"></span>
        <span class="sob_blog sobgithub"></span>
        <span class="sob_blog sobbilibili-line"></span>
      </div>
      <div class="left-categories-box">
        <div :class="currentCategoryId===item.id?'category-item-active default-border-radius':'category-item default-border-radius'" v-for="(item, index) in categories" :key="index">
          <span v-text="item.name" @click="listArticlesByCategoryId(item)"></span>
        </div>
      </div>
    </div>
    <div id="index-center-part" class="index-center-part default-border-radius float-left">
      <!--轮播图-->
      <div class="loop-box">
        <el-carousel :interval="6000" arrow="hover">
          <el-carousel-item v-for="(item, index) in loop" :key="index">
            <a :href="item.targetUrl">
              <img :src="item.imageUrl">
            </a>
          </el-carousel-item>
        </el-carousel>
      </div>
      <!--置顶文章-->
      <div class="top-article-box default-border-radius">
        <div class="article-item" v-for="(item, index) in topArticles" :key="index">
          <el-card>
            <!--            <img :src="'http://localhost:8080/portal/image/'+ item.cover">-->
            <div class="article-title" style="padding: 14px">
              <span style="font-size: 16px;font-weight: 600;">
                <el-tag style="margin-right: 10px" effect="dark" type="danger">置顶</el-tag>
                {{ item.title }}
              </span>
            </div>
            <div class="article-summary">
              <span style="margin-left: 12px;font-size: 16px;
              font-weight: 500;color: #999999;">{{ item.summary }}</span>
            </div>
            <div class="article-info" style="margin-left: 12px;margin-top: 10px">
              <span style="color:#999999;margin-right: 3px" class="sob_blog sobview"></span>
              <span style="color:#999999;margin-right: 10px">{{ item.viewCount }}</span>
              <span style="color:#999999;margin-right: 3px" class="el-icon-date"></span>
              <span style="color:#999999;">{{ formatDate(item.createTime) }}</span>
              <a :href="'/article/' + item.id">
                <span class="float-right read-more" style="color:#999999;margin-right: 10px;cursor: pointer;">阅读全文</span>
              </a>
            </div>
          </el-card>
        </div>
      </div>

      <!--文章-->
      <div class="last-articles-box">
        <div class="article-item" v-for="(item, index) in articles" :key="index">
          <el-card>
            <img :src="'/portal/image/'+ item.cover">
            <div class="article-title" style="padding: 14px">
              <span style="font-size: 16px;font-weight: 600;">
                <el-tag class="el-icon-thumb" style="margin-right: 10px" effect="dark" type="success" ></el-tag>
                {{ item.title }}
              </span>
            </div>
            <div class="article-summary">
              <span style="margin-left: 12px;font-size: 16px;
              font-weight: 500;color: #999999;">{{ item.summary }}</span>
            </div>
            <div class="article-info" style="margin-left: 12px;margin-top: 10px">
              <span style="color:#999999;margin-right: 3px" class="sob_blog sobview"></span>
              <span style="color:#999999;margin-right: 10px">{{ item.viewCount }}</span>
              <span style="color:#999999;margin-right: 3px" class="el-icon-date"></span>
              <span style="color:#999999;">{{item.createTime | formatDate('yyyy-MM-dd')}}</span>
              <a :href="'/article/' + item.id">
                <span class="float-right read-more" style="color:#999999;margin-right: 10px;cursor: pointer;">阅读全文</span>
              </a>
            </div>
          </el-card>
        </div>
      </div>
      <div class="article-page-navigation-bar">
        <el-pagination
          background
          layout="prev, pager, next"
          @current-change="onPageChange"
          :current-page="pageNavigation.currentPage"
          :page-size="pageNavigation.pageSize"
          :total="pageNavigation.totalCount">
        </el-pagination>
      </div>
    </div>
    <div id="index-right-part" class="index-right-part float-left">

      <!--搜索-->
      <div class="right-card">
        <div class="card-search">
          搜索
        </div>
        <div class="card-content">
          <el-input
            @keyup.enter.native="toSearchPage"
            size="medium"
            placeholder="有什么想搜索吗？"
            prefix-icon="el-icon-search"
            v-model="keyword">
          </el-input>
        </div>
      </div>

      <!--标签-->
      <div class="right-card">
        <div class="card-search">
          热门标签
        </div>
        <div class="card-content">
          <div class="labels-list-box">
            <div id="app">
              <wordcloud
                :data="defaultWords"
                :margin="margin"
                :rotate="rotate"
                :fontSize="fontSize"
                nameKey="name"
                valueKey="count"
                :showTooltip="false"
                :wordClick="wordClickHandler">
              </wordcloud>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '../api/api'
import * as dateUtils from '@/utils/date'

export default {
  data(){
    return {
      fontSize: [16, 30],
      margin: {top: 0, right: 0, bottom: 0, left: 0 },
      rotate: {from: -10, to: 10, numOfOrientation: 20 },
      keyword: '',
      defaultWords: []
    }
  },
  async asyncData({params}) {
    let userInfoRes = await api.getAdminInfo();
    let categoriesRes = await api.getCategories();
    let loopRes = await api.getLooper();
    let topArticleRes = await api.getTopArticle();
    let articleRes = await api.getArticles('',1, 10);
	// console.log(articleRes)
    let pageNavigation = {
      currentPage: articleRes.data.pageNum,
      totalCount: articleRes.data.total,
      pageSize: articleRes.data.pageSize
    }
    let tempCategories = [];
    tempCategories.push({
      name: '全部分类',
      id: ''
    })
    tempCategories = tempCategories.concat(categoriesRes.data);
    return {
      pageNavigation: pageNavigation,
      articles: articleRes.data.list,
      topArticles: topArticleRes.data,
      loop: loopRes.data,
      categories: tempCategories,
      userInfo: userInfoRes.data,
      currentCategoryId: ''
    };

  },
  mounted() {
    this.getLabels();

    this.onWindowScroll();
    window.addEventListener('scroll', this.onWindowScroll);
    let that = this;
    window.onresize = function () {
      that.onWindowScroll();
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onWindowScroll);
  },
  methods: {
    //搜索
    toSearchPage(){
      //内容为空
      this.keyword = this.keyword.trim();
      if (this.keyword === '') {
        this.$message.error('请输入搜索内容！');
        return;
      }

      //跳转到搜索页面
      // this.$router.push({
      //   path: '/search',
      //   query:{
      //     keyword: encodeURIComponent(this.keyword),
      //     page: 1,
      //     size: 10,
      //     sort: 0,
      //     categoryId: ''
      //   }
      // })
       location.href = '/search?keyword='+encodeURIComponent(this.keyword);
    },
    //根据分类id获取文章列表
    listArticlesByCategoryId(item){
      if (this.currentCategoryId === item.id) {
        return;
      }
      //重置页码
      this.pageNavigation.currentPage = 1;
      this.currentCategoryId = item.id;
      api.getArticles(this.currentCategoryId,this.pageNavigation.currentPage,this.pageNavigation.pageSize)
        .then(result =>{
          this.handleArticleResult(result);
        })
    },
    onWindowScroll(){
      let scrolledTop = document.documentElement.scrollTop;
      let scrolledLeft = document.documentElement.scrollLeft;
      let centerPart = document.getElementById('index-center-part');
      let parentPart = document.getElementById('index-page-box');
      //处理left-part的顶部
      let leftPart = document.getElementById('index-left-part');
      if (leftPart && centerPart && parentPart) {
        let baseTop = centerPart.offsetTop;
        if (scrolledTop <= baseTop) {
          leftPart.style.top = (baseTop - scrolledTop) + 'px';
        } else {
          leftPart.style.top = '10px';
        }
      }

      //处理left-part的左滑动
      if (scrolledLeft > 0) {
        leftPart.style.left = -scrolledLeft + 'px';
      } else {
        leftPart.style.left = parentPart.offsetLeft + 'px';
      }
			
	  //处理right-part的顶部
	  let rightPart = document.getElementById('index-right-part');
	  if (rightPart && centerPart && parentPart) {
	    let baseTop = centerPart.offsetTop;
	    if (scrolledTop <= baseTop) {
		  rightPart.style.top = (baseTop - scrolledTop) + 'px';
	    } else {
		  rightPart.style.top = '10px';
	    }
	  }
	  
	  //处理rigth-part的左滑动
	  if (scrolledLeft > 0) {
	    rightPart.style.left = -scrolledLeft + 'px';
	  } else {
	    rightPart.style.left = parentPart.offsetLeft + 'px';
	  }
    },
    // 获取标签
    getLabels(){
      api.getLabels(20).then(result =>{
        if (result.code === api.SUCCESS_CODE) {
          this.defaultWords = result.data.list;
        }
      })
    },
    wordClickHandler(name) {
      location.href = '/search?keyword='+encodeURIComponent(name);
    },
    handleArticleResult(result){
      if (result.code === api.SUCCESS_CODE) {
        this.articles = result.data.list;
        //回到顶部
        let topHeader = document.getElementById('blog-header');
        if (topHeader) {
          topHeader.scrollIntoView({
            block: 'start',
            behavior: 'smooth'
          })
        }
        this.pageNavigation.currentPage = result.data.pageNum;
        this.pageNavigation.totalCount = result.data.total;
        this.pageNavigation.pageSize = result.data.pageSize;
      } else {
        this.$message.error(result.message)
      }
    },
    formatDate(dateStr) {
      let date = new Date(dateStr);
      return dateUtils.formatDate(date, 'yyyy-MM-dd')
    },
    onPageChange(page){
      api.getArticles(this.currentCategoryId, page,this.pageNavigation.pageSize).then(result => {
        this.handleArticleResult(result);
      })
    }
  }
}
</script>

<style>
.last-articles-box .article-item{
  border-radius: 4px;
}
.index-right-part .el-input__inner{
  background-color: rgba(255, 255, 255, 0.9);
}
.last-articles-box .el-card{
  background-color: rgba(255, 255, 255, 0.9);
}
#index-left-part{
  position: fixed;
  top: 91px;
}
#index-right-part{
  position: fixed;
  top: 91px;
}
.wordCloud .text {
  cursor: pointer;
}
.labels-list-box .wordCloud{
  width: 100%;
  height: 240px;
}
.index-right-part .right-card{
  margin-bottom: 20px ;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
}
.index-right-part .right-card .card-search{
  padding-bottom: 10px;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #999999;
  border-bottom: 1px solid #DCDCDC;
}
.article-page-navigation-bar {
  margin-top: 10px;
  text-align: right;
}

.article-page-navigation-bar .el-pagination.is-background .el-pager li {
  background-color: rgba(255, 255, 255, 0.9);
}

.last-articles-box .el-card img {
  height: 300px;
  width: 100%;
  object-fit: cover;
}

.last-articles-box .article-info .read-more {
  color: red;
}

.top-article-box .el-card__body {
  padding: 0;
}

.last-articles-box .el-card__body {
  padding: 0;
}

.article-summary {
  padding-bottom: 10px;
  border-bottom: 1px solid #DCDCDC;
  border-radius: 0;
}

.top-article-box .el-card {
  margin-top: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #DCDCDC;
  border-radius: 0;
  background-color: rgba(255, 255, 255, 0.9);
}

.last-articles-box .el-card {
  margin-top: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #DCDCDC;
  border-radius: 0;
}

.top-article-box .el-card img {
  height: 300px;
  width: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.loop-box {
  margin-bottom: 30px;
}

.loop-box img {
  height: 300px;
  width: 100%;
  border-radius: 4px;
}

.left-categories-box .category-item:hover,
.left-categories-box .category-item-active{
  background: #F5F5F5;
  color: red;
}

.left-categories-box .category-item,
.left-categories-box .category-item-active{
  padding: 10px 5px;
  cursor: pointer;
  margin-left: 15px;
  margin-right: 15px;
}

.left-categories-box {
  margin-top: 20px;
  cursor: pointer;
  text-align: center;
  color: #999999;
}

.left-user-self-link {
  text-align: center;
  margin-top: 20px;
}

.left-user-self-link span {
  margin-right: 15px;
  margin-left: 15px;
  font-size: 25px;
  color: #CACACA;
  font-weight: 600;
  cursor: pointer;
}

.left-user-self-link span:hover {
  color: #909090;
}

.index-left-user-info {
  margin-top: 20px;
  text-align: center;
}

.index-left-user-info .user-avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.index-left-user-info .user-name {
  margin-top: 14px;
  color: #606060;
  font-size: 18px;
}

.index-left-user-info .user-sign {
  margin-top: 14px;
  color: #CACACA;

}

.index-page-box {
  margin-top: 20px;
  margin-bottom: 20px;
}

.index-right-part{
  width: 240px;
  margin-left: 900px;
}

.index-left-part {
  margin-right: 10px;
  width: 220px;
  background-color: rgba(255, 255, 255, 0.9);
}


.index-center-part {
  width: 640px;
  margin-left: 240px;
  margin-right: 10px;
}
</style>

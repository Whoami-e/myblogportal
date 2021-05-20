<template>
  <div class="article-page-box clear-fix" id="article-box">
    <el-backtop>
    </el-backtop>
    <div class="article-left-part float-left">

	  <div class="loading" id="loading" v-show="isArticleProcessing">
	  	<div id="content-loading" class="content-loading">
	  		<div class="loading-title clear-fix"></div>
	  		<div class="loading-content">
	  			<div class="loading-text"></div>
	  			<!-- <div class="loading-text animation-delay"></div> -->
	  		</div>
	  		<div class="loading-info clear-fix">
	  			<div class="loading-type"></div>
	  			<div class="loading-avatar"></div>
	  			<div class="loading-nickname"></div>
	  		</div>
	  	</div>
	  </div>
      <!--文章标题-->
      <div class="article-title" v-show="!isArticleProcessing">
        <h2 v-text="articleRes.title"></h2>
      </div>
      <!--文章信息-->
      <div class="article-info" v-show="!isArticleProcessing">
        <img :src="articleRes.userAvatar"></img>
        <span class="article-username" v-text="articleRes.userName"></span>
        <span style="color: #909090;font-size: 15px;margin-right: 3px;">发表于</span>
        <span class="el-icon-date" style="color: #909090;font-size: 15px;"></span>
        <span style="color: #909090;font-size: 15px;margin-right: 3px;">{{ articleRes.createTime | formatDate('yyyy-MM-dd') }}</span>
        <span style="color: #909090;font-size: 15px;" class="sob_blog sobview"></span>
        <span style="color: #909090;font-size: 15px;">{{ articleRes.viewCount }}</span>
      </div>

      <!--文章标签-->
      <div class="article-label" v-show="!isArticleProcessing">
        <el-tag style="margin-right: 10px;" effect="light" v-for="(item, index) in articleRes.labelList" :key="index">
          {{item}}
        </el-tag>
      </div>
      <!--文章内容-->
      <div v-show ="!isArticleProcessing" id="article-content" class="article-content" v-html="articleRes.content">
      </div>

      <!--文章评论-->
      <div class="article-comment">
        <div class="article-comment-title">
          文章评论
        </div>
        <!--发送评论-->
        <div class="article-comment-post">
          <el-input
            @focus="checkLogin"
            type="textarea"
            rows="4"
            placeholder="请输入评论内容!"
            v-model="comment.content"
            maxlength="256"
            show-word-limit>
          </el-input>
          <el-button type="primary" size="mini" @click="postComment" class="float-right">发表</el-button>
        </div>
        <!--评论列表-->
        <div id="article-comment-list" class="article-comment-list" v-for="(item, index) in commentRes" :key="index">
          <div class="comment-userinfo">
            <img :src="item.userAvatar"></img>
            <span class="comment-username" v-text="item.userName"></span>
            <span style="color: #909090;font-size: 15px;margin-right: 3px;">发表于</span>
            <span class="el-icon-date" style="color: #909090;font-size: 15px;"></span>
            <span style="color: #909090;font-size: 15px;margin-right: 3px;">{{ item.createTime | formatDate('yyyy-MM-dd') }}</span>
            <el-tag v-if="item.state === '2'" type="danger" size="mini">置顶</el-tag>
          </div>
          <div class="article-comment-reply" v-if="item.parentContent !== null">
            <span>回复：{{item.parentContent}}</span>
          </div>
          <div class="article-comment-content clear-fix" v-if="item.parentContent !== null">
            <span class="el-icon-bottom-right float-left">  {{item.content}}</span>
            <span class="float-right reply" @click="replyComment(item,index)">回复</span>
          </div>
          <div class="article-comment-content clear-fix" v-if="item.parentContent === null">
            <span class="float-left">  {{item.content}}</span>
            <span class="float-right reply" @click="replyComment(item,index)">回复</span>
          </div>
		<div class="reply-input" style="display: none;" :id="'sub_input_'+index">
			<el-input
			  @focus="checkLogin"
			  type="textarea"
			  rows="2"
			  :placeholder="placeholder"
			  v-model="ReplyComment.content"
			  maxlength="256"
			  show-word-limit>
			</el-input>
			<el-button type="primary" size="mini" @click="replyUserComment" class="float-right">回复</el-button>
		</div>
        </div>
<!--        <div class="article-comment-more" v-if="!isLastPageComment"  @click="loadMoreComment">-->
<!--          <span style="cursor: pointer">加载更多评论>></span>-->
<!--        </div>-->
      </div>
    </div>
    <div id="article-right-part" class="article-right-part float-left">
      <div class="article-toc-title">
        文章目录
      </div>
      <div id="article-toc" class="article-toc">

      </div>
    </div>
  </div>
</template>

<script>
import TOC from '@/utils/headerLineHandler';
import hljs from 'highlight.js';
import 'highlight.js/styles/darcula.css';
import * as api from '@/api/api';
import * as dateUtils from "@/utils/date";
let lastInputBox = null;
export default {
  data(){
    return{
		isArticleProcessing: true,
		ReplyComment:{
		  articleId: '',
		  content: '',
		  parentContent: null
		},
      comment:{
        articleId: '',
        content: '',
        parentContent: null
      },
      page: 1,
      size: 10,
	  placeholder: ''
    }
  },
  async asyncData({params}){
    let articleResult = await api.getArticlesDetail(params.id);
    let commentResult = await api.getComment(articleResult.data.id,1,10);
    // console.log(commentResult.data.list)
    return{
      articleRes: articleResult.data,
      commentRes: commentResult.data.list,
      isLastPageComment: commentResult.data.isLastPage
    }
  },
  methods:{
    loadMoreComment(){
      this.page++;
      api.getComment(this.articleRes.id,this.page,this.size).then(result=>{
        console.log(result)
        if (result.code === api.SUCCESS_CODE) {
          this.commentRes = this.commentRes.concat(result.data.list);
          this.isLastPageComment = result.data.isLastPage;
        }
      }).catch(error =>{
        console.log(error);
      })
    },
	replyUserComment(){

		if (this.ReplyComment.content === '') {
		  this.$message.error('请输入评论内容！');
		  return;
		}

		this.ReplyComment.articleId = this.articleRes.id;

		api.postComment(this.ReplyComment).then(result =>{
		  if (result.code === api.SUCCESS_CODE) {
		    this.$message.success(result.message);
		    this.ReplyComment.content = '';
		    this.ReplyComment.parentContent = null;
			if(lastInputBox){
				lastInputBox.style.display = 'none';
			}
		    this.getComment(1);
		  } else {
		    this.$message.error(result.message);
		  }
		})

		let top = document.getElementById('article-comment-list');
		if(top){
			top.scrollIntoView({
				block: 'start',
				behavior: 'smooth'
			})
		}
	},
    replyComment(item,index){
		this.ReplyComment.content = '';
		this.ReplyComment.parentContent = null;
		this.placeholder = '回复@'+item.userName;
      this.ReplyComment.parentContent = item.content;
	  let subInputBox = document.getElementById('sub_input_'+index);
	  if(subInputBox){
		  if(lastInputBox){
			  lastInputBox.style.display = 'none';
		  }
		  lastInputBox = subInputBox;
		  subInputBox.style.display = 'block';
	  }
    },
    getComment(page){
      api.getComment(this.articleRes.id,page,10).then(result=>{
        this.commentRes = result.data.list;
        this.page = page;
        //TODO:处理页码
      })
    },
    checkLogin(){
      api.checkToken().then(result =>{
        if (result.code === 40000) {
          this.$message.error('尚未登录，无法评论！');
          location.href = '/login?redirect='+location.href;
        }
      })
    },
    postComment(){

      let tokenIndex = document.cookie.indexOf('my_blog_token');
      if (tokenIndex === -1) {
        this.$message.error('尚未登录，无法评论！');
        location.href = '/login?redirect='+location.href;
        return;
      }

      if (this.comment.content === '') {
        this.$message.error('请输入评论内容！');
        return;
      }

      this.comment.articleId = this.articleRes.id;

      api.postComment(this.comment).then(result =>{
        if (result.code === api.SUCCESS_CODE) {
          this.$message.success(result.message);
          this.comment.content = '';
          this.comment.parentContent = null;
          this.getComment(1);
        } else {
          this.$message.error(result.message);
        }
      })

    },
    formatDate(dateStr) {
      let date = new Date(dateStr);
      return dateUtils.formatDate(date, 'yyyy-MM-dd')
    },
    onWindowScroll(){
      let toc = document.getElementById('article-toc');
      let parentPart = document.getElementById('article-box');
      if (toc) {
        let bottomOfToc = toc.offsetTop + toc.offsetHeight;
        let scrollTop = document.documentElement.scrollTop;
        let scrollLeft = document.documentElement.scrollLeft;

        // 上下
        if (scrollTop >= bottomOfToc) {

          toc.style.position = 'fixed';
          toc.style.top = '10px';
          toc.style.width = '240px';
        } else {
          toc.style.position = '';
          toc.style.top = '';
        }

        // 左右
        if (scrollLeft > 0) {
          toc.style.left =parentPart.offsetLeft + parentPart.offsetWidth - toc.offsetWidth -scrollLeft + 'px';
        } else {
          // 正常
          toc.style.left = parentPart.offsetLeft + parentPart.offsetWidth - toc.offsetWidth + 'px';
        }
      }
    }
  },
  mounted() {
    hljs.initHighlighting();
    // 监听滚动
    this.onWindowScroll();
    window.addEventListener('scroll', this.onWindowScroll);

    new TOC({
      contentEl: 'article-content',
      catalogEl: 'article-toc',
      selector: ['h1','h2','h3','h4','h5','h6']
    })

	let that = this;
	let timer = setInterval(function(){
		that.isArticleProcessing = false;
		clearInterval(timer);
	},1000)
  },
  beforeDestroy() {
    window.removeEventListener('scroll',this.onWindowScroll);
  }
}
</script>

<style>

.loading{
	margin-bottom: 10px;
}
.loading .loading-info .loading-nickname {
    width: 100px;
    margin-left: 50px;
    height: 20px;
    background: #eaeaea;
}
.loading .loading-info .loading-avatar {
    border-radius: 50%;
    width: 20px;
    height: 20px;
    background-color: #eaeaea;
    margin-left: 10px;
    float: left;
}
.loading .loading-content .animation-delay {
    -webkit-animation: loading 1s ease-in-out -.5s infinite;
    animation: loading 1s ease-in-out -.5s infinite;
}
.loading .loading-content .loading-text {
    width: 100%;
    height: 16px;
    margin: 0 0 10px;
    background-color: #eaeaea;
    -webkit-animation: loading 1s ease-in-out infinite;
    animation: loading 1s ease-in-out infinite;
}
.loading .loading-info {
    display: inline-block;
    width: 100%;
    height: 30px;
}
.loading .loading-content {
    margin-left: 10px;
    margin-top: 10px;
    width: 800px;
}
.loading .loading-title {
    width: 200px;
    height: 24px;
    background-color: #eaeaea;
}
.loading .content-loading {
    padding: 10px;
    background: #f3f3f3;
    margin-top: 5px;
}
@keyframes loading{
	0% {
	    width: 60%;
	}
	50% {
	    width: 100%;
	}

	100% {
	    width: 60%;
	}
}
.article-comment-post .el-textarea, .reply-input .el-textarea{
  margin-bottom: 10px;
}
.article-comment-post, .reply-input{
  margin-bottom: 20px;
  padding-right: 20px;
  padding-left: 20px;
}
.article-comment-more{
  text-align: center;
  color: #666666;
}
.reply:hover, .article-comment-more > span:hover{
  color: red;
  font-size: 16px;
  font-weight: 600;
}
.reply{
  color: #999999;
  cursor: pointer;
}
.article-comment-list{
  margin-bottom: 10px;
}
.article-comment-content{
  margin-left: 25px;
  font-size: 14px;
  font-weight: 400;
  padding-left: 20px;
  padding-bottom: 10px;
  padding-right: 20px;
  color: #999999;
  border-bottom: 1px solid #DCDCDC;
}
.article-comment-reply{
  margin-left: 27px;
  font-size: 16px;
  margin-bottom: 10px;
  font-weight: 400;
  color: crimson;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
.comment-userinfo {
  margin-left: 20px;
  padding-bottom: 10px;
}
.article-comment-title{
  padding-bottom: 10px;
  margin: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #999999;
  border-bottom: 1px solid #DCDCDC;
}
#article-toc{
  max-height: 400px;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.9);
}
.cl-link-active {
  color: red !important;
  font-size: 16px;
  font-weight: 600;
}
.article-toc .cl-wrapper li > span:hover{
  color: red;
  font-size: 16px;
  font-weight: 600;
}
.article-toc .cl-wrapper li{
  cursor: pointer;
  margin-bottom: 5px;
  list-style: none;
}
.article-toc .cl-wrapper ul{
  margin-left: 10px;
  padding-left: 10px;
}
.article-toc .cl-wrapper{
  width: 90%;
  padding-bottom: 20px;
  padding-top: 10px;
}
.article-toc-title{
  padding-bottom: 10px;
  margin: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #999999;
  border-bottom: 1px solid #DCDCDC;
}
.article-toc{
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
}
.article-content p img{
  cursor: pointer;
}
.article-content pre code{
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  word-break: break-all;
}
.article-content td {
  border-bottom-width: 1px;
  padding-bottom: 5px;
  padding-top: 5px;
  padding-left: 5px;
}
.article-content td, .article-content th {
  border-bottom: 3px solid #ddd;
  border-right: 1px solid #eee;
}
.article-content tbody{
  display: table-row-group;
  vertical-align: middle;
  border-color: inherit;
}
.article-content th{
  padding-bottom: 10px;
  font-weight: 700;
}
.article-content tr{
  display: table-row;
  vertical-align: inherit;
  border-color: inherit;
}
.article-content thead{
  display: table-header-group;
  vertical-align: middle;
  border-color: inherit;
}
.article-content table{
  margin: 20px 0;
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  border: 1px solid #ddd;
  font-size: 14px;
  table-layout: fixed;
}
.article-content hr {
  margin: 30px 0;
  height: 3px;
  border: none;
  background-color: #ddd;
  background-image: repeating-linear-gradient(
    -45deg
    , #fff, #fff 4px, transparent 4px, transparent 8px);
}
.article-content blockquote ul{
  margin-left: 50px;
}
.article-content blockquote{
  padding: 0 15px;
  color: #666666;
  border-left: 4px solid #ddd;
}
.article-content p{
  padding: 10px 0;
}
.article-content ol{
  margin-left: 30px;
}
.article-content h6{
  color: #000;
  line-height: 30px;
}
.article-content h5{
  color: #000;
  line-height: 32px;
}
.article-content h4{
  color: #000;
  line-height: 34px;
}
.article-content h3{
  color: #000;
  line-height: 36px;
}
.article-content h2{
  color: #000;
  line-height: 38px;
}
.article-content h1{
  color: #000;
  line-height: 40px;
}
.article-content img{
  max-width: 820px;
}
.article-content{
  margin-top: 20px;
  border-bottom: 1px solid #DCDCDC;
  padding-bottom: 20px;
  margin-bottom: 20px;
}
.article-label{
  margin-left: 36px;
  margin-top: 20px;
}
.article-info span{
  line-height: 28px;
}
.article-info img, .article-comment img{
  vertical-align: middle;
  border-radius: 50%;
  width: 28px;
  height: 28px;
}
.article-info{
  margin-top: 20px;
}
.article-username, .comment-username{
  color: #666;
  font-size: 16px;
  margin-left: 5px;
  margin-right: 5px;
  font-weight: 600;
}
.article-left-part .article-cover .el-image{
  height: 200px;
  width: 800px;
}
.article-left-part .article-cover{
  margin-bottom: 20px;
  margin-top: 20px;
}
.article-page-box{
  margin-top: 20px;
  margin-bottom: 20px;
}
.article-left-part{
  background-color: rgba(255, 255, 255, 0.9);
  width: 840px;
  border-radius: 4px;
  margin-right: 20px;
  padding: 20px;
}
.article-right-part{
  width: 240px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.9);
}
</style>

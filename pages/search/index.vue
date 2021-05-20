<template>
  <div class="search-box clear-fix">
    <div class="search-result-box float-left">
      <!--      <div class="search-input-box">-->

      <!--      </div>-->
      <!--      &lt;!&ndash;条件&ndash;&gt;-->
      <!--      <div class="search-condition-box">-->

      <!--      </div>-->
      <!--结果-->
      <div class="search-left-part">
        <!--结果条数-->
        <div class="search-result-count">
          找到约<span v-text="searchResult.totalCount"></span>条结果
        </div>
        <div class="search-result-list" style="padding-bottom: 10px" v-if="searchResult.contents.length !== 0">
          <div class="search-result-item" v-for="(item, index) in searchResult.contents" :key="index">
            <!--文章标题-->
            <a :href="'/article/' + item.id">
              <div class="result-title" v-html="item.blogTitle"></div>
            </a>

            <!--内容-->
            <div class="result-content" v-html="item.blogContent"></div>
            <!--其他信息-->
            <div class="result-info">
              <span style="color:#999999;margin-right: 3px" class="sob_blog sobview"></span>
              <span style="color:#999999;margin-right: 10px">{{ item.blogViewCount }}</span>
              <span style="color:#999999;margin-right: 3px" class="el-icon-date"></span>
              <span style="color:#999999;"> {{ item.blogCreateTime | formatDate('yyyy-MM-dd') }}</span>
            </div>
          </div>
        </div>
        <!--内容为空-->
        <div class="search-result-empty" v-else>
          <img src="../../image/isEmpty.png">
        </div>
      </div>

      <!--分页-->
      <div class="search-page clear-fix">
        <div class="search-pre float-left">
          <el-link v-if="isFirst" disabled>&lt;&lt;上一页</el-link>
          <el-link v-else :href="'/search?keyword='+keyword+'&pageNum='+(page-1)+'&pageSize='+size+'&sort='+sort+'&categoryId='+categoryId">&lt;&lt;上一页</el-link>
        </div>
        <div class="search-next float-right">
          <el-link v-if="isLast" disabled>下一页&gt;&gt;</el-link>
          <el-link v-else :href="'/search?keyword='+keyword+'&pageNum='+(page+1)+'&pageSize='+size+'&sort='+sort+'&categoryId='+categoryId">下一页&gt;&gt;</el-link>
        </div>
      </div>
    </div>
    <div class="search-right-part float-left">
      <!--搜索-->
      <div class="right-card">
        <div class="card-search">
          搜索
        </div>
        <div class="card-content">
          <el-input
            @keyup.enter.native="toSearch"
            size="medium"
            placeholder="有什么想搜索吗？"
            v-model="newKeyword"
            prefix-icon="el-icon-search">
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
import * as api from '@/api/api';
import * as dateUtils from "@/utils/date";

export default {
  data() {
    return {
      fontSize: [16, 30],
      margin: {top: 0, right: 0, bottom: 0, left: 0},
      rotate: {from: -10, to: 10, numOfOrientation: 20},
      defaultWords: [],
      newKeyword: ''
    }
  },
  asyncData({query}) {
    let categoryId = query.categoryId ? query.categoryId : '';
    let keyword = query.keyword ? query.keyword : '';
    let page = query.pageNum ? query.pageNum : 1;
    let size = query.pageSize ? query.pageSize : 10;
    let sort = query.sort ? query.sort : '';
    return api.getSearchContent(categoryId, keyword, page, size, sort).then(result => {
      return {
        keyword: keyword,
        page: parseInt(page),
        size: parseInt(size),
        sort: sort,
        categoryId: categoryId,
        searchResult: result.data,
        isFirst: result.data.first,
        isLast: result.data.last
      }
    });
  },
  methods: {
    //搜索
    toSearch(){
      //内容为空
      this.newKeyword = this.newKeyword.trim();
      if (this.newKeyword === '') {
        this.$message.error('请输入搜索内容！');
        return;
      }
      location.href = '/search?keyword='+encodeURIComponent(this.newKeyword);
    },
    wordClickHandler(name) {
      location.href = '/search?keyword='+encodeURIComponent(name);
    },
    formatDate(dateStr) {
      let date = new Date(dateStr);
      return dateUtils.formatDate(date, 'yyyy-MM-dd')
    },
    // 获取标签
    getLabels() {
      api.getLabels(20).then(result => {
        if (result.code === api.SUCCESS_CODE) {
          this.defaultWords = result.data.list;
        }
      })
    }
  }
  ,
  mounted() {
    this.getLabels()
  }
}
</script>
<style>
.search-result-empty{
  text-align: center;
}
.search-next:hover, .search-pre:hover {
  cursor: pointer;
  color: red;
}

.search-next-disable, .search-pre-disable {
  cursor: not-allowed;
}

.search-page {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 20px;
  width: 840px;
  margin-top: 20px;
}

.search-right-part .right-card {
  margin-bottom: 20px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
}

.search-right-part .right-card .card-search {
  padding-bottom: 10px;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #999999;
  border-bottom: 1px solid #DCDCDC;
}

.result-title {
  color: dodgerblue;
  font-size: 20px;
  line-height: 1.3;
  cursor: pointer;
  /*限制显示行数*/
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.result-content {
  color: #4d5156;
  line-height: 1.58;
  font-size: 14px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  line-height: 20px;
  height: 40px;
}

.search-result-count {
  color: #70757a;
  line-height: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #DCDCDC;
  margin-bottom: 10px;
  font-size: 16px;
}

.search-result-item {
  border-bottom: 1px solid #DCDCDC;
}

.result-title, .result-info, .result-content {
  margin-bottom: 10px;
}

.search-result-item {
  margin-bottom: 20px;
}

.search-condition-box {
  margin-bottom: 20px;
  background: red;
  width: 880px;
  height: 80px;
}

.search-input-box {
  height: 80px;
  width: 880px;
  background: aqua;
}

.search-box {
  margin-top: 20px;
  margin-bottom: 20px;
}

.search-left-part {
  background-color: rgba(255, 255, 255, 0.9);
  width: 840px;
  margin-right: 20px;
  padding-left: 20px;
  padding-right: 20px;
}

.search-right-part {
  width: 240px;
}
</style>

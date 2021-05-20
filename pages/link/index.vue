<template>
  <div class="link-page-box">
    <div class="link-title">
      友情链接
    </div>
    <div class="link-list-box clear-fix">
      <div class="link-item" v-for="(item, index) in linkList" :key="index">
        <a :href="item.url">
          <el-tooltip :content="item.name" placement="top">
            <img :src="item.logo">
          </el-tooltip>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/api'

export default {
  asyncData() {
    return api.getLinkList().then(result => {
      return {
        linkList: result.data
      }
    })
  }
}
</script>

<style>
.link-title{
  background-color: rgba(255, 255, 255, 0.9);
  text-align: center;
  font-size: 25px;
  color: #7f828b;
  margin-bottom: 10px;
}
.link-page-box {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 20px;
  margin-top: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.link-item img {
  width: 150px;
  height: 57px;
}

.link-item {
  float: left;
  border: 1px solid #dfdfdf;
  padding: 10px;
  margin: 10px;
  width: 233px;
  text-align: center;
  cursor: pointer;
}

.link-item:hover {
  border: 1px solid red;
}


</style>

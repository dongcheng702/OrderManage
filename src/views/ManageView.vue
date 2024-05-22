<!-- <template>
  <el-container style="min-height: 100vh;">
    <el-aside :width="sideWidth + 'px'"
      style="background-color: rgba(238, 241, 246, 0.981); box-shadow: 2px 0 6px rgb(0 21 41 / 35%);">
      <Aside />
    </el-aside>
    <el-container>
      <el-header style="border-bottom: 1px solid #ccc">
        <Header />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template> -->
<template>
  <el-container style="min-height: 100vh;">
    <el-aside :width="sideWidth + 'px'"
      style="background-color: rgba(238, 241, 246, 0.981); box-shadow: 2px 0 6px rgb(0 21 41 / 35%);">
      <Aside />
    </el-aside>
    <div class="background-container"></div> <!-- 新添加的背景图片容器 -->
    <el-container>
      <el-header style="border-bottom: 1px solid #ccc">
        <Header />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style>
.background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('../assets/7.png');
  background-size: cover;
  z-index: -2; /* 控制背景图片尺寸 */
  /* 其他样式 */
}
</style>

<script>

import Aside from '@/components/Aside.vue'
import Header from '@/components/Header.vue'
export default {
  name: 'ManageView',
  components: {
    Header,
    Aside
  },
  data() {
    return {
      sideWidth: 205,
    }
  }
}
</script>

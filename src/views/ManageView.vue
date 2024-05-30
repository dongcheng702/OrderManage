<template>
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
</template>

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

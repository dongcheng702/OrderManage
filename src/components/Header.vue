<template>
  <div
    style="text-align: left; font-size: 12px; line-height: 60px; display: flex"
  >
    <div style="flex: 1; font-size: 18px">
      <el-breadcrumb class="ml_10" separator="/" style="display: inline-block">
        <el-breadcrumb-item>画面 ：>>{{ pegeName }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </div>
</template>


<script>
export default {
  name: "Header",
  data() {
    return {};
  },
  props: {
    pegeName: String,
  },
  methods: {},
};
</script>
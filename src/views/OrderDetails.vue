<template>
  <!-- 使用 el-dialog 组件来创建对话框 -->
  <!-- 绑定本地变量 localVisible -->
  <el-dialog
    title="Edit User" 
    :visible="localVisible" 
    width="30%"
    @close="closeDialog"
  >
    <span>编辑用户内容...</span>
    <span slot="footer" class="dialog-footer"> <!-- 对话框底部 -->
      <el-button @click="closeDialog">Cancel</el-button> <!-- 取消按钮 -->
      <el-button type="primary" @click="confirmDialog">Confirm</el-button> <!-- 确认按钮 -->
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "OrderDetails",
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      localVisible: this.isVisible // 使用一个本地的 `data` 属性来存储初始的 isVisible 值
    };
  },
  watch: {
    isVisible(newVal) {
      this.localVisible = newVal; // 监听 `isVisible` 的变化，并更新 `localVisible`
    },
    localVisible(newVal) {
      this.$emit('update:isVisible', newVal); // 当 `localVisible` 变化时，触发 `update:isVisible` 事件通知父组件
    }
  },
  methods: {
    closeDialog() {
      this.localVisible = false; // 修改本地的 `data` 属性 `localVisible`
    },
    confirmDialog() {
      // 在这里处理确认逻辑
      this.localVisible = false; // 修改本地的 `data` 属性 `localVisible`
    }
  }
};
</script>

<template>
  <div style="text-align: center">
    <el-dialog
      @close="test"
      title="支払確定"
      :visible.sync="dialogTableVisible"
    >
      <el-form
        :label-position="labelPosition"
        label-width="100px"
        :model="formLabelAlign"
      >
        <el-form-item label="変更前金額">
          <el-input v-model="formLabelAlign.name"></el-input>
        </el-form-item>
        <el-form-item label="変更後金額">
          <el-input v-model="formLabelAlign.region"></el-input>
        </el-form-item>
        <el-form-item label="支払方法">
          <el-input v-model="formLabelAlign.type"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>




<script>
export default {
  name: "Payment",
  props: {
    dialogTableVisible: {
      type: Boolean,
    },
  },

  methods: {
    test() {
      this.$emit("update:dialogTableVisible", false);
    },
  },

  data() {
    return {
      labelPosition: "right",
      formLabelAlign: {
        name: "",
        region: "",
        type: "",
      },
    };
  },
};
</script>
<template>
  <!-- 使用 el-dialog 组件来创建对话框 -->
  <!-- 绑定本地变量 localVisible -->
  <div>
    <el-dialog
      :visible="isVisible"
      width="65%"
      @close="closeDialog"
      text-align:center
    >
      <template #title>
        <div style="text-align: center; width: 100%">注文明細</div>
      </template>
      <span>注文ID:{{ orderId }}</span>

      <el-table :data="tableData" style="width: 100%; margin-top: 10px">
        <el-table-column
          prop="productName"
          label="商品名"
          style="min-width: 16%"
        >
        </el-table-column>
        <el-table-column prop="origin" label="産地" style="min-width: 16%">
        </el-table-column>
        <el-table-column
          prop="specification"
          label="規格"
          style="min-width: 16%"
        >
        </el-table-column>
        <el-table-column
          prop="quantity"
          label="購入数量"
          style="min-width: 16%"
        >
        </el-table-column>
        <el-table-column prop="unitPrice" label="単価" style="min-width: 16%">
        </el-table-column>
        <el-table-column
          prop="totalPrice"
          label="単品合計金額"
          style="min-width: 16%"
        >
        </el-table-column>
      </el-table>
      <span
        >合計で{{ productTypeCount }}種類の商品を購入し、総額は{{
          amountSum
        }}円です。</span
      >
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "OrderDetails",
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tableData: [
        {
          productName: "商品1",
          origin: "中国",
          specification: "规格1",
          quantity: 10,
          unitPrice: 100,
          totalPrice: 1000,
        },
        {
          productName: "商品2",
          origin: "日本",
          specification: "规格2",
          quantity: 20,
          unitPrice: 200,
          totalPrice: 4000,
        },
      ],
    };
  },

  methods: {
    closeDialog() {
      console.log("closeDialog");
      this.$emit("update:isVisible", false);
    },
  },
};
</script>

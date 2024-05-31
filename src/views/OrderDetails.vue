<template>
  <!-- 使用 el-dialog 组件来创建对话框 -->
  <!-- 绑定本地变量 localVisible -->
  <div>
    <el-dialog
      :visible.sync="isVisible"
      width="65%"
      @close="closeDialog"
      text-align:center
    >
      <template #title>
        <div style="text-align: center; width: 100%">注文明細</div>
      </template>
      <span>注文ID:{{ orderNumber }}</span>

      <el-table :data="tableData" style="width: 100%; margin-top: 10px">
        <el-table-column
          prop="product_name"
          label="商品名"
          style="min-width: 16%"
        >
        </el-table-column>
        <el-table-column prop="origin" label="産地" style="min-width: 16%">
        </el-table-column>
        <el-table-column prop="standard" label="規格" style="min-width: 16%">
        </el-table-column>
        <el-table-column
          prop="quantity"
          label="購入数量"
          style="min-width: 16%"
        >
        </el-table-column>
        <el-table-column prop="unit_price" label="単価" style="min-width: 16%">
        </el-table-column>
        <el-table-column
          prop="item_total"
          label="単品合計金額"
          style="min-width: 16%"
        >
        </el-table-column>
      </el-table>
      <div style="text-align: right; width: 100%">
        合計で<el-tag size="small">{{ product_type_count }}</el-tag
        >種類の商品を購入し、総額は<el-tag size="small">{{ amount_sum }}</el-tag
        >円です。
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { EventBus } from "../eventBus";
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
      orderNumber: "",
      tableData: [],
      product_type_count: 0,
      amount_sum: 0,
    };
  },

  created() {
    EventBus.$on("sendOrderNumber", this.sendOrderId);
  },

  methods: {
    closeDialog() {
      console.log("closeDialog");
      this.$emit("update:isVisible", false);
    },
    sendOrderId(orderNumber) {
      console.log("sendOrderId", orderNumber);
      this.orderNumber = orderNumber;
      this.tableData = this.feachOrderDetails(orderNumber);
    },
    feachOrderDetails(orderNumber) {
      console.log("feachOrderDetails", orderNumber);
      this.request
        .get("/user/feach", { orderNumber })
        .then((response) => {
          console.log(JSON.stringify(response.data[0].amount_sum, null, 2));
          this.tableData = response.data;
          this.amount_sum = response.data[0].amount_sum;
          this.product_type_count = response.data[0].product_type_count;
        })
        .catch((error) => {
          console.error("Error fetching order details:", error);
        });
    },
  },
};
</script>

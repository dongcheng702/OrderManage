<template>
    <div>
        <div style="text-align: center;">
            <div style="display: inline-block; text-align: left; width: 50%;">
                <el-steps :active="active" finish-status="success">
                    <el-step title="商品選択"></el-step>
                    <el-step title="配送＆支払"></el-step>
                    <el-step title="確認"></el-step>
                </el-steps>
            </div>
        </div>
        <div>
            <router-view @next="next" @back="back" />
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      orderId:0
    };
  },
  created() { },
  methods: {
    next(data) {
      console.log(data);
      if (this.active++ > 2) this.active = 0;
      if (this.active == 0) {
        this.$router.push("orderlist");
      }
      if (this.active == 1) {
        this.orderId = data;
        this.$router.push({
          name: "ShippingAndBilling",
          params: { orderId: this.orderId },
        });
      }
      if (this.active == 2) {
        this.$router.push({
          name: "OrderConfirmation",
          params: { ruleForm: data , orderId : this.orderId},
        });
       
      }
    },
    back() {
      if (this.active-- < 0) this.active = 2;
      if (this.active == 0) {
        this.$router.push("orderlist");
      }
      if (this.active == 1) {
        this.$router.push("shippingandbilling");
      }
      if (this.active == 2) {
        this.$router.push("orderconfirmation");
      }
    },
  },
};
</script>
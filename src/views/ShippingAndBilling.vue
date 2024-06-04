<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm scrollable-form">
      <div class="section-title">ご配送：</div>

      <el-form-item label="受取人氏名:" prop="name" class="inputBox">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>

      <el-form-item label="電話番号:" prop="phone" class="inputBox">
        <el-input v-model="ruleForm.phone"></el-input>
      </el-form-item>

      <el-form-item label="郵便番号:" prop="postCode" class="inputBox">
        <el-input v-model="ruleForm.postCode"></el-input>
      </el-form-item>

      <el-form-item label="住所:" prop="address" class="inputBox">
        <el-input v-model="ruleForm.address" style="width: 500px"></el-input>
      </el-form-item>

      <el-form-item label="配送方法:" prop="deliveryMethod" class="inputBox">
        <el-cascader placeholder="配送方法を選択してください" v-model="ruleForm.deliveryMethod" :options="options"
          :props="{ expandTrigger: 'hover' }" @change="handleChange" @blur="validateDeliveryMethod"
          aria-required="true"></el-cascader>
      </el-form-item>

      <div class="section-title">支払方法を選択してください</div>

      <el-form-item label="支払方法" prop="payValue" class="inputBox">
        <el-select v-model="ruleForm.payValue" placeholder="支払方法" class="dropDownBox" @change="handlePayChange"
          @blur="validatePayMethod">
          <el-option v-for="item in payOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <template v-if="ruleForm.payValue === 'creditCard'">
        <el-form-item label="カード番号" prop="creditCardNumber" class="inputBox">
          <el-input v-model="ruleForm.creditCardNumber" style="width: 400px"></el-input>
        </el-form-item>

        <el-form-item label="有効期限" prop="expiryDate" class="inputBox">
          <el-date-picker v-model="ruleForm.expiryDate" type="month" format="MM/yy"
            placeholder="選択してください"></el-date-picker>
        </el-form-item>

        <el-form-item label="CVV" prop="cvv" class="inputBox">
          <el-input v-model="ruleForm.cvv" style="width: 100px"></el-input>
        </el-form-item>
      </template>

      <template v-else-if="
        ['PayPay', 'LinePay', 'WeChat', 'AliPay'].includes(ruleForm.payValue)
      ">
        <el-form-item label="スキャン" class="inputBox">
          <img :src="getPaymentImage(ruleForm.payValue)" :alt="ruleForm.payValue + ' QRコード'" class="payment-qr-code" />
        </el-form-item>
      </template>
    </el-form>

    <div class="form-buttons">
      <el-button type="primary" @click="back">戻る</el-button>
      <el-button type="primary" @click="next">次の手順</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ShippingAndBilling",
  data() {
    return {
      ruleForm: {
        name: "",
        phone: "",
        postCode: "",
        address: "",
        deliveryMethod: null,
        payValue: "",
        creditCardNumber: null,
        expiryDate: "",
        cvv: null,
      },
      rules: {
        name: [
          {
            required: true,
            message: "お名前を入力してください",
            trigger: "blur",
          },
          {
            min: 1,
            max: 20,
            message: "入力値の範囲は1から20まで",
            trigger: "blur",
          },
        ],
        phone: [
          {
            required: true,
            message: "お電話番号を入力してください。",
            trigger: "blur",
          },
          {
            pattern: /^[0-9]{10,11}$/,
            message: "電話番号の形式が正しくありません",
            trigger: "blur",
          },
          {
            max: 20,
            message: "電話番号が指定の長さを超えています",
            trigger: "blur",
          },
        ],
        postCode: [
          {
            required: true,
            message: "お郵便番号を入力してください",
            trigger: "blur",
          },
          {
            pattern: /^[0-9]{3}-[0-9]{4}$/,
            message: "郵便番号の形式が正しくありません（例：114-0002）",
            trigger: "blur",
          },
          {
            max: 10,
            message: "郵便番号が指定の長さを超えています",
            trigger: "blur",
          },
        ],
        address: [
          {
            required: true,
            message: "お住所を入力してください",
            trigger: "blur",
          },
          {
            max: 60,
            message: "住所が指定の長さを超えています",
            trigger: "blur",
          },
        ],
        deliveryMethod: [
          {
            required: true,
            message: "配送方法を選択してください",
            trigger: "blur",
          },
        ],
        payValue: [
          {
            required: true,
            message: "支払方法を選択してください",
            trigger: "blur",
          },
        ],
        creditCardNumber: [
          {
            required: true,
            message: "カード番号を入力してください",
            trigger: "blur",
          },
          {
            pattern: /^[0-9]{16}$/,
            message: "カード番号は16桁の数字で入力してください",
            trigger: "blur",
          },
        ],
        expiryDate: [{ validator: this.validateExpiryDate, trigger: "blur" }],
        cvv: [
          { required: true, message: "CVVを入力してください", trigger: "blur" },
          {
            pattern: /^[0-9]{3,4}$/,
            message: "新のCVVコードを入力してください",
            trigger: "blur",
          },
        ],
      },
      options: [],
      payOptions: [],
    };
  },
  props: {
    orderId: String,
  },
  created() {
    this.defaultShippingInformation();
    this.fetchDeliveryMethods();
    this.fetchPayMethods();
  },
  methods: {
    handleChange(value) {
      this.ruleForm.deliveryMethod = value;
      this.$refs.ruleForm.validateField("deliveryMethod");
    },
    handlePayChange(value) {
      this.ruleForm.payValue = value;
      this.$refs.ruleForm.validateField("payValue");
    },
    validateDeliveryMethod() {
      this.$refs.ruleForm.validateField("deliveryMethod");
    },
    validatePayMethod() {
      this.$refs.ruleForm.validateField("payValue");
    },
    next() {
      // 使用 Element UI 提供的 validate 方法对整个表单进行验证
      // this.$refs.ruleForm.validate((valid) => {
      //   // valid 是一个布尔值，表示表单验证是否通过
      //   if (valid) {
      //     // 如果验证通过，则触发 'next' 事件，并传递当前表单数据 (ruleForm)
          this.$emit("next", this.ruleForm);
      //   } else {
      //     // 如果验证未通过，则显示错误消息
      //     this.$message.error("すべての必須フィールドに入力してください。");
      //     // 返回 false，阻止继续执行
      //     return false;
      //   }
      // });
    },

    back() {
      this.$emit("back");
    },
    validateExpiryDate(rule, value, callback) {
      if (!value) {
        return callback(new Error("有効期限を入力してください"));
      }
      const year = value.getFullYear();
      const month = value.getMonth() + 1;
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;

      if (
        year < currentYear ||
        (year === currentYear && month < currentMonth)
      ) {
        return callback(new Error("未来の年月を選択してください"));
      }

      callback();
    },
    defaultShippingInformation() {
      this.request
        .get("/neworder/shippingandbilling", { userId: "7" })
        .then((response) => {
          const res = response.data;
          if (res && res.length > 0) {
            const shippingInfo = res[0];
            this.ruleForm.name = shippingInfo.name;
            this.ruleForm.phone = shippingInfo.phone;
            this.ruleForm.postCode = shippingInfo.post_code;
            this.ruleForm.address = shippingInfo.address;
          }
        })
        .catch((err) => {
          this.$message.error("无法获取默认配送信息");
        });
    },
    fetchDeliveryMethods() {
      this.request
        .get("/neworder/shippingandbilling/feach")
        .then((response) => {
          this.options = this.formatDeliveryMethods(response.data);
        })
        .catch((error) => {
          console.error("Error fetching delivery methods:", error);
        });
    },
    formatDeliveryMethods(data) {
      const regions = {};

      data.forEach((item) => {
        if (!regions[item.delivery_region]) {
          regions[item.delivery_region] = {
            value: item.delivery_region,
            label: item.delivery_region,
            children: [],
          };
        }

        const region = regions[item.delivery_region];
        if (!region.children.find((c) => c.value === item.delivery_company)) {
          region.children.push({
            value: item.delivery_company,
            label: item.delivery_company,
            children: [],
          });
        }

        const company = region.children.find(
          (c) => c.value === item.delivery_company
        );
        company.children.push({
          value: item.delivery_method_name,
          label: item.delivery_method_name,
        });
      });

      return Object.values(regions);
    },
    fetchPayMethods() {
      this.request
        .get("/neworder/shippingandbilling/feach2")
        .then((response) => {
          this.payOptions = this.formatPayMethods(response.data);
        })
        .catch((error) => {
          console.error("Error fetching pay methods:", error);
        });
    },
    formatPayMethods(data) {
      const payOptions = {};

      data.forEach((item) => {
        if (!payOptions[item.universal_name]) {
          payOptions[item.universal_name] = {
            value: item.universal_name,
            label: item.universal_name,
          };
        }
      });

      return Object.values(payOptions);
    },
    getPaymentImage(payValue) {
      const images = {
        // PayPay: require("@/img/AliPay.png"),
        // LinePay: require("@/img/WeChat.jpg"),
        // WeChat: require("@/img/WeChat.jpg"),
        // AliPay: require("@/img/AliPay.png"),
      };
      return images[payValue] || "";
    },
  },
};
</script>

<style>
.scrollable-form {
  height: 700px;
  overflow-y: auto;
  margin: 0 auto;
  width: 50%;
}

.dropDownBox {
  width: 200px;
}

.inputBox {
  text-align: left;
  margin: 30px 0;
  width: 300px;
}

.section-title {
  text-align: left;
  margin: 30px 0 10px;
  font-weight: bold;
}

.payment-qr-code {
  width: 40%;
}

.form-buttons {
  position: fixed;
  bottom: 0;
  right: 0;
  margin: 50px;
}
</style>

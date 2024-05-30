<template>
    <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm scrollable-form">
            <div class="section-title">ご配送：</div>

            <el-form-item label="受取人氏名:" prop="name" class="inputBox">
                <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>

            <el-form-item label="電話番号:" prop="postCode" class="inputBox">
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
                    <el-option v-for="item in payOptions" :key="item.value" :label="item.label"
                        :value="item.value"></el-option>
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

            <!-- <template
        v-else-if="
          ['PayPay', 'LinePay', 'WeChat', 'AliPay'].includes(ruleForm.payValue)
        "
      >
        <el-form-item label="スキャン" class="inputBox">
          <img
            :src="getPaymentImage(ruleForm.payValue)"
            :alt="ruleForm.payValue + ' QRコード'"
            class="payment-qr-code"
          />
        </el-form-item>
      </template> -->
        </el-form>

        <div class="form-buttons">
            <el-button type="primary" @click="back">戻る</el-button>
            <el-button type="primary" @click="next">次の手順</el-button>
        </div>
    </div>
</template>
<script>
export default {
    name: "OrderList",
    data() {
        return {
            returnData: "",
            deliveryData: "",
            value: [],

            ruleForm: {
                name: "",
                postCode: "",
                phone: "",
                address: "",
                deliveryMethod: null,
                delivery: false,
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
                        message: "入力値の範囲は1から50まで",
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
                expiryDate: [
                    {
                        validator: this.validateExpiryDate,
                        trigger: "change",
                    },
                ],
                cvv: [
                    { required: true, message: "CVVを入力してください", trigger: "blur" },
                    {
                        pattern: /^[0-9]{3,4}$/,
                        message: "新のCVVコードを入力してください",
                        trigger: "blur",
                    },
                ],
            },
            payOptions: [
                { value: "creditCard", label: "クレジットカード" },
                { value: "PayPay", label: "PayPay" },
                { value: "LinePay", label: "LinePay" },
                { value: "WeChat", label: "WeChat" },
                { value: "AliPay", label: "AliPay" },
            ],
            options: [
                {
                    value: "haiwai",
                    label: "海外",
                    children: [
                        {
                            value: "yamato",
                            label: "ヤマト運輸",
                            children: [
                                { value: "yamatohaiyun", label: "海上輸送" },
                                { value: "yamatokongyun", label: "航空輸送" },
                            ],
                        },
                        {
                            value: "youbianju",
                            label: "郵便局",
                            children: [
                                { value: "youbianjuhaiyun", label: "海上輸送" },
                                { value: "youbianjukongyun", label: "航空輸送" },
                            ],
                        },
                        {
                            value: "zuochuanjibian",
                            label: "佐川急便",
                            children: [{ value: "zuochuankongyun", label: "航空輸送" }],
                        },
                        {
                            value: "xinongyunshu",
                            label: "西濃運輸",
                            children: [{ value: "xinongkongyun", label: "航空輸送" }],
                        },
                    ],
                },
                {
                    value: "guonei",
                    label: "国内",
                    children: [
                        {
                            value: "yamato",
                            label: "ヤマト運輸",
                            children: [
                                { value: "yamatozhaijibian", label: "宅急便" },
                                { value: "yamatohaiyun", label: "海上輸送" },
                                { value: "yamatokongyun", label: "航空輸送" },
                            ],
                        },
                        {
                            value: "youbianju",
                            label: "郵便局",
                            children: [
                                { value: "youbianjuzhaijibian", label: "宅急便" },
                                { value: "youbianjukuaisu", label: "スピード便" },
                                { value: "youbianjuhaiyun", label: "海上輸送" },
                                { value: "youbianjukongyun", label: "航空輸送" },
                            ],
                        },
                        {
                            value: "zuochuanjibian",
                            label: "佐川急便",
                            children: [
                                { value: "zuochuanzhaijibian", label: "宅急便" },
                                { value: "zuochuankongyun", label: "航空輸送" },
                            ],
                        },
                        {
                            value: "xinongyunshu",
                            label: "西濃運輸",
                            children: [
                                { value: "xinongkuaisu", label: "スピード便" },
                                { value: "xinongkongyun", label: "航空輸送" },
                            ],
                        },
                    ],
                },
            ],
        };
    },
    methods: {
        handleChange(value) {
            this.deliveryData = value;
            this.$refs.ruleForm.validateField("deliveryMethod");
        },
        handlePayChange(value) {
            this.$refs.ruleForm.validateField("payValue");
        },
        validateDeliveryMethod() {
            this.$refs.ruleForm.validateField("deliveryMethod");
        },
        validatePayMethod() {
            this.$refs.ruleForm.validateField("payValue");
        },
        next() {
            this.returnData = `${this.data}->ShippingAndBilling(${this.deliveryData})`;
            this.$emit("next", this.returnData);
        },
        back() {
            this.$emit("back");
        },
        validateExpiryDate(rule, value, callback) {
            if (!value) {
                return callback(new error("有効期限を入力してください"));
            }
            const year = value.getFullYear;
            const month = value.getMonth + 1;
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear;
            const currentMonth = currentDate.getMonth + 1;

            if (
                year < currentYear ||
                (year === currentYear && month < currentMonth)
            ) {
                return callback(new error("有効期限は未来の年月を選択してください"));
            };

            callback();
        },
        // getPaymentImage(payValue) {
        //   switch (payValue) {
        //     case "PayPay":
        //       return require("@/img/AliPay.png");
        //     case "LinePay":
        //       return require("@/img/WeChat.jpg");
        //     case "WeChat":
        //       return require("@/img/WeChat.jpg");
        //     case "AliPay":
        //       return require("@/img/AliPay.png");
        //     default:
        //       return "";
        //   }
        // },
    },
};
</script>
<style>
.scrollable-form {
    height: 700px;
    /* 设置一个固定高度 */
    overflow-y: auto;
    /* 允许垂直方向上的滚动 */
    margin: 0 auto;
    width: 50%;
}

.dropDownBox {
    display: flex;
    justify-content: flex-start;
    width: 200px;
}

.inputBox {
    text-align: left;
    margin-top: 30px;
    margin-bottom: 30px;
    width: 300px;
}

.section-title {
    text-align: left;
    margin-top: 30px;
    margin-bottom: 10px;
    font-weight: bold;
}

.payment-qr-code {
    width: 40%;
    display: flex;
    justify-content: flex-start;
}

.form-buttons {
    position: fixed;
    bottom: 0;
    right: 0;
    margin-right: 50px;
    margin-bottom: 50px;
}
</style>


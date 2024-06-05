<template>
    <div style="text-align: left">
        <el-dialog title="支払確定" :visible.sync="localDialogVisible" width="500px" style="text-align: center;">
            <div style="text-align: left;">
                <span>注文ID:</span>
                <el-tag>{{ orderId }}</el-tag>
            </div>
            <el-form :label-position="labelPosition" label-width="90px" :model="form">
                <el-form-item label="変更前金額:">
                    <el-tag size="small" class="same-width">{{ amountSum.toLocaleString() }}</el-tag>
                </el-form-item>
                <el-form-item label="変更後金額:">
                    <el-tag size="small" class="same-width">{{ totalPrice.toLocaleString() }}</el-tag>
                </el-form-item>
                <el-form-item label="支払方法:">
                    <el-tag size="small" class="same-width">{{ UniversalName }}</el-tag>
                </el-form-item>
                <el-button type="success" @click="Confirm" style="float: right;margin-top: -20px">確定</el-button>
            </el-form>

        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'Payment',
    props: {
        dialogTableVisible: Boolean,
        orderId : [String,Number]
    },
    data() {
        return {
            localDialogVisible: this.dialogTableVisible,
            labelPosition: 'top',
            amountSum: 0,
            totalPrice: 0,
            UniversalName: '',
            form: {
                orderId : null
            }
        };
    },
    watch: {
        dialogTableVisible(newVal) {
            this.localDialogVisible = newVal;
        },
        localDialogVisible(newVal) {
            this.$emit('update:dialogTableVisible', newVal);
        },
    },
    methods: {
        fetchData() {
            this.request.post('/neworder/OrderConfirmation/payment', { orderId: this.orderId })
                .then(response => {
                    console.log(response);
                    this.amountSum = response.data.amountSum;
                    this.totalPrice = response.data.totalPrice;
                    this.UniversalName = response.data.universalName;
                })
                .catch(error => {
                    console.error('请求失败:', error);
                })
        },
        Confirm() {
            this.$message({
                message: 'ご注文ありがとうございます！',
                type: 'success'
            });
        }
    }
};
</script>

<style>
.same-width {
    width: 50%;
    /* display: flex;
  justify-content: flex-end; */
    /* text-align: top; */
}
</style>

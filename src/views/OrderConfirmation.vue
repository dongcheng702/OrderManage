<template>
    <div style="margin-top: 50px;">
        <el-table :data="tableData.results" border stripe style="width: 100%"
            :header-cell-style="{ background: '#eee' }">
            <el-table-column prop="productName" label="商品名" width="180" align="center">
            </el-table-column>
            <el-table-column prop="unitPrice" label="販売価格" width="180" align="right">
            </el-table-column>
            <el-table-column prop="quantity" label="購入数量" align="right">
            </el-table-column>
            <el-table-column prop="standard" label="商品規格" align="center">
            </el-table-column>
            <el-table-column prop="origin" label="産地" align="center">
            </el-table-column>
            <el-table-column prop="itemTotal" label="単品合計金額" align="center">
            </el-table-column>
        </el-table>
        <div style="margin-bottom: 30px;"></div>
        <el-descriptions title="配送方法">
            <el-descriptions-item label="名前">
                <el-tag size="small">{{ ruleForm.name }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="郵便番号">
                <el-tag size="small">{{ ruleForm.postCode }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="配送方法">
                <el-tag size="small">{{ ruleForm.deliveryMethod }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="届け先">
                <el-tag size="small">{{ ruleForm.address }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="電話番号">
                <el-tag size="small">{{ ruleForm.phone }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="支払い方法">
                <el-tag size="small">{{ ruleForm.payValue }}</el-tag>
            </el-descriptions-item>
        </el-descriptions>
        <div style="text-align: left;margin-top: 50px;">
            <span>ご注文金額:</span>
            <el-tag size="small">{{ tableData.amountSum }}</el-tag>
        </div>
        <div style="position: fixed; bottom: 0; right: 0; margin-right: 50px; margin-bottom: 50px;">
            <el-button v-if="showBackButton" type="primary" @click="back">戻る</el-button>
            <el-button type="primary" @click="next">確定</el-button>
        </div>
    </div>
</template>

<script>
export default {
    name: "OrderList",
    data() {
        return {
            showBackButton: true, // 控制是否显示 "戻る" 按钮的变量
            returnData: '',
            total: 0,
            pageNum: 1,
            pageSize: 5,
            drawer: false,
            direction: 'rtl',
            result : 0,
            form: {
                orderId: this.orderId,
                recipientName: this.ruleForm.name,
                postCode: this.ruleForm.postCode,
                destination: this.ruleForm.address,
                phone: this.ruleForm.phone,
                deliveryMethodId: 'ヤマト運輸',
                payment: 'クレジットカード',
            },
            tableData: []
        }
    },
    props: {
        ruleForm: Object,
        orderId: Number,
    },
    mounted() {
        console.log(this.orderId,1);
        this.fetchData();
    },
    methods: {
        fetchData() {
            this.request.post('/neworder/OrderConfirmation/select', this.form)
                .then(response => {
                    console.log(response);
                    this.tableData = response.data;
                    if (response.data.message === '' || response.data.message === null) {
                        console.log(response.data.message);
                        this.result = 1;
                    } else {
                        this.$message.error(response.data.message);
                    }
                })
                .catch(error => {
                    console.error('请求失败:', error);
                })
        },

        next() {
            this.request.post('/neworder/OrderConfirmation/update', this.form)
            console.log(this.form);
            if (this.result === 1 ) {
                this.$message({
                    showClose: true,
                    message: 'ご注文ありがとうございます。',
                    type: 'success'
                })
            } else {
                this.$message({
                    showClose: true,
                    message: '注文内容が存在しません。',
                    type: 'warning'
                })
            }

        },
        back() {
            this.$emit('back');
        }

    }
}
</script>

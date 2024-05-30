<template>
    <div style="margin-top: 50px;">
        <el-table :data="tableData" border stripe style="width: 100%" :header-cell-style="{ background: '#eee' }">
            <el-table-column prop="productName" label="商品名" width="180" align="center">
            </el-table-column>
            <el-table-column prop="salesPrice" label="販売価格" width="180" align="right">
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
                <el-tag size="small">岸田太郎</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="郵便番号">
                <el-tag size="small">100-0001</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="配送方法">
                <el-tag size="small">ヤマト運輸</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="届け先">
                <el-tag size="small">東京都台東区浅草橋3丁目12-13</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="電話番号">
                <el-tag size="small">01012345678</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="支払い方法">
                <el-tag size="small">クレジットカード</el-tag>
            </el-descriptions-item>
        </el-descriptions>
        <div class="indent-top" style="text-align: left;">
            <span>ご注文金額:</span>
            <el-tag size="small">260,000円</el-tag>
        </div>
        <div style="position: fixed; bottom: 0; right: 0; margin-right: 50px; margin-bottom: 50px;">
            <el-button v-if="showBackButton" type="primary" @click="back">戻る</el-button>
            <el-button type="primary" @click="next">確定</el-button>
        </div>

        <div style="
        position: fixed;
        bottom: 0;
        right: 0;
        margin-right: 50px;
        margin-bottom: 50px;
      ">
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
            tableData: [
                {
                    productName: '商品A',
                    salesPrice: '300',
                    quantity: '100',
                    standard: 'Small',
                    origin: 'アメリカ',
                    itemTotal: '30,000'
                },
                {
                    productName: '商品B',
                    salesPrice: '400',
                    quantity: '200',
                    standard: 'Medium',
                    origin: 'オーストラリア',
                    itemTotal: '80,000'
                },
                {
                    productName: '商品C',
                    salesPrice: '500',
                    quantity: '300',
                    standard: 'Large',
                    origin: 'ブラジル',
                    itemTotal: '150,000'
                }
            ],
            drawer: false,
            direction: 'rtl',

        }
    },
    props: {
        data: String
    },
    created() {
    },
    methods: {
        next() {
            this.showBackButton = false;
            this.returnData = this.data + '->OrderConfirmation';
            this.$emit('next', this.returnData);
        },
        back() {
            this.$emit('back');
        }

    }
}
</script>


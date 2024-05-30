<template>
    <div>
        <div style="text-align: left; margin-top: 20px">
            <el-input v-model="form.productName" placeholder="商品名を入力してください" style="width: 200px;"></el-input>
            <el-select v-model="form.productType" placeholder="商品種類" style="margin-left: 30px;width: 200px;">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div style="text-align: left; margin-top: 20px;">
            <el-input v-model="form.min_price" placeholder="最低価格" style="width: 200px;"></el-input>
            <span style="margin: 0 10px;">~</span>
            <el-input v-model="form.max_price" placeholder="最高価格" style="width: 200px;"></el-input>
            <el-button type="success" style="margin-left: 15px;" @click="selectProducts(1)">検索</el-button>
        </div>
        <div style="margin-top: 50px;">
            <el-table :data="productData" border stripe style="width: 100%; height: calc(92.6vh - 345px); overflow: auto;"
                @selection-change="handleSelectionChange" :header-cell-style="{ background: '#eee' }">
                <el-table-column type="selection"> </el-table-column>
                <el-table-column prop="product_id" label="商品ID" min-width="5%" align="center">
                </el-table-column>
                <el-table-column prop="product_name" label="商品名" min-width="20%" align="center">
                </el-table-column>
                <el-table-column prop="selling_price" label="商品単価" min-width="10%" align="right">
                </el-table-column>
                <el-table-column prop="actual_stock_Number" label="在库数量" min-width="10%" align="right">
                </el-table-column>
                <el-table-column prop="product_format" label="商品規格" min-width="10%" align="center">
                </el-table-column>
                <el-table-column prop="origin" label="産地" min-width="5%" align="center">
                </el-table-column>
                <el-table-column prop="quantity" label="購入数量" min-width="5%" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.quantity" size="mini"></el-input>
                    </template>
                </el-table-column>

                <el-table-column label="操作" min-width="3%" align="center">
                    <template slot-scope="scope">
                        <el-button type="warning" size="mini" icon="el-icon-plus" circle
                            @click="addOrder(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div
                style="display: flex; justify-content: space-between; align-items: center; padding: 10px; margin-right: 50px;">
                <div></div>
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="form.pageNum" :page-sizes="[5, 10, 15, 20]" :page-size="form.pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
                <div style="display: flex;">
                    <el-button style="margin-left: 16px;" @click="addOrderAll">
                        一括追加
                    </el-button>
                    <el-button @click="drawer = true" style="margin-left: 16px;">
                        注文リスト
                    </el-button>
                </div>
            </div>
        </div>
        <el-drawer title="注文リスト" :visible.sync="drawer" :direction="direction" :before-close="handleClose">
            <el-table :data="orderList" border style="width: 100%">
                <el-table-column prop="商品ID" label="商品ID"></el-table-column>
                <el-table-column prop="商品名" label="商品名"></el-table-column>
                <el-table-column prop="商品単価" label="商品単価"></el-table-column>
                <el-table-column prop="購入数量" label="購入"></el-table-column>
                <el-table-column prop="産地" label="産地"></el-table-column>
                <el-table-column prop="商品規格" label="商品規格"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="removeOrder(scope.row)">
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="position: fixed; bottom: 0; right: 0; margin-right: 50px; margin-bottom: 50px;">
                <el-button type="primary" @click="clearAllOrder">カートクリア</el-button>
                <el-button type="primary" @click="next">次の手順</el-button>
            </div>

        </el-drawer>
    </div>
</template>


<script>
const baseURL = "http://localhost:9090/neworder/productselection/";
export default {
    name: "OrderList",
    data() {
        return {
            total: 0,
            //商品データ
            productData: [],
            drawer: false,
            direction: 'rtl',
            orderList: [],
            multipleSelection: [],
            //商品種類
            options: [],
            //Form
            form: {
                productName: "",
                max_price: null,
                min_price: null,
                productType: "",
                pageNum: 1,
                pageSize: 5,
            },
            orderForm: {
                productId: null,
                quantity: null,
            }
        }
    },
    created() {
        this.selectProducts(1);
        //获取浏览器存储的商品种类对象信息
        let goodtypes = localStorage.getItem("goodtypes") ? JSON.parse(localStorage.getItem("goodtypes")) : null
        if (goodtypes) {
            //console.log("从浏览器获取");
            this.options = goodtypes;
        } else {
            //console.log("从服务器获取");
            this.request.get(baseURL + "getGoodTypes").then(res => {
                this.options = res.data;
                console.log(JSON.stringify(res.data));
                //存储商品种类到浏览器
                localStorage.setItem('goodtypes', JSON.stringify(res.data))
            });
        }
    },
    methods: {
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.form.pageSize = val;
            this.selectProducts(1);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.selectProducts(val);
        },
        handleClose(done) {
            done();
        },
        next() {
            const data = 'OrderList';
            this.$emit('next', data);
        },
        handleSelectionChange(val) {
            //console.log(JSON.stringify(val, null, 2));
            this.multipleSelection = val;
        },
        selectProducts(val) {
            this.form.pageNum = val; // 设置页数

            // 检查是否所有检索条件都为空或为默认值
            const isDefaultSearch = this.form.productName === "" &&
                (this.form.max_price === null || this.form.max_price === 0) &&
                (this.form.min_price === null || this.form.min_price === 0) &&
                (this.form.productType === null || this.form.productType === "");
            // 执行检索操作
            this.request.post(baseURL + "selectProducts", this.form).then(res => {
                console.log(this.productData);
                this.productData = res.data.products;
                if (isDefaultSearch) {
                    // 获取总件数
                    this.request.get(baseURL + "ProductCount").then(res => {
                        this.total = res.data;
                    });
                } else {
                    this.total = res.data.total;
                }
            });
        },
        addOrder(row) {
            // 数量を数値に変換
            const quantity = Number(row.quantity);
            if (quantity <= 0) {
                this.$message({
                    showClose: true,
                    type: 'error',
                    message: '请输入商品数量'
                })
                return;
            }

            this.orderForm.productId = row.product_id;
            this.orderForm.quantity = quantity;

            // 查找是否已有相同的商品
            const existingOrder = this.orderList.find(order => order.商品ID === row.product_id);

            if (existingOrder) {
                // 既に存在する場合は購入数量を累加
                existingOrder.購入数量 += quantity;

            } else {
                // 新しい商品を注文リストに追加
                this.orderList.push({
                    商品ID: row.product_id,
                    商品名: row.product_name,
                    商品単価: row.selling_price,
                    購入数量: quantity,
                    産地: row.origin,
                    商品規格: row.product_format
                });
            }
            // 新しい商品の在庫を更新
            this.request.post(baseURL + "updateStock", this.orderForm).then(res => {
                console.log(res.data);
                if (res.data === 0) {
                    this.$message({
                        showClose: true,
                        type: 'error',
                        message: '在庫が足りません'
                    })
                } else {
                    this.$message({
                        showClose: true,
                        type: 'success',
                        message: 'カートに追加しました'
                    })
                }
                this.selectProducts(this.form.pageNum)
            });
            console.log(this.orderList);
        },
        addOrderAll() {
            let quantitys = this.multipleSelection.map(v => v.quantity);
            // 检查 quantitys 数组中是否包含 0 或者空字符串
            console.log(quantitys);
            if (quantitys.some(item => item === '' || parseInt(item, 10) === 0)) {
                this.$message({
                    showClose: true,
                    type: 'error',
                    message: "商品の購入数量を入力してください"
                })
                return;
            }
            let ids = this.multipleSelection.map(v => v.product_id);
            let names = this.multipleSelection.map(v => v.product_name);
            let unitprices = this.multipleSelection.map(v => v.selling_price);
            let specifications = this.multipleSelection.map(v => v.product_format);
            let origin = this.multipleSelection.map(v => v.origin);
            for (let i = 0; i < this.multipleSelection.length; i++) {
                const existingOrder = this.orderList.find(order => order.商品ID === ids[i]);
                const quantity = Number(quantitys[i])
                if (existingOrder) {
                    // 既に存在する場合は購入数量を累加
                    existingOrder.購入数量 += quantity;
                } else {
                    this.orderList.push({
                        商品ID: ids[i],
                        商品名: names[i],
                        商品単価: unitprices[i],
                        購入数量: quantity,
                        産地: origin[i],
                        商品規格: specifications[i]
                    });
                }
            }
        },
        removeOrder(row) {
            // 从订单列表中移除指定商品
            this.orderList = this.orderList.filter(order => order.商品名 !== row.商品名);
            this.orderForm.productId = row.product_id;
            this.orderForm.quantity = quantity;

            this.request.post(baseURL + "backupStock", this.orderForm).then(res => {
                console.log(res.data);
                if (res.data === 0) {
                    this.$message({
                        showClose: true,
                        type: 'error',
                        message: '在庫が足りません'
                    })
                } else {
                    this.$message({
                        showClose: true,
                        type: 'success',
                        message: 'カートに追加しました'
                    })
                }
                this.selectProducts(this.form.pageNum)
            });
        },
        clearAllOrder() {
            this.orderList = [];
            console.log("カートクリア");
        },
    }
}
</script>


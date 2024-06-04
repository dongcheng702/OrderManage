<template>
    <div>
        <div class="search-bar">
            <el-input class="input-box_w200" v-model="form.productName" placeholder="商品名を入力してください"></el-input>
            <el-select class="input-box_l20_w200" v-model="form.productType" placeholder="商品種類">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </div>
        <div class="price-filter">
            <el-input class="input-box_w200" v-model="form.min_price" placeholder="最低価格"></el-input>
            <span class="price-separator">~</span>
            <el-input class="input-box_w200" v-model="form.max_price" placeholder="最高価格"></el-input>
            <el-button class="ml_10" type="success" @click="selectProducts(1)">検索</el-button>
        </div>
        <div class="product-table">
            <el-table :data="productData" border stripe @selection-change="handleSelectionChange"
                :header-cell-style="{ background: '#eee' }">
                <el-table-column type="selection"> </el-table-column>
                <el-table-column prop="product_id" label="商品ID" min-width="5%" align="center"></el-table-column>
                <el-table-column prop="product_name" label="商品名" min-width="20%" align="center"></el-table-column>
                <el-table-column prop="selling_price" label="商品単価" min-width="10%" align="right"></el-table-column>
                <el-table-column prop="actual_stock_Number" label="在库数量" min-width="10%" align="right"></el-table-column>
                <el-table-column prop="product_format" label="商品規格" min-width="10%" align="center"></el-table-column>
                <el-table-column prop="origin" label="産地" min-width="5%" align="center"></el-table-column>
                <el-table-column prop="quantity" label="購入数量" min-width="5%" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.quantity" size="mini"></el-input>
                    </template>
                </el-table-column>
                <el-table-column v-if="false" prop="last_modified_Ts" label="最後更新日時" min-width="5%"
                    align="center"></el-table-column>
                <el-table-column label="操作" min-width="3%" align="center">
                    <template slot-scope="scope">
                        <el-button type="warning" size="mini" icon="el-icon-plus" circle
                            @click="addOrder(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="form.pageNum" :page-sizes="[5, 10, 15, 20]" :page-size="form.pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            <div class="order-buttons">
                <el-button @click="addOrderAll">一括追加</el-button>
                <el-button @click="drawer = true">注文リスト</el-button>
            </div>
        </div>
        <el-drawer title="注文リスト" :visible.sync="drawer" :direction="direction" :before-close="handleClose">
            <el-table :data="orderList" border>
                <el-table-column prop="productId" label="商品ID"></el-table-column>
                <el-table-column prop="productName" label="商品名"></el-table-column>
                <el-table-column prop="productPrice" label="商品単価"></el-table-column>
                <el-table-column prop="quantity" label="購入数量"></el-table-column>
                <el-table-column prop="origin" label="産地"></el-table-column>
                <el-table-column prop="productFormat" label="商品規格"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="danger" size="mini" icon="el-icon-delete" circle
                            @click="removeOrder(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="drawer-buttons">
                <el-button type="primary" @click="clearAllOrder">カートクリア</el-button>
                <el-button type="primary" @click="next">注文確定</el-button>
            </div>
        </el-drawer>
    </div>
</template>




<script>
const baseURL = "http://localhost:8888/neworder/productselection/";
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
            console.log(this.orderList);
            // if (this.orderList.length === 0) {
            //     this.$message({
            //         showClose: true,
            //         type: 'warning',
            //         message: '商品を追加してください'
            //     });
                // return;
            // }
            // this.request.post(baseURL + "addOrderDetails", this.orderList).then(res => {
              //  this.$emit('next', res.data);

            // });
this.$emit('next', '');
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
                    message: '購入数量を入力してください'
                });
                return;
            }

            const orderForm = {
                productId: row.product_id,
                quantity: quantity,
                lastModifiedTs: row.last_modified_Ts
            };

            // 新しい商品の在庫を更新
            this.request.post(baseURL + "updateStock", orderForm).then(res => {
                console.log(res.data);
                if (res.data === 0) {
                    this.$message({
                        showClose: true,
                        type: 'error',
                        message: '在庫を確認して入力してください'
                    });
                    this.selectProducts(this.form.pageNum);
                    return;  // 在庫不足の場合、ここで処理を終了する
                }

                this.$message({
                    showClose: true,
                    type: 'success',
                    message: 'カートに追加しました',
                    duration: 1000
                });

                // 查找是否已有相同的商品
                const existingOrder = this.orderList.find(order => order.productId === row.product_id);

                if (existingOrder) {
                    // 既に存在する場合は購入数量を累加
                    existingOrder.quantity += quantity;
                } else {
                    // 新しい商品を注文リストに追加
                    this.orderList.push({
                        productId: row.product_id,
                        productName: row.product_name,
                        productPrice: row.selling_price,
                        quantity: quantity,
                        origin: row.origin,
                        productFormat: row.product_format
                    });
                }
                console.log(this.orderList);
                this.selectProducts(this.form.pageNum);  // 在庫が更新された後に商品リストを再取得する

            }).catch(error => {
                console.error("追加失敗しました", error);
                this.$message({
                    showClose: true,
                    type: 'error',
                    message: '追加失敗しました'
                });
            });
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
                });
                return;
            }
            let addcount = 0, errorcount = 0;
            let ids = this.multipleSelection.map(v => v.product_id);
            let names = this.multipleSelection.map(v => v.product_name);
            let unitprices = this.multipleSelection.map(v => v.selling_price);
            let specifications = this.multipleSelection.map(v => v.product_format);
            let origin = this.multipleSelection.map(v => v.origin);
            let lastModifiedTs = this.multipleSelection.map(v => v.last_modified_Ts);

            let promises = [];

            for (let i = 0; i < this.multipleSelection.length; i++) {
                const quantity = Number(quantitys[i]);
                const orderForm = {
                    productId: ids[i],
                    quantity: quantity,
                    lastModifiedTs: lastModifiedTs[i]
                };

                let promise = this.request.post(baseURL + "updateStock", orderForm).then(res => {
                    console.log(res.data);
                    if (res.data === 0) {
                        errorcount++;
                    } else {
                        addcount++;
                        // 查找是否已有相同的商品
                        const existingOrder = this.orderList.find(order => order.productId === ids[i]);
                        if (existingOrder) {
                            // 既に存在する場合は購入数量を累加
                            existingOrder.quantity += quantity;
                        } else {
                            this.orderList.push({
                                productId: ids[i],
                                productName: names[i],
                                productPrice: unitprices[i],
                                quantity: quantity,
                                origin: origin[i],
                                productFormat: specifications[i]
                            });
                        }
                    }
                }).catch(error => {
                    console.error("追加失敗しました", error);
                    this.$message({
                        showClose: true,
                        type: 'error',
                        message: '追加失敗しました'
                    });
                });

                promises.push(promise);
            }

            Promise.all(promises).then(() => {
                this.selectProducts(this.form.pageNum);
                if (addcount > 0) {
                    this.$message({
                        showClose: true,
                        type: 'success',
                        message: addcount + 'つの商品が追加しました',
                        duration: 1000
                    });
                }
                if (errorcount > 0) {
                    this.$message({
                        showClose: true,
                        type: 'error',
                        message: errorcount + 'つの商品が追加失敗しました',
                        duration: 1000
                    });
                }
                console.log(this.orderList);
            });
        },
        removeOrder(row) {
            const form = {
                productId: row.productId,
                pageNum: 1,
                pageSize: 1,
            };

            // 将字符串转换为数字类型，确保是有效的购买数量
            const quantity = Number(row.quantity);

            // 发送异步请求查询产品信息
            this.request.post(baseURL + "selectProducts", form)
                .then(res => {
                    // 检查返回数据是否存在并且包含产品信息
                    if (res.data && res.data.products && res.data.products.length > 0) {
                        // 获取产品的最后修改时间
                        const lastModifiedTs = res.data.products[0].last_modified_Ts;

                        // 构建备份库存的请求参数
                        const orderForm = {
                            productId: row.productId,
                            quantity: quantity,
                            lastModifiedTs: lastModifiedTs
                        };

                        // 发送库存更新的异步请求
                        this.request.post(baseURL + "backupStock", orderForm)
                            .then(res => {
                                // 检查备份库存操作是否成功
                                if (res.data === 0) {
                                    this.$message({
                                        showClose: true,
                                        type: 'error',
                                        message: 'システムエラー：バックアップストックに失敗しました'
                                    });
                                } else {
                                    this.$message({
                                        showClose: true,
                                        type: 'success',
                                        message: 'カートから削除しました',
                                        duration: 1000
                                    });

                                    // 从订单列表中移除指定商品
                                    this.orderList = this.orderList.filter(order => order.productName !== row.productName);
                                }
                                // 更新产品列表
                                this.selectProducts(this.form.pageNum);
                            })
                            .catch(error => {
                                console.error("バックアップストックのリクエストに失敗しました", error);
                                this.$message({
                                    showClose: true,
                                    type: 'error',
                                    message: 'バックアップストックのリクエストに失敗しました'
                                });
                            });
                    } else {
                        console.error("製品情報が見つかりませんでした");
                        this.$message({
                            showClose: true,
                            type: 'error',
                            message: '製品情報が見つかりませんでした'
                        });
                    }
                })
                .catch(error => {
                    console.error("製品情報のリクエストに失敗しました", error);
                    this.$message({
                        showClose: true,
                        type: 'error',
                        message: '製品情報のリクエストに失敗しました'
                    });
                });
        },
        clearAllOrder() {
            console.log(this.orderList, "orderList");
            let removecount = 0, errorcount = 0;
            let ids = this.orderList.map(v => v.productId);
            let names = this.orderList.map(v => v.productName);
            let quantitys = this.orderList.map(v => v.quantity);

            let promises = [];

            for (let i = 0; i < this.orderList.length; i++) {
                const form = {
                    productId: ids[i],
                    pageNum: 1,
                    pageSize: 1,
                };
                const quantity = Number(quantitys[i]);

                let promise = this.request.post(baseURL + "selectProducts", form).then(res => {
                    const orderForm = {
                        productId: ids[i],
                        quantity: quantity,
                        lastModifiedTs: res.data.products[0].last_modified_Ts
                    };
                    return this.request.post(baseURL + "backupStock", orderForm).then(res => {
                        console.log(res.data);
                        if (res.data === 0) {
                            errorcount++;
                        } else {
                            removecount++;
                        }
                        return names[i];  // 返回商品名，用于之后的过滤
                    });
                }).catch(error => {
                    console.error("削除失敗しました", error);
                    errorcount++;
                    return names[i];  // 即使发生错误，也返回商品名，以便过滤
                });

                promises.push(promise);
            }

            Promise.all(promises).then(results => {
                this.orderList = this.orderList.filter(order => !results.includes(order.productName));
                console.log("カートクリア");
                this.selectProducts(this.form.pageNum);
                if (removecount > 0) {
                    this.$message({
                        showClose: true,
                        type: 'success',
                        message: removecount + 'つの商品がカートから削除しました',
                        duration: 1000
                    });
                }
                if (errorcount > 0) {
                    this.$message({
                        showClose: true,
                        type: 'error',
                        message: errorcount + 'つの商品がカートから削除失敗しました',
                        duration: 1000
                    });
                }
                console.log(this.orderList);
            });
        }
    }
}
</script>


<style>
.search-bar {
    text-align: left;
    margin-top: 20px;
}

.search-bar el-input,
.search-bar el-select {
    width: 200px;
    margin-left: 30px;
}

.price-filter {
    text-align: left;
    margin-top: 20px;
}

.price-filter el-input {
    width: 200px;
}

.price-separator {
    margin: 0 5px;
}

.product-table {
    margin-top: 50px;
}

.pagination-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    margin-right: 50px;
}

.order-buttons {
    display: flex;
}

.order-buttons el-button {
    margin-left: 16px;
}

.drawer-buttons {
    position: fixed;
    bottom: 0;
    right: 0;
    margin-right: 50px;
    margin-bottom: 50px;
}

.input-box_l20_w200 {
    margin-left: 20px;
    width: 200px;
}

.input-box_w200 {
    width: 200px;
}
</style>

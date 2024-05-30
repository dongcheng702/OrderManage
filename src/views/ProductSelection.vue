<template>
  <div>
    <div style="text-align: left; margin-top: 20px">
      <el-input placeholder="商品名を入力してください" style="width: 200px"></el-input>
    </div>

    <div style="text-align: left; margin-top: 20px">
      <el-input placeholder="最低価格" style="width: 200px"></el-input>
      <span style="margin: 0 10px">~</span>
      <el-input placeholder="最高価格" style="width: 200px"></el-input>
    </div>
    <div style="text-align: left; margin-top: 20px">
      <el-select v-model="value" placeholder="在庫状況を選んでください">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div style="text-align: left; margin-top: 20px">
      <el-select v-model="value" placeholder="在庫状況を選んでください">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button type="success" style="margin-left: 15px">検索</el-button>
    </div>
    <div style="margin-top: 50px">
      <el-table :data="tableData" border stripe style="width: 100%" :header-cell-style="{ background: '#eee' }">
        <el-table-column prop="name" label="商品名" width="180" align="center">
        </el-table-column>
        <el-table-column prop="unitprice" label="商品単価" width="180" align="right">
        </el-table-column>
        <el-table-column prop="stockstatus" label="在庫状況" align="center">
        </el-table-column>
        <el-table-column prop="specification" label="商品規格" align="center">
        </el-table-column>
        <el-table-column label="操作">
          <el-button type="warning" size="mini" icon="el-icon-plus" circle></el-button>
        </el-table-column>
      </el-table>
    </div>
    <div style="
        position: fixed;
        bottom: 0;
        right: 0;
        margin-right: 50px;
        margin-bottom: 50px;
      ">
      <el-button @click="drawer = true" style="margin-left: 16px"><i class="el-icon-goods"> 注文確認</i>
      </el-button>
    </div>
    <div style="
        padding: 10px;
        position: fixed;
        bottom: 0;
        margin-right: 50px;
        margin-bottom: 50px;
      ">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
        :page-sizes="[5, 10, 15, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <el-drawer title="注文リスト" :visible.sync="drawer" :direction="direction" :before-close="handleClose">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="name" label="商品名" width="100" align="center">
        </el-table-column>
        <el-table-column prop="unitprice" label="商品単価" width="100" align="right">
        </el-table-column>
        <el-table-column prop="quantity" label="商品数量" width="180" align="right">
          <template slot-scope="scope">
            <el-input align="right" v-model="scope.row.quantity" @change="handleQuantityChange(scope.row)"
              @keyup.enter.native="saveQuantity(scope.row)" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="specification" label="商品規格" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <el-button type="danger" size="mini" icon="el-icon-delete" circle></el-button>
        </el-table-column>
      </el-table>
      <div style="
          position: fixed;
          bottom: 0;
          right: 0;
          margin-right: 50px;
          margin-bottom: 50px;
        ">
        <el-button type="primary" @click="clearAllOrder">カートクリア</el-button>
        <el-button type="primary" @click="next">次の手順</el-button>
      </div>
    </el-drawer>
  </div>
</template>


<script>
export default {
  name: "OrderList",
  data() {
    return {
      total: 0,
      pageNum: 1,
      pageSize: 5,
      drawer: false,
      direction: "rtl",
      num: 1,
      tableData: [
        {
          name: "商品A",
          unitprice: "300",
          stockstatus: "在庫あり",
          specification: "Small",
          quantity: "100",
        },
        {
          name: "商品B",
          unitprice: "400",
          stockstatus: "残りわずか",
          specification: "Medium",
          quantity: "200",
        },
        {
          name: "商品C",
          unitprice: "500",
          stockstatus: "入荷待ち",
          specification: "Large",
          quantity: "300",
        },
      ],
      options: [
        {
          value: "选项1",
          label: "在庫あり",
        },
        {
          value: "选项2",
          label: "残りわずか",
        },
        {
          value: "选项3",
          label: "入荷待ち",
        },
      ],
      value: "",
      options: [
        {
          value: "选项1",
          label: "在庫あり",
        },
        {
          value: "选项2",
          label: "残りわずか",
        },
        {
          value: "选项3",
          label: "入荷待ち",
        },
      ],
      value: "",
    };
  },
  created() { },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => { });
    },
    clearAllOrder() {
      console.log("カートクリア");
    },
    next() {
      const data = "OrderList";
      this.$emit("next", data);
    },
    handleQuantityChange(row) { },
    saveQuantity(row) {
      console.log("保存商品数量:", row.quantity);
    },
  },
};
</script>

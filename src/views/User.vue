<template>
  <div style="text-align: left">
    <div style="padding: 10px">
<<<<<<< Updated upstream
      <el-input placeholder="注文番号を入力してください" style="font-size: 12px; width: 220px"></el-input>
=======
      <el-input
        placeholder="中毛不爱学习注文番号を入力してください"
        style="font-size: 12px; width: 220px"
      ></el-input>
>>>>>>> Stashed changes

      <el-date-picker v-model="value2" type="daterange" align="left" unlink-panels range-separator="~"
        start-placeholder="開始日付" end-placeholder="終了日付" :picker-options="pickerOptions" style="margin-left: 30px"
        :default-value="defaultMonthDate">
      </el-date-picker>

      <el-dropdown>
        <el-button style="margin-left: 30px">
          注文状況<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>受取</el-dropdown-item>
          <el-dropdown-item>配送中</el-dropdown-item>
          <el-dropdown-item>在庫保留</el-dropdown-item>
          <el-dropdown-item>営業確認中</el-dropdown-item>
          <el-dropdown-item>部長確認中</el-dropdown-item>
          <el-dropdown-item>キャンセル中</el-dropdown-item>
          <el-dropdown-item>キャンセル済み</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-row>
      <el-button type="success" @click="select" style="transform: translateX(10px)">検索<i class="el-icon-search"
          style="margin-left: 5px"></i></el-button>
      <el-button type="info" style="margin-left: 30px; padding-left: 12px" @click="reset">リセット<i class="el-icon-refresh"
          style="margin-left: 5px"></i></el-button>
      <el-dropdown>
        <el-button type="primary" style="margin-left: 30px">
          エクスポート<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-on:click.native="expxlsx">.xlsx</el-dropdown-item>
          <el-dropdown-item v-on:click.native="exppdf">.pdf</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div style="padding: 10px">
        <el-button type="success" round style="float: right; margin-top: 40px" @click="newOrder"
          icon="el-icon-circle-plus">新規注文</el-button>
      </div>
    </el-row>
    <div style="margin-top: 10px">
      <el-table :data="items" border stripe :header-cell-style="{ background: '#eee' }"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection"> </el-table-column>
        <el-table-column prop="orderNumber" label="注文番号" min-width="10%" header-align="center">
        </el-table-column>
        <el-table-column prop="orderDate" label="注文日" min-width="10%" align="center" header-align="center">
        </el-table-column>
        <el-table-column prop="orderQuantity" label="注文数量" min-width="10%" align="right" header-align="center">
        </el-table-column>
        <el-table-column prop="totalPrice" label="合計金額" min-width="10%" align="right" header-align="right">
        </el-table-column>
        <el-table-column prop="orderStatus" label="注文状況" min-width="10%" align="center">
          <template slot="header">
            <el-dropdown>
              <el-button type="text" style="">
                注文状況 <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>受取</el-dropdown-item>
                <el-dropdown-item>配送中</el-dropdown-item>
                <el-dropdown-item>在庫保留</el-dropdown-item>
                <el-dropdown-item>営業確認中</el-dropdown-item>
                <el-dropdown-item>部長確認中</el-dropdown-item>
                <el-dropdown-item>キャンセル中</el-dropdown-item>
                <el-dropdown-item>キャンセル済み</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column prop="deliveryAddress" label="お届け先" min-width="30%" header-align="center">
        </el-table-column>
        <el-table-column prop="deliveryMethod" label="配送方法" min-width="10%" align="center">
          <template slot="header">
            <el-dropdown>
              <el-button type="text" style="">
                配送方法 <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>ヤマト運輸</el-dropdown-item>
                <el-dropdown-item>郵便局</el-dropdown-item>
                <el-dropdown-item>佐川急便</el-dropdown-item>
                <el-dropdown-item>西濃運輸</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column prop="test" label="操作" min-width="10%" align="center">
          <el-tooltip content="編集" placement="top" @click="editOrder">
            <el-button type="primary" icon="el-icon-edit" circle size="mini"></el-button>
          </el-tooltip>
          <el-tooltip content="キャメル" placement="top" @click="cancelOrder">
            <el-button type="danger" icon="el-icon-s-release" circle size="mini"></el-button>
          </el-tooltip>
          <el-tooltip content="再購入" placement="top" @click="reBuy">
            <el-button type="success" icon="el-icon-goods" circle size="mini"></el-button>
          </el-tooltip>
        </el-table-column>
      </el-table>
      <div style="padding: 10px">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
          :page-sizes="[5, 10, 15, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "User",
  data() {
    const end = new Date(); // 当前日期
    const start = new Date(end.getFullYear(), end.getMonth() - 1, 1); // 上个月的第一天
    return {
      total: 0,
      pageNum: 1,
      pageSize: 5,
      defaultMonthDate: start, // 设置默认值为上个月的第一天
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },

      items: [
        {
          orderNumber: "A001",
          orderDate: "2024年5月9日",
          orderQuantity: "1000個",
          totalPrice: 999,
          orderStatus: "受取",
          deliveryAddress:
            "2 Chome-16-2 Sotokanda, Chiyoda City, Tokyo 101-0021",
          deliveryMethod: "ヤマト運輸",
        },
        {
          orderNumber: "A002",
          orderDate: "2024年5月10日",
          orderQuantity: "1001個",
          totalPrice: 999,
          orderStatus: "受取",
          deliveryAddress:
            "3 Chome-11-3 Sotokanda, Chiyoda City, Tokyo 101-0021",
          deliveryMethod: "郵便局",
        },
        {
          orderNumber: "A003",
          orderDate: "2024年5月11日",
          orderQuantity: "1002個",
          totalPrice: 999,
          orderStatus: "受取",
          deliveryAddress: "2 Chome-4-1 Torigoe, Taito City, Tokyo 111-0054",
          deliveryMethod: "佐川急便",
        },
      ],
      value2: "",
    };
  },
  props: {},
  methods: {
    handleSelectionChange(val) {
      console.log(val);
    },
    edit(row) {
      console.log(row);
    },
    handleSizeChange(val) {
      /*传递过来当前是第几页*/
      console.log(`每页 ${val} 条`);
      this.pageSize = val; //获取当前每页显示条数
      this.load();
    },
    handleCurrentChange(val) {
      /*传递过来当前是第几页*/
      console.log(`当前页: ${val}`);
      this.pageNum = val; //获取当前第几页
      this.load();
    },
    select() {
      console.log("select");
    },
    reset() {
      console.log("reset");
    },
    newOrder() {
      console.log("newOrder");
      this.$router.push({ name: "NewOrder" });
    },
    expxlsx() {
      console.log("xlsx");
      //window.open("http://localhost:8084/user/expxlsx");
    },
    exppdf() {
      console.log("pdf");
      //window.open("http://localhost:8084/user/exppdf");
    },
    editOrder() { },
    cancelOrder() { },
    reBuy() { },
  },
};
</script>

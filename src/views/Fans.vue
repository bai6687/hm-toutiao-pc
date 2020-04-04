<template>
  <div class="container">
    <el-card>
      <div slot="header">
        <my-bread>粉丝管理</my-bread>
      </div>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="粉丝列表" name="list">
          <div class="fans_list">
            <!-- id为对象形式，需要转为数字或字符串类型，这里转为字符串 -->
            <div class="fans_item" v-for="item in list" :key="item.id.toString()">
              <el-avatar :size="80" :src="item.photo"></el-avatar>
              <p>{{item.name}}</p>
              <el-button type="primary" size="small" plain>+关注</el-button>
            </div>
            <el-pagination
              @current-change="changePager"
              :current-page="reqParams.page"
              :page-size="reqParams.per_page"
              background
              layout="prev, pager, next"
              :total="total"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="粉丝画像" name="img">
          <div ref="main" style="width:600px;height:400px"></div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "my-fans",
  data() {
    return {
      activeName: "list",
      //   测试头像
      //   circleUrl:"https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      reqParams: {
        page: 1,
        per_page: 24
      },
      total: 0,
      //   粉丝列表
      list: []
    };
  },
  created() {
    this.getFansList();
  },
  // dom生成完后会执行的回调函数
  mounted() {
    this.initBar();
  },
  methods: {
    async initBar() {
      const myCharts = echarts.init(this.$refs.main);
      const option = {
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "直接访问",
            type: "bar",
            barWidth: "60%",
            data: []
          }
        ]
      };
      const {
        data: { data }
      } = await this.$http.get("statistics/followers");
      for (const key in data.age) {
        option.xAxis[0].data.push(
          key.replace("le", "小于").replace("gt", "大于") + "岁"
        );
        option.series[0].data.push(data.age[key]);
      }
      myCharts.setOption(option);
    },

    //   分页
    changePager(newPage) {
      this.reqParams.page = newPage;
      this.getFansList();
    },
    //   获取粉丝列表
    async getFansList() {
      const {
        data: { data }
      } = await this.$http.get("followers", { params: this.reqParams });
      this.list = data.results;
      this.total = data.total_count;
    }
  }
};
</script>

<style scoped lang='less'>
.fans_list {
  .fans_item {
    width: 120px;
    height: 170px;
    border: 1px dashed #ddd;
    text-align: center;
    display: inline-block;
    padding-top: 10px;
    margin-right: 30px;
    margin-bottom: 30px;
    p {
      margin: 10px 0;
    }
  }
}
</style>
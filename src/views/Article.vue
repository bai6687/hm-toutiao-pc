<template>
  <div class="article-container">
    <el-card>
      <!-- 面包屑 -->
      <div slot="header">
        <my-bread>内容管理</my-bread>
      </div>
      <!-- 表单 -->
      <el-form lable-width="80px" size="small">
        <el-form-item label="状态：">
          <el-radio-group v-model="reqParams.status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道：">
          <!-- <my-channel :value="reqParams.channel_id" @input="reqParams.channel_id=$event"></my-channel> -->
          <my-channel v-model="reqParams.channel_id"></my-channel>
        </el-form-item>
        <el-form-item label="日期：">
          <el-date-picker
            @change="changeDate"
            value-format="yyyy-MM-dd"
            v-model="dateArr"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="filterArticle">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top:20px">
      <div slot="header">根据筛选条件共查询到{{total}}条结果</div>
      <!-- 表格 -->
      <el-table :data="articles">
        <el-table-column label="封面">
          <template slot-scope="scope">
            <el-image fit="cover" :src="scope.row.cover.images[0]" style="width:150px;height:100px">
              <div slot="error" class="image-slot">
                <img src="../assets/error.gif" style="width:150px;height:100px" />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status===0" type="info">草稿</el-tag>
            <el-tag v-if="scope.row.status===1">待审核</el-tag>
            <el-tag v-if="scope.row.status===2" type="success">审核通过</el-tag>
            <el-tag v-if="scope.row.status===3" type="warning">审核失败</el-tag>
            <el-tag v-if="scope.row.status===4" type="danger">已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop="pubdate"></el-table-column>
        <el-table-column label="操作" style="width:120px">
          <template slot-scope="scope">
            <el-button
              @click="editArticle(scope.row.id)"
              plain
              type="primary"
              icon="el-icon-edit"
              circle
            ></el-button>
            <el-button
              @click="deleteArticle(scope.row.id)"
              plain
              type="danger"
              icon="el-icon-delete"
              circle
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @current-change="changePager"
        :current-page="reqParams.page"
        :page-size="reqParams.per_page"
        style="margin-top:20px"
        background
        layout="prev, pager, next"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 使用组件 -->
    <!-- <my-test>111</my-test> -->

    <!-- 具名插槽使用 -->
    <!-- <my-test>
      <div slot="content">内容</div>
      <div slot="footer">page-footer111</div>
    </my-test>-->
  </div>
</template>

<script>
// 导入组件
// import MyBread from "@/components/my-bread.vue";
export default {
  // 注册组件
  // components: { MyBread },
  name: "my-article",
  data() {
    return {
      // 筛选条件对象数据
      reqParams: {
        status: null,
        channel_id: null,
        begin_pubdate: null,
        end_pubdate: null,
        page: 1,
        per_page: 20
      },
      // 时间范围[起始日期，结束日期]
      dateArr: [],
      articles: [],
      total: 0
    };
  },
  created() {
    this.getArticles();
  },
  methods: {
    deleteArticle(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          try {
            async () => {
              // 删除请求
              await this.$http.delete(`articles/${id}`);
              // 成功提示
              this.$message.success("删除成功");
              this.getArticles();
            };
          } catch (e) {
            this.$message.console.error("删除失败");
          }
        })
        .catch(() => {});
    },
    editArticle(id) {
      this.$router.push(`/publish?id=${id}`);
    },
    filterArticle() {
      this.reqParams.page = 1;
      this.getArticles();
    },
    // 改变日期
    changeDate(dateArr) {
      if (dateArr) {
        this.reqParams.begin_pubdate = dateArr[0];
        this.reqParams.end_pubdate = dateArr[1];
      } else {
        this.reqParams.begin_pubdate = null;
        this.reqParams.end_pubdate = null;
      }
    },
    // 分页
    changePager(newPage) {
      this.reqParams.page = newPage; //当前页
      this.getArticles();
    },
    // 获取文章列表数据
    async getArticles() {
      const {
        data: { data }
      } = await this.$http.get("articles", {
        params: this.reqParams
      });
      this.articles = data.results;
      // 总条数
      this.total = data.total_count;
    }
  }
};
</script>

<style scoped lang='less'></style>
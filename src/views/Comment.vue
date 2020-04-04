<template>
  <div class="comment-container">
    <el-card>
      <div slot="header">
        <my-bread>评论管理</my-bread>
      </div>
      <el-table :data="comments">
        <el-table-column label="文章标题" prop="title"></el-table-column>
        <el-table-column label="总评论数" prop="total_comment_count"></el-table-column>
        <el-table-column label="粉丝评论数" prop="fans_comment_count"></el-table-column>
        <el-table-column label="评论状态">
          <template slot-scope="scope">{{scope.row.comment_status?'正常':'关闭'}}</template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-button
              @click="toggelStatus(scope.row)"
              v-if="scope.row.comment_status"
              type="danger"
              size="small"
            >关闭评论</el-button>
            <el-button @click="toggelStatus(scope.row)" v-else type="success" size="small">打开评论</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @current-change="changePager"
        :current-page="reqParams.page"
        :page-size="reqParams.per_page"
        background
        layout="prev, pager, next"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "my-comment",
  data() {
    return {
      comments: [],
      reqParams: {
        response_type: "comment",
        page: 1,
        per_page: 20
      },
      total: 0
    };
  },
  created() {
    this.getComments();
  },
  methods: {
    //   切换
    async toggelStatus(row) {
      try {
        const {
          data: { data }
        } = await this.$http.put(`comments/status?article_id=${row.id}`, {
          allow_comment: !row.allow_comment
        });
        this.$message.success(
          data.allow_comment ? "打开评论成功" : "关闭评论成功"
        );
        // 更新当前数据中的状态，需要更新视图
        row.comment_status = data.allow_comment;
      } catch (e) {
        this.$message.error("操作失败");
      }
    },
    //   分页
    changePager(newPage) {
      this.reqParams.page = newPage;
      this.getComments();
    },
    async getComments() {
      const {
        data: { data }
      } = await this.$http.get("articles", { params: this.reqParams });
      this.comments = data.results;
      this.total = data.total_count;
    }
  }
};
</script>

<style scoped lang='less'></style>
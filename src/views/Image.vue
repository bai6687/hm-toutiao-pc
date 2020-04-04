<template>
  <div class="image-container">
    <el-card>
      <div slot="header">
        <my-bread>素材管理</my-bread>
      </div>
      <div class="btn_box">
        <el-radio-group @change="changeCollect" v-model="reqParams.collect" size="small">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button @click="openAddImgDialog" type="success" size="small" style="float:right">添加素材</el-button>
      </div>
      <div class="img_list">
        <div class="img_item" v-for="item in images" :key="item.id">
          <img :src="item.url" alt />
          <div class="option" v-if="!reqParams.collect">
            <span
              @click="toggleStatus(item)"
              class="el-icon-star-off"
              :style="{color:item.is_collected?'red':'#fff'}"
            ></span>
            <span @click="deleteImage(item.id)" class="el-icon-delete"></span>
          </div>
        </div>
      </div>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="reqParams.page"
        :page-size="reqParams.per_page"
        @current-change="changePager"
      ></el-pagination>
    </el-card>
    <!-- 对话框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="300px">
      <!-- el-upload组件发起请求，需要自己配置请求路径和请求头 -->
      <el-upload
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="headers"
        name="image"
        class="avatar-uploader"
        :on-success="uploadImgSuccess"
      >
        <!-- 同级标签才能v-if v-else配合使用 -->
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import auth from "@/utils/auth.js";
export default {
  name: "my-image",
  data() {
    return {
      reqParams: {
        // 默认查询全局 false 收藏 true
        collect: false,
        page: 1,
        per_page: 10
      },
      images: [],
      total: 0,
      dialogVisible: false,
      imageUrl: "",
      headers: {
        Authorization: `Bearer ${auth.getUser().token}`
      }
    };
  },
  created() {
    this.getImages();
  },
  methods: {
    // 上传素材成功
    uploadImgSuccess(res, file) {
      this.imageUrl = res.data.url;
      this.$message.success("上传成功");
      window.setTimeout(() => {
        // 关闭对话框
        this.dialogVisible = false;
        // 返回第一页
        this.page = 1;
        this.getImages();
        // 清除对话框内容
        this.imageUrl = null;
      }, 3000);
    },
    // 添加素材
    openAddImgDialog() {
      this.dialogVisible = true;
    },
    // 删除图片素材
    deleteImage(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          try {
            await this.$http.delete(`user/images/${id}`);
            this.$message.success = "删除成功";
            this.getImages();
          } catch (e) {
            this.$message.error = "删除失败";
          }
        })
        .catch(() => {});
    },
    // 切换添加收藏与取消收藏
    async toggleStatus(item) {
      try {
        const {
          data: { data }
        } = await this.$http.put(`user/images/${item.id}`, {
          collect: !item.is_collected
        });
        this.$message.success(data.collect ? "添加收藏成功" : "取消收藏成功");
        // 修改样式
        item.is_collected = data.collect;
      } catch (e) {
        this.$message.error("操作失败");
      }
    },
    // 切换全部与收藏
    changeCollect() {
      this.reqParams.page = 1;
      this.getImages();
    },
    // 分页
    changePager(newPage) {
      this.reqParams.page = newPage;
      this.getImages();
    },
    // 获取素材列表
    async getImages() {
      const {
        data: { data }
      } = await this.$http.get("user/images", { params: this.reqParams });
      this.images = data.results;
      this.total = data.total_count;
    }
  }
};
</script>

<style scoped lang='less'>
// style标签上加了scoped，给其他组件的样式是不能生效的
// 在当前template中看到的就是自己组件的标签
.img_list {
  margin-top: 20px;
  .img_item {
    position: relative;
    width: 180px;
    height: 180px;
    border: 1px dashed #ddd;
    display: inline-block;
    margin-bottom: 20px;
    margin-right: 60px;
    img {
      width: 100%;
      height: 100%;
    }
    .option {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 30px;
      background: rgba(0, 0, 0, 0.3);
      color: #fff;
      text-align: center;
      span {
        margin: 0 30px;
      }
    }
  }
}
</style>
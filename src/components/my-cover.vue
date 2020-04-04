<template>
  <div class="my-cover">
    <!-- 图片按钮 -->
    <div class="btn_img" @click="openDialog()">
      <img :src=" value || coverImgUrl" alt />
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="720px">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="image">
          <el-radio-group @change="changeCollect" v-model="reqParams.collect">
            <el-radio-button :label="false">全部</el-radio-button>
            <el-radio-button :label="true">收藏</el-radio-button>
          </el-radio-group>
          <div class="img_list">
            <div
              :class="{selected:item.url === selectedImgUrl}"
              class="img_item"
              v-for="item in images"
              :key="item.id"
              @click="selectedImg(item.url)"
            >
              <img :src="item.url" alt />
            </div>
            <el-pagination
              hide-on-single-page
              @current-change="changePager"
              :current-page="reqParams.page"
              :page-size="reqParams.per_page"
              background
              layout="prev, pager, next"
              :total="total"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="上传图片" style="text-align:center" name="upload">
          <el-upload
            :headers="headers"
            class="avatar-uploader"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            :show-file-list="false"
            :on-success="uploadSuccess"
            name="image"
          >
            <img v-if="uploadImgUrl" :src="uploadImgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmImg()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import auth from "@/utils/auth";
import defaultImg from "@/assets/default.png";
export default {
  name: "my-cover",
  props: ["value"],
  data() {
    return {
      dialogVisible: false,
      activeName: "image",
      reqParams: {
        collect: false,
        page: 1,
        per_page: 8
      },
      images: [],
      // 选中图片地址
      selectedImgUrl: null,
      total: 0,
      // 上传图片地址
      uploadImgUrl: null,
      headers: {
        Authorization: `Bearer ${auth.getUser().token}`
      },
      // 封面图片地址，
      coverImgUrl: defaultImg
    };
  },
  methods: {
    // 确认图片
    confirmImg() {
      if (this.activeName === "image") {
        if (!this.selectedImgUrl) {
          return this.$message.warning("请先选中一张图片");
        }
        // 预览
        // this.coverImgUrl = this.selectedImgUrl;
        // 提交给父组件
        this.$emit("input", this.selectedImgUrl);
      }
      if (this.activeName === "upload") {
        if (!this.uploadImgUrl) {
          return this.$message.warning("请先上传一张图片");
        }
        // 预览
        // this.coverImgUrl = this.uploadImgUrl;

        this.$emit("input", this.uploadImgUrl);
      }
      //   关闭对话框
      this.dialogVisible = false;
    },
    // 上传封面
    uploadSuccess(res) {
      this.uploadImgUrl = res.data.url;
      this.$message.success("上传图片成功");
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
    // 选中图片的url作为图片的唯一标识
    selectedImg(url) {
      this.selectedImgUrl = url;
      console.log(this.selectedImgUrl);
    },
    openDialog() {
      // 重置数据
      this.selectedImgUrl = null;
      this.uploadImgUrl = null;
      this.activeName = "image";

      // 打开对话框
      this.dialogVisible = true;
      this.getImages();
    },
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
.btn_img {
  width: 150px;
  height: 150px;
  border: 1px dashed #ddd;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.img_list {
  margin-top: 15px;
  .img_item {
    position: relative;
    width: 150px;
    height: 120px;
    border: 1px dashed #ddd;
    display: inline-block;
    margin-right: 15px;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
    // & 连接符：代表当前类 交集选择器
    &.selected::after {
      content: "";
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background: rgba(0, 0, 0, 0.3) url(../assets/selected.png) no-repeat
        center / 50px 50px;
    }
  }
}
</style>
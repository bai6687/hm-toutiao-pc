<template>
  <div class="setting-container">
    <el-card>
      <div slot="header">
        <my-bread>个人设置</my-bread>
      </div>
      <el-row>
        <el-col :span="12">
          <el-form label-width="120px">
            <el-form-item label="编号：">{{userInfo.id}}</el-form-item>
            <el-form-item label="手机号：">{{userInfo.mobile}}</el-form-item>
            <el-form-item label="媒体名称：">
              <el-input v-model="userInfo.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体简介：">
              <el-input v-model="userInfo.intro" type="textarea" :rows="3"></el-input>
            </el-form-item>
            <el-form-item label="联系邮箱：">
              <el-input v-model="userInfo.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="updateUser()" type="primary">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12" style="text-align:center">
          <el-upload
            :http-request="uploadPhoto"
            class="avatar-uploader"
            action
            :show-file-list="false"
          >
            <img v-if="userInfo.photo" :src="userInfo.photo" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p>修改头像</p>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import eventBus from "@/utils/eventBus";
import auth from "@/utils/auth";
export default {
  name: "my-setting",
  data() {
    return {
      // 用户信息
      userInfo: {
        name: "",
        intro: "",
        email: "",
        photo: ""
      }
      //   imageUrl: null
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    // 修改头像
    async uploadPhoto({ file }) {
      // axios + formData + file 对象
      const formData = new FormData();
      formData.append("photo", file);
      const {
        data: { data }
      } = await this.$http.patch("user/photo", formData);

      this.$message.success("修改头像成功");
      // 本地预览
      this.userInfo.photo = data.photo;

      // 同步Home组件
      eventBus.$emit("updateUserPhoto", data.photo);
      // 同步本地存储
      const user = auth.getUser;
      user.photo = data.photo;
      auth.setUser(user);
    },
    //   修改用户信息
    async updateUser() {
      // 局部修改--不修改头像
      try {
        const { name, intro, email } = this.userInfo;
        await this.$http.patch("user/profile", { name, intro, email });
        this.$message.success("修改用户信息成功");
        //  同步Home组件的用户名
        eventBus.$emit("updateUserName", name);
        // 同步本地存储的用户名
        const user = auth.getUser();
        user.name = name;
        auth.setUser(user);
      } catch (e) {
        if (e.response && e.response.status === 409) {
          this.$message.error("媒体名称已存在");
        } else {
          this.$message.error("修改用户信息失败");
        }
      }
    },
    //   获取用户资料
    async getUserInfo() {
      const {
        data: { data }
      } = await this.$http.get("user/profile");
      this.userInfo = data;
    }
  }
};
</script>

<style scoped lang='less'></style>
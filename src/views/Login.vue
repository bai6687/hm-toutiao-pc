<template>
  <div class="login-container">
    <el-card class="my-card">
      <img src="../assets/logo_index.png" alt />
      <!-- 表单 -->
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" status-icon>
        <el-form-item prop="mobile">
          <el-input v-model="loginForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            v-model="loginForm.code"
            placeholder="请输入验证码"
            style="width:240px;margin-right:8px"
          ></el-input>
          <el-button>发送验证码</el-button>
        </el-form-item>
        <el-form-item>
          <el-checkbox :value="true">我已同意用户协议</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button @click="login()" type="primary" style="width:100%">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import auth from "@/utils/auth.js";
export default {
  name: "my-login",
  data() {
    // 自定义校验函数--先定义后使用
    // rule：当前字段校验规则对象，一般不使用
    // value：当前字段对应数据
    // callback：
    const checkMobile = (rule, value, callback) => {
      // 检验value的值，必须符合手机格式
      // 格式：1 开头，第二个数组 3-9之间,9个数字结尾
      if (/^1[3-9]\d{9}$/.test(value)) {
        callback();
      } else {
        callback(new Error("手机号格式不对"));
      }
    };
    return {
      loginForm: {
        mobile: "",
        code: ""
      },
      loginRules: {
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          // 使用validator指定一个自定义校验函数
          { validator: checkMobile, trigger: "blur" }
        ],
        code: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { len: 6, message: "验证码6个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    login() {
      // 登录前，对整体表单进行校验
      // 组件方法validate(valid)用来整体校验表单
      // valid代表整体表单是否校验成功
      // 通过组件实例this.$refs.loginForm调用组件方法

      // 在await外层包裹async
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          // 万能短信验证码：246810 测试账号：13911111111
          // console.log("登录");
          // this.$http
          //   .post("authorizations", this.loginForm)
          //   .then(res => {
          //     // 登录成功
          //     // 存储用户信息 res === {data:{message:'',data:''}}
          //     auth.setUser(res.data.data);
          //     this.$router.push("/");
          //   })
          //   .catch(() => {
          //     this.$message.error("手机号或验证码错误");
          //   });

          // async 和 await 修改登录请求
          try {
            const res = await this.$http.post("authorizations", this.loginForm);
            auth.setUser(res.data.data);
            this.$router.push("/");
          } catch (e) {
            this.$message.error("手机号或验证码错误");
          }
        }
      });
    }
  }
};
</script>

<style lang='less'>
.login-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: url(../assets/login_bg.jpg) no-repeat center/cover;
  .my-card {
    width: 400px;
    height: 350px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    img {
      display: block;
      width: 200px;
      margin: 0 auto;
    }
  }
}
</style>
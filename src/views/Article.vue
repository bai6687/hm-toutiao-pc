<template>
  <div class="article-container">article</div>
</template>

<script>
export default {
  name: "my-article",
  created() {
    this.$http
      .get("articles")
      .then(res => {
        console.log(res.data);
      })
      .catch(() => {
        console.log("请求失败");
      });
  }
};
</script>

<style scoped lang='less'></style>
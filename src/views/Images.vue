<template>
  <div class="container">Image</div>
</template>

<script>
export default {
  name: "my-image",
  data() {
    return {
      reqParams: {
        collect: false,
        page: 1,
        per_page: 10
      },
      images: []
    };
  },
  created() {
    this.getImages();
  },
  methods: {
    async getImages() {
      const {
        data: { data }
      } = await this.$http.get("user/images", { params: this.reqParams });
      this.images = data.results;
    }
  }
};
</script>

<style scoped lang='less'></style>
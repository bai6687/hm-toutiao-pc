<template>
  <div class="page">
    <header>page-header</header>
    <div class="content">
      <!-- 默认插槽 -->
      <!-- <slot>备用内容</slot> -->

      <!-- 具名插槽--当组件中需要插入多处内容时，需使用具名插槽 -->
      <slot name="content"></slot>
    </div>
    <!-- <footer>page-footer</footer> -->
    <footer>
      <!-- 具名插槽 -->
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script>
export default {
  name: "my-test"
};
</script>

<style scoped lang='less'></style>
<template functional>
  <div class="container">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Container'
};
</script>

<style lang="scss" scoped>
.container {
  max-width: 800px;
  padding: 50px 25px;
  margin: 0 auto;
  box-sizing: border-box;

  @media (max-width: 700px) {
    padding: 30px 15px;
  }
}
</style>

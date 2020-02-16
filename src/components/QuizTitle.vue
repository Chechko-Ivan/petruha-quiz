<template functional>
  <h2 class="quiz-title">
    <slot></slot>
  </h2>
</template>

<script>
export default {
  name: 'QuizTitle'
};
</script>

<style lang="scss" scoped>
.quiz-title {
  margin: 0;
  margin-bottom: 25px;
  font-size: 23px;
  line-height: 1.3;
}
</style>

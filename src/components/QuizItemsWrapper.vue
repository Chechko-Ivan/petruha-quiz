<template functional>
  <div class="quiz-item-wrapper">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'QuizItemsWrapper'
};
</script>

<style lang="scss" scoped>
.quiz-item-wrapper {
  padding: 20px 25px;
  background-color: #ffffff;
  border-radius: 5px 20px 20px;
}
</style>

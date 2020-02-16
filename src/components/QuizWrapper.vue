<template functional>
  <div class="quiz-wrapper">
    <div v-if="props.isQuizLoad" class="quiz-wrapper-inner">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuizWrapper'
};
</script>

<style lang="scss" scoped>
.quiz-wrapper {
  margin-top: 15px;
}
</style>

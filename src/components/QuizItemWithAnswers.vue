<template>
  <div :class="['quiz-item', { error }]">
    <div class="quiz-item-inner">
      <div v-if="imageSrc" class="quiz-item-image">
        <picture>
          <source :srcset="require(`@/static/products/${imageSrc}.webp`)" type="image/webp" />
          <source :srcset="require(`@/static/products/${imageSrc}.png`)" type="image/png" />
          <img :src="require(`@/static/products/${imageSrc}.png`)" loading="lazy" :alt="title" />
        </picture>
      </div>

      <div class="quiz-item-content">
        <h3 class="quiz-item-title">
          {{ title }}
        </h3>

        <div class="quiz-item-answers">
          <vs-radio
            v-for="answer in answers !== 'undefined' && answers.items"
            :key="answer.value"
            :val="answer.value"
            v-model="value"
          >
            {{ answer.title }}
          </vs-radio>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuizItemWithAnswers',

  sync: ['value'],

  props: {
    title: {
      type: String,
      default: ''
    },

    imageSrc: {
      type: String,
      required: true
    },

    answers: {
      type: Object,
      default: () => {}
    },

    error: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss">
.quiz-item {
  border-radius: 20px;

  &:not(:last-of-type) {
    margin-bottom: 15px;
  }

  &.error {
    background-color: rgba(var(--vs-danger), 0.1);
  }
}

.quiz-item-inner {
  display: flex;
}

.quiz-item-image {
  width: 250px;
  flex-shrink: 0;
  margin-right: 15px;

  picture {
    picture {
      width: 100%;
    }
  }
}

.quiz-item-content {
  display: flex;
  flex-direction: column;
}

.quiz-item-title {
  font-size: 20px;
}

.quiz-item-answers {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>

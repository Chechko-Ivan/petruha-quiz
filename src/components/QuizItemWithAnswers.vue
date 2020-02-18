<template>
  <div :class="['quiz-item', { error }]">
    <div class="quiz-item-inner">
      <div v-if="withImage" class="quiz-item-image">
        <picture>
          <source :srcset="require(`@/static/products.v2/${id}.webp`)" type="image/webp" />
          <source :srcset="require(`@/static/products.v2/${id}.png`)" type="image/png" />
          <img :src="require(`@/static/products.v2/${id}.png`)" :alt="title" />
        </picture>
      </div>

      <div class="quiz-item-content">
        <h3 class="quiz-item-title">
          {{ title }}
        </h3>

        <div class="quiz-item-answers">
          <vs-radio
            v-for="answer in answers.length && answers"
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
    id: {
      type: Number,
      require: true
    },

    title: {
      type: String,
      default: ''
    },

    withImage: {
      type: Boolean,
      require: true
    },

    answers: {
      type: Array,
      default: () => []
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

<template>
  <div :class="['quiz-item', { error }]">
    <vs-radio v-model="value" class="quiz-item-inner" :val="title">
      <div v-if="withImage" :class="['quiz-item-image', { withImage }]">
        <picture>
          <source :srcset="require(`@/static/products.v2/${id}.webp`)" type="image/webp" />
          <source :srcset="require(`@/static/products.v2/${id}.png`)" type="image/png" />
          <img :src="require(`@/static/products.v2/${id}.png`)" :alt="title" />
        </picture>
      </div>

      <div class="quiz-item-content">
        <h3 class="quiz-item-title">{{ title }}</h3>
      </div>
    </vs-radio>
  </div>
</template>

<script>
export default {
  name: 'QuizItemUnanswered',

  sync: ['value'],

  props: {
    id: {
      type: Number,
      required: true
    },

    title: {
      type: String,
      default: ''
    },

    withImage: {
      type: Boolean,
      required: true
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

  &.vs-radio-content {
    justify-content: flex-start;

    @media (max-width: 700px) {
      flex-direction: row;
    }

    .vs-radio__label {
      width: 100%;
      display: flex;

      @media (max-width: 700px) {
        flex-direction: column;
      }
    }

    .quiz-item-image.withImage {
      margin-left: -10px;
    }
  }
}

.quiz-item-image {
  max-width: 250px;
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

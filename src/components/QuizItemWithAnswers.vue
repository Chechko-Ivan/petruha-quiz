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
        <h3 v-if="title && !dontShowItemTitle" class="quiz-item-title">
          {{ title }}
        </h3>

        <div class="quiz-item-answers">
          <template v-for="(answer, index) in answers">
            <component
              :is="unselectable ? 'vs-checkbox' : 'vs-radio'"
              :key="answer.value"
              :val="answer.value"
              v-model="value"
            >
              {{ answer.title }}
            </component>

            <base-text-area
              v-if="answer.needDescription && answer.value === value"
              :id="id"
              :key="`${answer.value}-${index}`"
              :title="answer.descriptionTitle"
              :label="answer.descriptionLabel"
              :value="customeValue"
              @input="val => $emit('custome-value', val)"
            ></base-text-area>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseTextArea from '@/components/BaseTextArea.vue';

export default {
  name: 'QuizItemWithAnswers',

  components: {
    BaseTextArea
  },

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

    unselectable: {
      type: Boolean,
      default: false
    },

    dontShowItemTitle: {
      type: Boolean,
      default: false
    },

    answers: {
      type: Array,
      default: () => []
    },

    customeValue: {
      type: String,
      default: ''
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
  flex-grow: 1;
  margin-right: 15px;

  picture {
    picture {
      width: 100%;
    }
  }
}

.quiz-item-content {
  display: flex;
  flex-grow: 1;
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

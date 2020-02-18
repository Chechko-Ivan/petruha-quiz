<template>
  <div id="app">
    <Container>
      <div id="topAnchor" class="app-logo">
        <Logo />
      </div>

      <vs-alert v-if="alertMessage">
        {{ alertMessage }}
      </vs-alert>

      <div ref="quiz-content" class="app-quiz">
        <QuizWrapper
          v-for="(step, index) in quiz"
          :key="index"
          :isQuizLoad="isQuizLoad && quiz.length"
        >
          <QuizItemsWrapper
            v-if="quizStep === index && result[quizStep] && step.type === 'ITEMS_WITH_ANSWERS'"
          >
            <QuizTitle>
              {{ step.title }}
            </QuizTitle>

            <QuizItemWithAnswers
              v-for="(item, index) in step.items"
              :key="index"
              :id="item.id"
              :title="item.title"
              :answers="item.answers"
              :withImage="item.withImage"
              :error="result[quizStep][index].error"
              :value.sync="result[quizStep][index].value"
            />
          </QuizItemsWrapper>

          <QuizItemsWrapper
            v-if="quizStep === index && result[quizStep] && step.type === 'UNANSWERED_ITEMS'"
          >
            <QuizTitle>
              {{ step.title }}
            </QuizTitle>

            <QuizItemUnanswered
              v-for="(item, index) in step.items"
              :key="index"
              :id="item.id"
              :title="item.title"
              :withImage="item.withImage"
              :error="result[quizStep].error"
              :value.sync="result[quizStep].value"
            />
          </QuizItemsWrapper>
        </QuizWrapper>

        <div v-if="isQuizLoad && quiz.length" class="quiz-button-wrapper">
          <vs-button v-if="quizStep > 0" flat @click="prevStep">
            Назад
          </vs-button>

          <vs-button flat active @click="nextStep">
            Дальше
          </vs-button>
        </div>
      </div>
    </Container>
  </div>
</template>

<script>
import Logo from '@/components/Logo.vue';
import Container from '@/components/Container.vue';
import QuizWrapper from '@/components/QuizWrapper.vue';
import QuizTitle from '@/components/QuizTitle.vue';
import QuizItemsWrapper from '@/components/QuizItemsWrapper.vue';
import QuizItemWithAnswers from '@/components/QuizItemWithAnswers.vue';
import QuizItemUnanswered from '@/components/QuizItemUnanswered.vue';

export default {
  initialQuizItemResult: {
    value: null,
    error: false
  },

  notificationMessages: {
    invalidQuizStep: 'Пожалуйста ответьте на все вопросы'
  },

  name: 'App',

  components: {
    Logo,
    Container,
    QuizWrapper,
    QuizTitle,
    QuizItemsWrapper,
    QuizItemWithAnswers,
    QuizItemUnanswered
  },

  data() {
    return {
      isQuizLoad: false,
      quizStorage: [],
      quiz: [],
      products: [],
      savedQuizItems: {},
      quizStep: 0,
      result: {}
    };
  },

  computed: {
    alertMessage() {
      return this.quizStep === 0
        ? 'Нам очень важно знать Ваше мнение о наших продуктах, поэтому просим Вас уделить несколько минут своего времени на заполнение следующей анкеты!'
        : '';
    }
  },

  mounted() {
    const loading = this.$vs.loading({
      target: this.$refs.quizContent
    });

    this.getQuiz().then(() => {
      if (this.quiz.length) {
        const { items } = this.quiz[this.quizStep];

        items.forEach((value, index) =>
          this.setResultPlaceholder({
            id: value.id,
            title: value.title,
            category: value.category,
            index,
            step: this.quizStep
          })
        );
      }

      loading.close();
      this.isQuizLoad = true;
    });
  },

  methods: {
    getQuiz() {
      return new Promise(resolve => {
        import('@/json/quiz.v2.json').then(({ default: quiz }) => {
          this.quizStorage = quiz;
          this.quiz = quiz;
          resolve();
        });
      });
    },

    isStepValid() {
      const { type } = this.quizStorage[this.quizStep];
      const result = this.result[this.quizStep];

      if (type === 'ITEMS_WITH_ANSWERS') {
        const itemWithErrors = {};

        for (let [key, item] of Object.entries(result)) {
          if (!item.value) {
            itemWithErrors[key] = { ...item, error: true };
          } else {
            itemWithErrors[key] = { ...item, error: false };
          }
        }

        this.result[this.quizStep] = itemWithErrors;
        return (
          Object.entries(itemWithErrors)
            .map(([, item]) => item.error)
            .filter(error => !error).length === Object.keys(itemWithErrors).length
        );
      } else if (type === 'UNANSWERED_ITEMS') {
        if (!result.value) {
          result.error = true;
          return false;
        }

        result.error = false;
        return true;
      }
    },

    setResultPlaceholder({ id, title, category, index, step }) {
      const { type } = this.quiz[step];

      if (type === 'ITEMS_WITH_ANSWERS') {
        if (this.result[step]) {
          this.$set(this.result[step], index, {
            ...this.$options.initialQuizItemResult,
            id,
            title,
            category,
            valueDescription: ''
          });
        } else {
          this.$set(this.result, step, {
            [index]: {
              ...this.$options.initialQuizItemResult,
              id,
              title,
              category,
              valueDescription: ''
            }
          });
        }
      } else if (type === 'UNANSWERED_ITEMS') {
        this.$set(this.result, step, {
          ...this.$options.initialQuizItemResult,
          title,
          category
        });
      }
    },

    nextStep() {
      if (!this.isStepValid()) {
        this.openNotification({ text: this.$options.notificationMessages.invalidQuizStep });
        this.$nextTick(() => {
          this.$scrollTo(document.querySelector('.quiz-item.error'), { offset: -120 });
        });
        return;
      }

      if (!this.quiz[this.quizStep]) {
        console.error('FINISH');
        return;
      }

      const nextStep = this.quizStep + 1;

      if (this.quiz[nextStep].type === 'ITEMS_WITH_ANSWERS') {
        const { items } = this.quiz[nextStep];

        items.forEach((value, index) =>
          this.setResultPlaceholder({
            id: value.id,
            title: value.title,
            category: value.category,
            index,
            step: nextStep
          })
        );

        this.quizStep = nextStep;
      } else if (this.quiz[nextStep].type === 'UNANSWERED_ITEMS') {
        const {
          filterQuizItemIndex,
          filterByCategory,
          filterByAnswer,
          title,
          items
        } = this.quizStorage[nextStep];

        const currentQuizStepItems = items.filter(
          (item, index) =>
            item.category === 'ALL' ||
            Object.entries(this.result[filterQuizItemIndex]).map(
              ([, resultItem]) =>
                resultItem.category === filterByCategory && resultItem.value === filterByAnswer
            )[index]
        );

        this.quiz[nextStep].items = currentQuizStepItems;
        this.setResultPlaceholder({ title, category: filterByCategory, step: nextStep });
      }

      this.quizStep = nextStep;
      this.$scrollTo('#topAnchor', { offset: -100 });
    },

    prevStep() {
      this.quizStep = this.quizStep - 1;
      this.$scrollTo('#topAnchor', { offset: -100 });
    },

    openNotification({ title = 'Уведомление', text, color = 'primary' }) {
      this.$vs.notification({
        progress: 'auto',
        position: 'top-right',
        duration: 4000,
        flat: true,
        title: title,
        text: text,
        color
      });
    }
  }
};
</script>

<style lang="scss">
body,
#app {
  font-family: 'Noto Sans', sans-serif;
}

.app-logo {
  text-align: center;
  margin-bottom: 25px;
}

.quiz-button-wrapper {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}

.flip-list-move {
  transition: transform 1s;
}
</style>

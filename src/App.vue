<template>
  <div id="app">
    <Container>
      <div id="topAnchor" class="app-logo">
        <Logo />
      </div>

      <vs-alert v-if="alertMessage && !isQuizFinish">
        {{ alertMessage }}
      </vs-alert>

      <div v-if="!isQuizFinish" ref="quiz-content" class="app-quiz">
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
              :unselectable="step.unselectable"
              :dontShowItemTitle="step.dontShowItemTitle"
              :error="result[quizStep][index].error"
              :value.sync="result[quizStep][index].value"
              :customeValue="result[quizStep][index].customeValue"
              @custome-value="val => (result[quizStep][index].customeValue = val)"
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

          <QuizItemsWrapper v-if="quizStep === index && result[quizStep] && step.type === 'FIELDS'">
            <QuizTitle>
              {{ step.title }}
            </QuizTitle>

            <vs-input
              v-for="(item, index) in step.items"
              :key="index"
              :placeholder="item.placeholder"
              v-model="result[quizStep][index].value"
            ></vs-input>
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

      <div v-if="isQuizFinish" class="finish-message">
        Спасибо за участие!
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
      isQuizFinish: false,
      quizStorage: [],
      quiz: [],
      products: [],
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

    this.getQuiz().then(quiz => {
      this.quiz = quiz;

      const clone = JSON.parse(JSON.stringify(quiz));
      this.quizStorage = clone;

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
          resolve(quiz);
        });
      });
    },

    isStepValid() {
      const { type, unselectable } = this.quizStorage[this.quizStep];
      const result = this.result[this.quizStep];

      if (result.skip) {
        delete this.result[this.quizStep];
        return true;
      }

      if ((type && type === 'ITEMS_WITH_ANSWERS') || (type && type === 'FIELDS')) {
        const itemWithErrors = {};

        for (let [key, item] of Object.entries(result)) {
          if (!item.value) {
            itemWithErrors[key] = { ...item, error: true };
          } else if (
            item.value &&
            String(item.value).indexOf('укажите') !== -1 &&
            !item.customeValue
          ) {
            itemWithErrors[key] = { ...item, error: true };
          } else {
            itemWithErrors[key] = { ...item, error: false };
          }
        }

        this.result[this.quizStep] = itemWithErrors;
        const arrayOfErrors = Object.entries(itemWithErrors)
          .map(([, item]) => item.error)
          .filter(error => !error);

        return (
          arrayOfErrors.length === Object.keys(itemWithErrors).length ||
          (unselectable && arrayOfErrors.length)
        );
      } else if (type && type === 'UNANSWERED_ITEMS') {
        if (!result.value) {
          result.error = true;
          return false;
        }

        result.error = false;
        return true;
      }
    },

    filterQuizStepItems(nextStep) {
      const { filterQuizStepIndex, filterByCategory, filterByAnswer, items } = this.quizStorage[
        nextStep
      ];

      const filtredQuizStepItems = items.filter(
        (item, index) =>
          item.category === 'ALL' ||
          Object.entries(this.result[filterQuizStepIndex]).map(
            ([, resultItem]) =>
              resultItem.category === filterByCategory && filterByAnswer.includes(resultItem.value)
          )[index]
      );

      this.quiz[nextStep].items = filtredQuizStepItems;
    },

    setResultPlaceholder({ id, title, category, index, step }) {
      const { type } = this.quiz[step];

      if (type === 'ITEMS_WITH_ANSWERS' || type === 'FIELDS') {
        if (this.result[step]) {
          this.$set(this.result[step], index, {
            ...this.$options.initialQuizItemResult,
            id,
            title,
            category
          });
        } else {
          this.$set(this.result, step, {
            [index]: {
              ...this.$options.initialQuizItemResult,
              id,
              title,
              category
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
      const nextStepIndex = this.quizStep + 1;

      // Заканчиваем опрос если вопросы закончились
      if (!this.quizStorage[nextStepIndex]) {
        this.sendForm();
        return;
      }

      if (!this.isStepValid()) {
        this.openNotification({ text: this.$options.notificationMessages.invalidQuizStep });
        this.$nextTick(() => {
          this.$scrollTo(document.querySelector('.quiz-item.error'), { offset: -120 });
        });
        return;
      }

      // Если на все ответили отрицательно то заканчиваем опрос
      if (this.quizStep === 0 && this.quizStorage[this.quizStep].type === 'ITEMS_WITH_ANSWERS') {
        const negativeResults = Object.entries(this.result[this.quizStep])
          .map(([, item]) => item.value)
          .filter(value => value === 3).length;

        if (negativeResults === this.quizStorage[this.quizStep].items.length) {
          this.sendForm();
          return;
        }
      }

      const { type, filterQuizStepIndex, filterByCategory, title } = this.quizStorage[
        this.quizStep + 1
      ];

      // Фильтруем следующий список продуктов и вопросов
      if (typeof filterQuizStepIndex === 'number') {
        this.filterQuizStepItems(this.quizStep + 1);
      }

      if (type === 'ITEMS_WITH_ANSWERS' || type === 'FIELDS') {
        this.quiz[nextStepIndex].items.forEach((value, index) =>
          this.setResultPlaceholder({
            id: value.id,
            title: value.title,
            category: value.category,
            index,
            step: this.quizStep + 1
          })
        );
      } else if (type === 'UNANSWERED_ITEMS') {
        this.setResultPlaceholder({ title, category: filterByCategory, step: this.quizStep + 1 });
      } else if (type === 'FIELDS') {
        this.quiz[nextStepIndex].items.forEach((value, index) =>
          this.setResultPlaceholder({
            id: value.id,
            title: value.title,
            category: value.category,
            index,
            step: this.quizStep + 1
          })
        );
      }

      // Пропускаем шаг если все товары или вопросы были отсеены
      if (
        !this.quiz[nextStepIndex].items ||
        (this.quiz[nextStepIndex].items.length === 1 &&
          this.quiz[nextStepIndex].items.find(item => item.category === 'ALL'))
      ) {
        this.quizStep = nextStepIndex;
        this.result[this.quizStep].skip = true;

        this.$nextTick(() => {
          this.nextStep();
        });
      }

      this.quizStep = nextStepIndex;
      this.$scrollTo('#topAnchor', { offset: -100 });
    },

    prevStep() {
      const resultKeys = Object.keys(this.result);
      this.quizStep = Number(resultKeys[resultKeys.indexOf(String(this.quizStep)) - 1]);
      this.$scrollTo('#topAnchor', { offset: -100 });
    },

    sendForm() {
      const loading = this.$vs.loading({
        target: this.$refs.quizContent
      });

      const body = new FormData();
      body.append('quiz', this.result);

      let options = {
        method: 'POST',
        body
      };

      fetch(`${window.BASE_API_PATH}/send`, options)
        .then(data => data.json())
        .then(res => {
          loading.close();
          this.isQuizFinish = true;

          if (res.error) {
            this.openNotification({ text: res.error });
          }
        })
        .catch(() => {
          loading.close();
          this.openNotification({
            text: 'Что-то пошло не так. Попробуйте отправить форму еще раз.'
          });
        });
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

.finish-message {
  position: absolute;
  top: 50%;
  left: 50%;
  text-align: center;
  font-size: 61px;
  font-weight: 700;
  width: 100%;
  transform: translate(-50%, -50%);

  @media (max-width: 600px) {
    font-size: 41px;
  }
}
</style>

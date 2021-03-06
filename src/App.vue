<template>
  <div id="app">
    <Container v-if="!isQuizFinish">
      <div id="topAnchor" class="app-logo">
        <Logo />
      </div>

      <vs-alert v-if="alertMessage">{{ alertMessage }}</vs-alert>

      <div ref="quiz-content" class="app-quiz">
        <QuizWrapper
          v-for="(step, index) in quiz"
          :key="index"
          :isQuizLoad="isQuizLoad && quiz.length"
        >
          <QuizItemsWrapper
            v-if="quizStep === index && result[quizStep] && step.type === 'ITEMS_WITH_ANSWERS'"
          >
            <QuizTitle :title="step.title" />

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
            <QuizTitle :title="step.title" />

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
            <QuizTitle :title="step.title" />

            <vs-input
              v-for="(item, index) in step.items"
              :key="index"
              :placeholder="item.placeholder"
              v-model="result[quizStep][index].value"
            ></vs-input>
          </QuizItemsWrapper>
        </QuizWrapper>

        <div v-if="isQuizLoad && quiz.length" class="quiz-button-wrapper">
          <vs-button v-if="quizStep > 0" flat @click="prevStep">Назад</vs-button>
          <vs-button flat active @click="nextStep">Дальше</vs-button>
        </div>
      </div>
    </Container>

    <FinishBanner v-if="isQuizFinish"></FinishBanner>
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
import FinishBanner from '@/components/FinishBanner.vue';

export default {
  quizVersion: 3,
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
    QuizItemUnanswered,
    FinishBanner
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
        import(`@/json/quiz.v${this.$options.quizVersion}.json`).then(({ default: quiz }) => {
          resolve(quiz);
        });
      });
    },

    isStepValid() {
      const { type, unselectable, requiredAnswerAllItems } = this.quizStorage[this.quizStep];
      const result = this.result[this.quizStep];

      // Пропускаем если нету вопросов
      if (!result) {
        return true;
      }

      if (result.skip) {
        delete this.result[this.quizStep];
        return true;
      }

      if ((type && type === 'ITEMS_WITH_ANSWERS') || (type && type === 'FIELDS')) {
        const itemWithErrors = {};

        for (let [key, item] of Object.entries(result)) {
          const isValid =
            !item.value ||
            (Array.isArray(item.value) && !item.value.length) ||
            (item.value && String(item.value).indexOf('укажите') !== -1 && !item.customeValue);

          if (isValid) {
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
          (unselectable && !requiredAnswerAllItems && arrayOfErrors.length)
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
      const { type, unselectable } = this.quiz[step];

      if (type === 'ITEMS_WITH_ANSWERS') {
        if (this.result[step]) {
          this.$set(this.result[step], index, {
            ...this.$options.initialQuizItemResult,
            value: unselectable ? [] : null,
            id,
            title,
            category
          });
        } else {
          this.$set(this.result, step, {
            [index]: {
              ...this.$options.initialQuizItemResult,
              value: unselectable ? [] : null,
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
      } else if (type === 'FIELDS') {
        this.$set(this.result, step, {
          [index]: {
            ...this.$options.initialQuizItemResult,
            value: '',
            id,
            title,
            category
          }
        });
      }
    },

    nextStep() {
      const nextStepIndex = this.quizStep + 1;

      if (!this.isStepValid()) {
        this.openNotification({ text: this.$options.notificationMessages.invalidQuizStep });
        this.$nextTick(() => {
          this.$scrollTo(document.querySelector('.quiz-item.error'), { offset: -120 });
        });
        return;
      }

      // Заканчиваем опрос если вопросы закончились
      if (!this.quizStorage[nextStepIndex]) {
        this.sendForm();
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
      }

      // Пропускаем шаг если все товары или вопросы были отсеены
      if (!this.quiz[nextStepIndex].items.length) {
        this.quizStep = nextStepIndex;

        this.$nextTick(() => {
          this.nextStep();
        });
      }

      if (
        this.quiz[nextStepIndex].items.length <= 2 &&
        this.quiz[nextStepIndex].items.find(item => item.category === 'ALL')
      ) {
        this.quizStep = nextStepIndex;
        this.$nextTick(() => {
          this.result[this.quizStep].skip = true;
        });

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

    prepareFormForSubmission() {
      const { result, quizStorage } = this;

      for (let key of Object.keys(result)) {
        if (quizStorage[key]) {
          result[key].stepTitle = quizStorage[key].title;
        }
      }
    },

    sendForm() {
      const loading = this.$vs.loading({
        target: this.$refs.quizContent
      });

      this.prepareFormForSubmission();

      const body = new FormData();
      body.append('quiz', JSON.stringify(this.result));

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
            for (let key of Object.keys(this.result)) {
              delete this.result[key].stepTitle;
            }
            this.openNotification({ text: res.error });
          }
        })
        .catch(() => {
          loading.close();
          for (let key of Object.keys(this.result)) {
            delete this.result[key].stepTitle;
          }
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

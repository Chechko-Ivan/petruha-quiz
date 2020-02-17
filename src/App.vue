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
        <!-- <QuizWrapper
          v-for="(step, index) in quiz"
          :key="index"
          :isQuizLoad="isQuizLoad && quiz.length"
        >
          <QuizItemWrapper v-if="quizStep === index && step.type === 'WITH_ANSWERS'">
            <QuizTitle>
              {{ step.title }}
            </QuizTitle>

            <QuizItemWithAnswers
              v-for="(item, index) in step.items"
              :key="index"
              :title="item.title"
              :imageSrc="item.image"
              :answers="step.answers"
              :error="result[quizStep][index].error"
              :value.sync="result[quizStep][index].value"
            />
          </QuizItemWrapper>

          <QuizItemWrapper v-if="quizStep === index && step.type === 'UNANSWERED'">
            <QuizTitle>
              {{ step.title }}
            </QuizTitle>

            <QuizItemUnanswered
              v-for="(item, index) in step.items"
              :key="index"
              :title="item.title"
              :imageSrc="item.image"
              :value.sync="result[quizStep].value"
            />
          </QuizItemWrapper>
        </QuizWrapper>

        <div v-if="isQuizLoad && quiz.length" class="quiz-button-wrapper">
          <vs-button v-if="quizStep > 0" flat @click="prevStep">
            Назад
          </vs-button>

          <vs-button flat active @click="nextStep">
            Дальше
          </vs-button>
        </div> -->
      </div>
    </Container>
  </div>
</template>

<script>
import Logo from '@/components/Logo.vue';
import Container from '@/components/Container.vue';
// import QuizWrapper from '@/components/QuizWrapper.vue';
// import QuizTitle from '@/components/QuizTitle.vue';
// import QuizItemWrapper from '@/components/QuizItemWrapper.vue';
// import QuizItemWithAnswers from '@/components/QuizItemWithAnswers.vue';
// import QuizItemUnanswered from '@/components/QuizItemUnanswered.vue';

export default {
  initialQuizItemResult: {
    value: null,
    error: false
  },

  name: 'App',

  components: {
    Logo,
    Container
    // QuizWrapper
    // QuizTitle,
    // QuizItemWrapper,
    // QuizItemWithAnswers,
    // QuizItemUnanswered
  },

  data() {
    return {
      isQuizLoad: false,
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
    Promise.all([this.getProducts(), this.getQuiz()]).then(() => {
      if (this.quiz.length && this.quiz[this.quizStep]) {
        const { productCategory } = this.quiz[this.quizStep];

        this.products
          .filter(product => productCategory.includes(product.category))
          .forEach((value, index) => this.setResultPlaceholder({ title: value.title, index }));
      }
    });
    // const loadQuiz = this.$vs.loading({
    //   target: this.$refs.quizContent
    // });

    // import('@/json/quiz.json').then(({ default: quiz }) => {
    //   this.quiz = quiz;

    //   quiz[this.quizStep].items.forEach((value, index) =>
    //     this.setStepResultObjects({
    //       category: value.category,
    //       title: value.title,
    //       index,
    //       quizStep: this.quizStep
    //     })
    //   );

    //   loadQuiz.close();
    //   this.isQuizLoad = true;
    // });
  },

  methods: {
    getProducts() {
      return new Promise(resolve => {
        import('@/json/products.json').then(({ default: products }) => {
          this.products = products;
          resolve();
        });
      });
    },

    getQuiz() {
      return new Promise(resolve => {
        import('@/json/quiz.v2.json').then(({ default: quiz }) => {
          this.quiz = quiz;
          resolve();
        });
      });
    },

    setResultPlaceholder({ title, index }) {
      const currentQuizItem = this.quiz[this.quizStep];
      const { type } = currentQuizItem;

      switch (type) {
        case 'ITEM_WITH_ANSWERS':
          if (this.result[this.quizStep]) {
            this.$set(this.result[this.quizStep], index, {
              title,
              valueDescription: '',
              ...this.$options.initialQuizItemResult
            });
          } else {
            this.$set(this.result, this.quizStep, {
              [index]: { title, valueDescription: '', ...this.$options.initialQuizItemResult }
            });
          }
          break;
      }
    }
  }

  // methods: {
  //   setStepResultObjects({ category, title, index, quizStep }) {
  //     this.result[quizStep]
  //       ? this.$set(this.result[quizStep], index, {
  //           category,
  //           title,
  //           ...this.$options.initialQuizItemResult
  //         })
  //       : this.$set(this.result, quizStep, {
  //           [index]: { title, category, ...this.$options.initialQuizItemResult }
  //         });
  //   },

  //   isStepValid() {
  //     const stepResult = this.result[this.quizStep];
  //     const { type } = this.quiz[this.quizStep];

  //     let valid = true;

  //     if (type === 'WITH_ANSWERS') {
  //       for (let [key, value] of Object.entries(stepResult)) {
  //         if (!value.value) {
  //           stepResult[key].error = true;
  //           valid = false;
  //         } else {
  //           stepResult[key].error = false;
  //           valid = true;
  //         }
  //       }
  //     } else if (type === 'UNANSWERED') {
  //       if (!stepResult.value) {
  //         stepResult.error = true;
  //         valid = false;
  //       } else {
  //         stepResult.error = false;
  //         valid = true;
  //       }
  //     }

  //     return valid;
  //   },

  //   filterRelevantProducts() {
  //     const { parentCategory, answerValue, parentIndex, items } = this.quiz[this.quizStep + 1];

  //     if (parentCategory) {
  //       const filtredItems = [];

  //       for (let [key, value] of Object.entries(this.result[parentIndex])) {
  //         parentCategory === value.category && answerValue === value.value
  //           ? filtredItems.push(items[key])
  //           : null;
  //       }

  //       for (let item of items) {
  //         if (item.immune) filtredItems.push(item);
  //       }

  //       return filtredItems;
  //     }
  //   },

  //   saveQuizItems() {
  //     this.$set(this.savedQuizItems, this.quizStep + 1, this.quiz[this.quizStep + 1].items);
  //   },

  //   nextStep() {
  //     if (!this.isStepValid()) {
  //       this.openNotification({ text: 'Пожалуйста ответьте на все вопросы' });
  //       return;
  //     }

  //     const filtredProducts = this.filterRelevantProducts();

  //     const quiz = this.quiz[this.quizStep + 1];

  //     if (quiz) {
  //       const { type } = quiz;

  //       if (filtredProducts.length !== quiz.items.length) {
  //         this.saveQuizItems();
  //         quiz.items = filtredProducts;
  //       }

  //       if (!this.result[this.quizStep + 1]) {
  //         if (type === 'WITH_ANSWERS') {
  //           quiz.items.forEach((value, index) =>
  //             this.setStepResultObjects({
  //               category: value.category,
  //               title: value.title,
  //               index,
  //               quizStep: this.quizStep
  //             })
  //           );
  //         } else if (type === 'UNANSWERED') {
  //           this.$set(this.result, this.quizStep + 1, { ...this.$options.initialQuizItemResult });
  //         }
  //       }
  //       this.$scrollTo('#topAnchor', { offset: -100 });
  //       this.quizStep = this.quizStep + 1;
  //     }
  //   },

  //   prevStep() {
  //     this.$scrollTo('#topAnchor', { offset: -100 });
  //     this.quizStep = this.quizStep - 1;

  //     if (this.savedQuizItems[this.quizStep + 1]) {
  //       this.quiz[this.quizStep + 1].items = this.savedQuizItems[this.quizStep + 1];
  //       delete this.savedQuizItems[this.quizStep + 1];
  //     }
  //   },

  //   openNotification({ title = 'Уведомление', text, color = 'primary' }) {
  //     this.$vs.notification({
  //       progress: 'auto',
  //       position: 'top-right',
  //       duration: 5000,
  //       flat: true,
  //       title: title,
  //       text: text,
  //       color
  //     });
  //   }
  // }
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
</style>

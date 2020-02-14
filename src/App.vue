<template>
  <div id="app">
    <Container>
      <vs-alert>
        Нам очень важно знать Ваше мнение о наших продуктах, поэтому просим Вас уделить несколько
        минут своего времени на заполнение следующей анкеты!
      </vs-alert>
    </Container>
  </div>
</template>

<script>
import Container from '@/components/Container.vue';

export default {
  name: 'App',

  components: {
    Container
  }
};
</script>

<style lang="scss">
#app {
  font-family: 'Noto Sans', sans-serif;
}
</style>

<template>
  <div class="finish-banner">
    <div class="finish-banner-container">
      <h2 class="finish-banner-title">Спасибо за участие в опросе!</h2>
      <p class="finish-banner-text">
        Подписывайтесь на нас в социальных сетях: получайте информацию о новинках, узнавайте
        интересные рецепты, делитесь отзывами. Мы с вами всегда на связи!
      </p>

      <ul class="finish-banner-social-list">
        <li>
          <a href="https://web.facebook.com/www.petruha.by/" target="_blank">
            <img src="@/static/icons/fb.svg" alt="facebook" />
          </a>
        </li>
        <li>
          <a href="https://www.instagram.com/petruha.by/?hl=ru" target="_blank">
            <img src="@/static/icons/inst.svg" alt="instagram" />
          </a>
        </li>
        <li>
          <a href="https://vk.com/petruha_by" target="_blank">
            <img src="@/static/icons/vk.svg" alt="vkontakte" />
          </a>
        </li>
        <li>
          <a href="https://ok.ru/petruhaby" target="_blank">
            <img src="@/static/icons/odnk.svg" alt="odnoklasniki" />
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FinishBanner'
};
</script>

<style lang="scss">
.finish-banner {
  height: 100vh;
  color: #ffffff;
  font-family: Cocon, sans-serif;
  background-image: url('../static/FinishBgFullHd.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.finish-banner-container {
  padding: 55px 15px 0;
  text-align: center;

  @media (max-width: 600px) {
    padding-top: 35px;
  }
}

.finish-banner-title {
  margin: 0 0 25px 0;
  font-size: 44px;

  @media (max-width: 600px) {
    font-size: 30px;
    margin-bottom: 15px;
  }
}

.finish-banner-text {
  font-size: 20px;
  max-width: 790px;
  margin: 0 auto;

  @media (max-width: 600px) {
    font-size: 15px;
  }
}

.finish-banner-social-list {
  display: flex;
  align-items: center;
  justify-content: center;
  list-style: none;
  margin: 50px 0 0 0;
  padding: 0;

  @media (max-width: 600px) {
    margin: 25px;
  }

  li {
    &:not(:last-of-type) {
      margin-right: 65px;

      @media (max-width: 600px) {
        margin-right: 20px;
      }
    }
  }

  a {
    display: inline-block;
    transition: transform 0.25s linear;

    &:hover {
      transform: translateY(-3px);
    }
  }

  img {
    max-width: 100%;
    width: 55px;
    height: auto;

    @media (max-width: 600px) {
      width: 40px;
    }
  }
}
</style>

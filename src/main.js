import Vue from 'vue';
import App from './App.vue';

import Vuesax from 'vuesax';
import VueScrollTo from 'vue-scrollto';

import 'vuesax/dist/vuesax.css';
import './assets/index.scss';

Vue.use(Vuesax);

Vue.use(VueScrollTo, {
  duration: 500,
  easing: 'ease-out',
  offset: 0
});

Vue.mixin({
  beforeCreate() {
    const sync = this.$options.sync;
    if (sync) {
      if (!this.$options.computed) {
        this.$options.computed = {};
      }
      const attrs = Object.keys(this.$attrs);
      sync.forEach(key => {
        if (!attrs.includes(key)) {
          Vue.util.warn(`Missing required sync-prop: "${key}"`, this);
        }
        this.$options.computed[key] = {
          get() {
            return this.$attrs[key];
          },
          set(val) {
            this.$emit('update:' + key, val);
          }
        };
      });
    }
  }
});

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount('#app');

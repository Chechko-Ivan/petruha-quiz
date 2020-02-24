<template>
  <div class="base-textarea">
    <div class="base-textarea-title">
      {{ title }}
    </div>

    <div class="base-textarea-content">
      <textarea
        placeholder="textarea"
        :id="`base-textarea-${id}`"
        :value="value"
        @input="$emit('input', $event.target.value)"
      ></textarea>
      <label :class="{ 'hide-label': value }" :for="`base-textarea-${id}`">
        {{ label }}
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseTextArea',

  props: {
    id: {
      type: [String, Number],
      required: true
    },

    label: {
      type: String,
      default: ''
    },

    title: {
      type: String,
      default: ''
    },

    value: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="scss" scoped>
.base-textarea,
.base-textarea-content {
  width: 100%;
  display: flex;
  position: relative;
  flex-direction: column;
}

.base-textarea {
  textarea {
    background: rgba(var(--vs-gray-2), 1);
    color: rgba(var(--vs-text), 1);
    padding: 18px 20px;
    border-radius: 12px;
    border: 0px;
    font-size: 16px;
    resize: none;
    transition: all 0.25s ease;

    &::placeholder {
      opacity: 0;
    }

    &:focus,
    &:not(:placeholder-shown) {
      outline: none;

      background: rgba(var(--vs-gray-3), 1);
      padding-left: 25px;

      ~ label {
        opacity: 0;
        left: 30px;
      }
    }
  }

  label {
    position: absolute;
    top: 15.1px;
    left: 20.1px;
    z-index: 1;
    cursor: text;
    transition: all 0.25s ease;
    color: rgba(var(--vs-text), 0.5);
  }
}

.base-textarea-title {
  margin-bottom: 10px;
  padding-left: 5px;
}
</style>

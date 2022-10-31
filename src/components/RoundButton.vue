<template>
  <div class="button-wrapper">
    <div
      class="button"
      :class="{ 'white-fill-button': isWhite }"
      @click="$emit('clicked')"
    >
      <slot name="content" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'RoundButton',
  props: {
    isWhite: {
      type: Boolean,
      default: false
    }
  },
  emits: ['clicked']
}
</script>

<style lang="scss" scoped>
@import "../common.scss";

.button-wrapper {
  display: flex;
  flex-basis: 25%;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
}

.button {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  vertical-align: middle;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  font-size: 36px;
  letter-spacing: 0;
  background-color: transparent;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: rgba(255, 255, 255, 0.12);
  }
}

.white-fill-button {
  background-color: #FFFFFF;
  color: #2B589A;

  &:hover {
    background-color: rgba(255, 255, 255, 0.5);
  }
}

@include media(0, $media_mobile) {
  .button-wrapper {
    margin-bottom: 8px;
  }

  .button {
    width: 70px;
    height: 70px;
  }
}

@include media(0, $media_mobile-small) {
  .button {
    font-size: 26px;
    width: 60px;
    height: 60px;
  }
}
</style>

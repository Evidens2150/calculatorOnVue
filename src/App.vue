<template>
  <div id="app">
    <calculator />
  </div>
</template>

<script>
import Calculator from './components/Calculator.vue'

export default {
  name: 'App',
  components: {
    Calculator
  }
}
</script>

<style lang='scss'>
@import '../src/assets/fonts/font-face.css';

body {
  margin: 0;
  font-family: "Geometria", "Arial", sans-serif;
}
</style>

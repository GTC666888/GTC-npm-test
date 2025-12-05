<template>
  <div>
    <TestNpmTest></TestNpmTest>
    <Test></Test>
  </div>
</template>

<script>
import Vue from "vue";
import {
  TestNpmTest,
} from "./components/index.js";
import Test from "./components/test/index.vue"

export default Vue.extend({
  components: {
    TestNpmTest,
    Test
  }
});
</script>

<style>
</style>

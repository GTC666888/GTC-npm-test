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
  Test
} from "./components/index.js";

export default Vue.extend({
  components: {
    TestNpmTest,
    Test
  }
});
</script>

<style>
</style>

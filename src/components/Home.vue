<template>로딩 중...</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Home",
  created() {
    this.$router.replace("/list");
  },
});
</script>

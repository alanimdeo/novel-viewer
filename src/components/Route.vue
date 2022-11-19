<template>로딩 중...</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Route",
  created() {
    this.$router.replace(`/view/${this.$route.params.id}`);
  },
});
</script>

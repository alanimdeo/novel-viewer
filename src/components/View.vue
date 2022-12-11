<template>
  <v-card variant="tonal" class="my-5">
    <h2 class="ma-5 mb-0" :href="data.url">
      <a class="link" :href="data.url" target="_blank">
        {{ data.title }}
        <v-tooltip activator="parent" location="bottom">클릭 시 원본 주소로 이동합니다.</v-tooltip>
      </a>
    </h2>
    <v-card-text class="mx-2">
      <div class="d-flex">
        <p>글쓴이: {{ data.author }}</p>
        <v-divider class="mx-2" vertical></v-divider>
        <p>작성일: {{ data.created_date }}</p>
        <!-- TODO: 날짜가 0000-00-00으로 되어 있는 글 처리 -->
      </div>
      <div v-if="data.related_links.length !== 0">
        <v-divider class="my-3"></v-divider>
        <p class="mb-1">관련 링크</p>
        <a class="link ms-1" v-for="link of data.related_links" :href="link">{{ link }}</a>
      </div>
    </v-card-text>
  </v-card>
  <div class="ma-2">
    <p v-for="line of content">{{ line || "&nbsp;" }}</p>
  </div>
  <div class="ma-2 mt-5">
    <v-btn
      color="info"
      prepend-icon="mdi-chevron-left"
      :disabled="!data.prev"
      @click="$router.push(`/route/${$route.params.table}/${data.prev}`)"
    >
      이전 화
    </v-btn>
    <v-btn
      color="info"
      append-icon="mdi-chevron-right"
      :disabled="!data.next"
      @click="$router.push(`/route/${$route.params.table}/${data.next}`)"
    >
      다음 화
    </v-btn>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRoute } from "vue-router";
import { getArticleInfo, getPrettierDate } from "../modules/article";

export default defineComponent({
  name: "View",
  async setup() {
    const route = useRoute();

    const data = await getArticleInfo(String(route.params.table), Number(route.params.id));
    data.created_date = getPrettierDate(data.created_date);
    const content = (await (await fetch(`/novel/${route.params.table}/${data.id}.txt`)).text()).split("\n");

    return { data, content };
  },
});
</script>

<style scoped>
.link {
  color: unset;
  text-decoration: none;
}
.link:hover {
  text-decoration: underline;
}
</style>

<template>
  <h1>List</h1>
  <p>총 글 개수: {{ articleCount }}</p>
  <select name="글 개수" v-model="articlesPerPage">
    <option v-for="n in [10, 15, 20, 25, 30]" :value="n">{{ n }}개씩 보기</option>
  </select>
  <div v-for="article of articles">
    <router-link :to="`/view/${article.id}`">{{ article.title }}</router-link>
  </div>
  <div class="">
    <button :disabled="page === 1" @click="page -= 1">◀</button>
    <select name="페이지" v-model="page">
      <option v-for="n in pages" :value="n">{{ n }}페이지</option>
    </select>
    <button :disabled="page === pages" @click="page += 1">▶</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Article, getArticleCount, getArticles, getPages } from "../modules/article";

export default defineComponent({
  name: "List",
  data() {
    return {
      articleCount: 0,
      articles: [] as Article[],
      articlesPerPage: Number(localStorage.getItem("articlesPerPage")) || 15,
      pages: 0,
      page: 1,
    };
  },
  async created() {
    if (this.$route.params.page) {
      this.page = Number(this.$route.params.page);
    }
    this.articleCount = await getArticleCount();
    this.pages = await getPages(this.articlesPerPage);
    this.articles = await getArticles(this.page, this.articlesPerPage);
  },

  methods: {},

  watch: {
    async articlesPerPage(n: number) {
      localStorage.setItem("articlesPerPage", String(n));
      if (this.page == 1) {
        this.articles = await getArticles(1, n);
      }
      this.page = 1;
      this.pages = await getPages(n);
    },
    async page(newPage: number) {
      this.articles = await getArticles(newPage, this.articlesPerPage);
    },
  },
});
</script>

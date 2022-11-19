<template>
  <v-row class="ma-2 mb-0">
    <v-col class="d-flex align-center">
      <p :class="`text-h${mobile ? '5' : '4'}`">총 글 개수: {{ articleCount }}</p>
    </v-col>
    <v-col class="articles-per-page">
      <v-select
        :items="articlesPerPageOptions"
        label="글 개수"
        density="compact"
        v-model="articlesPerPage"
        class="articles-per-page"
      ></v-select>
    </v-col>
  </v-row>

  <v-table class="mb-3 border" v-if="!mobile">
    <thead>
      <tr>
        <th class="text-left" width="100px">ID</th>
        <th class="text-left">제목</th>
        <th class="text-left" width="120px">글쓴이</th>
        <th class="text-left" width="160px">작성일</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="article of articles">
        <td class="text-left">{{ article.id }}</td>
        <td class="text-left">
          <router-link class="article-link article-link-pc" :to="'/route/' + article.id">{{
            article.title
          }}</router-link>
        </td>
        <td class="text-left">{{ article.author }}</td>
        <td class="text-left">{{ getPrettierDate(article.created_date) }}</td>
      </tr>
    </tbody>
  </v-table>
  <v-table v-else>
    <tbody>
      <tr v-for="article of articles">
        <td class="text-left">
          <router-link class="article-link" :to="'/route/' + article.id">
            {{ article.title }}
            <div class="d-flex justify-space-between">
              <span class="text-caption">
                <v-icon class="text-caption" icon="mdi-account"></v-icon>
                {{ article.author }}
              </span>
              <span class="text-caption">
                <v-icon class="text-caption" icon="mdi-clock-outline"></v-icon>
                {{ getPrettierDate(article.created_date) }}
              </span>
            </div>
          </router-link>
        </td>
      </tr>
    </tbody>
  </v-table>
  <v-pagination class="pagination" size="small" :total-visible="8" v-model="page" :length="pages"> </v-pagination>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useDisplay } from "vuetify";
import { Article, getArticleCount, getArticles, getPages, getPrettierDate } from "../modules/article";

export default defineComponent({
  name: "List",
  data() {
    return {
      articlesPerPageOptions: [
        { title: "10개씩 보기", value: 10 },
        { title: "15개씩 보기", value: 15 },
        { title: "20개씩 보기", value: 20 },
        { title: "25개씩 보기", value: 25 },
        { title: "30개씩 보기", value: 30 },
      ],
      articleCount: 0,
      articles: [] as Article[],
      articlesPerPage: Number(localStorage.getItem("articlesPerPage")) || 15,
      pages: 0,
      page: 1,
    };
  },
  setup() {
    const { xs } = useDisplay();

    return { mobile: xs };
  },
  async created() {
    if (this.$route.params.page) {
      this.$router.replace("/list");
      this.page = Number(this.$route.params.page);
    }
    this.articleCount = await getArticleCount();
    this.pages = await getPages(this.articlesPerPage);
    this.articles = await getArticles(this.page, this.articlesPerPage);
  },

  methods: {
    getPrettierDate,
  },

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

<style>
.v-input__details {
  display: none !important;
}
</style>

<style scoped>
.articles-per-page {
  max-width: 250px !important;
}
.article-link {
  color: unset;
  text-decoration-line: none;
}
.article-link-pc:hover {
  text-decoration-line: underline;
}
.article-link:visited {
  color: #888;
}
.pagination {
  max-width: 650px;
  margin: 0 auto;
}
</style>

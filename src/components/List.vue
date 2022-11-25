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

  <v-tabs v-model="table">
    <v-tab v-for="table of tables" :value="table">{{ table }}</v-tab>
  </v-tabs>
  <!-- PC 레이아웃 -->
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
          <router-link class="article-link article-link-pc" :to="`/route/${table}/${article.id}`">{{
            article.title
          }}</router-link>
        </td>
        <td class="text-left">{{ article.author }}</td>
        <td class="text-left">{{ getPrettierDate(article.created_date) }}</td>
      </tr>
    </tbody>
  </v-table>

  <!-- 모바일 레이아웃 -->
  <v-table class="pt-1 my-1" v-else>
    <tbody>
      <tr v-for="article of articles">
        <td class="text-left">
          <router-link class="article-link" :to="`/route/${table}/${article.id}`">
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

  <v-pagination class="pagination" size="small" v-model="page" :length="pages"> </v-pagination>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useDisplay } from "vuetify";
import { Article, getArticleCount, getArticles, getPages, getPrettierDate, getTables } from "../modules/article";

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
      tables: [] as string[],
      table: "oregairu",
      pages: 0,
      page: 1,
    };
  },
  setup() {
    const { xs } = useDisplay();

    return { mobile: xs };
  },
  async created() {
    if (this.$route.params.table) {
      this.table = String(this.$route.params.table);
    }
    if (this.$route.params.page) {
      this.page = Number(this.$route.params.page);
    } else {
      this.$router.replace({ name: "List", params: { table: this.table, page: 1 } });
    }
    this.tables = await getTables();
    this.articleCount = await getArticleCount(this.table);
    this.pages = await getPages(this.table, this.articlesPerPage);
    this.articles = await getArticles(this.table, this.page, this.articlesPerPage);
  },

  methods: {
    getPrettierDate,
  },

  watch: {
    async articlesPerPage(n: number) {
      localStorage.setItem("articlesPerPage", String(n));
      if (this.page === 1) {
        this.articles = await getArticles(this.table, 1, n);
      }
      this.page = 1;
      this.pages = await getPages(this.table, n);
    },
    async page(newPage: number) {
      this.$router.replace({ name: "List", params: { table: this.table, page: newPage } });
      this.articles = await getArticles(this.table, newPage, this.articlesPerPage);
    },
    async table(newTable: string) {
      console.log(newTable);
      this.$router.replace({ name: "List", params: { table: newTable, page: 1 } });
      if (this.page === 1) {
        this.articles = await getArticles(newTable, 1, this.articlesPerPage);
      }
      this.page = 1;
      this.pages = await getPages(this.table, this.articlesPerPage);
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

<template>
  <v-app>
    <v-app-bar color="info" title="팬픽">
      <v-btn icon @click="toggleTheme">
        <v-icon v-if="theme.global.current.value.dark" icon="mdi-weather-night" />
        <v-icon v-else icon="mdi-white-balance-sunny" />
      </v-btn>
      <!-- <v-btn icon="mdi-cog" v-if="$route.name == 'View'" @click="settings = !settings" /> -->
      <v-btn icon="mdi-plus" v-if="$route.name == 'List'" @click="addArticleDialog.opened = true" />
    </v-app-bar>

    <v-dialog class="dialog" v-model="addArticleDialog.opened">
      <v-card>
        <v-card-title>글 추가하기</v-card-title>
        <v-card-text>
          <v-alert
            v-if="addArticleDialog.error"
            type="error"
            vaiant="tonal"
            :text="(addArticleDialog.error as Error).message"
            class="mb-2"
          ></v-alert>
          <v-select
            :items="addArticleDialog.tables"
            label="테이블"
            v-model="addArticleDialog.table"
            class="mb-4"
          ></v-select>
          <v-text-field v-model="addArticleDialog.logNo" label="글 ID" />
        </v-card-text>
        <v-card-actions>
          <v-btn :disabled="addArticleDialog.processing" color="info" @click="fetchNaver()">
            <v-progress-circular indeterminate v-if="addArticleDialog.processing"></v-progress-circular>
            <span v-else>추가</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-main class="px-md-3 main">
      <Suspense>
        <router-view #default />
        <template #fallback>로딩 중...</template>
      </Suspense>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useTheme } from "vuetify";
import { fetchNaverBlogArticle, getTables } from "./modules/article";

export default defineComponent({
  name: "App",
  data() {
    return {
      addArticleDialog: {
        opened: false,
        processing: false,
        tables: [] as string[],
        table: "",
        error: null as Error | null,
        logNo: "",
      },
    };
  },
  setup() {
    const theme = useTheme();
    theme.global.name.value = localStorage.getItem("theme") || "light";

    const toggleTheme = () => {
      theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
      localStorage.setItem("theme", theme.global.name.value);
    };

    return { theme, toggleTheme };
  },
  async created() {
    this.addArticleDialog.tables = (await getTables())
      .filter((table) => table.info.site === "naver")
      .map((table) => table.name);
    this.addArticleDialog.table = this.addArticleDialog.tables[0];
  },
  methods: {
    async fetchNaver() {
      this.addArticleDialog.processing = true;
      try {
        await fetchNaverBlogArticle(this.addArticleDialog.table, this.addArticleDialog.logNo);
      } catch (err) {
        this.addArticleDialog.error = err as Error;
      }
      this.addArticleDialog.processing = false;
    },
    detectEnter(event: KeyboardEvent) {
      if (event.key === "Enter") {
        this.fetchNaver();
      }
    },
  },
});
</script>

<style scoped>
.main {
  padding-bottom: 64px;
}
.dialog {
  max-width: 400px;
}
</style>

<template>
  <v-app>
    <v-app-bar color="info" title="팬픽">
      <v-btn icon @click="toggleTheme">
        <v-icon v-if="theme.global.current.value.dark" icon="mdi-weather-night" />
        <v-icon v-else icon="mdi-white-balance-sunny" />
      </v-btn>
      <!-- <v-btn icon="mdi-cog" v-if="$route.name == 'View'" @click="settings = !settings" /> -->
    </v-app-bar>

    <v-main class="px-md-3 pb-4">
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

export default defineComponent({
  name: "App",
  // data() {
  //   return {
  //     settings: false,
  //   };
  // },
  setup() {
    const theme = useTheme();
    theme.global.name.value = localStorage.getItem("theme") || "light";

    const toggleTheme = () => {
      theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
      localStorage.setItem("theme", theme.global.name.value);
    };

    return { theme, toggleTheme };
  },
});
</script>

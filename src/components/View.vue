<template>
  <div class="info">
    <h1>
      <a :href="data.url">{{ data.title }}</a>
    </h1>
    <p>글쓴이: {{ data.author }}</p>
    <p>작성일: {{ data.created_date }}</p>
    <div v-if="data.related_links.length !== 0">
      <p>관련 링크</p>
      <ul>
        <li v-for="link of data.related_links">
          <a :href="link">{{ link }}</a>
        </li>
      </ul>
    </div>
  </div>
  <div class="line"></div>
  <div class="content">
    <p v-for="line of content">{{ line || "&nbsp;" }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Article, getArticleInfo } from "../modules/article";

export default defineComponent({
  name: "View",
  data() {
    return {
      data: {
        id: 0,
        title: "",
        author: "",
        created_date: "",
        url: "",
        related_links: [],
      } as Article,
      content: [] as string[],
    };
  },
  async created() {
    this.data = await getArticleInfo(Number(this.$route.params.id));
    const createdDate = new Date(this.data.created_date);
    this.data.created_date = `${createdDate.getFullYear()}-${
      createdDate.getMonth() + 1
    }-${createdDate.getDate()} ${createdDate.getHours()}:${createdDate.getMinutes()}`;
    this.content = (await (await fetch(`/novel/${this.data.id}.txt`)).text()).split("\n");
  },
});
</script>

<style scoped>
/* .info {
  margin-bottom: 10rem;
} */
.line {
  width: 98%;
  height: 1px;
  background-color: #aaa;
  margin: 5rem auto;
}
/* .content {
} */
</style>

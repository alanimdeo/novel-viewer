import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: () => import("./components/Home.vue"),
  },
  {
    path: "/list/:page?",
    name: "List",
    component: () => import("./components/List.vue"),
  },
  {
    path: "/view/:id",
    name: "View",
    component: () => import("./components/View.vue"),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

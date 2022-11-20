import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/index.html",
    redirect: {
      name: "Home",
    },
  },
  {
    path: "/",
    name: "Home",
    component: () => import("./components/Home.vue"),
  },
  {
    path: "/list/:table?/:page?",
    name: "List",
    component: () => import("./components/List.vue"),
  },
  {
    path: "/view/:table/:id",
    name: "View",
    component: () => import("./components/View.vue"),
  },
  {
    path: "/route/:table/:id",
    name: "Route",
    component: () => import("./components/Route.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.name === "View" && from.name === "View") {
    next({ name: "Route", params: { table: to.params.table, id: to.params.id }, replace: true });
  } else {
    next();
  }
});

export { router };

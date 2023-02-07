import { createRouter, createWebHistory } from "vue-router";
import CreateJob from "../views/CreateJob.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "createJob",
      component: CreateJob,
    },
    {
      path: "/managePerson",
      name: "managePerson",
      // component: ManagePerson,
      component: () => import("../views/ManagePerson.vue"),
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

export default router;

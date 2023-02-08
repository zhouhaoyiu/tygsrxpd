import { createRouter, createWebHistory } from "vue-router";
import CreateWork from "../views/CreateWork.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/createWork",
    },
    {
      path: "/createWork",
      name: "createWork",
      component: CreateWork,
    },
    {
      path: "/manageWork",
      name: "manageWork",
      // component: ManageJob,
      component: () => import("../views/ManageWork.vue"),
    },
    // 工单详细数据，后面加上工单id
    {
      path: "/workDetailData/:id",
      name: "workDetailData",
      component: () => import("../views/workDetailData.vue"),
    },
    {
      path: "/workDataAnalysis",
      name: "workDataAnalysis",
      component: () => import("../views/workDataAnalysis.vue"),
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

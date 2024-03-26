import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../components/ViewTracker.vue";
// import { HOST } from "./../js/url";

const router = createRouter({
    history: createWebHistory("/"),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView,
            meta: {
                title: "Home",
                header_display: true,
                need_login: false,
                project_bind: false,
            },
        }
    ],
});

export default router;

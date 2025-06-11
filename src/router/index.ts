import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
} from "vue-router";
import TodoList from "../views/TodoList.vue";
import DetailTodo from "../views/DetailTodo.vue";

const isServer = typeof window === "undefined";
const history = isServer ? createMemoryHistory() : createWebHistory();

const routes = [
  {
    path: "/",
    name: "TodoList",
    component: TodoList,
  },
  {
    path: "/detail/:id",
    name: "DetailTodo",
    component: DetailTodo,
  },
];

const router = createRouter({
  history,
  routes,
});

export default router;

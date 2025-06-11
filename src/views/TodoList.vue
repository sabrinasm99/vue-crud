<script setup lang="ts">
import { ref, computed } from "vue";
import type { Todo } from "../utils/constant";

const loading = ref(false);
const todos = ref<Todo[] | null>(null);
const error = ref(null);
const input = ref("");
const inputEdit = ref("");
const editingTodoId = ref<string | null>(null);

const isEditing = computed(() => {
  return editingTodoId.value !== null;
});

const todosLength = computed(() => {
  return todos.value ? todos.value.length : 0;
});

const fetchData = async () => {
  error.value = todos.value = null;
  loading.value = true;
  try {
    const response = await fetch("http://localhost:3000/todos");
    todos.value = await response.json();
  } catch (err: any) {
    error.value = err.toString();
  } finally {
    loading.value = false;
  }
};

const addTodo = async (title: string) => {
  try {
    const response = await fetch("http://localhost:3000/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: String(todosLength.value + 1), title: title }),
    });

    if (response.ok) {
      input.value = "";
    }
  } catch (err: any) {
    console.log(err);
    error.value = err.toString();
  }
};

const deleteTodo = async (id: string) => {
  try {
    await fetch(`http://localhost:3000/todos/${id}`, {
      method: "DELETE",
    });
  } catch (err: any) {
    console.log(err);
    error.value = err.toString();
  }
};

fetchData();
</script>

<template>
  <div class="h-screen">
    <div class="flex flex-col gap-8 w-1/2 mx-auto p-10 h-full">
      <h1 class="font-semibold text-2xl text-center">To Do List</h1>
      <div class="flex items-center gap-2">
        <input
          v-model="input"
          placeholder="Enter todo"
          class="w-4/5 py-1 focus:outline-none border border-gray-200 pl-1 rounded-md"
        />
        <button
          @click="addTodo(input)"
          :disabled="!input.trim()"
          class="w-1/5 bg-blue-500 hover:bg-blue-400 cursor-pointer text-white rounded-md py-1 font-medium"
        >
          Add Todo
        </button>
      </div>
      <p v-if="loading">Loading...</p>
      <p v-if="error">An unexpected error occured</p>
      <ul v-if="todos" class="flex flex-col gap-2">
        <li v-for="todo in todos" class="flex justify-between items-center">
          <div class="flex gap-2">
            <p>{{ todo.id }}</p>
            <p v-if="!isEditing || editingTodoId !== todo.id">
              {{ todo.title }}
            </p>
            <input
              class="focus:outline-none border border-gray-200 pl-1 rounded-md"
              v-model="inputEdit"
              v-if="editingTodoId === todo.id"
            />
          </div>
          <div class="flex gap-2 items-center">
            <button
              @click="$router.push(`/detail/${todo.id}`)"
              class="font-medium text-sm text-white px-2 py-1 rounded-md cursor-pointer bg-gray-500 hover:bg-gray-400"
            >
              View
            </button>
            <button
              @click="deleteTodo(todo.id)"
              class="font-medium text-sm bg-red-500 hover:bg-red-400 text-white px-2 py-1 rounded-md cursor-pointer"
            >
              Delete
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

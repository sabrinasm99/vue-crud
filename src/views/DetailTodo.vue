<template>
  <div class="h-screen">
    <div class="flex justify-center">
      <div
        v-if="todo"
        class="flex flex-col gap-3 mt-20 items-start border border-gray-200 p-5 rounded-md"
      >
        <button
          @click="$router.push('/')"
          class="bg-gray-800 hover:bg-gray-700 cursor-pointer px-2 py-1 rounded-md text-white"
        >
          Back
        </button>
        <h1 class="text-4xl">Todo Detail</h1>
        <div class="flex gap-3">
          <p>Title:</p>
          <p v-if="!isEditing">
            {{ todo.title }}
          </p>
          <form v-if="isEditing" @submit="updateTodo(editingTodoId, inputEdit)">
            <input
              class="focus:outline-none border border-gray-200 pl-1 rounded-md"
              v-model="inputEdit"
            />
          </form>
        </div>
        <button
          @click="
            isEditing ? updateTodo(editingTodoId, inputEdit) : clickEdit(todo)
          "
          class="text-white py-1 rounded-md cursor-pointer w-full"
          :class="
            isEditing
              ? 'bg-green-500 hover:bg-green-400'
              : 'bg-orange-500 hover:bg-orange-400'
          "
        >
          {{ isEditing ? "Save" : "Edit" }}
        </button>
        <p v-if="error">An unexpected error occured</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from "vue-router";
import type { Todo } from "../utils/constant";
import { ref, computed } from "vue";

const route = useRoute();
const { id } = route.params;
const todo = ref<Todo | null>(null);
const editingTodoId = computed(() => String(id));
const inputEdit = ref("");
const error = ref(null);
const isEditing = ref(false);

const clickEdit = (todo: Todo) => {
  isEditing.value = true;
  inputEdit.value = todo.title;
};

const updateTodo = async (id: string, title: string) => {
  try {
    const response = await fetch(`http://localhost:3000/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        title: title.trim(),
      }),
    });

    if (response.ok) {
      inputEdit.value = "";
      isEditing.value = false;
    }
  } catch (err: any) {
    console.log(err);
    error.value = err.toString();
  }
};

const fetchDataById = async (id: string) => {
  try {
    const response = await fetch(`http://localhost:3000/todos/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    todo.value = await response.json();
  } catch (err: any) {
    console.log(err);
    error.value = err.toString();
  }
};

fetchDataById(id as string);
</script>

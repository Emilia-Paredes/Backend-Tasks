<template>
  <div>
    <nav class="navbar navbar-light bg-light">
      <a href="/" class="navbar-brand"> MEVN STACK</a>
    </nav>

    <div class="container">
      <div class="row pt-5">
        <div class="col-md-5">
          <div class="card">
            <div class="card-body">
              <form @submit.prevent="sendTask">
                <div class="form-group">
                  <input type="text" v-model="task.title" placeholder="Insert A Task" class="form-control">
                </div>
                <div class="form-group">
                  <textarea v-model="task.description" placeholder="Insert A Description" cols="30" rows="10"
                    class="form-control"></textarea>
                </div>
                <template v-if="edit === false">
                  <button class="btn btn-primary btn-block">Send</button>
                </template>
                <template v-else>
                  <button class="btn btn-primary btn-block">Update</button>
                </template>
              </form>
            </div>
          </div>
        </div>
        <div class="col-md-7">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Task</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="task in tasks">
                <td>{{ task.title }}</td>
                <td>{{ task.description }}</td>
                <td>
                  <button @click="deleteTask(task._id)" class="btn btn-danger">
                    Delete
                  </button>
                </td>
                <td>
                  <button @click="editTask(task._id)" class="btn btn-secondary">
                    Update
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';

// Clase
class Task {
  constructor(title = '', description = '') {
    this.title = title;
    this.description = description;
  }
}

// Variables reactivas
let task = reactive(new Task());
let tasks = ref([]);
let edit = ref(false);
let taskToEdit = ref('');

// Funciones de tareas
const sendTask = () => {
  if(edit.value === false){
    console.log(task)
    fetch('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(task),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(data => {
      getTask();
      console.log(task)
      task = new Task();
    })
  } else {
    fetch('/api/tasks/' + taskToEdit, {
    method: 'PUT',
    body: JSON.stringify(task),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(data => {
      getTask();
      task = new Task();
      console.log(task)
      edit.value = false;
    })
  }
}

const getTask = () => {
  fetch('/api/tasks', {
    method: 'GET'
  })
    .then(res => res.json())
    .then(data => {
      tasks.value = data;
      console.log(tasks)
    })
}

const deleteTask = (taskId) => {
  fetch('/api/tasks/' + taskId, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(data => {
      console.log(data)
    })
  getTask();
}

const editTask = (taskId) => {
  fetch('/api/tasks/' + taskId)
    .then(res => res.json())
    .then(data => {
      task = new Task(data.title, data.description);
      taskToEdit = data._id;
      edit.value = true;
    })
}

// Llamar getTask cuando el componente se monta
onMounted(getTask);
</script>
document.addEventListener("DOMContentLoaded", function () {
  loadTasks();

  const addTaskButton = document.getElementById("add-task-btn");
  if (addTaskButton) {
    addTaskButton.addEventListener("click", addTask);
  }
});

async function loadTasks() {
  try {
    const response = await fetch("/tasks", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    if (response.ok) {
      const data = await response.json();
      displayTasks(data.tasks);
    } else {
      console.error("Failed to load tasks");
    }
  } catch (error) {
    console.error("Error loading tasks", error);
  }
}

function displayTasks(tasks) {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    taskList.innerHTML = "<p>No tasks available</p>";
    return;
  }

  tasks.forEach((task) => {
    const taskItem = document.createElement("li");
    taskItem.textContent = `${task.title}: ${task.description}`;
    taskItem.innerHTML += `
            <button onclick="editTask('${task._id}')">Edit</button>
            <button onclick="deleteTask('${task._id}')">Delete</button>`;
    taskList.appendChild(taskItem);
  });
}

async function addTask() {
  const title = prompt("Enter task title");
  const description = prompt("Enter a task description");
  if (!title) return alert("Task title is required");

  try {
    const response = await fetch("/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description }),
    });
    if (response.ok) {
      loadTasks();
    } else {
      console.error("Failed to add task");
    }
  } catch (error) {
    console.error("Error adding task:", error);
  }
}

async function editTask(taskId) {
  const title = prompt("Enter a new task title:");
  const description = prompt("Enter a new task description");
  if (!title) return alert("Task title is required");

  try {
    const response = await fetch(`/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description }),
    });
    if (response.ok) {
      loadTasks();
    } else {
      console.error("Error editing task:", error);
    }
  } catch (error) {
    console.error("Error editing task:", error);
  }
}

async function deleteTask(taskId) {
  try {
    const response = await fetch(`/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });

    if (response.ok) {
      loadTasks();
    } else {
      console.error("Failed to delete task");
    }
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}

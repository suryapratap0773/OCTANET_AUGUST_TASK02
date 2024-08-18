const input = document.querySelector("input");
const addButton = document.querySelector(".add-button");
const todosHtml = document.querySelector(".todos");
const emptyImage = document.querySelector(".empty-image");
let todosJson = JSON.parse(localStorage.getItem("todos")) || [];
const deleteAllButton = document.querySelector(".delete-all");
const filters = document.querySelectorAll(".filter");
let filter = '';


window.addEventListener("load", () => {
  const welcomeMessage = document.getElementById("welcome-message");
  welcomeMessage.classList.add("show");
  setTimeout(() => {
    welcomeMessage.classList.remove("show");
  }, 3000);
  setTimeout(showTodos, 3000);
});


function getTodoHtml(todo, index) {
  if (filter && filter != todo.status) {
    return '';
  }
  let checked = todo.status == "completed" ? "checked" : "";
  return /* html */ `
    <li class="todo">
      <label for="${index}">
        <input id="${index}" onclick="updateStatus(this)" type="checkbox" ${checked}>
        <span class="${checked}" id="todo-${index}">${todo.name}</span>
      </label>
      <div class="todo-buttons">
        <button class="edit-btn" onclick="editTask(${index})"><i class="fa fa-pencil"></i></button>
        <button class="delete-btn" data-index="${index}" onclick="remove(this)"><i class="fa fa-times"></i></button>
      </div>
    </li>
  `;
}

function showTodos() {
  if (todosJson.length == 0) {
    todosHtml.innerHTML = '';
    emptyImage.style.display = 'block';
  } else {
    todosHtml.innerHTML = todosJson.map(getTodoHtml).join('');
    emptyImage.style.display = 'none';
  }
}

function addTodo(todo) {
  input.value = "";
  todosJson.unshift({ name: todo, status: "pending" });
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

input.addEventListener("keyup", e => {
  let todo = input.value.trim();
  if (!todo || e.key != "Enter") {
    return;
  }
  addTodo(todo);
});

addButton.addEventListener("click", () => {
  let todo = input.value.trim();
  if (!todo) {
    return;
  }
  addTodo(todo);
});

function updateStatus(todo) {
  let todoName = todo.parentElement.lastElementChild;

  const pendingTasksCount = todosJson.filter(todo => todo.status === "pending").length;

  if (todo.checked) {
    todoName.classList.add("checked");
    todosJson[todo.id].status = "completed";

    if (pendingTasksCount === 1) {
      confetti({
        particleCount: 300,
        spread: 300,
        origin: { y: 0.6 },
      });
    }
  } else {
    todoName.classList.remove("checked");
    todosJson[todo.id].status = "pending";
  }
  localStorage.setItem("todos", JSON.stringify(todosJson));
}

function remove(todo) {
  const index = todo.dataset.index;
  todosJson.splice(index, 1);
  showTodos();
  localStorage.setItem("todos", JSON.stringify(todosJson));
}

filters.forEach(function (el) {
  el.addEventListener("click", (e) => {
    if (el.classList.contains('active')) {
      el.classList.remove('active');
      filter = '';
    } else {
      filters.forEach(tag => tag.classList.remove('active'));
      el.classList.add('active');
      filter = e.target.dataset.filter;
    }
    showTodos();
  });
});

deleteAllButton.addEventListener("click", () => {
  todosJson = [];
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
});

function editTask(index) {
  const todoSpan = document.getElementById(`todo-${index}`);
  const currentText = todoSpan.textContent;

  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.value = currentText;
  editInput.classList.add("edit-input");

  todoSpan.parentNode.replaceChild(editInput, todoSpan);
  editInput.focus();

  editInput.addEventListener("blur", () => {
    const updatedText = editInput.value.trim();
    if (updatedText) {
      todosJson[index].name = updatedText;
      localStorage.setItem("todos", JSON.stringify(todosJson));
      showTodos();
    } else {
      todoSpan.textContent = currentText;
      editInput.parentNode.replaceChild(todoSpan, editInput);
    }
  });

  editInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      editInput.blur();
    }
  });
}
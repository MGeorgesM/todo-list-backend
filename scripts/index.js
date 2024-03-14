const loginForm = document.getElementById('login-form');
const loginComponent = document.getElementById('login-component');
const validationDisplaySignIn = document.getElementById('validationDisplaySignIn');
const registerLink = document.getElementById('register-link');

const registerForm = document.getElementById('register-form');
const registerComponent = document.getElementById('register-component');
const validationDisplaySignUp = document.getElementById('validationDisplaySignUp');

const todoComponent = document.getElementById('todo-component');
const descriptionInput = document.getElementById('descriptionInput');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const logoutBtn = document.getElementById('logout-btn');
const scoreDisplay = document.getElementById('score-display');

let currentUserID = null;
let currentUserScore = null;

axios.defaults.baseURL = 'http://localhost/api';

const createTodo = async (user_id, todo_description) => {
  const data = new FormData();
  data.append('user_id', user_id);
  data.append('todo_description', todo_description);

  await axios.post('/createtodo.php', data);
  populateTodos(currentUserID);
};

const deleteTodo = async (todo_id) => {
  const data = new FormData();
  data.append('todo_id', todo_id);

  const response = await axios.post('/deletetodo.php', data);
  currentUserScore = response.data.Score;
  if (currentUserScore !== null && currentUserScore !== undefined) {
    adjustScore(currentUserScore);
  }
  populateTodos(currentUserID);
};

const signIn = async (login, password) => {
  const data = new FormData();
  data.append('login', login);
  data.append('password', password);

  try {
    const response = await axios.post('/signin.php', data);
    if (response.data.LoggedIn) {
      loginComponent.classList.toggle('remove');
      todoComponent.classList.toggle('remove');
      currentUserID = response.data.User_Id;
      currentUserScore = response.data.Score;
      adjustScore(currentUserScore);
      populateTodos(currentUserID);
      localStorage.setItem('currentUser', JSON.stringify(currentUserID));
    } else {
      throw Error(response.data.Message);
    }
  } catch (error) {
    validationDisplaySignIn.innerHTML = error.message;
  }
};

const signUp = async (username, email, password) => {
  const data = new FormData();
  data.append('username', username);
  data.append('email', email);
  data.append('password', password);

  try {
    const response = await axios.post('/signup.php', data);

    if (response.data.Registered) {
      registerComponent.classList.toggle('remove');
      todoComponent.classList.toggle('remove');
    } else {
      throw Error(response.data.Message);
    }
  } catch (error) {
    validationDisplaySignUp.innerHTML = error.message;
  }
};

const getTodos = async (user_id) => {
  try {
    const response = await axios.get(`/gettodos.php?user_id=${user_id}`);
    return response.data.Todos;
  } catch (error) {
    throw Error(error.response.data.Message);
  }
};

const toggleTodoStatus = async (user_id, todo_id, is_checked) => {
  const data = new FormData();
  data.append('user_id', user_id);
  data.append('todo_id', todo_id);
  data.append('is_checked', is_checked);

  try {
    const response = await axios.post('/toggletodo.php', data);
    currentUserScore = response.data.Score;
    if (currentUserScore !== null && currentUserScore !== undefined) {
      adjustScore(currentUserScore);
    }
  } catch (error) {
    console.log(error);
  }
};

const addTodo = () => {
  const description = descriptionInput.value.trim();
  if (description === '') {
    alert('Please enter a valid task');
    return;
  }

  descriptionInput.value = '';
  createTodo(currentUserID, description);
};

const populateTodos = async () => {
  todoList.innerHTML = '';
  const todos = await getTodos(currentUserID);
  if (!todos) {
    return;
  }
  todos.forEach((todo) => {
    const { id, description, complete } = todo;
    generateTodo(id, description, complete);
  });

  todoItemEventListener();
  todoDeleteEventListener();
};

const generateTodo = (id, description, complete) => {
  todoList.innerHTML += todoElement(id, description, complete);
};

const todoElement = (id, description, complete) => {
  const checkClass = complete ? 'checked' : '';
  return `<div class="todo-item flex space-between primary-text">
                <p class="todo-text ${checkClass}">${description}</p>
                <button class="delete-btn primary-text white-bg" data-todo-id="${id}">X</button>
            </div>`;
};

const todoItemEventListener = () => {
  const todoItems = document.querySelectorAll('.todo-item');
  for (let i = 0; i < todoItems.length; i++) {
    todoItems[i].addEventListener('click', (event) => {
      const todoItem = todoItems[i].querySelector('.todo-text');
      const todo_id = event.target.closest('.todo-item').querySelector('.delete-btn').getAttribute('data-todo-id');
      let is_checked = false;
      if (todoItem.classList.contains('checked')) {
        is_checked = false;
        todoItem.classList.remove('checked');
        toggleTodoStatus(currentUserID, todo_id, is_checked);
      } else {
        is_checked = true;
        todoItem.classList.add('checked');
        toggleTodoStatus(currentUserID, todo_id, is_checked);
      }
    });
  }
};

const todoDeleteEventListener = () => {
  const todoDeleteBtns = document.querySelectorAll('.delete-btn');
  for (let i = 0; i < todoDeleteBtns.length; i++) {
    todoDeleteBtns[i].addEventListener('click', (event) => {
      event.stopPropagation();
      const todo_id = event.target.getAttribute('data-todo-id');
      deleteTodo(todo_id);
    });
  }
};

const adjustScore = (score) => {
  scoreDisplay.innerHTML = score;
};

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const login = document.getElementById('login').value;
  const password = document.getElementById('password').value;
  signIn(login, password);
});

registerLink.addEventListener('click', () => {
  loginComponent.classList.toggle('remove');
  registerComponent.classList.toggle('remove');
});

registerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('register-password').value;
  signUp(username, email, password);
});

addBtn.addEventListener('click', addTodo);

logoutBtn.addEventListener('click', () => {
  loginComponent.classList.toggle('remove');
  todoComponent.classList.toggle('remove');
  currentUserID = null;
});
